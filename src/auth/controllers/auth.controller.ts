import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('login')
  public async login() {}

  @Get('callback')
  public async callback() {}
}
