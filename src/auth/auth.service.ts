import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/request/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/request/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(signupDto: SignupDto): Promise<void> {
    const isDupEmail = await this.prisma.user.findUnique({
      where: {
        email: signupDto.email,
      },
    });
    if (isDupEmail)
      throw new HttpException(
        '이미 존재하는 이메일입니다.',
        HttpStatus.CONFLICT,
      );

    const saltRounds = this.configService.get('BCRYPT_SALT', 10);
    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      Number(saltRounds),
    );

    await this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
      },
    });
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto.password);
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!user)
      throw new HttpException(
        '존재하지 않는 이메일입니다.',
        HttpStatus.NOT_FOUND,
      );

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch)
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );

    return user;
  }
}
