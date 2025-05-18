import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Config
import validationConfig from './config/validation.config';
import auth0Config from './config/auth0.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [auth0Config],
      validationSchema: validationConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
