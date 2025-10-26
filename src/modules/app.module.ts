import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';

// Config
import appConfig from 'src/config/app.config';
import validationConfig from '../config/validation.config';
import auth0Config from '../config/auth0.config';
import databaseConfig from '../config/database.config';
import googleConfig from 'src/config/google.config';
import satuSehatConfig from 'src/config/satu-sehat.config';
import openaiConfig from 'src/config/openai.config';

// Modules
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '../common/logger/logger.module';
import { AdminModule } from './admin/admin.module';
import { RequestModule } from '../common/request/request.module';
import { DbModule } from '../db/db.module';
import { EncounterModule } from './encounter/encounter.module';
import { PatientModule } from './patient/patient.module';
import { EmrModule } from './medical-record/emr.module';

// Misc
import { AppExceptionFilter } from '../filters/app-exception.filter';
import { AppRequestInterceptor } from '../interceptors/app-request.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { OwnerModule } from './owner/owner.module';
import { CasbinModule } from 'src/api/casbin/casbin.module';
import { UtilModule } from 'src/common/util/util.module';
import { BasicModule } from './basic/basic.module';
import { ReferenceModule } from './reference/reference.module';
import { SatuSehatModule } from 'src/api/satu-sehat/satu-sehat.module';
import { ReservationModule } from './reservation/reservation.module';

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
        synchronize: true, // Should be turned off on production
        autoLoadEntities: true,
        // logging: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [
        appConfig,
        auth0Config,
        databaseConfig,
        googleConfig,
        satuSehatConfig,
        openaiConfig,
      ],
      validationSchema: validationConfig,
    }),
    RequestModule, // only used as a side effect to HttpModule
    UtilModule,
    AdminModule,
    AuthModule,
    EncounterModule,
    BasicModule,
    CasbinModule,
    OwnerModule,
    PatientModule,
    ReferenceModule,
    SatuSehatModule,
    EmrModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AppRequestInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
