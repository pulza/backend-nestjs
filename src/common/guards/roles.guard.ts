import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesEnum } from '../enum';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()) || ['loggedIn'];
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    let user;
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      const decoded = this.tokenService.validateToken(token) && this.tokenService.decodeToken(token);

      bearer === 'Bearer' && decoded.userId
        ? (user = await this.prisma.user.findUnique({
            where: {
              id: decoded.userId,
            },
          }))
        : (user = null);

      request.user = user;
    }

    if (roles.includes('loggedIn') && user) return true;
    if (roles.includes('public')) return true;
    if (roles.includes('admin') && user?.role === RolesEnum.ADMIN) return true;

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
