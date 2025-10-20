import { DeepPartial, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Reservation } from '../entities/reservation.entity';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { GenericError } from 'src/common/errors/generic.error';
import { GetPendingReservationsPayload } from 'src/modules/reservation/interfaces/get-pending-reservations-payload.interface';
import { ReservationStatus } from '../enums/reservation-status.enum';

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
  public async createReservation(reservation: DeepPartial<Reservation>) {
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

  public async getPendingReservations(payload: GetPendingReservationsPayload) {
    this.logger.log(`Get pending reservations from DB `);

    const { organizationId, branchId } = payload;

    const reservations = await this.repository.find({
      where: {
        status: ReservationStatus.Pending,
        organizationId,
        ...(branchId && { branchId }),
      },
      order: { createdAt: 'DESC' },
    });

    return reservations;
  }
}
