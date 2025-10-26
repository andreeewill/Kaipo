import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tokenPayload?: JWTPayload;
    }
  }
}

export {};
