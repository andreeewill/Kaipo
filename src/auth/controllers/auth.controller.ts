import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../providers/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  public async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    const url = await this.authService.getLoginUrl(loginDto);

    return { url };
  }

  @Get('callback')
  public async callback(@Req() req: Request, @Query('code') code: string) {
    // TODO: Handle callback error from auth0
    // 1. when user is not part of organization
    // 2. when organization is not found
    const token = await this.authService.getLoginToken(code);

    const payload = jwt.decode(token.access_token);
    if (!payload) {
      throw new HttpException(
        'wtf is this token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // console.log('token', token);
    // console.log('payload', payload);

    // Get organization name and allowed modules from DB
    const organizationId = _.get(payload, 'org_id', null);
    if (!organizationId) {
      throw new HttpException(
        'Organization ID not found in token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { accessToken: token.access_token, idToken: token.id_token };
  }
}
