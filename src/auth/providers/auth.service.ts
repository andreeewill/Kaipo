import { Injectable } from '@nestjs/common';

import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { LoginDto } from '../dtos/login.dto';
import { OrganizationRepository } from 'src/common/db/repositories/organization.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,

    private readonly auth0Service: Auth0Service,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Get Auth0 login URL.
   * @param loginDto
   */
  public async getLoginUrl(loginDto: LoginDto) {
    const organizationId =
      await this.organizationRepository.getOrganizationIdByName(
        loginDto.organization,
      );
    this.logger.log(
      `Get login URL for organization Name/ID: ${loginDto.organization}/${organizationId}`,
    );

    const url = this.auth0Service.getLoginUrl(organizationId);

    return url;
  }

  public async getLoginToken(code: string) {
    this.logger.log('Getting Auth0 login token');

    const token = await this.auth0Service.getLoginToken(code);

    return token;
  }
}
