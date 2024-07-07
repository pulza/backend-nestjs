import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '이름',
  })
  @IsString()
  name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
