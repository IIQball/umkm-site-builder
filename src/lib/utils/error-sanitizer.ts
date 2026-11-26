import { EnvironmentConfigError } from '@/lib/config/env-validator';
import { DatabaseTimeoutError } from '@/lib/db/timeout';
import { errorLog } from '@/lib/utils/logger';
import { ValidationError } from '@/lib/utils/validation';

export interface ClassifiedServerError {
  status: number;
  code: string;
  clientMessage: string;
  details?: unknown;
  internalMessage: string;
  stack?: string;
}

const INTERNAL_LEAK_PATTERNS: readonly RegExp[] = [
  /\bat\s+[^\s]+\s+\(/i,
  /\b(select|insert\s+into|update\s+\w+\s+set|delete\s+from)\b/i,
  /\b(relation|column|constraint|table)\s+"[^"]+"/i,
  /\bsyntax error at or near\b/i,
  /\bdrizzle\b|\bneondb?\b|\bpostgresql\b|\bpg_/i,
  /([A-Za-z]:\\|\/(?:src|app|usr|var|home|Users|node_modules)\/)/,
  /\b(ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ESOCKETTIMEDOUT)\b/,
  /\bUnhandled\b|\bTypeError\b|\bReferenceError\b|\bSyntaxError\b/,
];

const TIMEOUT_PATTERNS: readonly RegExp[] = [
  /\bETIMEDOUT\b/i,
  /\bESOCKETTIMEDOUT\b/i,
  /\bstatement timeout\b/i,
  /\bquery read timeout\b/i,
  /\btimed?\s*out\b/i,
  /\bAbortError\b/i,
];

const NETWORK_DROP_PATTERNS: readonly RegExp[] = [
  /\bECONNREFUSED\b/i,
  /\bECONNRESET\b/i,
  /\bENOTFOUND\b/i,
  /\bEAI_AGAIN\b/i,
  /\bsocket hang up\b/i,
  /\bconnection terminated\b/i,
  /\bfetch failed\b/i,
  /\bnetwork\s*(?:error|timeout|drop)\b/i,
  /\bError connecting to database\b/i,
];

function extractErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const errObj = error as { code?: unknown; cause?: { code?: unknown } };
  if (typeof errObj.code === 'string' && errObj.code.length > 0) return errObj.code;
  if (errObj.cause && typeof errObj.cause.code === 'string') return errObj.cause.code;
  return undefined;
}

/**
 * Checks whether a message contains internal stack frames, SQL queries, paths, or runtime error symbols.
 */
export function isSensitiveOrInternalMessage(message: string): boolean {
  if (!message) return false;
  return INTERNAL_LEAK_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * Returns a safe, user-friendly Indonesian message for client responses, stripping internal details.
 */
export function sanitizeClientErrorMessage(message: string, status: number): string {
  if (status >= 500) {
    if (status === 504) {
      return 'Waktu tunggu layanan habis. Silakan coba beberapa saat lagi.';
    }
    if (status === 503) {
      return 'Layanan sedang mengalami gangguan sementara. Silakan coba lagi nanti.';
    }
    return 'Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi.';
  }

  if (!message || isSensitiveOrInternalMessage(message)) {
    switch (status) {
      case 400:
        return 'Permintaan tidak valid. Mohon periksa kembali data Anda.';
      case 401:
        return 'Silakan masuk terlebih dahulu untuk melanjutkan.';
      case 403:
        return 'Anda tidak memiliki izin untuk mengakses sumber daya ini.';
      case 404:
        return 'Data yang diminta tidak ditemukan.';
      case 409:
        return 'Data yang sama sudah terdaftar.';
      case 429:
        return 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.';
      default:
        return 'Permintaan tidak dapat diproses.';
    }
  }

  return message;
}

/**
 * Classifies an arbitrary server exception into an HTTP status, code, and safe client payload.
 */
export function classifyServerError(error: unknown): ClassifiedServerError {
  const internalMessage = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  const stack = error instanceof Error ? error.stack : undefined;
  const dbOrSysCode = extractErrorCode(error);

  if (error instanceof ValidationError) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      clientMessage: 'Data yang dikirim tidak valid. Mohon periksa kembali isian Anda.',
      details: error.details,
      internalMessage,
      stack,
    };
  }

  if (error instanceof EnvironmentConfigError) {
    return {
      status: 503,
      code: 'SERVICE_UNAVAILABLE',
      clientMessage: 'Layanan sedang dalam pemeliharaan konfigurasi. Silakan coba lagi nanti.',
      internalMessage,
      stack,
    };
  }

  if (error instanceof DatabaseTimeoutError || TIMEOUT_PATTERNS.some((p) => p.test(internalMessage) || p.test(dbOrSysCode || ''))) {
    return {
      status: 504,
      code: 'GATEWAY_TIMEOUT',
      clientMessage: 'Permintaan ke database memakan waktu terlalu lama. Silakan coba beberapa saat lagi.',
      internalMessage,
      stack,
    };
  }

  if (NETWORK_DROP_PATTERNS.some((p) => p.test(internalMessage) || p.test(dbOrSysCode || ''))) {
    return {
      status: 503,
      code: 'SERVICE_UNAVAILABLE',
      clientMessage: 'Koneksi layanan sedang terganggu. Silakan coba beberapa saat lagi.',
      internalMessage,
      stack,
    };
  }

  if (error instanceof SyntaxError && /json/i.test(internalMessage)) {
    return {
      status: 400,
      code: 'INVALID_JSON',
      clientMessage: 'Format data JSON tidak valid.',
      internalMessage,
      stack,
    };
  }

  if (dbOrSysCode === '23505') {
    return {
      status: 409,
      code: 'CONFLICT',
      clientMessage: 'Data sudah terdaftar.',
      internalMessage,
      stack,
    };
  }

  if (dbOrSysCode === '23503') {
    return {
      status: 400,
      code: 'INVALID_REFERENCE',
      clientMessage: 'Referensi data terkait tidak ditemukan.',
      internalMessage,
      stack,
    };
  }

  return {
    status: 500,
    code: 'INTERNAL_ERROR',
    clientMessage: 'Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi.',
    internalMessage,
    stack,
  };
}

const REJECTION_HOOK_KEY = '__pinokaGlobalRejectionRegistered';

/**
 * Registers idempotent process-level listeners for unhandled promise rejections and uncaught exceptions.
 */
export function registerGlobalRejectionHandler(): void {
  if (typeof process === 'undefined' || typeof process.on !== 'function') {
    return;
  }

  const g = globalThis as Record<string, unknown>;
  if (g[REJECTION_HOOK_KEY]) {
    return;
  }
  g[REJECTION_HOOK_KEY] = true;

  process.on('unhandledRejection', (reason: unknown) => {
    const classified = classifyServerError(reason);
    errorLog('UNHANDLED_REJECTION', {
      code: classified.code,
      message: classified.internalMessage,
      stack: classified.stack,
    });
  });

  process.on('uncaughtException', (err: Error) => {
    const classified = classifyServerError(err);
    errorLog('UNCAUGHT_EXCEPTION', {
      code: classified.code,
      message: classified.internalMessage,
      stack: classified.stack,
    });
  });
}

