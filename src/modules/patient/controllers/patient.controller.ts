import { Controller, Post } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly appLogger: AppLogger) {}

  @Post()
  public createNewPatient() {}
}
