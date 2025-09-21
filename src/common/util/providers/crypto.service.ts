import jwt from 'jsonwebtoken';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JWTPayload } from '../interfaces/jwt-payload.interface';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { GenericError } from 'src/common/errors/generic.error';

@Injectable()
export class CryptoService {
  constructor(
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,
  ) {}

  /**
   * Create JWT token for login
   * @param payload
   * @returns
   */
  public createLoginJWT(payload: Partial<JWTPayload>): string {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + (payload.exp || 60 * 60); // 1 hour expiration
    const iss = 'https://api.kaipo.my.id';
    const sub = payload.sub || '';
    const role = payload.role || [];

    const jwtPayload: JWTPayload = {
      sub,
      iat,
      exp,
      iss,
      role,
      scopes: payload.scopes || [],
      organizationId: payload.organizationId,
    };

    return jwt.sign(jwtPayload, this.appConf.jwt.secret);
  }

  /**
   * Verify JWT token
   * @param token
   * @returns JWT payload
   */
  public verifyLoginJWT(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.appConf.jwt.secret) as JWTPayload;

      // check for expiration
      return decoded;
    } catch (error) {
      throw new GenericError(
        {
          type: 'FORBIDDEN',
          message: 'Token tidak valid',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  public decodeJWT<T>(token: string): T {
    try {
      const decoded = jwt.decode(token) as T;
      return decoded;
    } catch (error) {
      throw new GenericError(
        {
          type: 'FORBIDDEN',
          message: 'Token tidak valid',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
