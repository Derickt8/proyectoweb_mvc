import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: {
      message: string | string[];
      error: string;
      statusCode: number;
    } = {
      message: 'Internal server error',
      error: 'Internal Server Error',
      statusCode: status,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      let message: string | string[] = this.getMessageByStatus(status);
      let error: string = this.getErrorByStatus(status);

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as Record<string, any>;
        message = res.message ?? message;
        error = res.error ?? error;
      }

      errorResponse = {
        message,
        error,
        statusCode: status,
      };
    } else if (exception instanceof Error) {
      errorResponse = {
        message: exception.message,
        error: this.getErrorByStatus(status),
        statusCode: status,
      };
    }

    this.logger.error(
      `Status ${status} Error: ${JSON.stringify(errorResponse)}`,
    );

    response.status(status).json({
      time: new Date().toISOString(),
      path: request.url,
      error: errorResponse,
    });
  }

  private getErrorByStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      default:
        return 'Internal Server Error';
    }
  }

  private getMessageByStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Solicitud inválida';
      case HttpStatus.UNAUTHORIZED:
        return 'No autorizado';
      case HttpStatus.FORBIDDEN:
        return 'Acceso denegado';
      case HttpStatus.NOT_FOUND:
        return 'Recurso no encontrado';
      case HttpStatus.CONFLICT:
        return 'Conflicto en la solicitud';
      default:
        return 'Internal server error';
    }
  }
}
