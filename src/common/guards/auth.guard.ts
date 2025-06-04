import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AppLogger } from '../logger/app-logger.service';
import { ROLES_KEY } from '../constants/decorator-key.constant';
import { GenericError } from '../errors/generic.error';

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
    // const accessToken = request.headers?.authorization?.split(' ')[1];
    // if (!accessToken) {
    //   throw new GenericError(
    //     {
    //       type: 'UNAUTHORIZED',
    //       message: '',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // const roles = this.reflector.get(ROLES_KEY, context.getHandler());

    // const permissoions = this.reflector.getAllAndMerge();

    // Optionally, you can check user roles or permissions here
    // For example, if you want to allow only admins:
    // if (user.role !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Access denied');
    // }

    return true; // Allow access
  }
}
