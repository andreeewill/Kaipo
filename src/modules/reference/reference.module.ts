import { Module } from '@nestjs/common';

import { ReferenceController } from './controllers/reference.controller';
import { ReferenceService } from './providers/reference.service';
import { SatuSehatModule } from 'src/api/satu-sehat/satu-sehat.module';

@Module({
  imports: [SatuSehatModule],
  controllers: [ReferenceController],
  providers: [ReferenceService],
})
export class ReferenceModule {}
