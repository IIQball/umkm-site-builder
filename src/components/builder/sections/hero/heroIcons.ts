/**
 * Konstanta & helper icon untuk Hero section builder
 * Menggunakan icon Lucide murni, bebas emoji AI slop
 */

import { stripEmoji as baseStripEmoji } from '../header/headerIcons';
import { resolveFeatureIcon } from '../features/featureIcons';

export const stripEmoji = baseStripEmoji;
export { resolveFeatureIcon };

export const HERO_BADGE_ICON_OPTIONS = [
  { value: '', label: 'Tanpa Ikon (Titik Dot)' },
  { value: 'flame', label: 'Flame / Terlaris Hot' },
  { value: 'sparkles', label: 'Sparkles / Spesial & Unggulan' },
  { value: 'zap', label: 'Zap / Promo Kilat' },
  { value: 'badge-percent', label: 'Diskon / Potongan Harga' },
  { value: 'star', label: 'Star / Bintang Rating' },
  { value: 'shield-check', label: 'Shield / Terverifikasi & Aman' },
  { value: 'leaf', label: 'Leaf / Alami & Herbal' },
  { value: 'award', label: 'Award / Kualitas Premium' },
  { value: 'tag', label: 'Tag / Harga Spesial' },
  { value: 'coffee', label: 'Coffee / Kuliner & Cafe' },
  { value: 'truck', label: 'Truck / Pengiriman Cepat' },
  { value: 'clock', label: 'Clock / Waktu Terbatas' },
  { value: 'gift', label: 'Gift / Hadiah & Bonus' },
  { value: 'heart', label: 'Heart / Favorit Pelanggan' },
  { value: 'thumbs-up', label: 'ThumbsUp / Rekomendasi' },
  { value: 'gem', label: 'Gem / Mewah & Elegan' },
  { value: 'message-circle', label: 'MessageCircle / Chat WhatsApp' },
];

export const HERO_IMAGE_FRAME_OPTIONS = [
  { value: 'none', label: 'Murni Foto (Tanpa Card)' },
  { value: 'card', label: 'Dengan Card Luar' },
  { value: 'grid', label: 'Aksen Grid Modern' },
];

export const HERO_IMAGE_SHAPE_OPTIONS = [
  { value: 'rounded', label: 'Kotak Bersudut (Rounded)' },
  { value: 'square', label: 'Kotak Tajam (Square)' },
  { value: 'circle', label: 'Bulat Penuh (Circle)' },
  { value: 'squircle', label: 'Squircle Halus' },
];
