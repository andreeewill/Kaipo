import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  isProduction: process.env.NODE_ENV === 'production',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
}));
