import moment from 'moment';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { CorrelationIdService } from '../logger/correlation-id.service';
import { BaseError } from '../errors/base.error';
import { AppLogger } from '../logger/app-logger.service';

/**
 * Catch all exceptions on application and handle response accordingly. All errors must be inherited from BaseError, otherwise error will be thrown.
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly correlationIdService: CorrelationIdService,

    private readonly logger: AppLogger,
  ) {}

  catch(exception: Error, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isUnknownError = !(exception instanceof BaseError);

    /**
     * Error must be inherited from BaseError
     */
    if (isUnknownError) {
      this.logger.error(
        `Unknown error occured : ${exception.message}`,
        exception.stack,
      );

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        operationId: this.correlationIdService.getId(),
        data: {
          code: `${moment().format('MMDDhmmss')}-x0001`,
          message:
            'Terjadi kesalahan pada sistem, silahkan hubungi ke support@kaipo.id',
        },
      });
    }

    const httpStatus = exception.getStatus();

    this.logger.error(`${exception.name} : ${exception.getErrorDetailsBE()}`);

    /**
     * Handle system error (500+). Should not expose error details to user
     */
    if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return response.status(httpStatus).json({
        httpStatus: httpStatus,
        operationId: this.correlationIdService.getId(),
        data: {
          code: `${moment().format('MMDDhmmss')}-x0002`,
          message:
            'Terjadi kesalahan pada sistem, silahkan hubungi ke support@kaipo.id',
        },
      });
    }

    return response.status(httpStatus).json({
      httpStatus,
      operationId: this.correlationIdService.getId(),
      data: exception.getErrorDetailsFE(),
    });
  }
}
