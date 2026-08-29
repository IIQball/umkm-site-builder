import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../src/lib/db/client', () => ({
  db: {
    select: vi.fn(),
    update: vi.fn(),
  },
}));

import { db } from '../../src/lib/db/client';
import {
  validateTemplateOwnership,
  applyTemplateToStore,
} from '../../src/services/store-template.service';
import { AppError } from '../../src/lib/utils/api-handler';

function mockSelectChain(rows: unknown[]) {
  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(rows),
    }),
  };
}

describe('store-template.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateTemplateOwnership', () => {
    it('throws STORE_NOT_FOUND if store does not exist', async () => {
      (db.select as Mock).mockReturnValueOnce(mockSelectChain([]));

      await expect(
        validateTemplateOwnership('store-1', 'tpl-1', 'user-1')
      ).rejects.toThrow(AppError);

      try {
        (db.select as Mock).mockReturnValueOnce(mockSelectChain([]));
        await validateTemplateOwnership('store-1', 'tpl-1', 'user-1');
      } catch (e) {
        expect((e as AppError).code).toBe('STORE_NOT_FOUND');
        expect((e as AppError).status).toBe(404);
      }
    });

    it('throws STORE_FORBIDDEN if store belongs to different user', async () => {
      (db.select as Mock).mockReturnValueOnce(
        mockSelectChain([{ id: 'store-1', userId: 'user-other', templateId: null }])
      );

      await expect(
        validateTemplateOwnership('store-1', 'tpl-1', 'user-1')
      ).rejects.toThrow(AppError);

      try {
        (db.select as Mock).mockReturnValueOnce(
          mockSelectChain([{ id: 'store-1', userId: 'user-other', templateId: null }])
        );
        await validateTemplateOwnership('store-1', 'tpl-1', 'user-1');
      } catch (e) {
        expect((e as AppError).code).toBe('STORE_FORBIDDEN');
        expect((e as AppError).status).toBe(403);
      }
    });

    it('throws TEMPLATE_NOT_FOUND if template not found or not approved', async () => {
      (db.select as Mock)
        .mockReturnValueOnce(
          mockSelectChain([{ id: 'store-1', userId: 'user-1', templateId: null }])
        )
        .mockReturnValueOnce(mockSelectChain([]));

      await expect(
        validateTemplateOwnership('store-1', 'tpl-1', 'user-1')
      ).rejects.toThrow(AppError);

      try {
        (db.select as Mock)
          .mockReturnValueOnce(
            mockSelectChain([{ id: 'store-1', userId: 'user-1', templateId: null }])
          )
          .mockReturnValueOnce(mockSelectChain([]));
        await validateTemplateOwnership('store-1', 'tpl-1', 'user-1');
      } catch (e) {
        expect((e as AppError).code).toBe('TEMPLATE_NOT_FOUND');
        expect((e as AppError).status).toBe(404);
      }
    });

    it('returns owned=true for free template (price=0)', async () => {
      const tpl = { id: 'tpl-free', name: 'Free', price: 0, config: {}, status: 'approved' };

      (db.select as Mock)
        .mockReturnValueOnce(
          mockSelectChain([{ id: 'store-1', userId: 'user-1', templateId: null }])
        )
        .mockReturnValueOnce(mockSelectChain([tpl]));

      const result = await validateTemplateOwnership('store-1', 'tpl-free', 'user-1');

      expect(result.owned).toBe(true);
      expect(result.template.name).toBe('Free');
      expect(result.store.id).toBe('store-1');
    });

    it('returns owned=false for paid template not purchased', async () => {
      const tpl = { id: 'tpl-paid', name: 'Premium', price: 50000, config: {}, status: 'approved' };

      (db.select as Mock)
        .mockReturnValueOnce(
          mockSelectChain([{ id: 'store-1', userId: 'user-1', templateId: null }])
        )
        .mockReturnValueOnce(mockSelectChain([tpl]))
        .mockReturnValueOnce(mockSelectChain([]));

      const result = await validateTemplateOwnership('store-1', 'tpl-paid', 'user-1');

      expect(result.owned).toBe(false);
    });

    it('returns owned=true for paid template that is purchased', async () => {
      const tpl = { id: 'tpl-paid', name: 'Premium', price: 50000, config: {}, status: 'approved' };

      (db.select as Mock)
        .mockReturnValueOnce(
          mockSelectChain([{ id: 'store-1', userId: 'user-1', templateId: null }])
        )
        .mockReturnValueOnce(mockSelectChain([tpl]))
        .mockReturnValueOnce(mockSelectChain([{ id: 'ut-1' }]));

      const result = await validateTemplateOwnership('store-1', 'tpl-paid', 'user-1');

      expect(result.owned).toBe(true);
      expect(result.template.price).toBe(50000);
    });
  });

  describe('applyTemplateToStore', () => {
    it('calls db.update with correct parameters', async () => {
      const setMock = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      });
      (db.update as Mock).mockReturnValueOnce({ set: setMock });

      const config = { theme: {}, sections: [] };
      await applyTemplateToStore('store-1', 'tpl-1', config);

      expect(db.update).toHaveBeenCalled();
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          templateId: 'tpl-1',
          customization: config,
        })
      );
    });
  });
});
