import { Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AppLogger } from 'src/common/logger/app-logger.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly appLogger: AppLogger) {}

  @Post()
  @ApiOperation({ summary: 'Creata a' })
  public createNewPatient() {}
}
