import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/decorator-key.constant';
import { UserRole } from '../types/auth.type';

export const Roles = (roles: UserRole[]) => {
  return applyDecorators(SetMetadata(ROLES_KEY, roles));
};
