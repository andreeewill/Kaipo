export interface Key {
  kty: string;
  user: string;
  n: string;
  e: string;
  kid: string;
  x5t: string;
  x5c: string[];
  alg: string;
}

export interface JwksResponse {
  keys: Key[];
}
