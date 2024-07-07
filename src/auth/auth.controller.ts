import { Controller, Post, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/request/signup.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({
    type: SignupDto,
  })
  @Post('signup')
  create(@Body() signupDto: SignupDto): Promise<void> {
    return this.authService.create(signupDto);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    type: LoginDto,
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.login(loginDto);
    session.userId = user.id;
    return user.name;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.userId = null;
  }
}
