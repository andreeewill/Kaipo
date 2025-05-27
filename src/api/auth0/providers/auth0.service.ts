import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import auth0Config from 'src/config/auth0.config';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { Auth0RequestProvider } from './auth0.request.provider';

@Injectable()
export class Auth0Service {
  constructor(
    @Inject(auth0Config.KEY)
    private authConfig: ConfigType<typeof auth0Config>,

    private readonly auth0RequestProvider: Auth0RequestProvider,

    private readonly logger: AppLogger,
  ) {}

  /**
   * Get Auth0 login URL.
   * @description returns the login URL for Auth0 that will be used to redirect the user to the Auth0 login page.
   */
  public getLoginUrl(organization: string): string {
    this.logger.log('Getting Auth0 login URL');

    const url = new URL(`${this.authConfig.baseUrl}/authorize`);

    url.searchParams.append('client_id', this.authConfig.clientId);
    url.searchParams.append('audience', this.authConfig.audience);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('redirect_uri', this.authConfig.redirectUri);
    url.searchParams.append('scope', 'openid profile email');
    url.searchParams.append('organization', 'org_WdM3kHvuUApaQCEi');

    return url.href;
  }

  /**
   * Exchange code for access token and id token.
   * @param code authorization code returned from Auth0
   */
  public async getLoginToken(code: string) {
    this.logger.log('Getting Auth0 login token');

    const token = await this.auth0RequestProvider.getAccessToken(code);

    return token;
  }
}
