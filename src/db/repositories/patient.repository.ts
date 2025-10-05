import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Patient } from '../entities/patient.entity';
import {
  extendedPatientRepository,
  ExtendedPatientRepository,
} from '../entities-extender/patient.extend';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class PatientRepository {
  private patientRepository: ExtendedPatientRepository;

  constructor(
    private readonly logger: AppLogger,

    @InjectRepository(Patient)
    private readonly repository: Repository<Patient>,
  ) {
    this.patientRepository = this.repository.extend(extendedPatientRepository);
  }

  /**
   * Insert new patient record to DB.
   * @param patient
   * @param organizationId
   * @returns
   */
  public async insert(patient: DeepPartial<Patient>, organizationId: string) {
    this.logger.log(
      `Inserting new patient for organization ID: ${organizationId}`,
    );

    const ent = this.patientRepository.create({
      ...patient,
      organization: { id: organizationId },
    });
    const result = await this.patientRepository.save(ent);

    return result;
  }

  /**
   * Get all patients in an organization
   * @param organizationId
   */
  public async getAllByOrganization(organizationId: string) {
    this.logger.log(
      `Fetching all patients for organization ID: ${organizationId}`,
    );

    return this.patientRepository.find({
      where: { organization: { id: organizationId } },
    });
  }
}
