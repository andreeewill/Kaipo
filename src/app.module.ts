import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';

// Config
import validationConfig from './config/validation.config';
import auth0Config from './config/auth0.config';
import databaseConfig from './config/database.config';

// Modules
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './common/logger/logger.module';
import { AdminModule } from './admin/admin.module';
import { RequestModule } from './common/request/request.module';
import { DbModule } from './common/db/db.module';
import { AppointmentModule } from './appointment/appointment.module';

// Misc
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { AppRequestInterceptor } from './common/interceptors/app-request.interceptor';
import { AuthGuard } from './common/guards/auth.guard';

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
    RequestModule, // only used as a side effect to HttpModule
    AdminModule,
    AuthModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AppRequestInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
