/**
 * Unified API response shape
 * All API responses follow `{ success: boolean, data: T | null, message: string, meta?: object }`.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  meta?: Record<string, unknown>;
}

export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T | null;
}

export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  data: null;
  meta?: {
    code: string;
    details?: unknown;
    [key: string]: unknown;
  };
}

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_KEY: 'DUPLICATE_KEY',
  INVALID_STATE: 'INVALID_STATE',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  RATE_LIMITED: 'RATE_LIMITED',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
