import { Injectable } from '@nestjs/common';

import { AppLogger } from 'src/common/logger/app-logger.service';

import { CreatePatientDto } from '../dtos/create-patient.dto';
import { PatientRepository } from 'src/db/repositories/patient.repository';

@Injectable()
export class PatientService {
  constructor(
    private readonly appLogger: AppLogger,

    private readonly patientRepository: PatientRepository,
  ) {}

  /**
   * Insert new patient record to DB.
   * @param createPatientDto
   * @param organizationId
   * @returns
   */
  public async insert(
    createPatientDto: CreatePatientDto,
    organizationId: string,
  ) {
    const result = await this.patientRepository.insert(
      createPatientDto,
      organizationId,
    );

    return result;
  }

  public async getAllByOrganization(organizationId: string) {
    const result =
      await this.patientRepository.getAllByOrganization(organizationId);

    const formatted = result.map((patient) => ({
      id: patient.id,
      NIK: patient.NIK,
      kkNumber: patient.kkNumber,
      name: patient.name,
      dob: patient.dob,
      birthPlace: patient.birthPlace,
      gender: patient.gender,
      maritalStatus: patient.maritalStatus || '',
      addressLine: patient.addressLine,
      addressUse: patient.addressUse,
      provinceName: patient.provinceName,
      cityName: patient.cityName,
      disctrictName: patient.districtName,
      subDistrictName: patient.subDistrictName,
      rt: patient.rt,
      rw: patient.rw,
      postalCode: patient.postalCode,
      phone: patient.phone || '',
      email: patient.email || '',
      occupation: patient.occupation || '',
    }));

    return formatted;
  }
}
