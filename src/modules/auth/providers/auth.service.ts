import { HttpStatus, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';

// Providers
import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { OrganizationRepository } from 'src/db/repositories/organization.repository';

import { LoginDto } from '../dtos/login.dto';
import { GenericError } from 'src/common/errors/generic.error';
import { GoogleService } from 'src/api/google/providers/google.service';
import { UserRepository } from 'src/db/repositories/user.repository';
import { CryptoService } from 'src/common/util/providers/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,

    private readonly userRepository: UserRepository,

    private readonly auth0Service: Auth0Service,

    private readonly cryptoService: CryptoService,

    private readonly googleService: GoogleService,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Get Auth0 login URL.
   * @param loginDto
   * @deprecated
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
   * @deprecated
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
              message: 'user is not part of the organization',
              queryStringFromAuth0: query,
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

  public getGoogleLoginUrl(): string {
    return this.googleService.getGoogleAuthUrl();
  }

  public async loginBasic(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);

    // Compare password
    if (!user || password !== user?.password) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: 'Kombinasi email dan password tidak dapat ditemukan',
          reason: {
            message: 'User not found or incorrect password',
            isUserExist: !!user,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // compare password (need to be hashed)
  }
}
