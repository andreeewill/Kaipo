import { HttpStatus, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { LoginDto } from '../dtos/login.dto';
import { OrganizationRepository } from 'src/common/db/repositories/organization.repository';
import { GenericError } from 'src/common/errors/generic.error';

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

  /**
   * Handle callback from Auth0 after user is redirected back to the application.
   * @param query
   */
  public async handleCallback(query: any) {
    this.logger.log('Handling Auth0 callback');

    if (!query.code) {
      if (/is not part/.test(query?.error_description)) {
        throw new GenericError(
          {
            type: 'NOT_FOUND',
            message: 'Akunmu tidak terdaftar dalam organisasi ini',
            reason: {
              reason: query,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new GenericError(
        {
          type: 'NOT_FOUND',
          reason: {
            message: 'code is missing from auth0 callback',
            queryStrFromAuth0: query,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.log('Getting Auth0 login token');

    const token = await this.auth0Service.getLoginToken(query.code);

    const payload = jwt.decode(token.access_token);
    if (!payload) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          reason: {
            message: 'JWT decode resolve with falsy value',
            payload,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    console.log(token);
    return token;
  }
}
