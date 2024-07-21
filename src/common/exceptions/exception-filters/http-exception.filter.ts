import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface CustomHttpExceptionResponse {
  message: any;
  statusCode: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('exception', exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const method = request.method;
    const path = request.url;
    const userAgent = request.headers['user-agent'];
    const clientIp = request.ip;

    let err: CustomHttpExceptionResponse;

    if (exception instanceof Prisma.PrismaClientKnownRequestError && exception.code === 'P2025')
      err = {
        message: 'The requested resource was not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    else
      err = {
        message: exception.response || 'An unexpected error occurred',
        statusCode: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
      };

    const errText = `[ExceptionError] ${method} ${path} userId: ${request?.user?.userId} nickname: ${request?.user?.nickname} userAgent: ${userAgent} clientIp: ${clientIp}`;

    console.log(errText, err);

    response.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }
}
