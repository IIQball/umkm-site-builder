import crypto from 'node:crypto';
import { ValidationError } from './validation';
import { errorLog } from './logger';
import { classifyServerError, sanitizeClientErrorMessage } from './error-sanitizer';
import type { ApiResponse } from '@/types/common/api';

/**
 * Constant-time string comparison for webhook secrets and cron tokens.
 */
export function timingSafeEqualString(input: string, secret: string): boolean {
  if (!input || !secret) return false;
  const inputBuf = Buffer.from(input);
  const secretBuf = Buffer.from(secret);
  return inputBuf.length === secretBuf.length && crypto.timingSafeEqual(inputBuf, secretBuf);
}

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

export interface JsonSuccessOptions {
  status?: number;
  message?: string;
  meta?: Record<string, unknown>;
  headers?: HeadersInit;
}

function getDefaultErrorCode(status: number): string {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'RATE_LIMITED';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    case 504:
      return 'GATEWAY_TIMEOUT';
    default:
      return status >= 500 ? 'INTERNAL_ERROR' : 'ERROR';
  }
}

export function jsonSuccess<T = unknown>(
  data: T,
  statusOrOptions: number | JsonSuccessOptions = 200,
  message = 'Berhasil',
  meta?: Record<string, unknown>
): Response {
  const opts: JsonSuccessOptions =
    typeof statusOrOptions === 'number'
      ? { status: statusOrOptions, message, meta }
      : statusOrOptions;

  const status = opts.status ?? 200;
  const resolvedMessage = opts.message ?? message;
  const resolvedMeta = opts.meta ?? meta;

  const body: ApiResponse<T> = {
    success: true,
    data: (data === undefined ? null : data) as T | null,
    message: resolvedMessage,
    ...(resolvedMeta !== undefined ? { meta: resolvedMeta } : {}),
  };

  return Response.json(body, {
    status,
    ...(opts.headers ? { headers: opts.headers } : {}),
  });
}

export function jsonError(
  message: string,
  status = 500,
  details?: unknown,
  code?: string,
  meta?: Record<string, unknown>
): Response {
  const safeMessage = sanitizeClientErrorMessage(message, status);
  const resolvedCode = code || getDefaultErrorCode(status);
  const safeMeta: Record<string, unknown> = {
    code: resolvedCode,
    ...(status < 500 && details !== undefined ? { details } : {}),
    ...(meta || {}),
  };

  return Response.json(
    {
      success: false,
      data: null,
      message: safeMessage,
      meta: safeMeta,
    },
    { status }
  );
}

/**
 * Safely parses a JSON request body, throwing a 400 AppError on empty or malformed JSON.
 */
export async function parseJsonBody<T = Record<string, unknown>>(request: Request): Promise<T> {
  try {
    const parsed = await request.json();
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new AppError('Payload JSON harus berupa objek.', 400, undefined, 'INVALID_JSON');
    }
    return parsed as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Format data JSON tidak valid.', 400, undefined, 'INVALID_JSON');
  }
}

export async function handleApiRoute(fn: () => Promise<Response> | Response): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ValidationError) {
      return jsonError(
        'Data yang dikirim tidak valid. Mohon periksa kembali isian Anda.',
        400,
        error.details,
        'VALIDATION_ERROR'
      );
    }

    if (error instanceof AppError) {
      if (error.status >= 500) {
        errorLog('API_HANDLER', {
          status: error.status,
          code: error.code || 'INTERNAL_ERROR',
          message: error.message,
          stack: error.stack,
        });
      }
      return jsonError(error.message, error.status, error.details, error.code);
    }

    const classified = classifyServerError(error);
    errorLog('API_HANDLER', {
      status: classified.status,
      code: classified.code,
      message: classified.internalMessage,
      stack: classified.stack,
    });

    return jsonError(
      classified.clientMessage,
      classified.status,
      classified.details,
      classified.code
    );
  }
}
