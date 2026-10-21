import { describe, it, expect, vi } from 'vitest';
import { GET as getPublicBusinessCategories } from '@/pages/api/public/business-categories';
import {
  GET as getAdminBusinessCategories,
  POST as postAdminBusinessCategories,
} from '@/pages/api/admin/business-categories/index';
import {
  PUT as putAdminBusinessCategory,
  DELETE as deleteAdminBusinessCategory,
} from '@/pages/api/admin/business-categories/[id]';
import {
  BusinessCategoryCreateSchema,
  BusinessCategoryUpdateSchema,
} from '@/schemas';
import { getNavGroups } from '@/components/dashboard/sidebar/sidebar.helpers';
import { getRoleNavLinks } from '@/components/common/navbar.helpers';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn().mockResolvedValue(null),
  isAuthorizedAdmin: vi.fn().mockReturnValue(false),
  isAuthorizedSuperAdmin: vi.fn().mockReturnValue(false),
}));

describe('Business Categories API, Schemas & Navigation', () => {
  describe('BusinessCategory Schemas', () => {
    it('validates a valid business category payload', () => {
      const valid = {
        name: 'Kuliner & Minuman',
        slug: 'kuliner-minuman',
        description: 'Kategori untuk restoran, kafe, dan warung makan',
        icon: 'restaurant',
      };
      const result = BusinessCategoryCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects invalid slug with spaces or uppercase', () => {
      const invalid = {
        name: 'Kuliner & Minuman',
        slug: 'Kuliner Minuman!',
      };
      const result = BusinessCategoryCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects empty name or slug', () => {
      const invalidName = { name: '', slug: 'kuliner' };
      const invalidSlug = { name: 'Kuliner', slug: '' };
      expect(BusinessCategoryCreateSchema.safeParse(invalidName).success).toBe(false);
      expect(BusinessCategoryCreateSchema.safeParse(invalidSlug).success).toBe(false);
    });

    it('validates partial update schema', () => {
      const partial = {
        name: 'Nama Bisnis Baru',
      };
      const result = BusinessCategoryUpdateSchema.safeParse(partial);
      expect(result.success).toBe(true);
    });

    it('validates update schema with icon and description', () => {
      const updateData = {
        description: 'Deskripsi baru yang lebih mendetail',
        icon: 'storefront',
      };
      const result = BusinessCategoryUpdateSchema.safeParse(updateData);
      expect(result.success).toBe(true);
    });
  });

  describe('GET /api/public/business-categories', () => {
    it('should return 200 and a list of business categories', async () => {
      const res = (await getPublicBusinessCategories({
        request: new Request('http://localhost:4321/api/public/business-categories'),
        params: {},
      } as unknown as Parameters<typeof getPublicBusinessCategories>[0])) as Response;

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  describe('Admin Business Categories Auth Guards', () => {
    it('rejects unauthenticated requests to GET /api/admin/business-categories', async () => {
      const res = (await getAdminBusinessCategories({
        request: new Request('http://localhost:4321/api/admin/business-categories'),
        params: {},
      } as unknown as Parameters<typeof getAdminBusinessCategories>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests to POST /api/admin/business-categories', async () => {
      const res = (await postAdminBusinessCategories({
        request: new Request('http://localhost:4321/api/admin/business-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Retail', slug: 'retail' }),
        }),
        params: {},
      } as unknown as Parameters<typeof postAdminBusinessCategories>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests to PUT /api/admin/business-categories/[id]', async () => {
      const res = (await putAdminBusinessCategory({
        request: new Request('http://localhost:4321/api/admin/business-categories/biz-1', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Updated' }),
        }),
        params: { id: 'biz-1' },
      } as unknown as Parameters<typeof putAdminBusinessCategory>[0])) as Response;

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests to DELETE /api/admin/business-categories/[id]', async () => {
      const res = (await deleteAdminBusinessCategory({
        request: new Request('http://localhost:4321/api/admin/business-categories/biz-1', {
          method: 'DELETE',
        }),
        params: { id: 'biz-1' },
      } as unknown as Parameters<typeof deleteAdminBusinessCategory>[0])) as Response;

      expect(res.status).toBe(403);
    });
  });

  describe('Superadmin Sidebar & Navbar Navigation', () => {
    it('includes Kategori Bisnis in superadmin sidebar nav items', () => {
      const navGroups = getNavGroups('superadmin');
      const catalogGroup = navGroups.find((g) => g.title === 'Katalog & Template');
      expect(catalogGroup).toBeDefined();

      const bizCategoryItem = catalogGroup?.items.find(
        (item) => item.href === '/superadmin/business-categories'
      );
      expect(bizCategoryItem).toBeDefined();
      expect(bizCategoryItem?.label).toBe('Kategori Bisnis');
      expect(bizCategoryItem?.icon).toBe('storefront');
    });

    it('includes Kategori Bisnis in superadmin navbar dropdown links', () => {
      const links = getRoleNavLinks('superadmin');
      const bizLink = links.find((l) => l.href === '/superadmin/business-categories');
      expect(bizLink).toBeDefined();
      expect(bizLink?.label).toBe('Kategori Bisnis');
    });
  });

  describe('Tenant Sidebar Navigation', () => {
    it('includes Studio AI in tenant sidebar nav items below Katalog Produk', () => {
      const navGroups = getNavGroups('tenant');
      const storeGroup = navGroups.find((g) => g.title === 'Manajemen Toko');
      expect(storeGroup).toBeDefined();

      const aiItem = storeGroup?.items.find((item) => item.href === '/dashboard/ai');
      expect(aiItem).toBeDefined();
      expect(aiItem?.label).toBe('Studio AI');
      expect(aiItem?.icon).toBe('auto_awesome');

      const productIdx = storeGroup?.items.findIndex((item) => item.href === '/dashboard/products');
      const aiIdx = storeGroup?.items.findIndex((item) => item.href === '/dashboard/ai');
      expect(aiIdx).toBe((productIdx ?? -1) + 1);
    });
  });
});
