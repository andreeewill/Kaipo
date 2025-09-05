import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '../common/constants/decorator-key.constant';

export const Public = () => {
  return applyDecorators(SetMetadata(PUBLIC_KEY, true));
};
