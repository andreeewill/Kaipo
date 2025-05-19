import { NestFactory } from '@nestjs/core';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { CorrelationIdService } from './common/logger/correlation-id.service';
import { CorrelationIdMiddleware } from './common/logger/correlation-id.middleware';
import { HttpLoggingMiddleware } from './common/logger/http-logging.middleware';

const instance = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('Kaipo App', {
          colors: true,
          prettyPrint: true,
          processId: true,
          appName: true,
        }),
      ),
    }),
  ],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance }),
  });

  // Set correlation ID middleware
  app.use(new CorrelationIdMiddleware(app.get(CorrelationIdService)).use);

  // Set HTTP logging middleware using resolve for request-scoped provider
  const httpLoggingMiddleware = await app.resolve(HttpLoggingMiddleware);
  app.use(httpLoggingMiddleware.use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
