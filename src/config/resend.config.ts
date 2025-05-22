import { registerAs } from '@nestjs/config';

export default registerAs('resend', () => ({
  apiKey: process.env.RESEND_API_KEY!,
  from: process.env.RESEND_FROM!,
}));
