import { Global, OnModuleDestroy } from '@nestjs/common';

@Global()
export class RedisCoreModule implements OnModuleDestroy {
  onModuleDestroy() {
    // Cleanup logic if needed when the module is destroyed
    console.log('RedisCoreModule is being destroyed');
  }

  // static register() {}

  // static
}
