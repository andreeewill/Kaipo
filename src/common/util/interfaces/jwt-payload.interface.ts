import { UserRole } from 'src/common/types/auth.type';
import { JWT_SCOPES } from '../constants/jwt.constant';

/**
 * JWT Token payload interface defiinition. `role` is optional because JWT token is also used for pre clinic selection state (no clinics has been chosen yet) so system cannot determine roles yet.
 */
export interface JWTPayload {
  sub: string; // email
  iat: number;
  exp: number;
  iss: string;
  role?: UserRole[];
  scopes?: (typeof JWT_SCOPES)[keyof typeof JWT_SCOPES][];
  organizationId?: string;
}
