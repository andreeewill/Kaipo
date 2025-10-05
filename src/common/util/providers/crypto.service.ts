import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { JWK, JWS } from 'node-jose';

import { JWTPayload } from '../interfaces/jwt-payload.interface';
import appConfig from 'src/config/app.config';
import { GenericError } from 'src/common/errors/generic.error';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Injectable()
export class CryptoService implements OnModuleInit {
  private keystore: JWK.KeyStore;
  private signingKey: JWK.Key;
  private verifyKey: JWK.Key;

  constructor(
    @Inject(appConfig.KEY)
    private appConf: ConfigType<typeof appConfig>,

    private readonly logger: AppLogger,
  ) {}

  async onModuleInit() {
    await this.initializeKeystore();
  }

  private async initializeKeystore() {
    try {
      const privateKeyPem = fs.readFileSync(
        './keystore/kaipo-private-key.pem',
        'utf8',
      );
      const publicKeyPem = fs.readFileSync(
        './keystore/kaipo-public-key.pem',
        'utf8',
      );

      this.keystore = JWK.createKeyStore();
      this.signingKey = await this.keystore.add(privateKeyPem, 'pem');
      this.verifyKey = await this.keystore.add(publicKeyPem, 'pem');

      this.logger.log('Keystore initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize keystore : ${error.message}`);
      throw new GenericError(
        {
          type: 'NOT_FOUND',
          reason: {
            message: 'Private key for JWT signing not found',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create JWT token for login
   * @param payload
   * @returns
   */
  public async createLoginJWT(payload: Partial<JWTPayload>): Promise<string> {
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

    const signResult = await JWS.createSign(
      {
        format: 'compact',
        fields: { alg: 'RS256', typ: 'JWT' },
      },
      this.signingKey,
    )
      .update(JSON.stringify(jwtPayload))
      .final();

    return signResult.toString();
  }

  /**
   * Verify JWT token
   * @param token
   * @returns JWT payload
   */
  public async verifyLoginJWT(token: string): Promise<JWTPayload> {
    try {
      const verifyResult = await JWS.createVerify(this.verifyKey).verify(token);
      const decoded = JSON.parse(verifyResult.payload.toString()) as JWTPayload;

      //* Expiry Check
      // const now = Math.floor(Date.now() / 1000); // in sec
      // if (decoded.exp < now) {
      //   throw new GenericError(
      //     {
      //       type: 'FORBIDDEN',
      //       message: 'Token sudah expired, silahkan login kembali ',
      //     },
      //     HttpStatus.FORBIDDEN,
      //   );
      // }

      return decoded;
    } catch (error) {
      if (error instanceof GenericError) throw error;

      throw new GenericError(
        {
          type: 'FORBIDDEN',
          message: 'Token tidak valid',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * Decode JWT token without verification
   * @param token
   * @returns
   */
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
