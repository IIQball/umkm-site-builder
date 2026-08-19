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
});
