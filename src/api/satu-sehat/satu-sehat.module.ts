import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SatuSehatService } from './providers/satu-sehat.service';
import { SatuSehatRequestProvider } from './providers/satu-sehat-request.provider';

@Module({
  imports: [HttpModule],
  providers: [SatuSehatService, SatuSehatRequestProvider],
  exports: [SatuSehatService],
})
export class SatuSehatModule {}
