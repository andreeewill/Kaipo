import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Config
import validationConfig from './config/validation.config';
import auth0Config from './config/auth0.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [auth0Config],
      validationSchema: validationConfig,
    }),
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
