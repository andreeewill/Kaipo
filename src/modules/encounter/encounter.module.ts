import { Module } from '@nestjs/common';

// controllers
import { EncounterController } from './controllers/encounter.controller';

// providers
import { EncounterService } from './providers/apppoitment.service';

@Module({
  imports: [],
  controllers: [EncounterController],
  providers: [EncounterService],
  exports: [EncounterService],
})
export class EncounterModule {}
