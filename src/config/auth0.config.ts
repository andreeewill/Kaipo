import { registerAs } from '@nestjs/config';

/**
 * Auth0 configuration. When declaring env with non-null assertion, make sure to put the env on validation.config.ts as a required env.
 * @see https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
 */
export default registerAs('auth0', () => ({
  baseUrl: process.env.AUTH0_BASE_URL!,
  audience: process.env.AUTH0_AUDIENCE!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  redirectUri: process.env.AUTH0_REDIRECT_URI!,
}));
