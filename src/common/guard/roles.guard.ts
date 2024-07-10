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
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!roles) {
      if (!request.session.userId)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      const user = await this.prisma.user.findUnique({
        where: {
          id: request.session.userId,
        },
      });

      if (user) {
        request.user = user;
        return true;
      } else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (roles.includes('public')) return true;

    if (roles.includes('admin')) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: request.session.userId,
        },
      });

      if (!user)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      request.user = user;

      if (user.role !== RolesEnum.ADMIN)
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      return true;
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
