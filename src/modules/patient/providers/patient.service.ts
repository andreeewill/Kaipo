import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class PatientService {
  constructor(private readonly appLogger: AppLogger) {}
}
