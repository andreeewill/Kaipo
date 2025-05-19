import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import auth0Config from 'src/config/auth0.config';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class Auth0Service {
  private readonly baseUrl: string;

  constructor(
    @Inject(auth0Config.KEY)
    private authConfig: ConfigType<typeof auth0Config>,

    @Inject(AppLogger)
    private readonly logger: AppLogger,
  ) {
    this.baseUrl = this.authConfig.baseUrl;
  }

  /**
   * Get Auth0 login URL
   * @description This function returns the login URL for Auth0 that will be used to redirect the user to the Auth0 login page.
   */
  public getLoginUrl(): string {
    this.logger.log('Getting Auth0 login URL');

    return '';
  }
}
