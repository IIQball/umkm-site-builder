import { ValidationError } from './validation';
import { errorLog } from './logger';

export class AppError extends Error {
  status: number;
  details?: unknown;
  code?: string;

  constructor(message: string, status = 400, details?: unknown, code?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

export const SetError = AppError;

export function jsonSuccess(data: unknown, message = 'Success', status = 200): Response {
  return Response.json(
    {
      success: true,
      ok: true,
      message,
      data,
    },
    { status }
  );
}

export function jsonError(message: string, status = 500, details?: unknown, code?: string): Response {
  const getErrorCode = (s: number) => {
    switch (s) {
      case 400: return 'VALIDATION_ERROR';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      default: return 'ERROR';
    }
  };
  
  return Response.json(
    {
      success: false,
      ok: false,
      message,
      error: {
        code: code || getErrorCode(status),
        message,
      },
      ...(details !== undefined ? { details } : {}),
    },
    { status }
  );
}

export async function handleApiRoute(fn: () => Promise<Response> | Response): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError('Data validation error', 400, error.details);
    }
    if (error instanceof AppError) {
      return jsonError(error.message, error.status, error.details, error.code);
    }

    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    errorLog('API_HANDLER', message, stack);

    return jsonError('Internal server error', 500);
  }
}
