import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import auth0Config from 'src/config/auth0.config';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { url } from 'inspector';

@Injectable()
export class Auth0Service {
  constructor(
    @Inject(auth0Config.KEY)
    private authConfig: ConfigType<typeof auth0Config>,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Get Auth0 login URL
   *
   * @description returns the login URL for Auth0 that will be used to redirect the user to the Auth0 login page.
   */
  public getLoginUrl(organization: string): string {
    this.logger.log('Getting Auth0 login URL');

    const url = new URL(`${this.authConfig.baseUrl}/authorize`);

    url.searchParams.append('client_id', this.authConfig.clientId);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('redirect_uri', this.authConfig.redirectUri);
    url.searchParams.append('scope', 'openid profile email');
    url.searchParams.append('organization', 'org_WdM3kHvuUApaQCEi');

    return url.href;
  }
}
