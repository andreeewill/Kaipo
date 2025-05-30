import { ClientRequest } from 'http';
import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';

interface ResponseError<T> {
  type: 'response';
  status: number;
  data: T;
  headers: any;
  message: string;
  config: any;
}
interface RequestError {
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

export type HttpError<T = any> = ResponseError<T> | RequestError | GeneralError;

@Injectable()
export class RequestService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();

    // Attach interceptors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle all types of axios errors
        if (error.response) {
          // Server responded with a status code out of 2xx
          return Promise.reject({
            type: 'response',
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
            message: error.message,
            config: error.config,
          } as HttpError);
        } else if (error.request) {
          // No response received
          return Promise.reject({
            type: 'request',
            message: 'No response received from server',
            request: error.request,
            config: error.config,
          } as HttpError);
        } else {
          // Something else happened
          return Promise.reject({
            type: 'general',
            message: error.message,
            config: error.config,
          } as HttpError);
        }
      },
    );
  }

  /**
   * Get original axios instance
   */
  get instance() {
    return this.axiosInstance;
  }
}
