import type {
  LogoVisualStyle,
  LogoConceptType,
  LogoLockupType,
  LogoFontFamily,
} from '@/lib/validators/ai-logo';

export interface LogoLockupOption {
  id: LogoLockupType;
  title: string;
  badge: string;
  description: string;
  specs: string;
}

export const LOGO_LOCKUP_OPTIONS: LogoLockupOption[] = [
  {
    id: 'icon_only',
    title: 'Simbol Murni (Tanpa Teks)',
    badge: 'Minimalis',
    description: 'Hanya lambang atau ikon visual mandiri tanpa tulisan huruf.',
    specs: 'Simbol mandiri di tengah dengan ruang lega dan seimbang.',
  },
  {
    id: 'vertical',
    title: 'Vertikal (Simbol di Atas)',
    badge: 'Proporsional',
    description: 'Simbol di atas dengan tulisan nama toko di bawahnya.',
    specs: 'Format tegak seimbang, sangat pas untuk stiker bulat & label kemasan.',
  },
  {
    id: 'horizontal',
    title: 'Horizontal (Simbol di Kiri)',
    badge: 'Header Toko',
    description: 'Simbol berdampingan rapi dengan nama toko di sebelah kanan.',
    specs: 'Format memanjang mendatar, ideal untuk header website & plang nama.',
  },
];

export interface LogoFontOption {
  id: LogoFontFamily;
  name: string;
  category: string;
  description: string;
}

export const LOGO_FONT_OPTIONS: LogoFontOption[] = [
  {
    id: 'Poppins',
    name: 'Poppins',
    category: 'Geometris Populer',
    description: 'Bentuk huruf bulat modern, ramah, dan sangat mudah dibaca.',
  },
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    category: 'Modern Elegan',
    description: 'Gaya modern bersih, seimbang, dan tampak profesional di era digital.',
  },
  {
    id: 'Space Grotesk',
    name: 'Space Grotesk',
    category: 'Tegas & Modern',
    description: 'Bentuk tegas berkarakter kuat, cocok untuk usaha masa kini.',
  },
  {
    id: 'Fraunces',
    name: 'Fraunces',
    category: 'Klasik Hangat',
    description: 'Huruf klasik berkesan hangat, cocok untuk kopi, kuliner, dan produk kriya.',
  },
  {
    id: 'Outfit',
    name: 'Outfit',
    category: 'Halus & Ramah',
    description: 'Lengkungan huruf lembut dan bersahabat, sangat pas untuk produk makanan.',
  },
  {
    id: 'Playfair Display',
    name: 'Playfair Display',
    category: 'Mewah & Anggun',
    description: 'Tampilan anggun dan berkelas, memberi kesan produk premium bermutu tinggi.',
  },
];

export interface LogoConceptOption {
  id: LogoConceptType;
  title: string;
  badge: string;
  description: string;
  example: string;
}

export const LOGO_CONCEPT_OPTIONS: LogoConceptOption[] = [
  {
    id: 'letter_fusion',
    title: 'Inisial + Objek (Letter Fusion)',
    badge: 'Cerdas',
    description: 'Inisial huruf merek berpadu cerdas dengan objek bisnis di ruang negatif.',
    example: 'Huruf H menyatu dengan kursi, T dengan buku',
  },
  {
    id: 'animal_character',
    title: 'Siluet Karakter / Hewan',
    badge: 'Ikonik',
    description: 'Siluet hewan atau karakter dari bidang datar geometris tegas tanpa garis kartun rumit.',
    example: 'Burung siluet roti, profil kucing/anjing geometris',
  },
  {
    id: 'pictorial_symbol',
    title: 'Simbol Objek Ikonik',
    badge: 'Populer',
    description: 'Penyederhanaan satu objek utama bisnis menjadi simbol vektor datar berkarakter kuat.',
    example: 'Cangkir kopi arsitektural, potongan jeruk geometris',
  },
  {
    id: 'abstract_mark',
    title: 'Glif Geometris Modern',
    badge: 'Minimalis',
    description: 'Bentuk geometris murni dengan ruang negatif seimbang mencerminkan esensi bisnis.',
    example: 'Busur lengkung berirama, heksagon modular',
  },
];

export interface BusinessCategoryOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const BUSINESS_CATEGORY_OPTIONS: BusinessCategoryOption[] = [
  { id: 'kuliner_makanan', name: 'Kuliner & Makanan', description: 'Resto, rumah makan, warung', icon: 'utensils' },
  { id: 'kedai_kopi', name: 'Kedai Kopi & Minuman', description: 'Coffee shop, kafe, teh, jus', icon: 'coffee' },
  { id: 'bakery_kue', name: 'Bakery & Kue', description: 'Roti, pastry, cake, cookies', icon: 'cake' },
  { id: 'fashion_busana', name: 'Fashion & Pakaian', description: 'Busana, butik, hijab, distro', icon: 'shirt' },
  { id: 'kerajinan', name: 'Kerajinan & Kriya', description: 'Handicraft, tenun, batik, dekorasi', icon: 'palette' },
  { id: 'jasa_profesional', name: 'Jasa & Layanan', description: 'Salon, laundry, bengkel, agensi', icon: 'briefcase' },
  { id: 'retail_kelontong', name: 'Retail & Kelontong', description: 'Minimarket, sembako, multi-produk', icon: 'store' },
];

export interface LogoStyleOption {
  id: LogoVisualStyle;
  title: string;
  badge: string;
  description: string;
  previewNote: string;
}

export const LOGO_STYLE_OPTIONS: LogoStyleOption[] = [
  {
    id: 'minimalis',
    title: 'Minimalis Geometris',
    badge: 'Populer',
    description: 'Bentuk geometris bersih, ruang negatif tajam, dan kontras tinggi.',
    previewNote: 'Mudah dikenali di favicon & avatar',
  },
  {
    id: 'tradisional',
    title: 'Neo-Heritage Nusantara',
    badge: 'Budaya Lokal',
    description: 'Garis modern yang terinspirasi motif batik, tenun, dan kriya nusantara.',
    previewNote: 'Identitas autentik Indonesia',
  },
  {
    id: 'maskot',
    title: 'Siluet Maskot',
    badge: 'Karakter',
    description: 'Siluet karakter kokoh dan tegas tanpa garis mikro kartun yang rumit.',
    previewNote: 'Ramah dan berkarakter kuat',
  },
  {
    id: 'tipografi',
    title: 'Monogram & Tipografi',
    badge: 'Elegan',
    description: 'Inisial toko geometris dengan proporsi arsitektural yang berwibawa.',
    previewNote: 'Profesional & timeless',
  },
];

export interface ColorPalettePreset {
  id: string;
  name: string;
  colors: string[];
}

export const PRESET_COLOR_PALETTES: ColorPalettePreset[] = [
  {
    id: 'terracotta',
    name: 'Terracotta Hangat',
    colors: ['#C85A32', '#F7F4EE', '#2A2A2A'],
  },
  {
    id: 'espresso',
    name: 'Espresso Heritage',
    colors: ['#4A2E1B', '#D4B996', '#F7F4EE'],
  },
  {
    id: 'forest',
    name: 'Forest Botanical',
    colors: ['#2D5A27', '#8FBC8F', '#FFFFFF'],
  },
  {
    id: 'navy',
    name: 'Modern Royal Navy',
    colors: ['#1B365D', '#E2E8F0', '#D4AF37'],
  },
  {
    id: 'monochrome',
    name: 'Monokrom Stamp',
    colors: ['#000000', '#FFFFFF'],
  },
];
