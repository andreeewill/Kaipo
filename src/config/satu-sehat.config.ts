import { registerAs } from '@nestjs/config';

export default registerAs('satuSehat', () => ({
  baseUrl: process.env.SATU_SEHAT_BASE_URL!,
  clientId: process.env.SATU_SEHAT_CLIENT_ID!,
  clientSecret: process.env.SATU_SEHAT_CLIENT_SECRET!,
}));
