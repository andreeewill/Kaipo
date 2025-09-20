import { Response } from 'express';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { Public } from 'src/decorators/public.decorator';
import { LoginBasicDto } from '../dtos/login-basic.dto';

import { AuthService } from '../providers/auth.service';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    private readonly logger: AppLogger,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Basic login method using email and password' })
  @Public()
  public async loginBasic(
    @Res() res: Response,
    @Body() loginBasicDto: LoginBasicDto,
  ) {
    const { email, password } = loginBasicDto;
    const jwt = await this.authService.loginBasic(email, password);

    // Set JWT as cookie
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(204).send();
  }

  @Get('/google/login')
  @ApiOperation({
    summary:
      'Redirect user to google consent URL for login. Set JWT token for auth credential',
  })
  @Public()
  public async loginGoogle(
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirect_url') redirectUrl: string,
  ) {
    const url = this.authService.getGoogleLoginUrl(redirectUrl);

    return res.redirect(url);
  }

  @Get('/google/code-exchange')
  @ApiOperation({
    summary:
      'Exchange google auth code for access token and id token. Set JWT token for auth credential',
  })
  @Public()
  public async codeExchangeGoogle(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('redirect_url') redirectUrl: string,
  ) {
    this.logger.log('this is google code exchange with code', code);

    const jwt = await this.authService.handleGoogleCallback(code, redirectUrl);

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(204).send();
  }

  @Post()
  @ApiOperation({ summary: 'Get current login user information ()' })
  public async currentLoginInfo() {}
}
