import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants/decorator-key.constant';

export const Permissions = (permissions: string[]) => {
  return applyDecorators(SetMetadata(PERMISSIONS_KEY, permissions));
};
