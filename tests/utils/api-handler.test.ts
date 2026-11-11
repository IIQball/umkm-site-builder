import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import {
  jsonSuccess,
  jsonError,
  handleApiRoute,
  AppError,
} from '@/lib/utils/api-handler';
import { validate } from '@/lib/utils/validation';
import * as loggerLib from '@/lib/utils/logger';

vi.mock('@/lib/utils/logger', () => ({
  errorLog: vi.fn(),
  debugLog: vi.fn(),
  infoLog: vi.fn(),
}));

describe('API Route Handler Utilities', () => {
  describe('jsonSuccess', () => {
    it('creates standard success response', async () => {
      const res = jsonSuccess({ foo: 'bar' });
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body).toEqual({
        success: true,
        data: { foo: 'bar' },
        message: 'Berhasil',
      });
    });

    it('uses custom status code', async () => {
      const res = jsonSuccess(null, 201);
      expect(res.status).toBe(201);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeNull();
    });
  });

  describe('jsonError', () => {
    it('creates standard error response for 4xx with details in meta', async () => {
      const res = jsonError('Bad stuff', 400, { fields: 'invalid' });
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body).toEqual({
        success: false,
        data: null,
        message: 'Bad stuff',
        meta: {
          code: 'VALIDATION_ERROR',
          details: { fields: 'invalid' },
        },
      });
    });

    it('defaults to 500, sanitizes internal message, and skips details', async () => {
      const res = jsonError('SELECT * FROM users failed at C:\\app\\db.ts:10');
      expect(res.status).toBe(500);

      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.message).toBe(
        'Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi.'
      );
      expect(body.meta?.code).toBe('INTERNAL_ERROR');
      expect(body.meta?.details).toBeUndefined();
    });
  });

  describe('handleApiRoute wrapper', () => {
    it('executes function and returns standard response on success', async () => {
      const route = () =>
        handleApiRoute(async () => {
          return jsonSuccess('data');
        });

      const res = await route();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toBe('data');
    });

    it('handles ValidationError automatically with status 400', async () => {
      const schema = z.object({ value: z.string() });
      const route = () =>
        handleApiRoute(async () => {
          validate(schema, { value: 123 });
          return jsonSuccess(null);
        });

      const res = await route();
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.meta?.code).toBe('VALIDATION_ERROR');
      expect(body.meta?.details).toHaveProperty('value');
    });

    it('handles AppError / SetError with custom status and message', async () => {
      const route = () =>
        handleApiRoute(async () => {
          throw new AppError('Resource not found', 404, { id: '123' });
        });

      const res = await route();
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Resource not found');
      expect(body.meta?.details).toEqual({ id: '123' });
    });

    it('handles unexpected errors by logging internally and returning safe sanitized 500', async () => {
      const mockErrorLog = vi.spyOn(loggerLib, 'errorLog');

      const route = () =>
        handleApiRoute(async () => {
          throw new Error('SELECT id FROM stores failed: stack leak');
        });

      const res = await route();
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.message).not.toContain('SELECT');
      expect(body.message).not.toContain('stack leak');

      expect(mockErrorLog).toHaveBeenCalledWith(
        'API_HANDLER',
        expect.objectContaining({
          status: 500,
          message: 'SELECT id FROM stores failed: stack leak',
        })
      );
    });
  });
});
