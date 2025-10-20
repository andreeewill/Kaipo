import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { Public } from 'src/decorators/public.decorator';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { ReservationService } from '../providers/reservation.service';
import { GetAvailableBranches } from '../dtos/get-available-branches.dto';
import { GetAvailableDoctorsDto } from '../dtos/get-available-doctors.dto';
import { GetAvailableTimeslotsDto } from '../dtos/get-available-timeslots.dto';
import { TokenPayload } from 'src/decorators/token-payload.decorator';
import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Public()
  @Get('/branches')
  @ApiOperation({
    summary:
      'Get available branches in organization. Organization Id is obtained from client own URL',
  })
  public async getAvailableBranches(
    @Query() getAvailableBranches: GetAvailableBranches,
  ) {
    const branches = await this.reservationService.getOrganizationBranches(
      getAvailableBranches.organizationId,
    );
    return branches;
  }

  @Public()
  @Get('/doctors')
  @ApiOperation({
    summary:
      'Get available doctors in branch. Branch is selected from available branches endpoint',
  })
  public async getAvailableDoctors(
    @Query() getAvailableDoctors: GetAvailableDoctorsDto,
  ) {
    const doctors = await this.reservationService.getAvailableDoctorsInBranch(
      getAvailableDoctors.branchId,
    );

    return doctors;
  }

  @Public()
  @Get('/timeslots')
  @ApiOperation({
    summary: 'Get available timeslots for a doctor in an organization',
  })
  public async getAvailableTimeslots(
    @Query() getAvailableTimeslots: GetAvailableTimeslotsDto,
  ) {
    // @todo : also need to consider doctor's off days

    const timeslots = await this.reservationService.getAvailableTimeSlots(
      getAvailableTimeslots.branchId,
      getAvailableTimeslots.doctorId,
    );

    return timeslots;
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ) {
    await this.reservationService.createReservation(createReservationDto);
    return;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get reservations for organization or branch (filter)',
  })
  public async getReservations(
    @TokenPayload() tokenPayload: JWTPayload,
    @Query('branchId') branchId?: string,
  ) {
    const organizationId = tokenPayload.organizationId!;
    const reservations = await this.reservationService.getReservations(
      organizationId,
      branchId,
    );

    return reservations;
  }
}
