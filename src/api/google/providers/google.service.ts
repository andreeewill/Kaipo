import { ConfigType } from '@nestjs/config';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import { AppLogger } from 'src/common/logger/app-logger.service';
import googleConfig from 'src/config/google.config';

@Injectable()
export class GoogleService implements OnModuleInit {
  private oauth2Client: OAuth2Client;

  constructor(
    @Inject(googleConfig.KEY)
    private googleConf: ConfigType<typeof googleConfig>,

    private readonly logger: AppLogger,
  ) {}

  onModuleInit() {
    this.oauth2Client = new google.auth.OAuth2({
      client_id: this.googleConf.clientId,
      client_secret: this.googleConf.clientSecret,
    });
  }

  /**
   * Generate Google OAuth login URL

   * @returns {string} Google OAuth login URL
   */
  public getGoogleAuthUrl(redirectUrl: string): string {
    this.logger.log('Getting Google login URL');

    const url = this.oauth2Client.generateAuthUrl({
      redirect_uri: redirectUrl,
      access_type: 'offline',
      scope: this.googleConf.scope.split(' '),
      prompt: 'consent', //! Remove once not needed
      // state
    });

    return url;
  }

  /**
   * Exchange auth code for tokens (access token, refresh token, id token, etc)
   * @param code
   * @returns
   */
  public async exchangeAuthCodeForTokens(code: string, redirectUrl: string) {
    try {
      this.logger.log('Exchanging auth code for tokens');

      const { tokens } = await this.oauth2Client.getToken({
        code,
        redirect_uri: redirectUrl,
      });

      return tokens;
    } catch (error) {
      this.logger.error('Error exchanging auth code for tokens');

      // throw new GenericError()

      throw error;
    }
  }
}
