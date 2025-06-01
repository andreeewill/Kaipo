import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RequestService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    const axios = this.httpService.axiosRef;

    // Attach interceptors
    axios.interceptors.response.use(
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
          });
        } else if (error.request) {
          // No response received
          return Promise.reject({
            type: 'request',
            message: 'No response received from server',
            request: error.request,
            config: error.config,
          });
        } else {
          // Something else happened
          return Promise.reject({
            type: 'general',
            message: error.message,
            config: error.config,
          });
        }
      },
    );
  }
}
