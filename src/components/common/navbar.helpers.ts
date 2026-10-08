import {
  Shield,
  Users,
  Palette,
  Layers,
  Receipt,
  Settings,
  Store,
  ShoppingBag,
  Wallet,
  LayoutDashboard
} from 'lucide-svelte'

import type { ComponentType } from 'svelte'

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
  icon: ComponentType
}

export type RoleBadgeMeta = {
  label: string
  color: string
}

import { getDashboardHomePath } from '@/components/dashboard/sidebar/sidebar.helpers'

export const getRoleBadge = (role?: string | null): RoleBadgeMeta => {
  switch (role) {
    case 'designer':
      return {
        label: 'Desainer',
        color: 'bg-success/15 text-success border-success/30'
      }
    case 'admin':
      return {
        label: 'Admin Pendamping',
        color: 'bg-info/15 text-info border-info/30'
      }
    case 'superadmin':
      return {
        label: 'Super Admin',
        color: 'bg-error/15 text-error border-error/20'
      }
    case 'tenant':
    default:
      return {
        label: 'Merchant',
        color: 'bg-warning/15 text-warning border-warning/30'
      }
  }
}

export const getDashboardHref = getDashboardHomePath

export const getDashboardLabel = (role?: string | null): string => {
  if (role === 'designer') return 'Studio Desainer'
  if (role === 'superadmin') return 'Panel Super Admin'
  if (role === 'admin') return 'Panel Admin'
  return 'Dashboard Toko'
}

export const getRoleNavLinks = (role?: string | null): NavSubItem[] => {
  switch (role) {
    case 'superadmin':
      return [
        { label: 'Overview Dashboard', href: '/superadmin', icon: LayoutDashboard },
        { label: 'Kelola Akses Admin', href: '/superadmin/whitelist', icon: Shield },
        { label: 'Manajemen Pengguna', href: '/superadmin/users', icon: Users },
        { label: 'Kurasi Template', href: '/superadmin/templates', icon: Palette },
        { label: 'Kategori Template', href: '/superadmin/template-categories', icon: Layers },
        { label: 'Riwayat Transaksi', href: '/superadmin/transactions', icon: Receipt },
        { label: 'Pengaturan Platform', href: '/superadmin/settings', icon: Settings }
      ]
    case 'admin':
      return [
        { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Merchant Anda', href: '/admin/merchants', icon: Store },
        { label: 'Dompet & Payout', href: '/admin/wallet', icon: Wallet },
        { label: 'Riwayat Transaksi', href: '/admin/transactions', icon: Receipt },
        { label: 'Marketplace Template', href: '/templates', icon: Palette }
      ]
    case 'designer':
      return [
        { label: 'Overview Dasbor', href: '/designer', icon: LayoutDashboard },
        { label: 'Dompet & Finansial', href: '/designer/wallet', icon: Wallet },
        { label: 'Koleksi Template', href: '/designer/templates', icon: Palette },
        { label: 'Pesanan Masuk', href: '/designer/orders', icon: ShoppingBag },
        { label: 'Marketplace Publik', href: '/templates', icon: Store }
      ]
    case 'tenant':
    default:
      return [
        { label: 'Dashboard Toko', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Katalog Produk', href: '/dashboard/products', icon: ShoppingBag },
        { label: 'Riwayat Pesanan', href: '/dashboard/orders', icon: Receipt },
        { label: 'Katalog Template', href: '/templates', icon: Palette }
      ]
  }
}

export const berandaItems = [
  { label: 'Beranda Utama', href: '/#hero-scroll-track', desc: 'Kembali ke tampilan awal hero anime' },
  { label: 'Visi & Manifesto', href: '/#manifesto-reveal', desc: 'Misi digitalisasi potensi Banyuwangi' },
  { label: 'Sinergi 3 Pilar', href: '/#synergy', desc: 'Kolaborasi Desainer, UMKM, dan Konsumen' },
  { label: 'Alur Kerja (Value Matrix)', href: '/#value-matrix', desc: '3 langkah praktis operasional platform' },
  { label: 'Ulasan & Testimoni', href: '/#testimonials', desc: 'Cerita sukses mitra perajin & UMKM' },
  { label: 'Tanya Jawab (FAQ)', href: '/#faq', desc: 'Jawaban pertanyaan umum seputar platform' },
  { label: 'Kontak & Gabung', href: '/#contact', desc: 'Konsultasi langsung dengan tim Pinoka' }
]

export const helpCenterItems = [
  { label: 'Pusat Bantuan', href: '/help', desc: 'Tanya jawab & kontak tim via WhatsApp' },
  { label: 'Syarat & Ketentuan', href: '/terms', desc: 'Aturan layanan & hak kekayaan intelektual' },
  { label: 'Kebijakan Privasi', href: '/privacy', desc: 'Perlindungan data pribadi & keamanan' }
]
