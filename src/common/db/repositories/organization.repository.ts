import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Organization } from '../entities/organization.entity';
import {
  ExtendedOrganizationRepository,
  extendedOrganizationRepository,
} from '../entities-extender/organization.extend';
import { GenericError } from 'src/common/errors/generic.error';

@Injectable()
export class OrganizationRepository {
  private organizationRepository: ExtendedOrganizationRepository;

  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
  ) {
    this.organizationRepository = this.repository.extend(
      extendedOrganizationRepository,
    );
  }

  /**
   * Get organization ID by name. Name of an organization is a subdomain that will be assigned for each client
   * @param name - Name of the organization
   * @returns Organization ID
   */
  public async getOrganizationIdByName(name: string) {
    const organization = await this.organizationRepository.findByName(name);

    if (!organization) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: `Invalid organization name of ${name}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return organization.id;
  }
}
