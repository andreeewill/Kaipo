import { Response } from 'express';
import { Body, Controller, Get, Query, Req, Res } from '@nestjs/common';

import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../providers/auth.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/types/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const url = await this.authService.getLoginUrl(loginDto);

    return loginDto.redirect ? res.redirect(url) : { url };
  }

  @Get('callback')
  public async callback(@Req() req: Request, @Query() query: any) {
    const token = await this.authService.handleCallback(query);

    return { accessToken: token.access_token, idToken: token.id_token };
  }
}
