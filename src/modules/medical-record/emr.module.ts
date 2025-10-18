import { Module } from '@nestjs/common';

import { EmrController } from './controllers/emr.controller';
import { EmrService } from './providers/emr.service';
import { OpenAIModule } from 'src/api/openai/openai.module';

@Module({
  imports: [OpenAIModule],
  controllers: [EmrController],
  providers: [EmrService],
})
export class EmrModule {}
