import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminCategoriesModule } from './admin/categories/admin-categories.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CommentsModule } from './quizzes/comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      ttl: 3600 * 24, // default는 1일, 캐시 설정 시 ttl 주입하면 그 설정을 따름
      max: 100, // 캐시에 담을 수 있는 최대 아이템 수
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AdminCategoriesModule,
    CategoriesModule,
    QuizzesModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
