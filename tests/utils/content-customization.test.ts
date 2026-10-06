import { describe, it, expect } from 'vitest';
import {
  createDefaultContentCustomization,
  buildTemplateCustomizationPayload,
  extractContentCustomizationFromStore,
} from '../../src/components/onboarding/wizard/content/contentCustomization.helpers';
import { mergeStoreCustomization } from '../../src/lib/templates/mergeCustomization';
import type { TemplateConfig } from '../../src/schemas';
import { DEFAULT_TEMPLATE_THEME, DEFAULT_TEMPLATE_SECTIONS } from '../../src/schemas';

describe('Onboarding Content Customization Helpers', () => {
  it('creates default customization with personalized storeName, categoryName and address', () => {
    const custom = createDefaultContentCustomization('Kopi Nusantara', 'Minuman', 'Jl. Ijen No. 10');
    expect(custom.header.logoText).toBe('Kopi Nusantara');
    expect(custom.hero.title).toBe('Kopi Nusantara');
    expect(custom.hero.subtitle).toContain('Minuman');
    expect(custom.footer.brandName).toBe('Kopi Nusantara');
    expect(custom.footer.address).toBe('Jl. Ijen No. 10');
    expect(custom.features.items.length).toBe(3);
    expect(custom.faq.faqs.length).toBe(3);
  });

  it('builds comprehensive payload ensuring all section props are populated', () => {
    const custom = createDefaultContentCustomization('Batik Osing', 'Fashion', 'Jl. Gajah Mada 5');
    custom.theme.primaryColor = '#10b981';
    custom.theme.typography.headingFont = 'Outfit';
    custom.theme.typography.bodyFont = 'Open Sans';
    custom.header.announcementText = 'Diskon 50% Grand Opening';
    custom.hero.ctaText = 'Belanja Batik';
    custom.hero.badgeText = 'Eksklusif 2026';
    custom.features.heading = 'Keunggulan Kain Kami';
    custom.features.subheading = 'Pewarna alami dari daun indigo';
    custom.faq.heading = 'FAQ Batik';
    custom.faq.subheading = 'Pertanyaan seputar perawatan batik';
    custom.footer.tagline = 'Melestarikan warisan leluhur';

    const payload = buildTemplateCustomizationPayload(custom) as {
      theme: {
        primaryColor: string;
        typography: { headingFont: string; bodyFont: string };
      };
      sections: Array<{
        type: string;
        props: {
          logoText?: string;
          announcementText?: string;
          showAnnouncement?: boolean;
          title?: string;
          heading?: string;
          subheading?: string;
          subtitle?: string;
          ctaText?: string;
          badgeText?: string;
          items?: unknown[];
          faqs?: unknown[];
          tagline?: string;
          brandName?: string;
          address?: string;
        };
      }>;
    };

    expect(payload.theme.primaryColor).toBe('#10b981');
    expect(payload.theme.typography.headingFont).toBe('Outfit');
    expect(payload.theme.typography.bodyFont).toBe('Open Sans');

    const header = payload.sections.find((s) => s.type === 'header_announcement');
    expect(header).toBeDefined();
    expect(header?.props.logoText).toBe('Batik Osing');
    expect(header?.props.announcementText).toBe('Diskon 50% Grand Opening');
    expect(header?.props.showAnnouncement).toBe(true);

    const hero = payload.sections.find((s) => s.type === 'hero');
    expect(hero).toBeDefined();
    expect(hero?.props.title).toBe('Batik Osing');
    expect(hero?.props.ctaText).toBe('Belanja Batik');
    expect(hero?.props.badgeText).toBe('Eksklusif 2026');

    const features = payload.sections.find((s) => s.type === 'features');
    expect(features).toBeDefined();
    expect(features?.props.title).toBe('Keunggulan Kain Kami');
    expect(features?.props.heading).toBe('Keunggulan Kain Kami');
    expect(features?.props.subtitle).toBe('Pewarna alami dari daun indigo');
    expect(features?.props.subheading).toBe('Pewarna alami dari daun indigo');
    expect(features?.props.items?.length).toBe(3);

    const faq = payload.sections.find((s) => s.type === 'faq');
    expect(faq).toBeDefined();
    expect(faq?.props.title).toBe('FAQ Batik');
    expect(faq?.props.heading).toBe('FAQ Batik');
    expect(faq?.props.subtitle).toBe('Pertanyaan seputar perawatan batik');
    expect(faq?.props.subheading).toBe('Pertanyaan seputar perawatan batik');
    expect(faq?.props.faqs?.length).toBe(3);

    const footer = payload.sections.find((s) => s.type === 'footer');
    expect(footer).toBeDefined();
    expect(footer?.props.brandName).toBe('Batik Osing');
    expect(footer?.props.tagline).toBe('Melestarikan warisan leluhur');
    expect(footer?.props.address).toBe('Jl. Gajah Mada 5');
  });

  it('extracts customization accurately from store object', () => {
    const rawCustom = {
      theme: {
        primaryColor: '#f43f5e',
        typography: {
          headingFont: 'Montserrat',
          bodyFont: 'Roboto',
        },
      },
      sections: [
        {
          type: 'features',
          props: {
            title: 'Fitur Terbaik',
            subtitle: 'Subjudul Fitur',
            items: [{ icon: 'Star', title: 'Bintang', description: 'Deskripsi' }],
          },
        },
        {
          type: 'faq',
          props: {
            heading: 'Pertanyaan Umum',
            subheading: 'Jawaban Praktis',
            faqs: [{ question: 'Tanya?', answer: 'Jawab.' }],
          },
        },
      ],
    };

    const extracted = extractContentCustomizationFromStore(rawCustom, 'Toko Bunga', 'Tanaman', 'Jl. Mawar 3');
    expect(extracted.theme.primaryColor).toBe('#f43f5e');
    expect(extracted.theme.typography.headingFont).toBe('Montserrat');
    expect(extracted.theme.typography.bodyFont).toBe('Roboto');
    expect(extracted.features.heading).toBe('Fitur Terbaik');
    expect(extracted.features.subheading).toBe('Subjudul Fitur');
    expect(extracted.features.items.length).toBe(1);
    expect(extracted.faq.heading).toBe('Pertanyaan Umum');
    expect(extracted.faq.subheading).toBe('Jawaban Praktis');
    expect(extracted.faq.faqs.length).toBe(1);
    expect(extracted.footer.address).toBe('Jl. Mawar 3');
  });

  it('successfully merges onboarding customization into template config for storefront rendering', () => {
    const baseConfig: TemplateConfig = {
      schemaVersion: 1,
      theme: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_THEME)),
      sections: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_SECTIONS)),
    };

    const custom = createDefaultContentCustomization('Sari Laut Banyuwangi', 'Restoran', 'Pantai Boom');
    custom.theme.primaryColor = '#0ea5e9';
    custom.features.heading = 'Kenapa Makan di Sini?';
    custom.features.subheading = 'Ikan segar langsung dari nelayan lokal.';
    custom.faq.heading = 'FAQ Restoran';
    custom.faq.subheading = 'Informasi reservasi dan menu.';
    custom.header.announcementText = 'Promo Makan Siang Hemat!';

    const payload = buildTemplateCustomizationPayload(custom);
    const merged = mergeStoreCustomization(baseConfig, payload, {
      name: 'Sari Laut Banyuwangi',
      address: 'Pantai Boom',
      waNumber: '6281234567890',
    });

    expect(merged.theme?.primaryColor).toBe('#0ea5e9');
    expect(merged.theme?.colors?.primary).toBe('#0ea5e9');

    const mergedHeader = merged.sections.find((s) => s.type === 'header_announcement');
    expect(mergedHeader?.props?.announcementText).toBe('Promo Makan Siang Hemat!');
    expect(mergedHeader?.props?.logoText).toBe('Sari Laut Banyuwangi');

    const mergedFeatures = merged.sections.find((s) => s.type === 'features');
    expect(mergedFeatures?.props?.title).toBe('Kenapa Makan di Sini?');
    expect(mergedFeatures?.props?.heading).toBe('Kenapa Makan di Sini?');
    expect(mergedFeatures?.props?.subtitle).toBe('Ikan segar langsung dari nelayan lokal.');

    const mergedFaq = merged.sections.find((s) => s.type === 'faq');
    expect(mergedFaq?.props?.title).toBe('FAQ Restoran');
    expect(mergedFaq?.props?.subtitle).toBe('Informasi reservasi dan menu.');

    const mergedFooter = merged.sections.find((s) => s.type === 'footer');
    expect(mergedFooter?.props?.brandName).toBe('Sari Laut Banyuwangi');
    expect(mergedFooter?.props?.address).toBe('Pantai Boom');
  });
});
