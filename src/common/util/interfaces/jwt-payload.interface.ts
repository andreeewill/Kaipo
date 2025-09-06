import { UserRole } from 'src/common/types/auth.type';

export interface JWTPayload {
  sub: string; // email
  iat: number;
  exp: number;
  iss: string;
  role: UserRole[];
}
