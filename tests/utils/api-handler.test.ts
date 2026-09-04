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
      const res = jsonSuccess({ foo: 'bar' }, 'Done');
      expect(res.status).toBe(200);
      
      const body = await res.json();
      expect(body).toEqual({
        success: true,
        ok: true,
        message: 'Done',
        data: { foo: 'bar' },
      });
    });

    it('uses custom status code', async () => {
      const res = jsonSuccess(null, 'Created', 201);
      expect(res.status).toBe(201);
      
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });

  describe('jsonError', () => {
    it('creates standard error response', async () => {
      const res = jsonError('Bad stuff', 400, { fields: 'invalid' });
      expect(res.status).toBe(400);
      
      const body = await res.json();
      expect(body).toEqual({
        success: false,
        ok: false,
        message: 'Bad stuff',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Bad stuff',
        },
        details: { fields: 'invalid' },
      });
    });

    it('defaults to 500 and skips details when undefined', async () => {
      const res = jsonError('Internal error');
      expect(res.status).toBe(500);
      
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.details).toBeUndefined();
    });
  });

  describe('handleApiRoute wrapper', () => {
    it('executes function and returns standard response on success', async () => {
      const route = () => handleApiRoute(async () => {
        return jsonSuccess('data', 'OK');
      });

      const res = await route();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toBe('data');
    });

    it('handles ValidationError automatically with status 400', async () => {
      const schema = z.object({ value: z.string() });
      const route = () => handleApiRoute(async () => {
        validate(schema, { value: 123 });
        return jsonSuccess(null);
      });

      const res = await route();
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Data validation error');
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.details).toHaveProperty('value');
    });

    it('handles AppError / SetError with custom status and message', async () => {
      const route = () => handleApiRoute(async () => {
        throw new AppError('Resource not found', 404, { id: '123' });
      });

      const res = await route();
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Resource not found');
      expect(body.details).toEqual({ id: '123' });
    });

    it('handles unexpected errors by logging and returning 500', async () => {
      const mockErrorLog = vi.spyOn(loggerLib, 'errorLog');
      
      const route = () => handleApiRoute(async () => {
        throw new Error('Database connection lost');
      });

      const res = await route();
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('Database connection lost');
      
      expect(mockErrorLog).toHaveBeenCalledWith(
        'API_HANDLER',
        'Database connection lost',
        expect.any(String)
      );
    });
  });
});
