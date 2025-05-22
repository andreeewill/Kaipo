import { Controller, Get } from '@nestjs/common';
import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: AppLogger,
    private readonly authService: Auth0Service,
  ) {}

  @Get('login')
  public async login() {
    this.logger.log('Redirecting to Auth0 login URL');

    const url = this.authService.getLoginUrl('heheh');

    return {
      url,
    };
  }

  @Get('callback')
  public async callback() {
    console.log('this is callback');

    // TODO: Handle callback error from auth0
    // 1. when user is not part of organization
    // 2. when organization is not found

    return {
      callback: 'hehe this is callback',
    };
  }
}
