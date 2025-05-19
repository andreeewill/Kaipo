import { INQUIRER } from '@nestjs/core';
import { Inject, Injectable, Logger, Scope } from '@nestjs/common';

import { CorrelationIdService } from './correlation-id.service';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  constructor(
    private readonly correlationIdService: CorrelationIdService,
    @Inject(INQUIRER) parentClass: object,
  ) {
    super(parentClass?.constructor?.name || 'AppLogger', { timestamp: true });
  }

  log(message: string, ...optionalParams: any[]) {
    const correlationId = this.correlationIdService.getId();
    super.log(`[${correlationId ?? 'N/A'}] ${message}`, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    const correlationId = this.correlationIdService.getId();
    super.warn(`[${correlationId ?? 'N/A'}] ${message}`, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    const correlationId = this.correlationIdService.getId();
    super.error(`[${correlationId ?? 'N/A'}] ${message}`, ...optionalParams);
  }
}
