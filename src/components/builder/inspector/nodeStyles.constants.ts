export const fontFamilies = [
  { label: 'Default (Inter)', value: 'Inter, sans-serif' },
  { label: 'Poppins (Modern)', value: 'Poppins, sans-serif' },
  { label: 'Roboto (Clean)', value: 'Roboto, sans-serif' },
  { label: 'Playfair Display (Serif/Elegant)', value: "'Playfair Display', serif" },
  { label: 'Montserrat (Bold)', value: 'Montserrat, sans-serif' },
];

export const fontSizes = [
  { label: 'Extra Small (12px)', value: '12px' },
  { label: 'Small (14px)', value: '14px' },
  { label: 'Base (16px)', value: '16px' },
  { label: 'Large (18px)', value: '18px' },
  { label: 'XL (20px)', value: '20px' },
  { label: '2XL (24px)', value: '24px' },
  { label: '3XL (30px)', value: '30px' },
  { label: '4XL (36px)', value: '36px' },
  { label: '5XL (48px)', value: '48px' },
];

export const fontWeights = [
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra Bold (800)', value: '800' },
];

export const radiusPresets = [
  { label: 'Kotak (0px)', value: '0px' },
  { label: 'Sedikit (6px)', value: '6px' },
  { label: 'Sedang (12px)', value: '12px' },
  { label: 'Bulat (24px)', value: '24px' },
  { label: 'Pill (9999px)', value: '9999px' },
];

export const buttonPaddings = [
  { label: 'Kompak', value: '8px 16px' },
  { label: 'Normal', value: '12px 24px' },
  { label: 'Besar', value: '16px 32px' },
];

export const shadowPresets = [
  { label: 'Tanpa Shadow', value: 'none' },
  { label: 'Soft Shadow', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  { label: 'Glow Blue', value: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' },
  { label: 'Deep Shadow', value: '0 20px 25px -5px rgb(0 0 0 / 0.2)' },
];

export const nodeAnimationOptions = [
  { value: '', label: 'Tanpa Animasi' },
  { value: 'fadeIn', label: 'Fade In (Halus)' },
  { value: 'slideUp', label: 'Slide Up (Muncul dari Bawah)' },
  { value: 'slideLeft', label: 'Slide In Left (Dari Kanan)' },
  { value: 'slideRight', label: 'Slide In Right (Dari Kiri)' },
  { value: 'zoomIn', label: 'Zoom In (Membesar)' },
];

export const hoverOptions = [
  { value: '', label: 'None' },
  { value: 'scale', label: 'Scale Up (1.05x)' },
  { value: 'lift', label: 'Lift Up (-4px)' },
  { value: 'glow', label: 'Glow Shadow' },
];
