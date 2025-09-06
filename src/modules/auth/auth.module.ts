import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';

import { Auth0Module } from 'src/api/auth0/auth0.module';
import { AuthService } from './providers/auth.service';
import { GoogleModule } from 'src/api/google/google.module';

@Module({
  imports: [Auth0Module, GoogleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
