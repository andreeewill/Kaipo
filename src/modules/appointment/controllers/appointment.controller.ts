import { Controller, Post } from '@nestjs/common';

import { PERMISSION } from 'src/common/constants/permission.constant';
import { Permissions } from 'src/decorators/permissions.decorator';

import { AppointmentService } from '../providers/apppoitment.service';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @Permissions([PERMISSION.CREATE_APPOINTMENT])
  public createApppointment() {
    console.log('Creating appointment...');
  }
}
