import moment from 'moment';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

import { CorrelationIdService } from '../common/logger/correlation-id.service';
import { BaseError } from '../common/errors/base.error';
import { AppLogger } from '../common/logger/app-logger.service';

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
    const isNotFoundError = exception instanceof NotFoundException;

    if (isUnknownError && isNotFoundError) {
      this.logger.error(`Resource not found : ${exception.message}`);

      return response.status(HttpStatus.NOT_FOUND).json({
        httpStatus: HttpStatus.NOT_FOUND,
        operationId: this.correlationIdService.getId(),
        data: {
          code: `${moment().format('MMDDhmmss')}-00001`,
          message: 'Hal yang kamu cari tidak dapat ditemukan :(',
        },
      });
    }

    /**
     * Error must be inherited from BaseError (no need to print error on unknown route)
     */
    if (isUnknownError) {
      const shouldPrintErrStack =
        process.env.NODE_ENV !== 'production' &&
        !(exception instanceof NotFoundException);

      this.logger.error(
        `Unknown error occured : ${exception.message}`,
        shouldPrintErrStack ? exception.stack : undefined,
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
