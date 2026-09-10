import { describe, it, expect } from 'vitest';
import { mergeStoreCustomization } from '@/lib/templates/mergeCustomization';
import { DEFAULT_TEMPLATE_THEME, type TemplateConfig } from '@/schemas';

describe('mergeStoreCustomization', () => {
  const baseConfig: TemplateConfig = {
    schemaVersion: 1,
    theme: {
      ...DEFAULT_TEMPLATE_THEME,
      primaryColor: '#3b82f6',
      colors: {
        ...DEFAULT_TEMPLATE_THEME.colors,
        primary: '#3b82f6',
      },
    },
    sections: [
      {
        id: 'sec-header',
        type: 'header_announcement',
        layoutPreset: 'default_split',
        props: { logoText: 'Default Logo' },
        styles: {},
      },
      {
        id: 'sec-hero',
        type: 'hero',
        layoutPreset: 'split_left_text',
        props: { title: 'Selamat datang di toko kami' },
        styles: {},
      },
      {
        id: 'sec-catalog',
        type: 'product_catalog',
        layoutPreset: 'grid_standard',
        props: { title: 'Produk Kami' },
        styles: {},
      },
      {
        id: 'sec-maps',
        type: 'google_maps',
        layoutPreset: 'fullwidth_map',
        props: { address: '' },
        styles: {},
      },
      {
        id: 'sec-footer',
        type: 'footer',
        layoutPreset: 'multi_column',
        props: { brandName: '' },
        styles: {},
      },
    ],
  };

  it('should override theme primary color when specified in customization', () => {
    const customization = {
      theme: {
        primaryColor: '#e11d48',
        colors: {
          primary: '#e11d48',
        },
      },
    };

    const result = mergeStoreCustomization(baseConfig, customization);
    expect(result.theme?.primaryColor).toBe('#e11d48');
    expect(result.theme?.colors?.primary).toBe('#e11d48');
  });

  it('should inject store profile data into empty section props', () => {
    const storeData = {
      id: 'store-mami',
      name: 'Mami Toko',
      subdomain: 'mami-toko',
      address: 'Jl. Raya Pesanggaran No. 10',
      waNumber: '6281234567890',
      googleMapsEmbedUrl: 'https://maps.google.com/embed?q=pesanggaran',
      categoryName: 'Fashion & Retail',
    };

    const result = mergeStoreCustomization(baseConfig, {}, storeData);

    const hero = result.sections.find((s) => s.type === 'hero');
    expect(hero?.props?.title).toBe('Mami Toko');
    expect(hero?.props?.whatsappNumber).toBe('6281234567890');

    const maps = result.sections.find((s) => s.type === 'google_maps');
    expect(maps?.props?.address).toBe('Jl. Raya Pesanggaran No. 10');
    expect(maps?.props?.googleMapsUrl).toBe('https://maps.google.com/embed?q=pesanggaran');

    const footer = result.sections.find((s) => s.type === 'footer');
    expect(footer?.props?.brandName).toBe('Mami Toko');
    expect(footer?.props?.address).toBe('Jl. Raya Pesanggaran No. 10');
  });

  it('should support multi-branch in customization for google_maps', () => {
    const customization = {
      branches: [
        { name: 'Cabang Kota', address: 'Banyuwangi Kota', phone: '0811' },
        { name: 'Cabang Rogojampi', address: 'Rogojampi', phone: '0812' },
      ],
    };

    const result = mergeStoreCustomization(baseConfig, customization, { name: 'Mami Toko' });
    const maps = result.sections.find((s) => s.type === 'google_maps');
    expect(maps?.props?.branches).toHaveLength(2);
    expect(maps?.layoutPreset).toBe('multi_branch_tabs');
  });

  it('should merge section overrides by section id', () => {
    const customization = {
      sections: [
        {
          id: 'sec-hero',
          layoutPreset: 'full_banner_overlay',
          props: {
            title: 'Koleksi Batik Eksklusif',
            ctaText: 'Belanja Sekarang',
          },
        },
      ],
    };

    const result = mergeStoreCustomization(baseConfig, customization);
    const hero = result.sections.find((s) => s.id === 'sec-hero');
    expect(hero?.layoutPreset).toBe('full_banner_overlay');
    expect(hero?.props?.title).toBe('Koleksi Batik Eksklusif');
    expect(hero?.props?.ctaText).toBe('Belanja Sekarang');
  });

  it('should inject latitude and longitude into google_maps section props', () => {
    const storeData = {
      name: 'Warung Makan Mbak Jah',
      latitude: -8.2208381,
      longitude: 114.1587712,
      address: 'Songgon, Banyuwangi',
    };

    const result = mergeStoreCustomization(baseConfig, {}, storeData);
    const maps = result.sections.find((s) => s.type === 'google_maps');
    expect(maps?.props?.latitude).toBe(-8.2208381);
    expect(maps?.props?.longitude).toBe(114.1587712);
    expect(maps?.props?.address).toBe('Songgon, Banyuwangi');
  });
});
