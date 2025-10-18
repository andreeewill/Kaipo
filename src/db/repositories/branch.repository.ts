import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Branch } from '../entities/branch.entity';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class BranchRepository {
  constructor(
    @InjectRepository(Branch)
    private readonly repository: Repository<Branch>,

    private readonly appLogger: AppLogger,
  ) {}

  public async getOrganizationByBranchId(branchId: string) {
    const result = await this.repository.findOne({
      where: { id: branchId },
      relations: { organization: true },
    });
    return result?.organization;
  }

  /**
   * Get all branches in an organization
   * @param organizationId
   */
  public async getAllByOrganization(organizationId: string) {
    const branches = await this.repository.find({
      where: { organization: { id: organizationId } },
    });
    return branches;
  }
}
