import { Controller, Get, Query, Req } from '@nestjs/common';
import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: AppLogger,

    private readonly auth0Service: Auth0Service,
  ) {}

  @Get('login')
  public async login() {
    this.logger.log('Redirecting to Auth0 login URL');

    const url = this.auth0Service.getLoginUrl('heheh');

    return {
      url,
    };
  }

  @Get('callback')
  public async callback(@Query('code') code: string) {
    console.log('this is callback');

    // TODO: Handle callback error from auth0
    // 1. when user is not part of organization
    // 2. when organization is not found
    const token = await this.auth0Service.getLoginToken(code);

    console.log('token', token);

    return { accessToken: token.access_token, idToken: token.id_token };
  }
}
