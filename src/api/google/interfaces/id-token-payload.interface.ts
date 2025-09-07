export interface IdTokenPayload {
  iss: string; // "https://accounts.google.com"
  azp: string;
  aud: string;
  sub: number;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}
