import { describe, it, expect, beforeEach } from 'vitest';
import {
  EnvironmentConfigError,
  assertEnvVars,
  validateRuntimeEnv,
  resetEnvAuditFlagForTest,
} from '@/lib/config/env-validator';
import { DatabaseTimeoutError, withDbTimeout } from '@/lib/db/timeout';
import {
  classifyServerError,
  isSensitiveOrInternalMessage,
  sanitizeClientErrorMessage,
} from '@/lib/utils/error-sanitizer';
import { isDevHeaderOverrideAllowed } from '@/lib/auth/guards';
import { canUserAction } from '@/lib/auth/permissions';

describe('Security, Error Sanitization & Resilience Utilities', () => {
  beforeEach(() => {
    resetEnvAuditFlagForTest();
  });

  describe('Environment Config Validator', () => {
    it('throws EnvironmentConfigError with 503 when required runtime env keys are absent', () => {
      const missingKey = 'PINOKA_NON_EXISTENT_SECRET_KEY_123';
      let caught: unknown;
      try {
        assertEnvVars([missingKey]);
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(EnvironmentConfigError);
      const envErr = caught as EnvironmentConfigError;
      expect(envErr.status).toBe(503);
      expect(envErr.code).toBe('SERVICE_UNAVAILABLE');
      expect(envErr.missingKeys).toContain(missingKey);
    });

    it('reports missing production keys cleanly without throwing unless strict=true', () => {
      const savedUrl = process.env.DATABASE_URL;
      const savedSecret = process.env.BETTER_AUTH_SECRET;
      const savedXendit = process.env.XENDIT_API_KEY;
      const savedXenditSecret = process.env.XENDIT_SECRET_KEY;
      const savedCloud = process.env.CLOUDINARY_NAME;
      const savedCloudAlt = process.env.CLOUDINARY_CLOUD_NAME;

      try {
        delete process.env.DATABASE_URL;
        delete process.env.BETTER_AUTH_SECRET;
        delete process.env.XENDIT_API_KEY;
        delete process.env.XENDIT_SECRET_KEY;
        delete process.env.CLOUDINARY_NAME;
        delete process.env.CLOUDINARY_CLOUD_NAME;

        const audit = validateRuntimeEnv({ isProd: true, strict: false });
        expect(audit.isValid).toBe(false);
        expect(audit.missingProduction.length).toBeGreaterThan(0);

        expect(() => validateRuntimeEnv({ isProd: true, strict: true })).toThrow(EnvironmentConfigError);
      } finally {
        if (savedUrl !== undefined) process.env.DATABASE_URL = savedUrl;
        if (savedSecret !== undefined) process.env.BETTER_AUTH_SECRET = savedSecret;
        if (savedXendit !== undefined) process.env.XENDIT_API_KEY = savedXendit;
        if (savedXenditSecret !== undefined) process.env.XENDIT_SECRET_KEY = savedXenditSecret;
        if (savedCloud !== undefined) process.env.CLOUDINARY_NAME = savedCloud;
        if (savedCloudAlt !== undefined) process.env.CLOUDINARY_CLOUD_NAME = savedCloudAlt;
      }
    });
  });

  describe('Database Timeout Wrapper', () => {
    it('resolves normally when operation finishes before deadline', async () => {
      const result = await withDbTimeout('fastQuery', async () => 'ok', 200);
      expect(result).toBe('ok');
    });

    it('rejects with DatabaseTimeoutError (504 GATEWAY_TIMEOUT) on RTO/hang', async () => {
      const slowQuery = () => new Promise<string>((resolve) => setTimeout(() => resolve('late'), 250));

      let caught: unknown;
      try {
        await withDbTimeout('slowQuery', slowQuery, 15);
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(DatabaseTimeoutError);
      const timeoutErr = caught as DatabaseTimeoutError;
      expect(timeoutErr.status).toBe(504);
      expect(timeoutErr.code).toBe('GATEWAY_TIMEOUT');
      expect(timeoutErr.operation).toBe('slowQuery');
    });
  });

  describe('Error Sanitizer & Classifier', () => {
    it('detects SQL fragments, stack frames, server file paths, and runtime exceptions', () => {
      expect(isSensitiveOrInternalMessage('SELECT id FROM users WHERE email = $1')).toBe(true);
      expect(isSensitiveOrInternalMessage('relation "bug_reports" does not exist')).toBe(true);
      expect(isSensitiveOrInternalMessage('TypeError: Cannot read properties at handleSubmit (/app/src/index.ts:22:4)')).toBe(true);
      expect(isSensitiveOrInternalMessage('E:\u005cPOLIWANGI\u005capp\u005cdb.ts failed')).toBe(true);
      expect(isSensitiveOrInternalMessage('Nama produk wajib diisi')).toBe(false);
    });

    it('never leaks internal error text on 5xx and masks sensitive 4xx details', () => {
      const sqlLeak = 'SELECT * FROM users WHERE password = "x" at src/lib/db.ts (line 42)';
      const safe500 = sanitizeClientErrorMessage(sqlLeak, 500);
      expect(safe500).toBe('Terjadi kesalahan internal pada server. Silakan coba beberapa saat lagi.');
      expect(safe500).not.toContain('SELECT');

      const safe400 = sanitizeClientErrorMessage('relation "stores" violates foreign key constraint', 400);
      expect(safe400).toBe('Permintaan tidak valid. Mohon periksa kembali data Anda.');
    });

    it('classifies DatabaseTimeoutError, EnvironmentConfigError, network drops, and PG codes safely', () => {
      const timeoutClassified = classifyServerError(new DatabaseTimeoutError('bugReports.list', 10000));
      expect(timeoutClassified.status).toBe(504);
      expect(timeoutClassified.code).toBe('GATEWAY_TIMEOUT');
      expect(timeoutClassified.clientMessage).not.toContain('bugReports.list');

      const envClassified = classifyServerError(new EnvironmentConfigError(['DATABASE_URL']));
      expect(envClassified.status).toBe(503);
      expect(envClassified.code).toBe('SERVICE_UNAVAILABLE');
      expect(envClassified.clientMessage).not.toContain('DATABASE_URL');

      const netClassified = classifyServerError(new Error('connect ECONNREFUSED 10.0.0.5:5432'));
      expect(netClassified.status).toBe(503);
      expect(netClassified.clientMessage).not.toContain('10.0.0.5');

      const dupClassified = classifyServerError({ code: '23505', message: 'duplicate key value violates unique constraint' });
      expect(dupClassified.status).toBe(409);
      expect(dupClassified.code).toBe('CONFLICT');
    });
  });

  describe('Auth Header Spoof Guard & Bug Report Permissions', () => {
    it('rejects x-user-id header override outside test env unless DEV + explicit opt-in are active', () => {
      expect(isDevHeaderOverrideAllowed({ nodeEnv: 'production', isDev: false, allowDevHeader: 'true' })).toBe(false);
      expect(isDevHeaderOverrideAllowed({ nodeEnv: 'development', isDev: true, allowDevHeader: 'false' })).toBe(false);
      expect(isDevHeaderOverrideAllowed({ nodeEnv: 'development', isDev: true, allowDevHeader: '' })).toBe(false);
      expect(isDevHeaderOverrideAllowed({ nodeEnv: 'development', isDev: true, allowDevHeader: 'true' })).toBe(true);
      expect(isDevHeaderOverrideAllowed({ nodeEnv: 'test', isDev: false, allowDevHeader: '' })).toBe(true);
    });

    it('restricts bug_reports read/update strictly to superadmin while allowing creation broadly', () => {
      expect(canUserAction('superadmin', 'bug_reports', 'read')).toBe(true);
      expect(canUserAction('superadmin', 'bug_reports', 'update')).toBe(true);
      expect(canUserAction('admin', 'bug_reports', 'read')).toBe(false);
      expect(canUserAction('admin', 'bug_reports', 'update')).toBe(false);
      expect(canUserAction('designer', 'bug_reports', 'read')).toBe(false);
      expect(canUserAction('tenant', 'bug_reports', 'update')).toBe(false);
      expect(canUserAction('public', 'bug_reports', 'create')).toBe(true);
    });
  });
});

