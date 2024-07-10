import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface CustomHttpExceptionResponse {
  error: string;
  message: any;
  statusCode: number;
  code?: number;
  isErrorLoggingActive?: boolean;
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
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as CustomHttpExceptionResponse | string)
        : {
            error: 'Internal Server Error',
            message: exception.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          };

    let err: CustomHttpExceptionResponse;

    if (typeof errResponse === 'string') {
      err = {
        error: errResponse,
        message: errResponse,
        statusCode: status,
        isErrorLoggingActive: true,
      };
    } else {
      err = {
        error: errResponse.error || 'Internal Server Error',
        message: errResponse.message || 'An unexpected error occurred',
        statusCode: errResponse.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        isErrorLoggingActive: errResponse.isErrorLoggingActive !== false,
      };
    }

    const errText = `[ExceptionError] ${method} ${path} userId: ${request?.user?.userId} nickname: ${request?.user?.nickname} userAgent: ${userAgent} clientIp: ${clientIp}`;

    console.log(errText, err);

    response.status(status).json({
      statusCode: status,
      message: err.message,
      error: err.error,
    });
  }
}
