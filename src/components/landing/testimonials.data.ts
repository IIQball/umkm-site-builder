export interface TestimonialItem {
  id: string
  flexClass?: string
  isPattern?: boolean
  quote: string
  author: string
  role: string
  initials: string
  theme: 'pattern' | 'orange' | 'neutral' | 'dark'
}

export const COL_1: TestimonialItem[] = [
  {
    id: 'c1-1',
    flexClass: 'lg:flex-[7]',
    isPattern: true,
    quote: 'Katalog toko selesai dalam hitungan menit dan pesanan pembeli masuk utuh ke WhatsApp tanpa potongan komisi sepeser pun.',
    author: 'Siti Rohmah',
    role: 'Pengrajin Batik Gajah Oling, Banyuwangi',
    initials: 'SR',
    theme: 'pattern'
  },
  {
    id: 'c1-2',
    flexClass: 'lg:flex-[3]',
    isPattern: false,
    quote: 'Karya desain kami langsung digunakan oleh pelaku usaha daerah dan menghasilkan pendapatan royalti nyata secara berkelanjutan.',
    author: 'Dimas Pratama',
    role: 'Desainer Grafis & UI, Mitra Pinoka',
    initials: 'DP',
    theme: 'orange'
  }
]

export const COL_2: TestimonialItem[] = [
  {
    id: 'c2-1',
    quote: 'Daftar menu kopi tertata rapi sehingga pelanggan bisa langsung memilih varian dan memesan tanpa harus tanya jawab panjang.',
    author: 'Hendra Wijaya',
    role: 'Pemilik Kedai Kopi Ijen',
    initials: 'HW',
    theme: 'neutral'
  },
  {
    id: 'c2-2',
    quote: 'Sistem pembagian hasil yang transparan membuka peluang penghasilan nyata bagi talenta kreatif di daerah.',
    author: 'Nadia Putri',
    role: 'UI/UX Designer, Komunitas Kreatif',
    initials: 'NP',
    theme: 'neutral'
  },
  {
    id: 'c2-3',
    quote: 'Belanja oleh-oleh khas Banyuwangi terasa jauh lebih aman dan terpercaya karena terhubung langsung ke pembuat aslinya.',
    author: 'Budi Santoso',
    role: 'Konsumen & Wisatawan Nusantara',
    initials: 'BS',
    theme: 'neutral'
  }
]

export const COL_3: TestimonialItem[] = [
  {
    id: 'c3-1',
    flexClass: 'lg:flex-[3]',
    isPattern: false,
    quote: 'Tanpa keahlian teknologi, produk kriya bambu kami kini memiliki toko online resmi dan langsung menerima pesanan dari berbagai kota.',
    author: 'Ahmad Fauzi',
    role: 'Pengrajin Kriya Bambu Gintangan',
    initials: 'AF',
    theme: 'dark'
  },
  {
    id: 'c3-2',
    flexClass: 'lg:flex-[7]',
    isPattern: true,
    quote: 'Tampilan katalog yang profesional terbukti meningkatkan rasa percaya pembeli luar kota terhadap mutu camilan khas kami.',
    author: 'Dewi Lestari',
    role: 'Produsen Camilan Bagiak Otentik',
    initials: 'DL',
    theme: 'pattern'
  }
]