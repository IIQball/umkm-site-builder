import { describe, it, expect } from 'vitest';
import {
  TemplateConfigSchema,
  TemplateDraftCreateSchema,
  TemplateDraftSubmitSchema,
  DEFAULT_TEMPLATE_SECTIONS,
} from '@/schemas';

describe('Template Schemas', () => {
  it('should validate DEFAULT_TEMPLATE_SECTIONS against TemplateConfigSchema', () => {
    const config = {
      theme: {
        primaryColor: '#3b82f6',
        fontFamily: 'sans-serif',
      },
      sections: DEFAULT_TEMPLATE_SECTIONS,
    };

    const parsed = TemplateConfigSchema.safeParse(config);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.sections).toHaveLength(7);
      expect(parsed.data.sections.map((s) => s.type)).toEqual([
        'header_announcement',
        'hero',
        'features',
        'product_catalog',
        'testimonials',
        'faq',
        'footer',
      ]);
    }
  });

  it('should validate draft create schema', () => {
    const validDraft = {
      name: 'Template Batik Modern',
      price: 150000,
      description: 'Template elegan untuk UMKM busana',
    };

    const parsed = TemplateDraftCreateSchema.safeParse(validDraft);
    expect(parsed.success).toBe(true);
  });

  it('should validate draft submit schema with 7 sections', () => {
    const submitPayload = {
      name: 'Template Warung Kopi',
      price: 99000,
      config: {
        theme: {
          primaryColor: '#854d0e',
        },
        sections: DEFAULT_TEMPLATE_SECTIONS,
      },
    };

    const parsed = TemplateDraftSubmitSchema.safeParse(submitPayload);
    expect(parsed.success).toBe(true);
  });

  it('should validate product_catalog with full custom grid, card presets, aspect ratio, and cta styles', () => {
    const customConfig = {
      theme: {
        primaryColor: '#059669',
      },
      sections: [
        {
          id: 'catalog-section',
          type: 'product_catalog',
          props: {
            title: 'Katalog Unggulan Toko',
            subtitle: 'Koleksi produk terlaris minggu ini',
            columnsDesktop: 4,
            columnsTablet: 2,
            columnsMobile: 2,
            gridGap: 'compact',
            cardPreset: 'elevated_shadow',
            cardRadius: 'smooth',
            imageAspectRatio: 'square',
            badgePosition: 'top_left',
            badgeColor: 'emerald',
            productNameSize: 'base',
            productNameWeight: 'bold',
            pricePlacement: 'inline',
            ctaButtonWidth: 'compact',
            ctaButtonColor: '#059669',
            ctaButtonRadius: 'pill',
            showWhatsAppIcon: true,
            products: [
              {
                name: 'Kopi Arabika 250g',
                price: 75000,
                badge: 'Best Seller',
                imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
              },
            ],
          },
          styles: {
            backgroundColor: '#ffffff',
            padding: '64px 32px',
            columnsDesktop: 4,
            cardPreset: 'elevated_shadow',
            cardRadius: 'smooth',
            imageAspectRatio: 'square',
          },
        },
      ],
    };

    const parsed = TemplateConfigSchema.safeParse(customConfig);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const catSection = parsed.data.sections[0];
      expect(catSection.type).toBe('product_catalog');
      expect(catSection.props?.columnsDesktop).toBe(4);
      expect(catSection.props?.cardPreset).toBe('elevated_shadow');
      expect(catSection.props?.imageAspectRatio).toBe('square');
      expect(catSection.styles?.cardPreset).toBe('elevated_shadow');
    }
  });

  it('should validate header_announcement with full 3-element custom configuration', () => {
    const customConfig = {
      theme: {
        primaryColor: '#2563eb',
      },
      sections: [
        {
          id: 'header-1',
          type: 'header_announcement',
          props: {
            showAnnouncement: true,
            announcementText: 'Gratis Ongkir Se-Indonesia',
            announcementAlign: 'center',
            announcementBgColor: '#1e40af',
            announcementTextColor: '#ffffff',
            announcementPaddingY: '10px',
            logoType: 'image_text',
            logoText: 'Batik Lestari',
            logoImageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9',
            logoImageHeight: 48,
            logoTextSize: 'xl',
            logoTextWeight: 'bold',
            logoTextColor: '#1e293b',
            navLinks: ['Beranda', 'Katalog', 'Promo', 'Kontak'],
            navGap: 'relaxed',
            navFontSize: '16px',
            navFontWeight: '600',
            navTextTransform: 'uppercase',
            navColor: '#334155',
            navHoverColor: '#2563eb',
            ctaText: 'Hubungi Kami',
            ctaLink: '#contact',
          },
          styles: {
            backgroundColor: '#ffffff',
            padding: '0px',
          },
        },
      ],
    };

    const parsed = TemplateConfigSchema.safeParse(customConfig);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const headerSection = parsed.data.sections[0];
      expect(headerSection.type).toBe('header_announcement');
      expect(headerSection.props?.showAnnouncement).toBe(true);
      expect(headerSection.props?.logoType).toBe('image_text');
      expect(headerSection.props?.logoImageHeight).toBe(48);
      expect(headerSection.props?.navGap).toBe('relaxed');
      expect(headerSection.props?.navTextTransform).toBe('uppercase');
    }
  });

  it('should validate full global design system theme configuration', () => {
    const fullThemeConfig = {
      theme: {
        colors: {
          primary: '#4f46e5',
          secondary: '#64748b',
          background: '#ffffff',
          surface: '#f8fafc',
          textPrimary: '#0f172a',
          textMuted: '#64748b',
        },
        typography: {
          headingFont: 'Playfair Display, serif',
          bodyFont: 'Inter, sans-serif',
          h1: { fontSize: '40px', lineHeight: '1.2', fontWeight: '800' },
          h2: { fontSize: '30px', lineHeight: '1.25', fontWeight: '700' },
          h3: { fontSize: '24px', lineHeight: '1.3', fontWeight: '600' },
          body: { fontSize: '16px', lineHeight: '1.6', fontWeight: '400' },
          caption: { fontSize: '13px', lineHeight: '1.5', fontWeight: '400' },
        },
        buttons: {
          borderRadius: '16px',
          primary: {
            backgroundColor: '#4f46e5',
            textColor: '#ffffff',
            hoverBg: '#4338ca',
          },
          secondary: {
            backgroundColor: '#f1f5f9',
            textColor: '#0f172a',
          },
          outline: {
            borderColor: '#4f46e5',
            textColor: '#4f46e5',
          },
        },
        layout: {
          maxWidth: '1280px',
          horizontalMarginDesktop: '32px',
          horizontalMarginTablet: '24px',
          horizontalMarginMobile: '16px',
        },
      },
      sections: DEFAULT_TEMPLATE_SECTIONS,
    };

    const parsed = TemplateConfigSchema.safeParse(fullThemeConfig);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.theme?.colors?.primary).toBe('#4f46e5');
      expect(parsed.data.theme?.typography?.headingFont).toBe('Playfair Display, serif');
      expect(parsed.data.theme?.buttons?.borderRadius).toBe('16px');
      expect(parsed.data.theme?.layout?.maxWidth).toBe('1280px');
    }
  });
});

