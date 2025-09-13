import { Response } from 'express';
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';

import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../providers/auth.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/common/types/auth.type';
import { Public } from 'src/decorators/public.decorator';
import { LoginBasicDto } from '../dtos/login-basic.dto';
import { GoogleService } from 'src/api/google/providers/google.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('login')
  // @Public()
  // public async login(
  //   @Res({ passthrough: true }) res: Response,
  //   @Body() loginDto: LoginDto,
  // ) {
  //   const url = await this.authService.getLoginUrl(loginDto);

  //   return loginDto.redirect ? res.redirect(url) : { url };
  // }

  // @Get('callback')
  // @Public()
  // public async callback(@Req() req: Request, @Query() query: any) {
  //   const token = await this.authService.handleCallback(query);

  //   return { accessToken: token.access_token, idToken: token.id_token };
  // }

  /**
   * Basic login with email and password
   */
  @Post('login')
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
  @Public()
  public async codeExchangeGoogle(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('redirect_url') redirectUrl: string,
  ) {
    console.log('this is google code exchange with code', code);

    const jwt = await this.authService.handleGoogleCallback(code, redirectUrl);

    // check if consent is successfull or not. if not then redirect back to FE login page.

    // if success, exchange code with google token

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(204).send();
  }
}
