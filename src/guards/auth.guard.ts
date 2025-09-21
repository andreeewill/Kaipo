import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AppLogger } from '../common/logger/app-logger.service';
import {
  PERMISSIONS_KEY,
  ROLES_KEY,
} from '../common/constants/decorator-key.constant';
import { GenericError } from '../common/errors/generic.error';
import { UserRole } from '../common/types/auth.type';
import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';
import { JWT_SCOPES } from 'src/common/util/constants/jwt.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: AppLogger,

    private readonly reflector: Reflector,
  ) {}

  /**
   * Extract JWT token from request headers or cookies
   * @param request
   */
  private extractToken(request: Request): string | null {
    const authHeader = request.headers?.authorization;
    if (authHeader && authHeader.split(' ')[1]) {
      return authHeader.split(' ')[1];
    }

    // Try to get token from cookies
    const tokenFromCookie =
      request.cookies?.['access_token'] || request.cookies['select_token'];
    if (tokenFromCookie) {
      return tokenFromCookie;
    }

    return null;
  }

  canActivate(context: ExecutionContext): boolean {
    this.logger.log('AuthGuard: Checking authentication');

    const request = context.switchToHttp().getRequest<Request>();

    // Skip public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Verify access token and expiration
    const accessToken = this.extractToken(request);
    if (!accessToken) {
      throw new GenericError(
        {
          type: 'UNAUTHORIZED',
          message: 'Pastikan kamu memberikan akses token yang valid',
          reason: {
            message: 'access token is missing on headers or cookies',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //! Verify token signature

    const jwtPayload = jwt.decode(accessToken, { json: true }) as JWTPayload;
    console.log('jwt payload', jwtPayload);

    //* Set userId (this will be captured by custom decorator @UserId())
    request['userId'] = jwtPayload?.sub;
    request['tokenPayload'] = jwtPayload;

    //* Special checks for clinic selection
    const tokenScopes = jwtPayload?.scopes || [];
    if (tokenScopes.includes(JWT_SCOPES.ORGANIZATION_SELECTION)) {
      return true;
    }

    /**
     * Generic API access checks. This includes :
     * 1.Organization's module activation (if the module is not active, user cannot access the module's features)
     */

    // const roles = this.reflector.get<UserRole[]>(
    //   ROLES_KEY,
    //   context.getHandler(),
    // );
    // if (roles.length > 0) {
    //   this.logger.log(
    //     `Verifying user roles, required roles : ${roles.join(', ')}`,
    //   );
    // }

    const permissions = this.reflector.getAllAndMerge(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (permissions.length > 0) {
      this.logger.log(
        `Verifying user permissions, required permissions : ${permissions.join(', ')}`,
      );
    }

    this.logger.log('AuthGuard: PASSED');

    return true; // Allow access
  }
}
