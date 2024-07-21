import { Controller, Post, Body, Headers, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/request/signup.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/request/login.dto';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authService: AuthService,
  ) {}

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
    description: '로그인 성공 시 토큰 반환',
  })
  @Post('login')
  @Roles('public')
  async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('access-token')
  @Post('logout')
  async logout(@Headers('authorization') token: string): Promise<void> {
    await this.cacheManager.del(token);
  }

  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth('access-token')
  @Post('withdraw')
  async withdraw(@CurrentUser() user: User): Promise<void> {
    this.authService.withdraw(user);
  }
}
