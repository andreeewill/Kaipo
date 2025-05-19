import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [Auth0Service, AppLogger],
})
export class AuthModule {}
