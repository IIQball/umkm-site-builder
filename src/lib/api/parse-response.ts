export interface StandardApiEnvelope<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  meta?: Record<string, unknown>;
}

export interface ParsedApiResult<T = unknown> {
  success: boolean;
  status: number;
  data: T | null;
  message: string;
  meta?: Record<string, unknown>;
  errorCode?: string;
  details?: Record<string, string[] | undefined>;
}

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
  fallbackError?: string;
}

const DEFAULT_FETCH_TIMEOUT_MS = 20_000;

function extractMetaFieldErrors(meta?: Record<string, unknown>): Record<string, string[] | undefined> | undefined {
  const raw = meta?.details;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return undefined;
  }
  return raw as Record<string, string[] | undefined>;
}

/**
 * Parses a Fetch Response following `{ success, data, message, meta? }` safely.
 * Never throws when the server returns non-JSON or HTML error payloads.
 */
export async function parseApiResponse<T = unknown>(
  res: Response,
  fallbackError = 'Terjadi kesalahan saat memproses permintaan.'
): Promise<ParsedApiResult<T>> {
  let rawBody: unknown = null;
  try {
    const text = await res.text();
    if (text) {
      rawBody = JSON.parse(text);
    }
  } catch {
    return {
      success: false,
      status: res.status,
      data: null,
      message: res.ok ? 'Respon server tidak valid.' : fallbackError,
    };
  }

  if (!rawBody || typeof rawBody !== 'object') {
    return {
      success: res.ok,
      status: res.status,
      data: null,
      message: res.ok ? 'Berhasil' : fallbackError,
    };
  }

  const envelope = rawBody as Partial<StandardApiEnvelope<T>> & {
    error?: { code?: string; message?: string; details?: Record<string, string[] | undefined> };
  };
  const isSuccess = typeof envelope.success === 'boolean' ? res.ok && envelope.success : res.ok;
  const meta = envelope.meta && typeof envelope.meta === 'object' ? envelope.meta : undefined;
  const resolvedMessage =
    (typeof envelope.message === 'string' && envelope.message) ||
    (typeof envelope.error?.message === 'string' && envelope.error.message) ||
    (isSuccess ? 'Berhasil' : fallbackError);

  return {
    success: isSuccess,
    status: res.status,
    data: (envelope.data as T | null | undefined) ?? null,
    message: resolvedMessage,
    meta,
    errorCode: typeof meta?.code === 'string' ? meta.code : envelope.error?.code,
    details: extractMetaFieldErrors(meta) ?? envelope.error?.details,
  };
}

/**
 * Flattens Zod/Validation field error arrays into a single message per field.
 */
export function extractFieldErrors(result: ParsedApiResult<unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  if (!result.details) return out;
  for (const [key, messages] of Object.entries(result.details)) {
    if (Array.isArray(messages) && messages.length > 0 && messages[0]) {
      out[key] = messages[0];
    }
  }
  return out;
}

/**
 * Performs `fetch` with abort timeout and uniform network error handling, returning a standardized `ParsedApiResult`.
 */
export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  options: ApiFetchOptions = {}
): Promise<ParsedApiResult<T>> {
  const { timeoutMs = DEFAULT_FETCH_TIMEOUT_MS, fallbackError, signal, ...init } = options;
  const controller = new AbortController();
  let timedOut = false;

  const timer = timeoutMs > 0
    ? setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs)
    : undefined;

  const onExternalAbort = () => controller.abort();
  signal?.addEventListener('abort', onExternalAbort, { once: true });

  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return await parseApiResponse<T>(res, fallbackError);
  } catch (error) {
    if (timedOut) {
      return {
        success: false,
        status: 408,
        data: null,
        message: 'Waktu koneksi ke server habis. Silakan periksa internet Anda dan coba lagi.',
        errorCode: 'REQUEST_TIMEOUT',
      };
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Permintaan dibatalkan.',
        errorCode: 'ABORTED',
      };
    }
    return {
      success: false,
      status: 0,
      data: null,
      message: fallbackError || 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
      errorCode: 'NETWORK_ERROR',
    };
  } finally {
    if (timer !== undefined) clearTimeout(timer);
    signal?.removeEventListener('abort', onExternalAbort);
  }
}

