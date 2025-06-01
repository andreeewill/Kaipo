import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export abstract class BaseError extends HttpException {
  // constructor(
  //   response: string | Record<string, any>,
  //   status: number,
  //   options?: HttpExceptionOptions,
  // ) {
  //   super(response, status, options);
  // }

  abstract getErrorDetailsBE(): object | string;

  abstract getErrorDetailsFE(): object | string;
}
