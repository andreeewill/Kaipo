import {
  HttpException,
  HttpStatus,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { set } from 'lodash';
import { BaseError } from './base.error';

export class RequestValidationError extends BaseError {
  public static readonly options: ValidationPipeOptions = {
    transform: true,
    validationError: { target: false },
  };

  constructor(validationErrors: ValidationError[]) {
    const errors = RequestValidationError.destructureErrors(validationErrors);

    super({ fields: errors }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  /**
   * Destructure original error from class-validator to a more readable format.
   * @param validationError
   * @returns error object containing all fiield with error + message (nested)
   */
  static destructureErrors(validationError: ValidationError[]) {
    const output = {};

    function traverse(error: ValidationError, prevKey?: string) {
      const key = prevKey ? `${prevKey}.${error.property}` : error.property;

      if (error.children && error.children.length > 0) {
        error.children.forEach((err) => traverse(err, key));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        set(output, key, Object.values(error.constraints!));
      }
    }
    validationError.forEach((err) => traverse(err));

    return output;
  }

  public getErrorDetailsBE(): object | string {
    return JSON.stringify(this.getResponse());
  }

  public getErrorDetailsFE(): object | string {
    return this.getResponse();
  }
}
