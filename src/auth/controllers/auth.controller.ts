import { Controller, Get } from '@nestjs/common';
import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: AppLogger,
    private readonly authService: Auth0Service,
  ) {
    // Set the logger context to the class name
  }

  @Get('login')
  public async login() {
    this.logger.log('Redirecting to Auth0 login URL');
    this.logger.warn('Redirecting to Auth0 login URL');

    this.authService.getLoginUrl();
  }

  @Get('callback')
  public async callback() {}
}
