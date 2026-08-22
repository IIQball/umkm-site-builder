const IS_DEBUG = process.env.NODE_ENV !== 'production';

export const debugLog = (tag: string, ...args: unknown[]) => {
  if (!IS_DEBUG) return;
  // Comment baris di bawah ini untuk menonaktifkan seluruh log secara global:
  console.log(`[DEBUG][${tag}]`, ...args);
};

export const errorLog = (tag: string, ...args: unknown[]) => {
  console.error(`[ERROR][${tag}]`, ...args);
};

export const infoLog = (tag: string, ...args: unknown[]) => {
  console.info(`[INFO][${tag}]`, ...args);
};

export const logger = {
  debug: debugLog,
  info: infoLog,
  error: errorLog,
};
