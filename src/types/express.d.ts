import { JWTPayload } from 'src/common/util/interfaces/jwt-payload.interface';
import { UserRole } from '../common/types/auth.type';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tokenPayload?: JWTPayload;
    }
  }
}

export {};
