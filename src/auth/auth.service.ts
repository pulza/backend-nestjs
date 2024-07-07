import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/request/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
