import { HttpStatus } from '@nestjs/common';
import moment from 'moment';

import { BaseError } from './base.error';

export const GenericErrorCode = {
  NOT_FOUND: {
    code: '00001',
    message: 'Hal yang kamu cari tidak dapat ditemukan :(',
  },
  UNAUTHORIZED: {
    code: '00002',
    message: 'Kamu tidak memiliki akses untuk melakukan ini',
  },
  FORBIDDEN: {
    code: '00003',
    message: 'Akses ditolak',
  },
  UNPROCESSABLE_ENTITY: {
    code: '00004',
    message:
      'Permintaan kamu tidak dapat diproses, silahkan hubungi ke support@kaipo.id',
  },
} as const;

interface GenericErrorOptions {
  type: keyof typeof GenericErrorCode;
  message?: string;
  reason?: Record<string, any>; // backend details for logging
}

export class GenericError extends BaseError {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(options: GenericErrorOptions, httpStatus: HttpStatus) {
    super(options, httpStatus);
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
      type: undefined, // Hide type from frontend
      reason: undefined,
      code: `${moment().format('MMDDhmmss')}-${GenericErrorCode[res.type].code}`,
      message: res.message || GenericErrorCode[res.type].message,
    };
  }
}
