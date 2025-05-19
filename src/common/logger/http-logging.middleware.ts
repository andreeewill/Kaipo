import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from './app-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {
    this.use = this.use.bind(this); // Ensure correct 'this' context
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const elapsedMs = Number(end - start) / 1_000_000;

      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsedMs.toFixed(2)}ms`,
      );
    });

    next();
  }
}
