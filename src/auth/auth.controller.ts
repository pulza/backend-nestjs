import { Controller, Post, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/request/signup.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입', description: 'Role: public' })
  @ApiBody({
    type: SignupDto,
  })
  @Post('signup')
  @Roles('public')
  create(@Body() signupDto: SignupDto): Promise<void> {
    return this.authService.create(signupDto);
  }

  @ApiOperation({ summary: '로그인', description: 'Role: public' })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    type: String,
    description: '로그인 성공 시 connect.sid 반환',
  })
  @Post('login')
  @Roles('public')
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>): Promise<string> {
    const user = await this.authService.login(loginDto);
    session.userId = user.id;
    return session.id;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Session() session: Record<string, any>): void {
    session.userId = null;
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @Post('withdraw')
  withdraw(@CurrentUser() user: User, @Session() session: Record<string, any>): void {
    this.authService.withdraw(user);
    session.userId = null;
  }
}
