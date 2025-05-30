import { Response } from 'express';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
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

import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../providers/auth.service';
import { GenericError } from 'src/common/errors/generic.error';

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
    // TODO: Handle callback error from auth0
    // 1. when user is not part of organization
    console.log('QUERY', query);
    if (!query.code) {
      // Identify why code is missing
      if (/is not part/.test(query?.error_description)) {
        throw new GenericError(
          {
            type: 'NOT_FOUND',
            message: 'Akunmu tidak terdaftar dalam organisasi ini',
            reason: query,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const token = await this.authService.getLoginToken('');

    const payload = jwt.decode(token.access_token);
    if (!payload) {
      throw new HttpException(
        'wtf is this token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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
