import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';

import { OfficeHours } from '../entities/office-hours.entity';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { CasbinService } from 'src/api/casbin/providers/casbin.service';
import { UserRole } from 'src/common/types/auth.type';
import { GenericError } from 'src/common/errors/generic.error';

@Injectable()
export class OfficeHoursRepository {
  constructor(
    @InjectRepository(OfficeHours)
    private readonly repository: Repository<OfficeHours>,

    private readonly casbinService: CasbinService,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Get office hours by ID
   * @param officeHoursId
   * @returns
   */
  public async getById(officeHoursId: string) {
    try {
      this.logger.log(`Fetching office hours by ID: ${officeHoursId}`);

      if (!isValidUUID(officeHoursId)) {
        this.logger.warn(`Invalid UUID format provided`);
        return null;
      }

      const officeHours = await this.repository.findOne({
        where: { id: officeHoursId },
        relations: { branch: true, user: true },
      });

      return officeHours;
    } catch (error) {
      throw new GenericError(
        {
          type: 'UNPROCESSABLE_ENTITY',
          reason: `failed to get office hours record: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get doctor available in a branch. Available means doctors that has schedule in the branch
   * @param organizationId
   * @param branchId
   */
  public async getAvailableDoctorsInBranch(
    organizationId: string,
    branchId: string,
  ) {
    this.logger.log(`Fetching available doctors in branch ID: ${branchId}`);

    const doctors: { id: string; name: string }[] = [];
    const result = await this.repository.find({
      where: { branch: { id: branchId } },
      relations: { user: true },
    });

    // Filter based on doctor role
    const promises = [];
    for (const officeHour of result) {
      const userEmail = officeHour.user.email;

      const promise = this.casbinService
        .getUserRolesInClinic(userEmail, organizationId)
        .then((roles) => {
          // filter for doctor role
          if (roles.includes(UserRole.DOCTOR)) {
            doctors.push({
              id: officeHour.user.id,
              name: officeHour.user.name,
            });
          }
        });

      promises.push(promise);
    }

    await Promise.all(promises);

    this.logger.log(`Found ${doctors.length} available doctors`);

    return doctors;
  }

  /**
   * Get doctor office hours in a branch
   * @param branchId
   * @param doctorId
   */
  public async getDoctorOfficeHoursInBranch(
    branchId: string,
    doctorId: string,
  ) {
    this.logger.log(
      `Fetching office hours for doctor ID: ${doctorId} in branch ID: ${branchId}`,
    );

    //? UUID validation
    if (!isValidUUID(branchId) || !isValidUUID(doctorId)) {
      this.logger.warn(`Invalid UUID format provided`);
      return [];
    }

    const officeHours = await this.repository.find({
      where: {
        branch: { id: branchId },
        user: { id: doctorId },
      },
      order: { startTime: 'ASC' },
    });

    const formattedOfficeHours = officeHours.map((o) => {
      return {
        id: o.id,
        dayOfWeek: o.dayOfWeek,
        startTime: o.startTime,
        endTime: o.endTime,
      };
    });

    return formattedOfficeHours;
  }
}
