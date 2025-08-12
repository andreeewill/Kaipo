import { Module } from '@nestjs/common';

// controllers
import { AppointmentController } from './controllers/appointment.controller';

// providers
import { AppointmentService } from './providers/apppoitment.service';

@Module({
  imports: [],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
