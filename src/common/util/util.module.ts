import { Global, Module } from '@nestjs/common';
import { CryptoService } from './providers/crypto.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class UtilModule {}
