// Standardized error handling utilities
import { ApiError } from '@/types';

export class ErrorHandler {
  static handleApiError(error: any): string {
    if (error instanceof ApiError) {
      return error.message;
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  }

  static createApiError(status: number, message: string, details?: any): ApiError {
    return new ApiError(status, message, details);
  }

  static isNetworkError(error: any): boolean {
    return error.code === 'NETWORK_ERROR' || 
           error.message?.includes('Network Error') ||
           error.message?.includes('fetch');
  }

  static isTimeoutError(error: any): boolean {
    return error.code === 'TIMEOUT' || 
           error.message?.includes('timeout');
  }

  static getErrorMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Network connection failed. Please check your internet connection.';
    }
    
    if (this.isTimeoutError(error)) {
      return 'Request timed out. Please try again.';
    }
    
    return this.handleApiError(error);
  }
}

export const handleError = ErrorHandler.getErrorMessage;
