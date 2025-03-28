import { IErrorLog } from './../types';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorLogService } from 'src/modules/errorLog/errorLog.service';
import { ErrorSeverity } from '../enum';
import { ITokenData } from '../types';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly errorLogService: ErrorLogService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Logging an error to the console
    Logger.error(exception.message, exception.stack);

    // Saving the error in the database if status >= 500
    if (status >= 500) {
      const tokenData = ctx.getRequest().tokenData as ITokenData;
      const userId = tokenData ? tokenData._id : undefined; // If there is a user, we record his ID
      const description = exception.message || 'Internal Server Error';

      await this.errorLogService.logError({
        actionType: 'server_error',
        description: description,
        message: (exception as any).response.error,
        userId: userId,
        severity: ErrorSeverity.HIGH,
      } as IErrorLog);
    }

    // Sending a standard response to a user
    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
