import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  // constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Skip public routes

    // Check if the user is authenticated
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Optionally, you can check user roles or permissions here
    // For example, if you want to allow only admins:
    // if (user.role !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Access denied');
    // }

    return true; // Allow access
  }
}
