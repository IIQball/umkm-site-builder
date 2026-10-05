import type {
  StoreContentCustomization,
  StoreTestimonialItem,
} from '../../onboarding.types';
import { HERO_IMAGE_PRESETS } from './contentCustomization.constants';

export const DEFAULT_ONBOARDING_TESTIMONIALS: StoreTestimonialItem[] = [
  {
    id: 'testi_1',
    customerName: 'Ibu Ratna Dewi',
    rating: 5,
    comment: 'Kualitas produk sangat bagus, pengiriman cepat, dan respon admin sangat ramah via WhatsApp!',
    role: 'Pelanggan Setia',
  },
  {
    id: 'testi_2',
    customerName: 'Budi Santoso',
    rating: 5,
    comment: 'Sudah langganan lebih dari 6 bulan, rasanya konsisten enak dan selalu fresh setiap pesanan.',
    role: 'Pembeli Terverifikasi',
  },
  {
    id: 'testi_3',
    customerName: 'Siti Rahmawati',
    rating: 5,
    comment: 'Sangat recommended untuk keluarga maupun pesanan acara besar. Mantap!',
    role: 'Pelanggan Banyuwangi',
  },
];

export function createDefaultContentCustomization(
  storeName = '',
  categoryName = '',
  storeAddress = ''
): StoreContentCustomization {
  const name = storeName.trim() || 'Toko Unggulan Anda';
  const subtitle = categoryName
    ? `Pusat penyedia ${categoryName} berkualitas tinggi dengan jaminan mutu dan kemudahan order via WhatsApp.`
    : 'Produk terbaik pilihan pelanggan dengan kualitas teruji, pelayanan ramah, dan pemesanan WhatsApp instan.';
  const address = storeAddress.trim() || 'Jl. Merdeka No. 45, Banyuwangi, Jawa Timur';

  return {
    theme: {
      primaryColor: '#0ea5e9',
      fontFamily: 'Inter',
      typography: {
        headingFont: 'Plus Jakarta Sans',
        bodyFont: 'Inter',
      },
    },
    header: {
      logoText: name,
      logoImageUrl: '',
      announcementText: 'Promo Spesial: Belanja hemat & gratis konsultasi produk via WhatsApp!',
    },
    hero: {
      title: name,
      subtitle,
      ctaText: 'Hubungi Penjual',
      badgeText: 'Koleksi Resmi 2026',
      imageUrl: HERO_IMAGE_PRESETS[0].url,
    },
    features: {
      heading: 'Mengapa Memilih Kami?',
      subheading: 'Dedikasi kami untuk memberikan pengalaman berbelanja terbaik bagi setiap pelanggan.',
      items: [
        {
          icon: 'ShieldCheck',
          title: 'Kualitas Terjamin 100%',
          description: 'Setiap produk diproduksi dan dikurasi secara teliti dengan standar mutu tinggi.',
        },
        {
          icon: 'Truck',
          title: 'Pengiriman Cepat & Aman',
          description: 'Didukung ekspedisi terpercaya dengan pengemasan ekstra aman sampai ke tujuan.',
        },
        {
          icon: 'MessageCircle',
          title: 'Layanan WhatsApp Ramah',
          description: 'Konsultasi cepat, responsif, dan siap membantu kebutuhan belanja Anda setiap hari.',
        },
      ],
    },
    testimonials: {
      heading: 'Apa Kata Pelanggan Kami',
      subheading: 'Ulasan jujur dari pelanggan setia yang telah merasakan kepuasan produk kami.',
      items: [...DEFAULT_ONBOARDING_TESTIMONIALS],
    },
    faq: {
      heading: 'Pertanyaan yang Sering Diajukan',
      subheading: 'Jawaban praktis untuk pertanyaan umum seputar pesanan, pembayaran, dan pengiriman.',
      faqs: [
        {
          question: 'Bagaimana cara melakukan pemesanan?',
          answer: 'Pilih produk yang diinginkan dari katalog, lalu klik tombol pesan untuk otomatis tersambung ke WhatsApp kami.',
        },
        {
          question: 'Metode pembayaran apa saja yang diterima?',
          answer: 'Kami menerima transfer bank, QRIS, e-wallet, dan sistem pembayaran terverifikasi lainnya.',
        },
        {
          question: 'Berapa lama estimasi pesanan sampai?',
          answer: 'Pesanan dikirim dalam 1x24 jam kerja dengan estimasi tiba 2-4 hari kerja tergantung wilayah tujuan Anda.',
        },
      ],
    },
    maps: {
      branchMode: 'single',
      branches: [],
    },
    footer: {
      brandName: name,
      logoImageUrl: '',
      tagline: 'Pilihan terbaik untuk produk berkualitas tinggi dan pelayanan terpercaya.',
      storeHours: 'Buka Setiap Hari (08.00 - 21.00 WIB)',
      address,
      copyrightText: `© ${new Date().getFullYear()} ${name}. Hak Cipta Dilindungi.`,
    },
  };
}
