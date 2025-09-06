import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AppLogger } from 'src/common/logger/app-logger.service';
import googleConfig from 'src/config/google.config';

@Injectable()
export class GoogleService {
  constructor(
    @Inject(googleConfig.KEY)
    private googleConf: ConfigType<typeof googleConfig>,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Generate Google OAuth login URL
   * @returns {string} Google OAuth login URL
   */
  public getGoogleAuthUrl(): string {
    this.logger.log('Getting Google login URL');

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    url.searchParams.append('redirect_uri', this.googleConf.callbackUrl);
    url.searchParams.append('client_id', this.googleConf.clientId);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', this.googleConf.scope);

    return url.href;
  }
}
