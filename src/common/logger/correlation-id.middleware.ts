import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CorrelationIdService } from './correlation-id.service';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  correlationIdService: CorrelationIdService;

  constructor(correlationIdService: CorrelationIdService) {
    this.correlationIdService = correlationIdService;
    this.use = this.use.bind(this); // rebind the method to the current instance
  }

  use(req: Request, res: Response, next: NextFunction) {
    const incomingId = req.headers['x-correlation-id'] as string | undefined;

    this.correlationIdService.runWithId(() => next(), incomingId);
  }
}
