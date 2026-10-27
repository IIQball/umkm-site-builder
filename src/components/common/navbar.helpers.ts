import {
  type RoleConfig,
  ROLE_CONFIGS,
  getRoleConfig,
  getDashboardHomePath,
  getSettingsHref
} from '@/components/dashboard/sidebar/sidebar.helpers'

export {
  type RoleConfig,
  ROLE_CONFIGS,
  getRoleConfig,
  getDashboardHomePath,
  getSettingsHref
}

export type NavUser = {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
  image?: string | null
}

export type NavSubItem = {
  label: string
  href: string
  icon?: unknown
}

export const getDashboardHref = getDashboardHomePath

export const getDashboardLabel = (role?: string | null): string => {
  if (role === 'designer') return 'Studio Desainer'
  if (role === 'superadmin') return 'Panel Super Admin'
  if (role === 'admin') return 'Dashboard Pendamping'
  return 'Dashboard Toko'
}

export const getRoleNavLinks = (role?: string | null): NavSubItem[] => {
  const r = (role || 'tenant').toLowerCase().trim()
  if (r === 'superadmin') {
    return [
      { label: 'Overview Dashboard', href: '/superadmin' },
      { label: 'Kelola Akses Admin', href: '/superadmin/whitelist' },
      { label: 'Manajemen Pengguna', href: '/superadmin/users' },
      { label: 'Kurasi Template', href: '/superadmin/templates' },
      { label: 'Kategori Template', href: '/superadmin/template-categories' },
      { label: 'Kategori Bisnis', href: '/superadmin/business-categories' },
      { label: 'Riwayat Transaksi', href: '/superadmin/transactions' },
      { label: 'Pengaturan Platform', href: '/superadmin/settings' }
    ]
  }
  if (r === 'admin') {
    return [
      { label: 'Overview Dashboard', href: '/admin' },
      { label: 'Merchant Anda', href: '/admin/merchants' },
      { label: 'Dompet & Payout', href: '/admin/wallet' },
      { label: 'Riwayat Transaksi', href: '/admin/transactions' },
      { label: 'Marketplace Template', href: '/templates' }
    ]
  }
  if (r === 'designer') {
    return [
      { label: 'Overview Dasbor', href: '/designer' },
      { label: 'Dompet & Finansial', href: '/designer/wallet' },
      { label: 'Koleksi Template', href: '/designer/templates' },
      { label: 'Pesanan Masuk', href: '/designer/orders' },
      { label: 'Marketplace Publik', href: '/templates' }
    ]
  }
  return [
    { label: 'Dashboard Toko', href: '/dashboard' },
    { label: 'Katalog Produk', href: '/dashboard/products' },
    { label: 'Riwayat Pesanan', href: '/dashboard/orders' },
    { label: 'Katalog Template', href: '/templates' }
  ]
}

export const berandaItems = [
  { label: 'Beranda Utama', href: '/#hero-scroll-track', desc: 'Kembali ke tampilan awal hero anime' },
  { label: 'Visi & Manifesto', href: '/#manifesto-reveal', desc: 'Misi digitalisasi potensi Banyuwangi' },
  { label: 'Sinergi Ekosistem', href: '/#synergy', desc: 'Kolaborasi 3 pilar: UMKM, Desainer, Konsumen' },
  { label: 'Fitur Unggulan', href: '/#value-matrix', desc: 'Alur cepat mulai dari pilih desain hingga jualan' },
  { label: 'Ulasan Pengguna', href: '/#testimonials', desc: 'Pengalaman nyata wirausaha dan kreator' },
  { label: 'Tanya Jawab (FAQ)', href: '/#faq', desc: 'Pertanyaan umum seputar layanan Pinoka' }
]

export const helpCenterItems = [
  { label: 'Pusat Bantuan', href: '/help', desc: 'Panduan lengkap penggunaan & tutorial toko' },
  { label: 'Syarat & Ketentuan', href: '/terms', desc: 'Aturan layanan & hak kekayaan intelektual' },
  { label: 'Kebijakan Privasi', href: '/privacy', desc: 'Perlindungan data pribadi & keamanan' }
]

export const getNavModeState = (): 'transparent' | 'hidden' | 'normal' => {
  if (typeof window === 'undefined') return 'normal'
  if (window.scrollY <= 10) return 'transparent'

  const footer = document.getElementById('contact') || document.querySelector('footer')
  if (footer && footer.getBoundingClientRect().top <= 100) return 'hidden'

  const heroTrack = document.getElementById('hero-scroll-track')
  if (!heroTrack) return 'normal'

  const rect = heroTrack.getBoundingClientRect()
  const maxScroll = rect.height - window.innerHeight

  if (window.scrollY <= 40 || -rect.top <= 40) return 'transparent'
  if (rect.bottom > 80 && -rect.top < maxScroll) return 'hidden'
  return 'normal'
}
