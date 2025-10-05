import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AppLogger } from 'src/common/logger/app-logger.service';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { TokenPayload } from 'src/decorators/token-payload.decorator';
import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';
import { PatientService } from '../providers/patient.service';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly appLogger: AppLogger,

    private readonly patientService: PatientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient record' })
  @HttpCode(204)
  public async createNewPatient(
    @Body() createPatientDto: CreatePatientDto,
    @TokenPayload() tokenPayload: JWTPayload,
  ) {
    const organizationId = tokenPayload.organizationId!;

    await this.patientService.insert(createPatientDto, organizationId);

    return;
  }

  @Get()
  @ApiOperation({ summary: 'Get all patient records in an organization' })
  public async getAllPatients(@TokenPayload() tokenPayload: JWTPayload) {
    const organizationId = tokenPayload.organizationId!;

    const result =
      await this.patientService.getAllByOrganization(organizationId);

    return result;
  }
}
