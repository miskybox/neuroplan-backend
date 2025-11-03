import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Configurar retry automático con exponential backoff
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Retry en errores de red o 5xx, pero no en 4xx (errores del cliente)
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status ?? 0) >= 500
        );
      },
      onRetry: (retryCount, error, requestConfig) => {
        this.logger.warn(
          `Retrying request to ${requestConfig.url} (attempt ${retryCount}): ${error.message}`
        );
      },
    });

    // Interceptor de request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const method = (config.method || 'GET').toUpperCase();
        this.logger.debug(`[HTTP Request] ${method} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error('[HTTP Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Interceptor de response
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `[HTTP Response] ${response.config.url} - Status: ${response.status}`
        );
        return response;
      },
      (error) => {
        const url = error.config?.url || 'unknown';
        const status = error.response?.status || 'no response';
        this.logger.error(`[HTTP Response Error] ${url} - Status: ${status}`, error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  /**
   * Acceso directo a la instancia de axios (para casos avanzados)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
