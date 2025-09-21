import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';

export const TokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JWTPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.tokenPayload;
  },
);
