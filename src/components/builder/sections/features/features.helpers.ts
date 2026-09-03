import type { FeatureItem, FeaturesProps } from '@/types';

export const IMAGE_SUPPORTED_FEATURE_PRESETS = [
  'bento_grid_asymmetric',
  'alternating_zigzag_rows',
  'interactive_tabs',
  'vertical_accordion_showcase',
];

export const defaultFeaturesItems: FeatureItem[] = [
  {
    id: 'f-1',
    icon: 'shield-check',
    iconName: 'shield-check',
    title: '100% Bahan Alami',
    description: 'Tanpa bahan pemanis buatan, pewarna kimia, atau pengawet sintetis berbahaya.',
    badge: 'Alami & Murni',
    statLabel: 'Terverifikasi BPOM',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'f-2',
    icon: 'award',
    iconName: 'award',
    title: 'Sertifikasi Lengkap',
    description: 'Teruji klinis laboratorium, mengantongi izin resmi BPOM dan Halal MUI.',
    badge: 'Halal MUI',
    statLabel: 'Resmi',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'f-3',
    icon: 'truck',
    iconName: 'truck',
    title: 'Pengiriman Cepat',
    description: 'Packing bubble wrap tebal berlapis kardus tebal untuk menjamin keutuhan produk.',
    badge: 'Kirim Cepat',
    statLabel: 'Seluruh RI',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'f-4',
    icon: 'credit-card',
    iconName: 'credit-card',
    title: 'Bisa Bayar COD',
    description: 'Layanan bayar di tempat saat paket tiba aman di depan pintu Anda.',
    badge: 'Bayar Aman',
  },
  {
    id: 'f-5',
    icon: 'leaf',
    iconName: 'leaf',
    title: 'Ramah Lingkungan',
    description: 'Bahan kemasan food-grade dapat didaur ulang dan ramah bumi.',
    badge: 'Eco-Friendly',
  },
  {
    id: 'f-6',
    icon: 'star',
    iconName: 'star',
    title: 'Rating 4.9 Bintang',
    description: 'Dipercaya oleh ribuan pelanggan setia dari seluruh kota di Indonesia.',
    badge: 'Terfavorit',
  },
];

export const denseFallbackItems: FeatureItem[] = [
  { id: 'dm-1', icon: 'leaf', iconName: 'leaf', title: '100% Organik', description: 'Bahan baku lokal alami bebas pestisida kimia sintetis.' },
  { id: 'dm-2', icon: 'shield-check', iconName: 'shield-check', title: 'Izin Resmi BPOM RI', description: 'Lolos uji laboratorium dengan nomor izin edar resmi.' },
  { id: 'dm-3', icon: 'award', iconName: 'award', title: 'Sertifikasi Halal MUI', description: 'Seluruh fasilitas dan bahan baku 100% halal.' },
  { id: 'dm-4', icon: 'wheat', iconName: 'wheat', title: 'Bebas Gluten & Pengawet', description: 'Aman untuk penderita alergi dan lambung sensitif.' },
  { id: 'dm-5', icon: 'sparkles', iconName: 'sparkles', title: 'Rasa Autentik Gurih', description: 'Racikan bumbu kaldu rempah tanpa penguat rasa buatan.' },
  { id: 'dm-6', icon: 'package', iconName: 'package', title: 'Kemasan Kedap Udara', description: 'Segel vakum food-grade menjaga renyah hingga 6 bulan.' },
  { id: 'dm-7', icon: 'truck', iconName: 'truck', title: 'Kirim Cepat Terlindungi', description: 'Ekspedisi kilat dengan proteksi kardus tebal berlapis.' },
  { id: 'dm-8', icon: 'credit-card', iconName: 'credit-card', title: 'Pilihan Bayar di Tempat', description: 'Kemudahan transaksi COD aman langsung ke kurir Anda.' },
];

export function mapRawFeatureItems(props: FeaturesProps | undefined): FeatureItem[] {
  const raw = (Array.isArray(props?.items) && props.items.length > 0)
    ? props.items
    : (Array.isArray(props?.features) && props.features.length > 0)
      ? props.features
      : defaultFeaturesItems;

  return raw.map((item, idx) => ({
    id: item.id || `f-${idx}`,
    icon: item.icon || item.iconName || 'sparkles',
    iconName: item.iconName || item.icon || 'sparkles',
    title: item.title || 'Keunggulan Kami',
    description: item.description || 'Deskripsi keunggulan produk/layanan Anda.',
    badge: item.badge,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl,
    statValue: item.statValue,
    statLabel: item.statLabel,
  }));
}

export function getDenseFeatureItems(items: FeatureItem[]): FeatureItem[] {
  if (items.length >= 8) return items.slice(0, 8);
  return [
    ...items,
    ...denseFallbackItems.slice(items.length).map((it, i) => ({
      ...it,
      id: `dm-fill-${i}`,
    })),
  ].slice(0, 8);
}
