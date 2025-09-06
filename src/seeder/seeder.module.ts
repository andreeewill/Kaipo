import { Module } from '@nestjs/common';
import { CasbinModule } from 'src/api/casbin/casbin.module';

@Module({
  imports: [CasbinModule],
  providers: [],
  exports: [],
})
export class SeederModule {}
