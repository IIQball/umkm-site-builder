const IS_DEBUG = process.env.NODE_ENV !== 'production';

function serializeLogArg(arg: unknown): unknown {
  if (arg instanceof Error) {
    return {
      name: arg.name,
      message: arg.message,
      stack: arg.stack,
    };
  }
  return arg;
}

export const debugLog = (tag: string, ...args: unknown[]) => {
  if (!IS_DEBUG) return;
  console.warn(`[DEBUG][${tag}]`, ...args.map(serializeLogArg));
};

export const errorLog = (tag: string, ...args: unknown[]) => {
  const entry = {
    level: 'error',
    timestamp: new Date().toISOString(),
    tag,
    details: args.map(serializeLogArg),
  };
  console.error(`[ERROR][${tag}]`, JSON.stringify(entry));
};

export const infoLog = (tag: string, ...args: unknown[]) => {
  console.warn(`[INFO][${tag}]`, ...args.map(serializeLogArg));
};

export const logger = {
  debug: debugLog,
  info: infoLog,
  error: errorLog,
};
