import { describe, it, expect } from 'bun:test';
import {
  formatAiErrorMessage,
  AiStudioError,
  AI_HTTP_ERROR_MESSAGES,
  DEFAULT_AI_ERROR_MESSAGE,
} from '@/lib/errors/ai-error';

describe('AI Error Handler - formatAiErrorMessage & AiStudioError', () => {
  describe('HTTP Status Code Mapping', () => {
    it('maps 400 Bad Request to validation input error', () => {
      const msg = formatAiErrorMessage(400);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[400]);
      expect(msg).toContain('Validasi input tidak lengkap');
    });

    it('maps 402 Payment Required to quota exhaustion top-up guidance', () => {
      const msg = formatAiErrorMessage(402);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[402]);
      expect(msg).toContain('Kuota kredit AI toko habis');
    });

    it('maps 429 Rate Limit to busy server retry guidance', () => {
      const msg = formatAiErrorMessage(429);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[429]);
      expect(msg).toContain('Antrean server AI sedang padat');
    });

    it('maps 500 Internal Server Error to temporary issue message', () => {
      const msg = formatAiErrorMessage(500);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[500]);
      expect(msg).toContain('Layanan visualizer sedang mengalami kendala sementara');
    });

    it('maps 503 Service Unavailable correctly', () => {
      const msg = formatAiErrorMessage(503);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[503]);
      expect(msg).toContain('pemeliharaan server');
    });

    it('parses numeric string status codes', () => {
      expect(formatAiErrorMessage('429')).toBe(AI_HTTP_ERROR_MESSAGES[429]);
      expect(formatAiErrorMessage('402')).toBe(AI_HTTP_ERROR_MESSAGES[402]);
    });
  });

  describe('Object & Error Instance Handling', () => {
    it('extracts status from { status: 429 }', () => {
      const msg = formatAiErrorMessage({ status: 429 });
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[429]);
    });

    it('extracts statusCode from { statusCode: 402 }', () => {
      const msg = formatAiErrorMessage({ statusCode: 402 });
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[402]);
    });

    it('extracts status from nested { response: { status: 500 } }', () => {
      const msg = formatAiErrorMessage({ response: { status: 500 } });
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[500]);
    });

    it('detects rate limit keyword in standard Error message', () => {
      const err = new Error('OpenAI API Error: Rate limit exceeded');
      const msg = formatAiErrorMessage(err);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[429]);
    });

    it('detects quota keyword in standard Error message', () => {
      const err = new Error('User has insufficient credits (kuota habis)');
      const msg = formatAiErrorMessage(err);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[402]);
    });

    it('detects network failure in Error message', () => {
      const err = new Error('TypeError: fetch failed due to network offline');
      const msg = formatAiErrorMessage(err);
      expect(msg).toContain('Koneksi jaringan terputus');
    });

    it('detects APIConnectionTimeoutError object and maps to 504 message', () => {
      const timeoutErr = Object.assign(new Error('Request timed out.'), { name: 'APIConnectionTimeoutError' });
      const msg = formatAiErrorMessage(timeoutErr);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[504]);
      expect(msg).toContain('koneksi timeout');
    });

    it('detects OpenAI API Error: Request timed out string and maps to 504 message', () => {
      const err = new Error('OpenAI API Error: Request timed out');
      const msg = formatAiErrorMessage(err);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[504]);
    });

    it('detects ETIMEDOUT connection error and maps to 504 message', () => {
      const err = new Error('ETIMEDOUT: Connection to api.openai.com timed out');
      const msg = formatAiErrorMessage(err);
      expect(msg).toBe(AI_HTTP_ERROR_MESSAGES[504]);
    });

    it('returns default message on null, undefined, or empty object', () => {
      expect(formatAiErrorMessage(null)).toBe(DEFAULT_AI_ERROR_MESSAGE);
      expect(formatAiErrorMessage(undefined)).toBe(DEFAULT_AI_ERROR_MESSAGE);
      expect(formatAiErrorMessage({})).toBe(DEFAULT_AI_ERROR_MESSAGE);
    });
  });

  describe('AiStudioError Class', () => {
    it('creates an AiStudioError with automatic Indonesian message and status', () => {
      const error = new AiStudioError(402);
      expect(error.name).toBe('AiStudioError');
      expect(error.status).toBe(402);
      expect(error.message).toBe(AI_HTTP_ERROR_MESSAGES[402]);
    });

    it('allows custom message overriding standard status message', () => {
      const custom = 'Pesan kustom khusus UMKM';
      const error = new AiStudioError(400, custom);
      expect(error.status).toBe(400);
      expect(error.message).toBe(custom);
    });
  });
});
