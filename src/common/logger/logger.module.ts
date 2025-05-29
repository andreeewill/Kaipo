import { INQUIRER } from '@nestjs/core';
import { Module, Global, Scope } from '@nestjs/common';

import { AppLogger } from './app-logger.service';
import { CorrelationIdService } from './correlation-id.service';

@Global()
@Module({
  providers: [
    CorrelationIdService,
    {
      provide: AppLogger,
      scope: Scope.TRANSIENT,
      useFactory: (
        correlationIdService: CorrelationIdService,
        parentClass: object,
      ) => {
        return new AppLogger(correlationIdService, parentClass);
      },
      inject: [CorrelationIdService, INQUIRER],
    },
  ],
  exports: [AppLogger, CorrelationIdService],
})
export class LoggerModule {}
