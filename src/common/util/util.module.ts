import { Global, Module } from '@nestjs/common';
import { CryptoService } from './providers/crypto.service';
import { CasbinModule } from 'src/api/casbin/casbin.module';

@Global()
@Module({
  imports: [CasbinModule],
  controllers: [],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class UtilModule {}
