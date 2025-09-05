import * as winston from 'winston';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import { ValidationError } from 'class-validator';

import { AppModule } from './modules/app.module';
import { CorrelationIdService } from './common/logger/correlation-id.service';
import { CorrelationIdMiddleware } from './common/logger/correlation-id.middleware';
import { RequestValidationError } from './common/errors/request-validation.error';

/**
 * Winston logger instance with custom format
 */
const instance = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('Kaipo App', {
          colors: true,
          prettyPrint: true,
          processId: false,
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

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      ...RequestValidationError.options,
      exceptionFactory: (errors: ValidationError[]) =>
        new RequestValidationError(errors),
    }),
  );

  // Set correlation ID middleware
  app.use(new CorrelationIdMiddleware(app.get(CorrelationIdService)).use);

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
