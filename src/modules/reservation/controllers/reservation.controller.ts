import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { Public } from 'src/decorators/public.decorator';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { ReservationService } from '../providers/reservation.service';
import { GetAvailableBranches } from '../dtos/get-available-branches.dto';
import { GetAvailableDoctorsDto } from '../dtos/get-available-doctors.dto';
import { GetAvailableTimeslotsDto } from '../dtos/get-available-timeslots.dto';

@Controller('reservation')
@Public()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('/branches')
  @ApiOperation({
    summary:
      'Get available branches in organization. Organization Id is obtained from client own URL',
  })
  public async getAvailableBranches(
    @Body() getAvailableBranches: GetAvailableBranches,
  ) {
    const branches = await this.reservationService.getOrganizationBranches(
      getAvailableBranches.organizationId,
    );
    return branches;
  }

  @Get('/doctors')
  @ApiOperation({
    summary:
      'Get available doctors in branch. Branch is selected from available branches endpoint',
  })
  public async getAvailableDoctors(
    @Body() getAvailableDoctors: GetAvailableDoctorsDto,
  ) {
    const doctors = await this.reservationService.getAvailableDoctorsInBranch(
      getAvailableDoctors.branchId,
    );

    return doctors;
  }

  @Get('/timeslots')
  @ApiOperation({
    summary: 'Get available timeslots for a doctor in an organization',
  })
  public async getAvailableTimeslots(
    @Body() getAvailableTimeslots: GetAvailableTimeslotsDto,
  ) {
    // @todo : also need to consider doctor's off days

    const timeslots = await this.reservationService.getAvailableTimeSlots(
      getAvailableTimeslots.branchId,
      getAvailableTimeslots.doctorId,
    );

    return timeslots;
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ) {
    await this.reservationService.createReservation(createReservationDto);
    return;
  }
}
