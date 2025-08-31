import { ApiError } from '@/types/api';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): string => {
  if (error?.message?.includes('cancelled')) {
    return 'Request was cancelled';
  }
  
  if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR') {
    return 'Please check your internet connection';
  }
  
  if (error?.status === 429) {
    return 'Too many requests. Please try again later';
  }
  
  if (error?.status >= 500) {
    return 'Server error. Please try again later';
  }
  
  if (error?.status === 404) {
    return 'Images not found';
  }
  
  return error?.message || 'Something went wrong';
};

export const logError = (error: any, context?: string) => {
  if (__DEV__) {
    console.error(`[${context || 'App'}] Error:`, error);
  }
  
  // In production, you might want to send this to a crash reporting service
  // like Sentry or Bugsnag
};