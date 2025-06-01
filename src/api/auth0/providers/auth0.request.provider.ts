import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import auth0Config from 'src/config/auth0.config';
import { GetAccessTokenResponse } from '../interfaces/get-access-token-response.interface';
import { JwksResponse } from '../interfaces/jwks-response.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class Auth0RequestProvider {
  constructor(
    @Inject(auth0Config.KEY)
    private authConfig: ConfigType<typeof auth0Config>,

    private readonly httpService: HttpService,
  ) {}

  /**
   * Exchange code for access token. After user is redirected back to the application, the code must be exchanged for an access token.
   * @see https://auth0.com/docs/api/authentication/authorization-code-flow/get-token
   */
  public async getAccessToken(code: string) {
    const url = new URL(`${this.authConfig.baseUrl}/oauth/token`);

    const { data } = await firstValueFrom(
      this.httpService.post<GetAccessTokenResponse>(url.href, {
        grant_type: 'authorization_code',
        client_id: this.authConfig.clientId,
        client_secret: this.authConfig.clientSecret,
        redirect_uri: this.authConfig.redirectUri, // must match wtih the one in login url
        code,
      }),
    );

    return data;
  }

  /**
   * Get Auth0 JWKS. value of keyset will be stored in redis
   */
  public async getJWKS(options?: { forceRefresh?: boolean }) {
    const url = new URL(`${this.authConfig.baseUrl}/.well-known/jwks.json`);

    const { data } = await firstValueFrom(
      this.httpService.get<JwksResponse>(url.href),
    );

    //! Store data value in redis

    return data.keys;
  }
}
