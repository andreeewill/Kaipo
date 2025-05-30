import { BaseError } from './base.error';

export class RequestError extends BaseError {
  constructor(
    message: string,
    public readonly request: any, // Adjust type as needed
    public readonly config: any, // Adjust type as needed
  ) {
    super({ message, request, config }, 500); // Use appropriate HTTP status code
  }

  getErrorDetailsBE(): object | string {
    return {
      type: 'request',
      message: this.message,
      request: this.request,
      config: this.config,
    };
  }

  getErrorDetailsFE(): object | string {
    return {
      type: 'request',
      message: this.message,
      request: this.request,
      config: this.config,
    };
  }
}
