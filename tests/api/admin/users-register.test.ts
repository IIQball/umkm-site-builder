import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/pages/api/admin/users/register';
import { db } from '@/db/index';
import { auth } from '@/lib/auth';

vi.mock('@/db/index', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([]),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn().mockResolvedValue([{}]),
    })),
  },
  users: {
    email: 'mock_email',
  },
  sessions: {
    userId: 'mock_userId',
  },
}));

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn().mockResolvedValue({ id: 'admin1', role: 'admin' }),
  isAuthorizedAdmin: vi.fn().mockReturnValue(true),
  auth: {
    api: {
      signUpEmail: vi.fn().mockResolvedValue({ user: { id: 'new_user_123' } }),
    },
  },
}));

vi.mock('drizzle-orm', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    eq: vi.fn(),
  };
});

import type { APIContext } from 'astro';

describe('POST /api/admin/users/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockContext = (body: Record<string, unknown>) => ({
    request: {
      json: vi.fn().mockResolvedValue(body),
    },
  } as unknown as APIContext);

  it('should successfully register a new user and delete the created session', async () => {
    const payload = {
      role: 'tenant',
      name: 'Tenant User',
      email: 'tenant@test.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const response = await POST(mockContext(payload)) as Response;
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('new_user_123');

    // verify signUpEmail is called with empty Headers
    expect(auth.api.signUpEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          name: 'Tenant User',
          email: 'tenant@test.com',
          role: 'tenant'
        }),
        headers: expect.any(Headers)
      })
    );

    // verify session deletion is triggered
    expect(db.delete).toHaveBeenCalled();
  });

  it('should return 400 if validation fails (password mismatch)', async () => {
    const payload = {
      role: 'designer',
      name: 'Designer',
      email: 'designer@test.com',
      password: 'password123',
      confirmPassword: 'password321' // Mismatch
    };

    const response = await POST(mockContext(payload)) as Response;
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBeDefined();
  });

  it('should return 400 if email already exists', async () => {
    vi.mocked(db.select).mockImplementationOnce(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([{ id: 'existing_user' }]),
        })),
      })),
    }) as unknown as ReturnType<typeof db.select>);

    const payload = {
      role: 'tenant',
      name: 'Tenant',
      email: 'existing@test.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const response = await POST(mockContext(payload)) as Response;
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.message).toBe('Email is already registered in the system');
  });
});
