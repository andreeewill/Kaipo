import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { Public } from 'src/decorators/public.decorator';
import { LoginBasicDto } from '../dtos/login-basic.dto';

import { AuthService } from '../providers/auth.service';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { AccessTokenExchangeDto } from '../dtos/access-token-exchange.dto';
import { UserId } from 'src/decorators/user-id.decorator';
import { TokenPayload } from 'src/decorators/token-payload.decorator';
import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    private readonly logger: AppLogger,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Basic login method using email and password' })
  @Public()
  public async loginBasic(
    @Res({ passthrough: true }) res: Response,
    @Body() loginBasicDto: LoginBasicDto,
  ) {
    const { email, password } = loginBasicDto;
    const { jwt, availableOrgs } = await this.authService.loginBasic(
      email,
      password,
    );

    // Set JWT as cookie
    res.cookie('select_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 3, // 3 minutes
    });

    return { organizations: availableOrgs };
  }

  @Get('/google/login')
  @ApiOperation({
    summary:
      'Redirect user to google consent URL for login. Set JWT token for auth credential',
  })
  @Public()
  public async loginGoogle(
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
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Query('redirect_url') redirectUrl: string,
  ) {
    const { jwt, availableOrgs } = await this.authService.handleGoogleCallback(
      code,
      redirectUrl,
    );

    res.cookie('select_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 3, // 3 minutes
    });

    return { organizations: availableOrgs };
  }

  @Post('/token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Exchange temp JWT (for clinic selection) to JWT access token',
  })
  public async getAccessToken(
    @Res() res: Response,
    @UserId() userId: string,
    @Body() accessTokenExchangeDto: AccessTokenExchangeDto,
  ) {
    const jwt = await this.authService.getAccessToken(
      accessTokenExchangeDto.organizationId,
      userId,
    );

    res.cookie('access_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 60 * 60, // 1 hour
    });

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('/access-control')
  @ApiOperation({ summary: 'Get current login user access-control' })
  public async getAccessControl(@TokenPayload() tokenPayload: JWTPayload) {
    const userId = tokenPayload.sub;
    const organizationId = tokenPayload.organizationId!;

    const result = await this.authService.getAccessControl(
      userId,
      organizationId,
    );

    return result;
  }
}
