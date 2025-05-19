import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

const CORRELATION_ID_KEY = 'correlationId';

@Injectable()
export class CorrelationIdService {
  private readonly als = new AsyncLocalStorage<Map<string, string>>();

  runWithId<T>(fn: () => T, correlationId?: string): T {
    const store = new Map<string, string>();
    store.set(CORRELATION_ID_KEY, correlationId || randomUUID());
    return this.als.run(store, fn);
  }

  getId(): string | undefined {
    const store = this.als.getStore();
    return store?.get(CORRELATION_ID_KEY);
  }
}
