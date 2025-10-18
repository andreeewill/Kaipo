import { Module } from '@nestjs/common';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './providers/reservation.service';

@Module({
  imports: [],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
