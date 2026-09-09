import { describe, it, expect, vi } from 'vitest';
import { GET as getPublicCategories } from '@/pages/api/public/template-categories/index';
import { GET as getAdminCategories, POST as postAdminCategories } from '@/pages/api/admin/template-categories/index';
import { PUT as putAdminCategory, DELETE as deleteAdminCategory } from '@/pages/api/admin/template-categories/[id]';
import { TemplateCategoryCreateSchema, TemplateCategoryUpdateSchema, TemplateDraftCreateSchema } from '@/schemas';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn().mockResolvedValue(null),
  isAuthorizedAdmin: vi.fn().mockReturnValue(false),
  isAuthorizedSuperAdmin: vi.fn().mockReturnValue(false),
}));


describe('Template Categories API & Schemas', () => {
  describe('TemplateCategory Schemas', () => {
    it('validates a valid template category payload', () => {
      const valid = {
        name: 'Kuliner & Makanan',
        slug: 'kuliner-makanan',
        description: 'Template untuk resto dan kuliner',
        icon: 'restaurant',
      };
      const result = TemplateCategoryCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid slug with spaces or uppercase', () => {
      const invalid = {
        name: 'Kuliner',
        slug: 'Kuliner Makanan!',
      };
      const result = TemplateCategoryCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('validates partial update schema', () => {
      const partial = {
        name: 'Nama Baru',
      };
      const result = TemplateCategoryUpdateSchema.safeParse(partial);
      expect(result.success).toBe(true);
    });

    it('validates TemplateDraftCreateSchema with categoryId', () => {
      const draftInput = {
        name: 'Template Warung Kopi',
        price: 50000,
        categoryId: 'cat-kuliner',
      };
      const result = TemplateDraftCreateSchema.safeParse(draftInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.categoryId).toBe('cat-kuliner');
      }
    });
  });

  describe('GET /api/public/template-categories', () => {
    it('should return 200 and a list of template categories', async () => {
      const res = (await getPublicCategories({
        request: new Request('http://localhost:4321/api/public/template-categories'),
        params: {},
      } as unknown as Parameters<typeof getPublicCategories>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('Admin Template Categories Auth Guards', () => {
    it('rejects unauthenticated requests to GET /api/admin/template-categories', async () => {
      const res = (await getAdminCategories({
        request: new Request('http://localhost:4321/api/admin/template-categories'),
        params: {},
      } as unknown as Parameters<typeof getAdminCategories>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests to POST /api/admin/template-categories', async () => {
      const res = (await postAdminCategories({
        request: new Request('http://localhost:4321/api/admin/template-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Test', slug: 'test' }),
        }),
        params: {},
      } as unknown as Parameters<typeof postAdminCategories>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests to PUT /api/admin/template-categories/[id]', async () => {
      const res = (await putAdminCategory({
        request: new Request('http://localhost:4321/api/admin/template-categories/cat-1', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Updated' }),
        }),
        params: { id: 'cat-1' },
      } as unknown as Parameters<typeof putAdminCategory>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests to DELETE /api/admin/template-categories/[id]', async () => {
      const res = (await deleteAdminCategory({
        request: new Request('http://localhost:4321/api/admin/template-categories/cat-1', {
          method: 'DELETE',
        }),
        params: { id: 'cat-1' },
      } as unknown as Parameters<typeof deleteAdminCategory>[0])) as Response;

      expect(res.status).toBe(403);
    });
  });
});
