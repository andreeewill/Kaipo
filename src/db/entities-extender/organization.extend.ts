import { Repository } from 'typeorm';

import { Organization } from '../entities/organization.entity';

export interface ExtendedOrganizationRepository
  extends Repository<Organization> {
  findByName(name: string): Promise<Organization | null>;
}

export const extendedOrganizationRepository = {
  findByName(this: Repository<Organization>, name: string) {
    return this.findOne({ where: { name } });
  },
};
