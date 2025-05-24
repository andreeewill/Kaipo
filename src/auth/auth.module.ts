import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { Auth0Service } from 'src/api/auth0/providers/auth0.service';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/db/entities/user.entity';
import { Auth0RequestProvider } from 'src/api/auth0/providers/auth0.request.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [Auth0Service, Auth0RequestProvider, AppLogger],
})
export class AuthModule {}
