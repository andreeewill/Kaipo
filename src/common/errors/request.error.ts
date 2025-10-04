import moment from 'moment';
import { HttpStatus } from '@nestjs/common';

import { BaseError } from './base.error';

interface RequestErrorOptions {
  error: Record<string, any>;
  message: string;
}
/**
 * Request error will always show default error message as all error thrown by axios can't be guaranteed
 */
export class RequestError extends BaseError {
  constructor(error: RequestErrorOptions) {
    super(error, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  getErrorDetailsBE(): object | string {
    const { error, message } = this.getResponse() as RequestErrorOptions;

    return JSON.stringify({
      type: error.type || 'unknown',
      message: message,
      data: error.data || null,
      status: error.status || 500,
    });
  }

  getErrorDetailsFE(): object | string {
    return {
      code: `${moment().format('MMDDhmmss')}-x0000`,
      message:
        'Terjadi kesalahan pada sistem, silahkan hubungi ke support@kaipo.id',
    };
  }
}
