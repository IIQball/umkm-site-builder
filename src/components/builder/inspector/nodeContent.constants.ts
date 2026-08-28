export const getNodeLabel = (id: string): string => {
  switch (id) {
    case 'badge': return 'Promo Badge';
    case 'title': return 'Heading Title';
    case 'subtitle': return 'Subtitle Description';
    case 'image': return 'Banner Image';
    case 'cta': return 'CTA Button';
    case 'announcement': return 'Announcement Bar';
    case 'logo': return 'Logo & Brand';
    case 'nav_links': return 'Navigation Menu';
    default: return id;
  }
};

export const nodeTextColorOptions = [
  { value: '', label: 'Default (Tema)' },
  { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
  { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
  { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
  { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  { value: '#ffffff', label: 'Putih Bersih (White)' },
];

export const nodeBgColorOptions = [
  { value: 'transparent', label: 'Transparan' },
  { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
  { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
  { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
  { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
];

export const nodeMarginOptions = [
  { value: '0px', label: '0px (Tanpa Jarak)' },
  { value: '8px', label: '8px (Ketat)' },
  { value: '16px', label: '16px (Normal)' },
  { value: '24px', label: '24px (Renggang)' },
  { value: '32px', label: '32px (Lebar)' },
  { value: '48px', label: '48px (Sangat Lebar)' },
];

export const btnVariantOptions = [
  { value: 'primary', label: 'Primary Brand (Solid)' },
  { value: 'secondary', label: 'Secondary Brand (Solid)' },
  { value: 'outline', label: 'Outline (Garis Tepi)' },
];

export const btnHeightOptions = [
  { value: '32px', label: '32px (Compact)' },
  { value: '40px', label: '40px (Normal)' },
  { value: '48px', label: '48px (Large)' },
  { value: '56px', label: '56px (Jumbo)' },
];
