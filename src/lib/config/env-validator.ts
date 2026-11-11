import { errorLog } from '@/lib/utils/logger';

export type EnvKeySpec = string | readonly string[];

export interface EnvAuditReport {
  missingRequired: string[];
  missingProduction: string[];
  isValid: boolean;
}

/**
 * Error thrown when required runtime environment configuration is missing.
 */
export class EnvironmentConfigError extends Error {
  readonly missingKeys: string[];
  readonly status = 503;
  readonly code = 'SERVICE_UNAVAILABLE';

  constructor(missingKeys: string[]) {
    super(`Missing required environment configuration: ${missingKeys.join(', ')}`);
    this.name = 'EnvironmentConfigError';
    this.missingKeys = missingKeys;
  }
}

const buildTimeEnv = import.meta.env as unknown as Record<string, string | undefined>;
let startupAuditLogged = false;

/**
 * Reads an environment variable prioritizing runtime `process.env` over build-time `import.meta.env`.
 */
export function readRuntimeEnv(key: string): string {
  const runtime = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  return runtime || buildTimeEnv?.[key] || '';
}

function resolveKeySpec(spec: EnvKeySpec): { label: string; value: string } {
  if (typeof spec === 'string') {
    return { label: spec, value: readRuntimeEnv(spec) };
  }
  const label = spec[0] || '';
  for (const candidate of spec) {
    const val = readRuntimeEnv(candidate);
    if (val) {
      return { label, value: val };
    }
  }
  return { label, value: '' };
}

/**
 * Asserts that every specified key (or alias group) has a non-empty value at runtime.
 * Throws `EnvironmentConfigError` containing the missing variable names.
 */
export function assertEnvVars(specs: readonly EnvKeySpec[]): Record<string, string> {
  const resolved: Record<string, string> = {};
  const missing: string[] = [];

  for (const spec of specs) {
    const { label, value } = resolveKeySpec(spec);
    if (!value) {
      missing.push(label);
    } else {
      resolved[label] = value;
    }
  }

  if (missing.length > 0) {
    throw new EnvironmentConfigError(missing);
  }

  return resolved;
}

const BASE_REQUIRED_ENV: readonly EnvKeySpec[] = ['DATABASE_URL'];

const PROD_REQUIRED_ENV: readonly EnvKeySpec[] = [
  'BETTER_AUTH_SECRET',
  ['XENDIT_API_KEY', 'XENDIT_SECRET_KEY'],
  ['CLOUDINARY_NAME', 'CLOUDINARY_CLOUD_NAME'],
];

/**
 * Audits runtime environment variables and logs missing variables without crashing module import.
 * Pass `{ strict: true }` to throw `EnvironmentConfigError` immediately when variables are absent.
 */
export function validateRuntimeEnv(options: { strict?: boolean; isProd?: boolean } = {}): EnvAuditReport {
  const isProd = options.isProd ?? Boolean(import.meta.env?.PROD);
  const missingRequired: string[] = [];
  const missingProduction: string[] = [];

  for (const spec of BASE_REQUIRED_ENV) {
    const { label, value } = resolveKeySpec(spec);
    if (!value) missingRequired.push(label);
  }

  if (isProd) {
    for (const spec of PROD_REQUIRED_ENV) {
      const { label, value } = resolveKeySpec(spec);
      if (!value) missingProduction.push(label);
    }
  }

  const allMissing = [...missingRequired, ...missingProduction];
  const isValid = allMissing.length === 0;

  if (!isValid && !startupAuditLogged) {
    startupAuditLogged = true;
    errorLog('ENV_CONFIG', 'Missing required environment variables', {
      missingRequired,
      missingProduction,
    });
  }

  if (!isValid && options.strict) {
    throw new EnvironmentConfigError(allMissing);
  }

  return { missingRequired, missingProduction, isValid };
}

/**
 * Resets internal once-per-boot warning state (intended for automated tests).
 */
export function resetEnvAuditFlagForTest(): void {
  startupAuditLogged = false;
}

