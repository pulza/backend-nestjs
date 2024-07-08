import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session?.userId;

    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) req.user = null;
    else req.user = user;

    next();
  }
}
