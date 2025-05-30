import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { map, tap } from 'rxjs/operators';

import { AppLogger } from '../logger/app-logger.service';
import { CorrelationIdService } from '../logger/correlation-id.service';

@Injectable()
export class AppRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly correlationIdService: CorrelationIdService,

    private readonly logger: AppLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const start = process.hrtime.bigint();

    const res = context.switchToHttp().getResponse<Response>();
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        if (!res.headersSent) {
          return {
            httpStatus: res.statusCode,
            operationId: this.correlationIdService.getId(),
            data,
          };
        }
      }),
      // logging
      tap(() => {
        const end = process.hrtime.bigint();
        const elapsedMs = Number(end - start) / 1_000_000;

        this.logger.log(
          `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsedMs.toFixed(2)}ms`,
        );
      }),
    );
  }
}
