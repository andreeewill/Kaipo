import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RequestService } from './request.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
