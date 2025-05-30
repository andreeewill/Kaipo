import { HttpStatus } from '@nestjs/common';
import moment from 'moment';

import { BaseError } from './base.error';

export const GenericErrorCode = {
  NOT_FOUND: {
    code: '00001',
    message: 'Hal yang kamu cari tidak dapat ditemukan :(',
  },
} as const;

interface GenericErrorOptions {
  type: keyof typeof GenericErrorCode;
  message?: string;
  reason?: any; // backend details for logging
}

export class GenericError extends BaseError {
  constructor(options: GenericErrorOptions, httpError: HttpStatus) {
    super(options, httpError);
  }

  getErrorDetailsBE(): object | string {
    const res = this.getResponse() as GenericErrorOptions;

    return JSON.stringify({
      errorCode: GenericErrorCode[res.type].code,
      ...res,
    });
  }

  getErrorDetailsFE(): object | string {
    const res = this.getResponse() as GenericErrorOptions;

    return {
      ...res,
      type: undefined, // override type
      reason: undefined,
      code: `${moment().format('MMDDhmmss')}-${GenericErrorCode[res.type].code}`,
      message: res.message || GenericErrorCode[res.type].message,
    };
  }
}
