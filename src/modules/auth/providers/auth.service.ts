import { HttpStatus, Injectable } from '@nestjs/common';

// Providers
import { AppLogger } from 'src/common/logger/app-logger.service';

import { GenericError } from 'src/common/errors/generic.error';
import { GoogleService } from 'src/api/google/providers/google.service';
import { UserRepository } from 'src/db/repositories/user.repository';
import { CryptoService } from 'src/common/util/providers/crypto.service';
import { CasbinService } from 'src/api/casbin/providers/casbin.service';
import { IdTokenPayload } from 'src/api/google/interfaces/id-token-payload.interface';
import { UserMetadataRepository } from 'src/db/repositories/user-metadata.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,

    private readonly userMetadataRepository: UserMetadataRepository,

    private readonly cryptoService: CryptoService,

    private readonly googleService: GoogleService,

    private readonly casbinService: CasbinService,

    private readonly logger: AppLogger,
  ) {}

  public getGoogleLoginUrl(redirectUrl: string): string {
    return this.googleService.getGoogleAuthUrl(redirectUrl);
  }

  public async loginBasic(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);

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

    //* Google login check
    if (user.userMetadata.isGoogleLogin) {
      throw new GenericError(
        {
          type: 'FORBIDDEN',
          message:
            'Akun ini sudah terhubung dengan google, silahkan login menggunakan google',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const roles = await this.casbinService.getUserRolesInClinic(
      user.email,
      user.organization.id,
    );

    //! compare password (must be hashed)
    const jwt = this.cryptoService.createLoginJWT({
      sub: user.email,
      role: roles,
    });

    return jwt;
  }

  public async handleGoogleCallback(code: string, redirectUrl: string) {
    const tokens = await this.googleService.exchangeAuthCodeForTokens(
      code,
      redirectUrl,
    );

    const {
      access_token,
      refresh_token,
      id_token,
      // refresh_token_expires_in,
      // expiry_date,
    } = tokens;

    if (!id_token) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: 'Terjadi kesalahan pada sistem, silahkan coba lagi nanti',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // exchange id_token
    const profile = this.cryptoService.decodeJWT<IdTokenPayload>(id_token);
    const user = await this.userRepository.getByEmail(profile.email);

    if (!user) {
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          message: 'User tidak dapat ditemukan pada sistem',
          reason: {
            message: 'User not found (using google login)',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //* Upsert google token
    await this.userMetadataRepository.saveGoogleTokenInfo(user.id, {
      googleAccessToken: access_token || undefined,
      googleRefreshToken: refresh_token || undefined,
      isGoogleLogin: true,
    });

    const roles = await this.casbinService.getUserRolesInClinic(
      user.email,
      user.organization.id,
    );

    const jwt = this.cryptoService.createLoginJWT({
      sub: user.email,
      role: roles,
    });

    return jwt;
  }
}
