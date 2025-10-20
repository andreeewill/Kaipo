import { HttpStatus, Injectable } from '@nestjs/common';

import { AppLogger } from 'src/common/logger/app-logger.service';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { BranchRepository } from 'src/db/repositories/branch.repository';
import { GenericError } from 'src/common/errors/generic.error';
import { OfficeHoursRepository } from 'src/db/repositories/office-hours.repository';

import { ReservationRepository } from 'src/db/repositories/reservation.repository';
import { UserRepository } from 'src/db/repositories/user.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly logger: AppLogger,

    private readonly reservationRepository: ReservationRepository,

    private readonly userRepository: UserRepository,

    private readonly officeHoursRepository: OfficeHoursRepository,

    private readonly branchRepository: BranchRepository,
  ) {}

  public async getOrganizationBranches(organizationId: string) {
    this.logger.log(`Fetching branches for organization ID: ${organizationId}`);

    const branches =
      await this.branchRepository.getAllByOrganization(organizationId);

    if (!branches || branches.length === 0) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: 'Cabang organisasi tidak ditemukan :(',
          reason: `no branches found for organization ID: ${organizationId}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedBranches = branches.map((b) => ({
      id: b.id,
      name: b.name,
    }));

    return formattedBranches;
  }

  /**
   * Get available doctor in a branch. Available means doctors that has schedule in the branch
   */
  public async getAvailableDoctorsInBranch(branchId: string) {
    this.logger.log(`Fetching available doctors in branch ID: ${branchId}`);

    // get organization ID from branch ID
    const organization =
      await this.branchRepository.getOrganizationByBranchId(branchId);
    if (!organization) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: 'Tidak ada organisasi ditemukan :(',
          reason: `no organization found for branch ID: ${branchId}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const doctors =
      await this.officeHoursRepository.getAvailableDoctorsInBranch(
        organization.id,
        branchId,
      );

    return doctors;
  }

  /**
   * Get available time slots for a specific doctor in a branch
   */
  public async getAvailableTimeSlots(branchId: string, doctorId: string) {
    this.logger.log(
      `Fetching available time slots for doctor ID: ${doctorId} in branch ID: ${branchId}`,
    );

    const officeHours =
      await this.officeHoursRepository.getDoctorOfficeHoursInBranch(
        branchId,
        doctorId,
      );

    return officeHours;
  }

  /**
   * Create a new reservation. Reservation is an initial request before an appointment. There's no guarantee that patient will get an appointment. Data is kept until later
   */
  public async createReservation(createReservationDto: CreateReservationDto) {
    this.logger.log(`Creating new reservation...`);

    this.logger.log('Validate chosen doctors timeslot');
    const officeHour = await this.officeHoursRepository.getById(
      createReservationDto.timeslotId,
    );
    if (!officeHour) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: 'Jadwal dokter tidak ditemukan :(',
          reason: `no office hour found for id: ${createReservationDto.timeslotId}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //* Get organization  from branch ID
    const organization = await this.branchRepository.getOrganizationByBranchId(
      officeHour.branch.id,
    );

    const reservation = await this.reservationRepository.createReservation({
      name: createReservationDto.name,
      phone: createReservationDto.phone,
      complaint: createReservationDto.complaint,
      startTime: officeHour.startTime,
      endTime: officeHour.endTime,
      organizationId: organization!.id,
      branchId: officeHour.branch.id,
      doctorId: officeHour.user.id,
      date: createReservationDto.date,
    });

    this.logger.log(`Reservation created with ID: ${reservation.id}`);

    return reservation;
  }

  /**
   * Get pending reservations for a specific organization and optional branch
   * @param organizationId
   * @param branchId
   */
  public async getPendingReservations(
    organizationId: string,
    branchId?: string,
  ) {
    this.logger.log(`Fetching pending reservations..`);

    const reservations =
      await this.reservationRepository.getPendingReservations({
        organizationId,
        branchId,
      });

    const formattedReservations = reservations.map((r) => ({
      name: r.name,
      complaint: r.complaint,
      startTime: r.startTime,
      endTime: r.endTime,
      status: r.status,
    }));

    return formattedReservations;
  }

  public async getReservations(organizationId: string, branchId?: string) {
    this.logger.log(`Fetching reservations..`);

    //@todo : implement paginations

    const reservations =
      await this.reservationRepository.getPendingReservations({
        organizationId,
        branchId,
      });

    const formattedReservations = Promise.all(
      reservations.map(async (r) => {
        const doctor = await this.userRepository.findById(r.doctorId);
        return {
          name: r.name,
          complaint: r.complaint,
          doctorName: doctor?.name,
          phone: r.phone,
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
        };
      }),
    );

    return formattedReservations;
  }
}
