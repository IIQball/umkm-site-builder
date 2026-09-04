import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validate, ValidationError } from '@/lib/utils/validation';

describe('Validation Utility', () => {
  const schema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
  });

  it('validates correct data successfully', () => {
    const data = { username: 'testuser', email: 'test@example.com' };
    const result = validate(schema, data);
    expect(result).toEqual(data);
  });

  it('throws ValidationError with formatted details on failure', () => {
    const invalidData = { username: 'ab', email: 'invalid-email' };
    
    expect(() => validate(schema, invalidData)).toThrow(ValidationError);
    
    try {
      validate(schema, invalidData);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const validationError = error as ValidationError;
      expect(validationError.message).toBe('Data validation error');
      expect(validationError.details).toHaveProperty('username');
      expect(validationError.details).toHaveProperty('email');
      expect(validationError.details.username).toContainEqual(expect.stringContaining('at least 3 character(s)'));
    }
  });
});
