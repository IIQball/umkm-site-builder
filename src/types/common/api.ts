/**
 * Unified API response shape
 * All API responses follow this structure
 */

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export interface SuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
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
  INTERNAL: 'INTERNAL',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export function okResponse<T>(data: T): SuccessResponse<T> {
  return { ok: true, data };
}

export function errorResponse(code: ErrorCode, message: string): ErrorResponse {
  return {
    ok: false,
    error: { code, message },
  };
}

export const unauthorized = (msg = 'Please log in to continue') =>
  errorResponse('UNAUTHORIZED', msg);

export const forbidden = (msg = 'Access denied') =>
  errorResponse('FORBIDDEN', msg);

export const notFound = (msg = 'Not found') =>
  errorResponse('NOT_FOUND', msg);

export const validationError = (msg = 'Validation failed') =>
  errorResponse('VALIDATION_ERROR', msg);

export const duplicateKeyError = (msg = 'Resource already exists') =>
  errorResponse('DUPLICATE_KEY', msg);

export const invalidState = (msg = 'Invalid state') =>
  errorResponse('INVALID_STATE', msg);

export const invalidStateError = invalidState;

export const paymentFailed = (msg = 'Payment failed') =>
  errorResponse('PAYMENT_FAILED', msg);

export const internalError = (msg = 'Internal server error') =>
  errorResponse('INTERNAL', msg);
