import { Module } from '@nestjs/common';
import { Auth0Service } from './providers/auth0.service';

@Module({
  imports: [],
  controllers: [],
  providers: [Auth0Service],
})
export class Auth0Module {}
