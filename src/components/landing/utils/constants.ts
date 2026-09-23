import {
  Utensils,
  Coffee,
  Shirt,
  Gift,
  Cookie,
  Camera,
  Palette,
  Globe
} from 'lucide-svelte';
import type {
  CategoryFilter,
  UmkmItem,
  BuilderStep,
  BuilderProduct,
  FeaturedItem,
  HowItWorksStep
} from '../types/index';

export const categoryFilters: CategoryFilter[] = [
  { name: 'Semua', icon: null },
  { name: 'Kuliner', icon: Utensils },
  { name: 'Kopi & Minuman', icon: Coffee },
  { name: 'Fashion', icon: Shirt },
  { name: 'Oleh-Oleh', icon: Gift },
  { name: 'Makanan Ringan', icon: Cookie }
];

export const categoryIconMap: Record<string, typeof Utensils> = {
  Kuliner: Utensils,
  'Kopi & Minuman': Coffee,
  Fashion: Shirt,
  'Oleh-Oleh': Gift,
  'Makanan Ringan': Cookie
};

export const kecamatanFilters = [
  'Semua Kecamatan',
  'Bangorejo',
  'Banyuwangi (Kota)',
  'Blimbingsari',
  'Cluring',
  'Gambiran',
  'Genteng',
  'Giri',
  'Glagah',
  'Glenmore',
  'Rogojampi',
  'Songgon'
];

export const umkmDirectory: UmkmItem[] = [
  {
    name: 'Warung Osing Mbak Yuni',
    category: 'Kuliner',
    kecamatan: 'Glagah',
    desc: 'Nasi Tempong & Rujak Soto khas Banyuwangi dengan sambal pedas mantap.',
    count: '14 Produk',
    rating: '4.9',
    distance: '1.2 km'
  },
  {
    name: 'Kopi Sewu Rasa',
    category: 'Kopi & Minuman',
    kecamatan: 'Songgon',
    desc: 'Kopi Robusta Songgon petik merah dengan aroma pinus yang khas.',
    count: '8 Produk',
    rating: '4.9',
    distance: '3.4 km'
  },
  {
    name: 'Batik Gajah Oling Sanggar',
    category: 'Fashion',
    kecamatan: 'Rogojampi',
    desc: 'Batik tulis asli Banyuwangi bermotif Gajah Oling & Kangkung Setingkes.',
    count: '22 Produk',
    rating: '4.8',
    distance: '5.1 km'
  },
  {
    name: 'Sale Pisang Bu Marni',
    category: 'Oleh-Oleh',
    kecamatan: 'Glenmore',
    desc: 'Sale pisang gapit asli tanpa pengawet, camilan wajib buat oleh-oleh.',
    count: '6 Produk',
    rating: '4.7',
    distance: '8.6 km'
  },
  {
    name: 'Keripik Osing Renyah',
    category: 'Makanan Ringan',
    kecamatan: 'Genteng',
    desc: 'Keripik singkong & pisang aneka rasa, gurih dan renyah tahan lama.',
    count: '11 Produk',
    rating: '4.6',
    distance: '6.3 km'
  },
  {
    name: 'Angkringan Kota Gandrung',
    category: 'Kuliner',
    kecamatan: 'Banyuwangi (Kota)',
    desc: 'Nasi kucing, sate usus, dan wedang jahe, buka sampai tengah malam.',
    count: '18 Produk',
    rating: '4.8',
    distance: '0.8 km'
  },
  {
    name: 'Kedai Kopi Kalibaru',
    category: 'Kopi & Minuman',
    kecamatan: 'Cluring',
    desc: 'Racikan kopi robusta kebun sendiri, disajikan hangat atau dingin.',
    count: '9 Produk',
    rating: '4.7',
    distance: '4.9 km'
  },
  {
    name: 'Konveksi Osing Kece',
    category: 'Fashion',
    kecamatan: 'Gambiran',
    desc: 'Kaos & totebag motif khas Banyuwangi, bisa custom desain sendiri.',
    count: '15 Produk',
    rating: '4.6',
    distance: '7.2 km'
  },
  {
    name: 'Toko Oleh-Oleh Bu Painten',
    category: 'Oleh-Oleh',
    kecamatan: 'Bangorejo',
    desc: 'Aneka kerupuk, kopi bubuk, dan camilan khas untuk buah tangan.',
    count: '20 Produk',
    rating: '4.8',
    distance: '9.4 km'
  }
];

export const builderSteps: BuilderStep[] = [
  {
    n: '01',
    icon: Camera,
    label: 'Input Instan',
    title: 'Isi Data & Foto Usaha',
    desc: 'Masukkan nama UMKM, deskripsi singkat, unggah foto produk unggulan, dan sambungkan nomor WhatsApp bisnis.'
  },
  {
    n: '02',
    icon: Palette,
    label: 'Live Editor',
    title: 'Pilih & Kustomisasi Tema',
    desc: 'Pilih tema yang cocok dengan usahamu, lalu atur warna dan tata letak langsung dari editor visual.'
  },
  {
    n: '03',
    icon: Globe,
    label: 'Instant Live',
    title: 'Terbit Domain & Tombol WhatsApp',
    desc: 'Halaman UMKM-mu langsung tayang, lengkap dengan tombol pesan via WhatsApp.'
  }
];

export const builderProducts: BuilderProduct[] = [
  { name: 'Nasi Tempong', price: 'Rp 15.000' },
  { name: 'Rujak Soto', price: 'Rp 15.000' },
  { name: 'Ayam Kesrut', price: 'Rp 15.000' }
];

export const featured: FeaturedItem[] = [
  {
    name: 'Kopi Osing',
    loc: 'Kecamatan Giri',
    tag: 'Kuliner',
    rate: '4.9'
  },
  {
    name: 'Batik Sembulungan',
    loc: 'Kecamatan Kalipuro',
    tag: 'Fashion',
    rate: '4.8'
  },
  {
    name: 'Anyaman Bambu Krajan',
    loc: 'Kecamatan Glagah',
    tag: 'Kerajinan',
    rate: '4.7'
  },
  {
    name: 'Rumah Madu Ijen',
    loc: 'Kecamatan Licin',
    tag: 'Pertanian',
    rate: '5.0'
  },
  {
    name: 'Homestay Sukamade',
    loc: 'Kecamatan Pesanggaran',
    tag: 'Wisata',
    rate: '4.8'
  }
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    n: '01',
    t: 'Daftar usahamu',
    d: 'Isi nama, kategori, dan lokasi UMKM lewat formulir singkat.'
  },
  {
    n: '02',
    t: 'Verifikasi tim',
    d: 'Tim Pinoka meninjau data dan menghubungimu dalam 2x24 jam.'
  },
  {
    n: '03',
    t: 'Tampil di peta',
    d: 'Etalase digitalmu aktif dan bisa ditemukan lewat pencarian.'
  },
  {
    n: '04',
    t: 'Ditemukan pembeli',
    d: 'Warga dan wisatawan menemukan usahamu berdasarkan lokasi.'
  }
];

export const fullEyebrow = 'Kenapa Pinoka';
export const fullH2 = 'Setiap etalase kecil punya cerita yang layak ditemukan';
