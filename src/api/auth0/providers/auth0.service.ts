import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import auth0Config from 'src/config/auth0.config';

@Injectable()
export class Auth0Service {
  private readonly baseUrl: string;

  constructor(
    @Inject(auth0Config.KEY)
    private authConfig: ConfigType<typeof auth0Config>,
  ) {
    this.baseUrl = this.authConfig.baseUrl;
  }

  /**
   * Get Auth0 login URL
   */
  public getLoginUrl(): string {
    return '';
  }
}
