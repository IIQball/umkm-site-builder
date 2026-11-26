/**
 * Standarisasi Penanganan Pesan Error AI untuk Pedagang UMKM
 * Memetakan kode HTTP dan anomali sistem ke pesan Bahasa Indonesia yang solutif.
 */

export const AI_HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Validasi input tidak lengkap atau format gambar tidak didukung.',
  401: 'Sesi akun telah berakhir. Silakan masuk kembali ke toko Anda.',
  402: 'Kuota kredit AI toko habis. Silakan top-up paket kuota untuk melanjutkan pembuatan desain.',
  403: 'Toko Anda belum memiliki izin untuk mengakses fitur studio AI ini.',
  404: 'Aset gambar referensi atau data studio tidak ditemukan.',
  413: 'Ukuran berkas gambar terlalu besar. Batas maksimal berkas adalah 4 MB.',
  429: 'Antrean server AI sedang padat. Silakan coba lagi dalam beberapa detik.',
  500: 'Layanan visualizer sedang mengalami kendala sementara. Silakan coba sesaat lagi.',
  502: 'Gagal terhubung dengan server generator AI. Silakan coba beberapa saat lagi.',
  503: 'Layanan visualizer sedang mengalami kendala sementara atau pemeliharaan server.',
  504: 'Batas waktu pembuatan desain terlampaui (koneksi timeout). Generator AI membutuhkan waktu lebih lama dari biasanya. Silakan coba sesaat lagi.',
};

export const DEFAULT_AI_ERROR_MESSAGE =
  'Terjadi kendala saat memproses pembuatan visual AI. Silakan coba beberapa saat lagi.';

export class AiStudioError extends Error {
  status: number;

  constructor(status: number, customMessage?: string) {
    const resolvedMessage = customMessage || formatAiErrorMessage(status);
    super(resolvedMessage);
    this.name = 'AiStudioError';
    this.status = status;
  }
}

/**
 * Mengekstrak kode status HTTP dari berbagai variasi bentuk objek error
 */
function extractStatusCode(error: unknown): number | null {
  if (typeof error === 'number' && Number.isInteger(error)) {
    return error;
  }

  if (typeof error === 'string') {
    const parsed = parseInt(error.trim(), 10);
    if (!isNaN(parsed) && parsed >= 400 && parsed < 600) {
      return parsed;
    }
  }

  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>;

    // Pola error.status / error.statusCode
    if (typeof obj.status === 'number') return obj.status;
    if (typeof obj.statusCode === 'number') return obj.statusCode;

    // Pola error.response.status
    if (obj.response && typeof obj.response === 'object') {
      const resp = obj.response as Record<string, unknown>;
      if (typeof resp.status === 'number') return resp.status;
    }
  }

  return null;
}

/**
 * Memformat error menjadi pesan Bahasa Indonesia yang ramah dan solutif bagi pedagang UMKM
 */
export function formatAiErrorMessage(error: unknown): string {
  if (!error) {
    return DEFAULT_AI_ERROR_MESSAGE;
  }

  // Deteksi error instance / object timeout (APIConnectionTimeoutError)
  const isTimeoutError =
    (typeof error === 'object' && error !== null && (error as Record<string, unknown>).name === 'APIConnectionTimeoutError') ||
    (error instanceof Error && error.name === 'APIConnectionTimeoutError');

  if (isTimeoutError) {
    return AI_HTTP_ERROR_MESSAGES[504];
  }

  const statusCode = extractStatusCode(error);
  if (statusCode && AI_HTTP_ERROR_MESSAGES[statusCode]) {
    return AI_HTTP_ERROR_MESSAGES[statusCode];
  }

  // Analisis teks pesan error jika berupa string, Error instance, atau objek respons
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : typeof (error as Record<string, unknown>)?.message === 'string'
          ? ((error as Record<string, unknown>).message as string)
          : '';

  if (rawMessage) {
    const lower = rawMessage.toLowerCase();

    // Deteksi timeout koneksi spesifik OpenAI / generator
    if (
      lower.includes('apiconnectiontimeouterror') ||
      lower.includes('request timed out') ||
      lower.includes('connection timeout') ||
      lower.includes('etimedout') ||
      (lower.includes('timed out') && (lower.includes('openai') || lower.includes('generator') || lower.includes('api'))) ||
      (lower.includes('timeout') && (lower.includes('openai') || lower.includes('generator') || lower.includes('koneksi')))
    ) {
      return AI_HTTP_ERROR_MESSAGES[504];
    }

    // Deteksi pola kuota / saldo
    if (lower.includes('402') || lower.includes('kuota') || lower.includes('credit') || lower.includes('saldo')) {
      return AI_HTTP_ERROR_MESSAGES[402];
    }

    // Deteksi rate limit
    if (lower.includes('429') || lower.includes('rate limit') || lower.includes('too many requests')) {
      return AI_HTTP_ERROR_MESSAGES[429];
    }

    // Deteksi bad request / validasi
    if (lower.includes('400') || lower.includes('bad request') || lower.includes('invalid') || lower.includes('validation')) {
      return AI_HTTP_ERROR_MESSAGES[400];
    }

    // Deteksi kendala server / timeout
    if (lower.includes('500') || lower.includes('503') || lower.includes('internal server error')) {
      return AI_HTTP_ERROR_MESSAGES[500];
    }

    // Deteksi kendala jaringan
    if (lower.includes('network') || lower.includes('offline') || lower.includes('fetch failed') || lower.includes('econnrefused')) {
      return 'Koneksi jaringan terputus. Pastikan perangkat Anda terhubung ke internet dan coba kembali.';
    }

    // Jika pesan sudah berupa Bahasa Indonesia yang cukup panjang dan informatif, gunakan langsung
    if (rawMessage.length > 10 && !/[<>{}]/.test(rawMessage)) {
      return rawMessage;
    }
  }

  return DEFAULT_AI_ERROR_MESSAGE;
}
