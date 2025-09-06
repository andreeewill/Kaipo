import { Module } from '@nestjs/common';
import { OwnerService } from './providers/owner.service';
import { OwnerController } from './controllers/owner.controller';

@Module({
  imports: [],
  providers: [OwnerService],
  controllers: [OwnerController],
})
export class OwnerModule {}
