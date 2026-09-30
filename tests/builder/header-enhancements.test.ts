import { describe, it, expect } from 'vitest';
import {
  stripEmoji,
  DELIVERY_ICON_OPTIONS,
  BADGE_BPOM_ICON_OPTIONS,
  BADGE_HALAL_ICON_OPTIONS,
  PROMO_ICON_OPTIONS,
} from '@/components/builder/sections/header/headerIcons';
import { resolveSectionAnchor } from '@/components/builder/sections/header/headerNav.helpers';
import {
  sanitizeSearchInput,
  filterCatalogProducts,
  type SearchProduct,
} from '@/components/builder/sections/header/headerSearch.helpers';

describe('Header Icons & Emoji Stripping', () => {
  it('should strip emojis and checkmarks correctly', () => {
    expect(stripEmoji('⚡ FLASH SALE')).toBe('FLASH SALE');
    expect(stripEmoji('🛵 Siap Kirim Instan: Estimasi 30 Menit')).toBe('Siap Kirim Instan: Estimasi 30 Menit');
    expect(stripEmoji('✓ BPOM')).toBe('BPOM');
    expect(stripEmoji('✔ Halal MUI')).toBe('Halal MUI');
    expect(stripEmoji('Toko Kopi')).toBe('Toko Kopi');
  });

  it('should provide at least 5 searchable options with valid values and labels', () => {
    expect(DELIVERY_ICON_OPTIONS.length).toBeGreaterThanOrEqual(5);
    expect(BADGE_BPOM_ICON_OPTIONS.length).toBeGreaterThanOrEqual(5);
    expect(BADGE_HALAL_ICON_OPTIONS.length).toBeGreaterThanOrEqual(5);
    expect(PROMO_ICON_OPTIONS.length).toBeGreaterThanOrEqual(5);

    DELIVERY_ICON_OPTIONS.forEach((opt) => {
      expect(opt.value).toBeDefined();
      expect(opt.label).toBeDefined();
    });
  });
});

describe('Header Navigation Helpers', () => {
  it('should map nav titles and hash links to standard backend section types', () => {
    expect(resolveSectionAnchor('Beranda')).toEqual({ anchor: 'beranda', sectionType: 'hero' });
    expect(resolveSectionAnchor('#produk')).toEqual({ anchor: 'produk', sectionType: 'product_catalog' });
    expect(resolveSectionAnchor('katalog')).toEqual({ anchor: 'produk', sectionType: 'product_catalog' });
    expect(resolveSectionAnchor('Tentang')).toEqual({ anchor: 'tentang', sectionType: 'features' });
    expect(resolveSectionAnchor('Ulasan')).toEqual({ anchor: 'ulasan', sectionType: 'testimonials' });
    expect(resolveSectionAnchor('FAQ')).toEqual({ anchor: 'faq', sectionType: 'faq' });
    expect(resolveSectionAnchor('Lokasi')).toEqual({ anchor: 'lokasi', sectionType: 'google_maps' });
    expect(resolveSectionAnchor('Kontak')).toEqual({ anchor: 'kontak', sectionType: 'footer' });
  });

  it('should handle custom slugs gracefully', () => {
    const res = resolveSectionAnchor('Custom Section');
    expect(res.anchor).toBe('custom-section');
  });
});

describe('Header Search Security & Lazy Filtering', () => {
  it('should detect and sanitize SQL injection patterns', () => {
    const sqli1 = sanitizeSearchInput("' OR '1'='1");
    expect(sqli1.hasThreat).toBe(true);

    const sqli2 = sanitizeSearchInput('UNION SELECT * FROM users--');
    expect(sqli2.hasThreat).toBe(true);

    const sqli3 = sanitizeSearchInput('DROP TABLE stores;');
    expect(sqli3.hasThreat).toBe(true);
  });

  it('should detect and sanitize XSS scripts', () => {
    const xss = sanitizeSearchInput('<script>alert("hacked")</script>');
    expect(xss.hasThreat).toBe(true);
    expect(xss.cleanQuery).not.toContain('<script>');
  });

  it('should allow valid search queries', () => {
    const safe = sanitizeSearchInput('Kopi Robusta Aceh');
    expect(safe.isValid).toBe(true);
    expect(safe.hasThreat).toBe(false);
    expect(safe.cleanQuery).toBe('Kopi Robusta Aceh');
  });

  it('should filter catalog products accurately', () => {
    const mockProducts: SearchProduct[] = [
      { name: 'Kopi Robusta Premium', price: 45000, category: 'Minuman' },
      { name: 'Keripik Tempe Renyah', price: 18000, category: 'Snack' },
      { name: 'Batik Tulis Handmade', price: 150000, category: 'Fashion' },
    ];

    expect(filterCatalogProducts(mockProducts, '')).toEqual([]);
    expect(filterCatalogProducts(mockProducts, 'kopi')).toHaveLength(1);
    expect(filterCatalogProducts(mockProducts, 'snack')).toHaveLength(1);
    expect(filterCatalogProducts(mockProducts, 'xyznotfound')).toHaveLength(0);
  });
});

describe('Header Layout Presets & Design System Helpers', () => {
  it('should identify row support accurately for all presets', async () => {
    const {
      headerHasRowOrder,
      getDefaultHeaderRowOrder,
      getDefaultHeaderNavbarOrder,
      headerSupportsCta,
      getHeaderSupportedSlots,
      getHeaderRowSlotLabel,
      getHeaderNavbarSlotLabel,
    } = await import('@/components/builder/sections/header/headerLayout.helpers');

    expect(headerHasRowOrder('default_split')).toBe(true);
    expect(headerHasRowOrder('compact_inline')).toBe(false);
    expect(headerHasRowOrder('floating_pill_island')).toBe(false);
    expect(headerHasRowOrder('top_contact_bar')).toBe(true);

    expect(getDefaultHeaderRowOrder('default_split')).toEqual(['announcement_bar', 'navbar']);
    expect(getDefaultHeaderRowOrder('compact_inline')).toEqual([]);

    expect(getDefaultHeaderNavbarOrder('centered_stacked')).toEqual(['logo', 'nav_links']);
    expect(getDefaultHeaderNavbarOrder('command_search_bar')).toEqual(['logo', 'search_bar', 'cta']);
    expect(getDefaultHeaderNavbarOrder('store_badge_highlight')).toEqual(['logo', 'store_badges', 'nav_links', 'cta']);

    expect(headerSupportsCta('default_split')).toBe(true);
    expect(headerSupportsCta('centered_stacked')).toBe(false);

    expect(getHeaderRowSlotLabel('announcement_bar', 'top_contact_bar')).toBe('Bar Kontak & Jam Buka');
    expect(getHeaderRowSlotLabel('announcement_bar', 'delivery_order_cta')).toBe('Bar Layanan Pesan Antar');
    expect(getHeaderRowSlotLabel('announcement_bar', 'promo_countdown_banner')).toBe('Bar Hitung Mundur Promo');
    expect(getHeaderRowSlotLabel('announcement_bar', 'default_split')).toBe('Bar Pengumuman Promo');

    expect(getHeaderNavbarSlotLabel('logo')).toBe('Logo & Brand Toko');
    expect(getHeaderNavbarSlotLabel('nav_links')).toBe('Menu Navigasi Toko');
    expect(getHeaderNavbarSlotLabel('cta')).toBe('Tombol Pesan WhatsApp (CTA)');

    const supported = getHeaderSupportedSlots('default_split');
    expect(supported.map((s) => s.id)).toEqual(['announcement', 'logo', 'nav_links', 'cta']);
    expect(supported.map((s) => s.name)).toEqual([
      'Bar Pengumuman Promo',
      'Logo & Brand Toko',
      'Menu Navigasi Toko',
      'Tombol Pesan WhatsApp (CTA)',
    ]);
  });
});

