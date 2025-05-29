import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

// Config
import validationConfig from './config/validation.config';
import auth0Config from './config/auth0.config';
import databaseConfig from './config/database.config';

// Modules
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './common/logger/logger.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { DbModule } from './common/db/db.module';
import { AppRequestInterceptor } from './common/interceptors/app-request.interceptor';
import { RequestModule } from './common/request/request.module';

@Module({
  imports: [
    DbModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: Number(config.port),
        username: config.user,
        password: config.password,
        database: config.name,
        synchronize: true,
        autoLoadEntities: true,
        // logging: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [auth0Config, databaseConfig],
      validationSchema: validationConfig,
    }),
    RequestModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AppRequestInterceptor },
  ],
})
export class AppModule {}
