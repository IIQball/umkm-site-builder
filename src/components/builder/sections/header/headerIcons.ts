/**
 * Konstanta & helper icon untuk Header builder
 * Menggunakan icon Lucide murni, bebas emoji AI slop
 */

export function stripEmoji(str?: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✓✔⚡🛵]/gu, '').trim();
}

export const DELIVERY_ICON_OPTIONS = [
  { value: 'truck', label: 'Truk Ekspedisi' },
  { value: 'package', label: 'Kurir / Paket' },
  { value: 'clock', label: 'Estimasi Cepat' },
  { value: 'zap', label: 'Pengiriman Kilat' },
  { value: 'map-pin', label: 'Antar Lokasi' },
  { value: 'shopping-bag', label: 'Pesanan Belanja' },
  { value: 'send', label: 'Kirim Langsung' },
];

export const BADGE_BPOM_ICON_OPTIONS = [
  { value: 'shield-check', label: 'Shield / Izin BPOM' },
  { value: 'badge-check', label: 'Badge / Terverifikasi' },
  { value: 'award', label: 'Award / Teruji Klinis' },
  { value: 'check-circle-2', label: 'Check / Standar Mutu' },
  { value: 'star', label: 'Star / Kualitas Terbaik' },
  { value: 'lock', label: 'Lock / Keamanan Konsumen' },
];

export const BADGE_HALAL_ICON_OPTIONS = [
  { value: 'badge-check', label: 'Badge / Halal MUI' },
  { value: 'shield-check', label: 'Shield / Terjamin Halal' },
  { value: 'leaf', label: 'Leaf / Bahan Halal Alami' },
  { value: 'check-circle-2', label: 'Check / Sertifikasi Halal' },
  { value: 'award', label: 'Award / Kepercayaan Umat' },
  { value: 'wheat', label: 'Wheat / Thayyib & Higienis' },
];

export const PROMO_ICON_OPTIONS = [
  { value: 'flame', label: 'Flame / Flash Sale' },
  { value: 'zap', label: 'Zap / Promo Kilat' },
  { value: 'badge-percent', label: 'Percent / Diskon Spesial' },
  { value: 'gift', label: 'Gift / Bonus & Hadiah' },
  { value: 'tag', label: 'Tag / Harga Coret' },
  { value: 'sparkles', label: 'Sparkles / Eksklusif' },
  { value: 'clock', label: 'Clock / Waktu Terbatas' },
];
