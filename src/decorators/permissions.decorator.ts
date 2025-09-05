import { applyDecorators, SetMetadata } from '@nestjs/common';

import { PERMISSIONS_KEY } from '../common/constants/decorator-key.constant';
import { PERMISSION } from '../common/constants/permission.constant';

export const Permissions = (
  permissions: (typeof PERMISSION)[keyof typeof PERMISSION][],
) => {
  return applyDecorators(SetMetadata(PERMISSIONS_KEY, permissions));
};
