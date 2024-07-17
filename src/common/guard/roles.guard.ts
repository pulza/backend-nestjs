import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolesEnum } from '../enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    ) || ['loggedIn'];
    const request = context.switchToHttp().getRequest();
    let user;
    if (request.session.userId) {
      user = await this.prisma.user.findUnique({
        where: {
          id: request.session.userId,
        },
      });
      request.user = user;
    }

    if (roles.includes('loggedIn') && user) return true;
    if (roles.includes('public')) return true;
    if (roles.includes('admin') && user?.role === RolesEnum.ADMIN) return true;

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
