export interface TestimonialItem {
  id: string;
  flexClass?: string;
  isPattern?: boolean;
  quote: string;
  author: string;
  role: string;
  initials: string;
  theme: 'pattern' | 'orange' | 'neutral' | 'dark';
}

export const COL_1: TestimonialItem[] = [
  {
    id: 'c1-1',
    flexClass: 'lg:flex-[7]',
    isPattern: true,
    quote: 'Pinoka menjadi solusi tepat digitalisasi visual produk lokal kami. Katalog siap pakai dan pesanan langsung masuk ke WhatsApp tanpa potongan komisi sepeser pun.',
    author: 'Siti Rohmah',
    role: 'Pengrajin Batik Gajah Oling, Banyuwangi',
    initials: 'SR',
    theme: 'pattern',
  },
  {
    id: 'c1-2',
    flexClass: 'lg:flex-[3]',
    isPattern: false,
    quote: 'Bukan mockup fiktif. Tema yang kami rancang dipakai langsung dan mendatangkan royalti transparan.',
    author: 'Dimas Pratama',
    role: 'Desainer Grafis & UI, Mitra Pinoka',
    initials: 'DP',
    theme: 'orange',
  },
];

export const COL_2: TestimonialItem[] = [
  {
    id: 'c2-1',
    quote: 'Dulu kelola varian kopi manual di chat sangat membingungkan. Sekarang etalase rapi, pembeli tinggal pilih dan kirim pesanan otomatis.',
    author: 'Hendra Wijaya',
    role: 'Pemilik Kedai Kopi Ijen',
    initials: 'HW',
    theme: 'neutral',
  },
  {
    id: 'c2-2',
    quote: 'Bagi hasil 15% dari aktivasi template sangat adil dan konsisten. Menghidupkan ekosistem desainer daerah.',
    author: 'Nadia Putri',
    role: 'UI/UX Designer, Komunitas Kreatif',
    initials: 'NP',
    theme: 'neutral',
  },
  {
    id: 'c2-3',
    quote: 'Pengalaman belanja oleh-oleh khas Banyuwangi jauh lebih terpercaya karena langsung terhubung ke perajin aslinya.',
    author: 'Budi Santoso',
    role: 'Konsumen & Wisatawan Nusantara',
    initials: 'BS',
    theme: 'neutral',
  },
];

export const COL_3: TestimonialItem[] = [
  {
    id: 'c3-1',
    flexClass: 'lg:flex-[3]',
    isPattern: false,
    quote: 'Dalam satu jam etalase kriya bambu kami langsung aktif dan siap dipromosikan ke seluruh Indonesia.',
    author: 'Ahmad Fauzi',
    role: 'Pengrajin Kriya Bambu Gintangan',
    initials: 'AF',
    theme: 'dark',
  },
  {
    id: 'c3-2',
    flexClass: 'lg:flex-[7]',
    isPattern: true,
    quote: 'Standar estetika tema katalog mengangkat nilai jual camilan khas kami. Pembeli luar kota semakin percaya dengan kualitas produk Banyuwangi.',
    author: 'Dewi Lestari',
    role: 'Produsen Camilan Bagiak Otentik',
    initials: 'DL',
    theme: 'pattern',
  },
];
