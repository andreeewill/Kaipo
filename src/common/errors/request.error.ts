import moment from 'moment';
import { ClientRequest } from 'http';
import { HttpStatus } from '@nestjs/common';

import { BaseError } from './base.error';

interface ResponseErr<T> {
  type: 'response';
  status: number;
  data: T;
  headers: any;
  message: string;
  config: any;
}
interface RequestErr {
  type: 'request';
  message: string;
  request: ClientRequest;
  config: any;
}

interface GeneralError {
  type: 'general';
  message: string;
  config: any;
}

export type HttpError<T = any> = ResponseErr<T> | RequestErr | GeneralError;

/**
 * Request error will always show default error message as all error thrown by axios can't be guaranteed
 */
export class RequestError extends BaseError {
  // constructor(httpError: HttpError, httpStatus: HttpStatus) {
  //   super(httpError, httpStatus);
  // }

  getErrorDetailsBE(): object | string {
    const res = this.getResponse() as HttpError;

    return {
      type: res.type,
      message: res.message,
      data: res.type === 'response' ? res.data : null,
      status: res.type === 'response' ? res.status : null,
    };
  }

  getErrorDetailsFE(): object | string {
    return {
      code: `${moment().format('MMDDhmmss')}-x0000`,
      message:
        'Terjadi kesalahan pada sistem, silahkan hubungi ke support@kaipo.id',
    };
  }
}
