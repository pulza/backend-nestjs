import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    type: String,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: '이름',
    type: String,
  })
  @IsString()
  name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
