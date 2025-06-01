import { applyDecorators, SetMetadata } from '@nestjs/common';

const ROLES_KEY = 'roles';

export const Roles = () => {
  return applyDecorators(SetMetadata(ROLES_KEY, true));
};
