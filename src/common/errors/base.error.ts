import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export interface BaseErrorDetails {}

export abstract class BaseError extends HttpException {
  constructor(
    response: string | Record<string, any>,
    status: number,
    options?: HttpExceptionOptions | undefined,
  ) {
    super(response, status, options);
  }

  abstract getErrorDetailsBE(): object | string;

  abstract getErrorDetailsFE(): object | string;
}
