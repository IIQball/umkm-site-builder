import { describe, it, expect } from 'vitest';
import { formatAuditAction } from '@/lib/utils/audit';

describe('formatAuditAction', () => {
  describe('Feed mode (default)', () => {
    it('translates "Create Store" and variations correctly', () => {
      expect(formatAuditAction('Create Store')).toBe('membuat toko baru');
      expect(formatAuditAction('create_store')).toBe('membuat toko baru');
      expect(formatAuditAction('CREATE_STORE')).toBe('membuat toko baru');
    });

    it('translates "Purchase AI Credit" correctly', () => {
      expect(formatAuditAction('Purchase AI Credit')).toBe('membeli kredit AI');
      expect(formatAuditAction('PURCHASE_AI_CREDIT')).toBe('membeli kredit AI');
      expect(formatAuditAction('purchase_ai_credit')).toBe('membeli kredit AI');
    });

    it('translates user status actions correctly', () => {
      expect(formatAuditAction('USER_ACTIVATED')).toBe('mengaktifkan akun pengguna');
      expect(formatAuditAction('USER_SUSPENDED')).toBe('menonaktifkan akun pengguna');
      expect(formatAuditAction('store_suspended')).toBe('menangguhkan toko');
      expect(formatAuditAction('store_unsuspended')).toBe('memulihkan toko');
    });

    it('translates financial and template actions correctly', () => {
      expect(formatAuditAction('Apply Template')).toBe('menerapkan template');
      expect(formatAuditAction('Download Free Template')).toBe('mengunduh template gratis');
      expect(formatAuditAction('Request Payout')).toBe('mengajukan penarikan dana');
      expect(formatAuditAction('Add Bank Account')).toBe('menambahkan rekening bank');
    });

    it('falls back gracefully on unknown actions', () => {
      expect(formatAuditAction('create unknown_thing')).toBe('membuat unknown thing');
      expect(formatAuditAction('')).toBe('-');
      expect(formatAuditAction(null)).toBe('-');
      expect(formatAuditAction(undefined)).toBe('-');
    });
  });

  describe('Label mode', () => {
    it('returns title-cased labels for badges and dropdowns', () => {
      expect(formatAuditAction('Create Store', { mode: 'label' })).toBe('Membuat Toko');
      expect(formatAuditAction('purchase_ai_credit', { mode: 'label' })).toBe('Beli Kredit AI');
      expect(formatAuditAction('store_suspended', { mode: 'label' })).toBe('Tangguhkan Toko');
      expect(formatAuditAction('Apply Template', { mode: 'label' })).toBe('Terapkan Template');
      expect(formatAuditAction('Request Payout', { mode: 'label' })).toBe('Tarik Dana');
    });

    it('falls back gracefully in label mode', () => {
      expect(formatAuditAction('update custom_widget', { mode: 'label' })).toBe('Memperbarui Custom Widget');
    });
  });
});
