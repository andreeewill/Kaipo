import { Module } from '@nestjs/common';
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

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: Number(config.port),
        username: config.user,
        password: config.password,
        database: config.name,
        synchronize: true,
      }),
      inject: [databaseConfig.KEY],
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [auth0Config, databaseConfig],
      validationSchema: validationConfig,
    }),
    AdminModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
