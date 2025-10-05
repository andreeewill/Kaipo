import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

export interface ExtendedPatientRepository extends Repository<Patient> {
  findByOrganizationId(organizationId: string): Promise<Patient[]>;
}

export const extendedPatientRepository = {
  findByOrganizationId(this: Repository<Patient>, organizationId: string) {
    return this.createQueryBuilder('patient')
      .where('patient.organizationId = :organizationId', { organizationId })
      .getMany();
  },
};
