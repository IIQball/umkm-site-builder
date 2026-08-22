import { z } from 'zod';

export class ValidationError extends Error {
  details: Record<string, string[] | undefined>;

  constructor(zodError: z.ZodError) {
    super('Data validation error');
    this.name = 'ValidationError';
    this.details = zodError.flatten().fieldErrors;
  }
}

export function validate<T extends z.ZodTypeAny>(schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}
