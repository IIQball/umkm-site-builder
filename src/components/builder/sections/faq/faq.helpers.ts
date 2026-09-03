import type { FAQItem } from '@/types';

export const DEFAULT_FAQS: (FAQItem & { category?: string; iconName?: string })[] = [
  {
    id: 'faq_1',
    question: 'Berapa lama estimasi proses pengiriman pesanan?',
    answer: 'Pesanan diproses dalam 1x24 jam kerja. Untuk pengiriman reguler estimasi tiba 2-4 hari kerja tergantung lokasi pengiriman di seluruh Indonesia.',
    category: 'Pengiriman',
    iconName: 'Package',
  },
  {
    id: 'faq_2',
    question: 'Metode pembayaran apa saja yang didukung toko?',
    answer: 'Kami menerima transfer antar bank (BCA, Mandiri, BRI, BNI), QRIS instan semua e-wallet (GoPay, OVO, ShopeePay), serta fitur bayar di tempat (COD).',
    category: 'Pembayaran',
    iconName: 'CreditCard',
  },
  {
    id: 'faq_3',
    question: 'Apakah produk dijamin original dan bergaransi?',
    answer: 'Semua produk kami 100% original dan diproduksi langsung oleh artisan UMKM terpercaya. Kami menjamin garansi penggantian baru jika paket tiba rusak.',
    category: 'Garansi',
    iconName: 'RefreshCw',
  },
  {
    id: 'faq_4',
    question: 'Bagaimana jika saya ingin memesan partai besar / hampers?',
    answer: 'Kami menyediakan layanan pesanan khusus, hampers corporate, dan souvenir pernikahan dengan harga grosir terbaik. Hubungi admin via WhatsApp untuk penawaran.',
    category: 'Pemesanan',
    iconName: 'Users',
  },
  {
    id: 'faq_5',
    question: 'Apakah kemasan aman untuk pengiriman luar pulau?',
    answer: 'Pasti aman! Setiap produk dilindungi dengan bubble wrap berlapis ganda dan kardus tebal bersertifikasi tanpa biaya tambahan.',
    category: 'Pengiriman',
    iconName: 'Package',
  },
  {
    id: 'faq_6',
    question: 'Bagaimana cara melacak nomor resi pengiriman?',
    answer: 'Nomor resi otomatis dikirimkan melalui notifikasi pesan WhatsApp atau email segera setelah paket diserahkan ke kurir ekspedisi.',
    category: 'Pemesanan',
    iconName: 'HelpCircle',
  },
];

export function getCleanWaNumber(wa?: string): string {
  if (!wa) return '6281234567890';
  const cleaned = wa.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
  if (cleaned.startsWith('8')) return '62' + cleaned;
  return cleaned || '6281234567890';
}

export function buildWhatsAppHelpLink(wa?: string, message?: string): string {
  const cleanWa = getCleanWaNumber(wa);
  const text = message || 'Halo admin, saya ingin bertanya seputar produk/layanan toko.';
  return `https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`;
}

export function filterFaqs(
  faqs: (FAQItem & { category?: string })[],
  query: string,
  category: string = 'all'
): (FAQItem & { category?: string })[] {
  return faqs.filter((item) => {
    const matchesCategory = category === 'all' || !item.category || item.category.toLowerCase() === category.toLowerCase();
    const qLower = (query || '').toLowerCase().trim();
    if (!qLower) return matchesCategory;

    const matchesQuery =
      (item.question && item.question.toLowerCase().includes(qLower)) ||
      (item.answer && item.answer.toLowerCase().includes(qLower));

    return matchesCategory && matchesQuery;
  });
}
