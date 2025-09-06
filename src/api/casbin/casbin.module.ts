import { Module } from '@nestjs/common';
import { CasbinService } from './providers/casbin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasbinRule } from 'typeorm-adapter';

@Module({
  imports: [TypeOrmModule.forFeature([CasbinRule])],
  providers: [CasbinService],
  exports: [CasbinService],
})
export class CasbinModule {}
