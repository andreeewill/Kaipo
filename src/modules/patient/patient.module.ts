import { Module } from '@nestjs/common';
import { PatientService } from './providers/patient.service';
import { PatientController } from './controllers/patient.controller';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
