import { Module } from '@nestjs/common';
import { Auth0Service } from './providers/auth0.service';
import { Auth0RequestProvider } from './providers/auth0.request.provider';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  exports: [Auth0Service],
  providers: [Auth0Service, Auth0RequestProvider],
})
export class Auth0Module {}
