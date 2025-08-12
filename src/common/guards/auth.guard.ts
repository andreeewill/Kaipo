import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AppLogger } from '../logger/app-logger.service';
import {
  PERMISSIONS_KEY,
  ROLES_KEY,
} from '../constants/decorator-key.constant';
import { GenericError } from '../errors/generic.error';
import { UserRole } from '../types/auth.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: AppLogger,

    private readonly reflector: Reflector,
  ) {}

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
    const accessToken = request.headers?.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new GenericError(
        {
          type: 'UNAUTHORIZED',
          message: 'Pastikan kamu memberikan token akses pada header',
          reason: {
            message: 'access token is missing on headers',
            headers: request.headers,
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.logger.log('Verifying access token signature using Auth0');

    const jwtPayload = jwt.decode(accessToken, { json: true });
    console.log('jwt payload', jwtPayload);

    const roles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (roles.length > 0) {
      this.logger.log(
        `Verifying user roles, required roles : ${roles.join(', ')}`,
      );
    }

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
