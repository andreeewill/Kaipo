import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/db/entities/user.entity';

import { Auth0Module } from 'src/api/auth0/auth0.module';
import { AuthService } from './providers/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), Auth0Module],
  controllers: [AuthController],
  providers: [AuthService, AppLogger],
})
export class AuthModule {}
