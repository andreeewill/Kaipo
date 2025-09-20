import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// Entities
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
          message: `Nama organisasi tidak ditemukan :(`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return organization.id;
  }

  /**
   * Get all organizations (clinics) that the user has access to
   * @param userId User ID
   * @returns List of organizations
   */
  public async getAllUserOrganizations(userId: string) {
    console.log('userId', userId);
    const organizations = await this.repository
      .createQueryBuilder('organization')
      .innerJoin('organization.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('organization.status = :status', { status: 'active' })
      .getMany();

    // alternate query
    // const org = await this.repository.find({
    //   relations: { users: true },
    //   where: { users: { id: userId } },
    // });

    return organizations;
  }
}
