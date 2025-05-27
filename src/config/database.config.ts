import { registerAs } from '@nestjs/config';
import { DatabaseType } from 'typeorm';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE!,
  host: process.env.DB_HOST!,
  port: process.env.DB_PORT!,
  name: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
}));
