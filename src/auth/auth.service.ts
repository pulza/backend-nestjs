import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/requests/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/requests/login.dto';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async create(signupDto: SignupDto): Promise<void> {
    const isDupEmail = await this.prisma.user.findUnique({
      where: {
        email: signupDto.email,
      },
    });
    if (isDupEmail) throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.CONFLICT);

    const saltRounds = this.configService.get('BCRYPT_SALT', 10);
    const hashedPassword = await bcrypt.hash(signupDto.password, Number(saltRounds));

    await this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
      },
    });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) throw new HttpException('이메일 또는 비밀번호 불일치', HttpStatus.BAD_REQUEST);

    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatch) throw new HttpException('이메일 또는 비밀번호 불일치', HttpStatus.BAD_REQUEST);

    const token = this.tokenService.generateToken(user.id);
    await this.cacheManager.set(token, user.id, 3600 * 24 * 30); // 30days TTL

    return token;
  }

  async validateToken(token: string): Promise<User> {
    if (!this.tokenService.validateToken(token)) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const decoded = this.tokenService.decodeToken(token);
    const userId = decoded.userId;
    const cachedUserId = await this.cacheManager.get(token);
    if (!cachedUserId || cachedUserId !== userId) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return user;
  }

  async withdraw(user: User) {
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
}
