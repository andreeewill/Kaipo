import { UserRole } from '../common/types/auth.type';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
