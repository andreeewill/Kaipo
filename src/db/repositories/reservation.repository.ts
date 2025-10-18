import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Reservation } from '../entities/reservation.entity';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { GenericError } from 'src/common/errors/generic.error';

@Injectable()
export class ReservationRepository {
  constructor(
    private readonly logger: AppLogger,

    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
  ) {}

  /**
   * Create a new reservation
   * @param reservation
   */
  public async createReservation(reservation: Omit<Reservation, 'id'>) {
    try {
      this.logger.log(`Creating a new reservation for ${reservation.name}`);

      const ent = this.repository.create(reservation);

      return await this.repository.save(ent);
    } catch (error) {
      throw new GenericError(
        {
          type: 'UNPROCESSABLE_ENTITY',
          reason: `failed to create reservation: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
