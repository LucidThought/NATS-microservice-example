import axios, { AxiosRequestConfig } from 'axios';

// An example class handles REST requests generated from NATS messages
export class RestRequester {
  baseUrl?: string;
  accessKey?: string;

  // Initialize the intended API base URL and access key (if any)
  constructor(apiBaseUrl: string, apiKey?: string) {
    this.baseUrl = apiBaseUrl;
    this.accessKey = apiKey;
  }

  // This will let components call the request function below
  // without having to import the AxiosRequestConfig object
  generateRequest(
    method: 'GET' | 'PUT' | 'POST' | 'DELETE',
    uri: string,
    params: object
  ): AxiosRequestConfig {
    const requested: AxiosRequestConfig = {
      method: method,
      url: this.baseUrl + uri,
      params: {
        // app_id is for an access key on the currency conversion API specifically
        app_id: this.accessKey,
        ...params,
      },
      headers: { accept: 'application/json' },
    };
    return requested;
  }

  // This request function can be used with any AxiosRequestConfig
  // to make REST requests against an API
  async request(options: AxiosRequestConfig) {
    options = {
      ...options,
    };
    let response = await axios(options).then((response) => {
      return response;
    });
    return response;
  }
}