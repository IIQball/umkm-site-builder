import { describe, it, expect } from 'vitest';
import {
  TemplateConfigSchema,
  TemplateDraftCreateSchema,
  TemplateDraftSubmitSchema,
  DEFAULT_TEMPLATE_SECTIONS,
} from '@/schemas/template.schema';

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
});

