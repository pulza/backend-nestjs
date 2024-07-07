import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key';
  app.use(
    session({
      secret: sessionSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3000 * 60 * 60 * 24 * 30,
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('풀자')
    .setDescription('풀자 API 문서')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
