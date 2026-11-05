import type {
  PosterSizeRatio,
  PosterStyle,
} from '@/lib/validators/ai-poster';

export interface PosterRatioOption {
  id: PosterSizeRatio;
  label: string;
  badge: string;
  description: string;
  dimensionLabel: string;
  aspectClass: string;
}

export const POSTER_RATIO_OPTIONS: PosterRatioOption[] = [
  {
    id: '1:1',
    label: 'Persegi (1:1)',
    badge: 'Instagram Feed',
    description: 'Format simetris seimbang untuk postingan feed media sosial dan marketplace.',
    dimensionLabel: '1024 x 1024 px',
    aspectClass: 'aspect-square',
  },
  {
    id: '2:3',
    label: 'Vertikal (2:3)',
    badge: 'Story & Status WA',
    description: 'Format vertikal jangkauan tinggi untuk WhatsApp status, IG stories, dan banner promosi.',
    dimensionLabel: '1024 x 1536 px',
    aspectClass: 'aspect-[2/3]',
  },
];

export interface PosterStyleOption {
  id: PosterStyle;
  title: string;
  badge: string;
  description: string;
  fontPairing: string;
  previewColor: string;
  lightingNote: string;
}

export const POSTER_STYLE_OPTIONS: PosterStyleOption[] = [
  {
    id: 'vietnam_editorial',
    title: 'Kafe Butik Hangat',
    badge: 'Editorial Hangat',
    description: 'Latar kain linen hangat dengan pencahayaan alami jendela siang hari dan tata letak majalah kuliner modern.',
    fontPairing: 'Fraunces + Plus Jakarta Sans',
    previewColor: '#EDE8DF',
    lightingNote: 'Cahaya alami jendela siang hari',
  },
  {
    id: 'thai_commercial',
    title: 'Pop Kuliner Berani',
    badge: 'Bold & Pop',
    description: 'Kombinasi warna kontras berani dengan susunan dinamis penuh energi kuliner populer.',
    fontPairing: 'Kanit + DM Sans',
    previewColor: '#FF6B35',
    lightingNote: 'Pencahayaan studio kontras tinggi',
  },
  {
    id: 'neo_brutalism',
    title: 'Urban Modern Bergaris',
    badge: 'Tren Desain',
    description: 'Bingkai kotak garis tegas dengan bayangan tebal solid dan perpaduan warna pastel ceria.',
    fontPairing: 'Space Grotesk + IBM Plex Mono',
    previewColor: '#FDE047',
    lightingNote: 'Pencahayaan grafis tanpa bayangan buram',
  },
  {
    id: 'swiss_grid',
    title: 'Katalog Bersih & Rapi',
    badge: 'Katalog Bersih',
    description: 'Susunan kolom rapi teratur dengan judul tegas di atas dan tata letak sangat lega.',
    fontPairing: 'Plus Jakarta Sans Bold + Regular',
    previewColor: '#F8FAFC',
    lightingNote: 'Pencahayaan studio lembut merata',
  },
  {
    id: 'japanese_muji',
    title: 'Minimalis Zen Natural',
    badge: 'Muji Zen',
    description: 'Gaya zen minimalis dengan ruang kosong lega, cahaya pagi lembut, dan warna bumi alami.',
    fontPairing: 'Cormorant Garamond + Noto Sans',
    previewColor: '#F4F1EA',
    lightingNote: 'Cahaya pagi hari lembut & tenang',
  },
  {
    id: 'kopitiam_retro',
    title: 'Nusantara Klasik Antik',
    badge: 'Klasik Otentik',
    description: 'Bingkai garis klasik elegan dengan nuansa warna nostalgia tempo dulu di atas kertas krem antik.',
    fontPairing: 'Playfair Display + Work Sans',
    previewColor: '#F7F0E4',
    lightingNote: 'Cahaya hangat sore hari bernuansa klasik',
  },
  {
    id: 'korean_pastel',
    title: 'Kafe Estetik Pastel',
    badge: 'Pastel Cafe',
    description: 'Nuansa cerah terang kafe estetik dengan bayangan tirai jendela lembut dan warna pastel manis.',
    fontPairing: 'Outfit + Lora',
    previewColor: '#FEF08A',
    lightingNote: 'Cahaya terang lembut & bayangan tirai',
  },
  {
    id: 'dark_luxury',
    title: 'Studio Gelap Elegan',
    badge: 'Premium Mewah',
    description: 'Latar gelap arang elegan dengan sorotan tepi tajam dan nuansa tipografi emas sampanye berkelas.',
    fontPairing: 'Bodoni Moda + Manrope',
    previewColor: '#18181B',
    lightingNote: 'Sorotan lampu tepi fokus & berkelas',
  },
  {
    id: 'tropical_podium',
    title: 'Podium Tropis Alami',
    badge: 'Organik Tropis',
    description: 'Podium terakota hangat dengan bayangan dedaunan tropis alami yang segar dan estetik.',
    fontPairing: 'DM Serif Display + Plus Jakarta Sans',
    previewColor: '#D97706',
    lightingNote: 'Sinar matahari tropis & bayangan daun',
  },
  {
    id: 'pop_halftone',
    title: 'Promo Diskon Heboh',
    badge: 'Promo Heboh',
    description: 'Latar grafis diagonal berani dengan sudut produk dinamis, sangat cocok untuk promo menu diskon.',
    fontPairing: 'Bricolage Grotesque + Plus Jakarta Sans',
    previewColor: '#EC4899',
    lightingNote: 'Pencahayaan tajam bergaya promo heboh',
  },
];


export const DESIGN_TIPS: string[] = [
  'Gunakan headline singkat 2-4 kata agar mudah dibaca dalam 3 detik pertama saat di-scroll.',
  'Pencahayaan alami dan kontras tajam meningkatkan selera makan pelanggan pada foto kuliner.',
  'Format 1:1 paling optimal untuk katalog marketplace dan postingan feed Instagram.',
  'Format vertikal 2:3 memiliki rasio klik 40% lebih tinggi di WhatsApp status dan Story.',
  'Komposisi Rule of Thirds dengan 40% ruang kosong mencegah poster terlihat murahan atau AI-slop.',
];
