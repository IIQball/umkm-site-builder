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
  LayoutDashboard,
  Home,
  Compass,
  MessageSquare,
  HelpCircle,
  PhoneCall,
  FileText,
} from 'lucide-svelte';

import type { ComponentType } from 'svelte';

export type NavUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
};

export type NavSubItem = {
  label: string;
  href: string;
  icon: ComponentType;
};

export type RoleBadgeMeta = {
  label: string;
  color: string;
};

export const getRoleBadge = (role?: string | null): RoleBadgeMeta => {
  switch (role) {
    case 'designer':
      return {
        label: 'Desainer',
        color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      };
    case 'admin':
      return {
        label: 'Admin Pendamping',
        color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      };
    case 'superadmin':
      return {
        label: 'Super Admin',
        color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      };
    case 'tenant':
    default:
      return {
        label: 'Merchant',
        color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      };
  }
};

export const getDashboardHref = (role?: string | null): string => {
  if (role === 'designer') return '/designer/wallet';
  if (role === 'admin' || role === 'superadmin') return '/admin';
  return '/dashboard';
};

export const getDashboardLabel = (role?: string | null): string => {
  if (role === 'designer') return 'Studio Desainer';
  if (role === 'superadmin') return 'Panel Super Admin';
  if (role === 'admin') return 'Panel Admin';
  return 'Dashboard Toko';
};

export const getRoleNavLinks = (role?: string | null): NavSubItem[] => {
  switch (role) {
    case 'superadmin':
      return [
        { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Kelola Akses Admin', href: '/admin/whitelist', icon: Shield },
        { label: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
        { label: 'Kurasi Template', href: '/admin/templates', icon: Palette },
        { label: 'Kategori Bisnis', href: '/admin/template-categories', icon: Layers },
        { label: 'Riwayat Transaksi', href: '/admin/transactions', icon: Receipt },
        { label: 'Pengaturan Platform', href: '/admin/settings', icon: Settings },
      ];
    case 'admin':
      return [
        { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Merchant Anda', href: '/admin/merchants', icon: Store },
        { label: 'Riwayat Transaksi', href: '/admin/transactions', icon: Receipt },
        { label: 'Marketplace Template', href: '/templates', icon: Palette },
      ];
    case 'designer':
      return [
        { label: 'Dompet & Finansial', href: '/designer/wallet', icon: Wallet },
        { label: 'Koleksi Template', href: '/designer/templates', icon: Palette },
        { label: 'Pesanan Masuk', href: '/designer/orders', icon: ShoppingBag },
        { label: 'Marketplace Publik', href: '/templates', icon: Store },
      ];
    case 'tenant':
    default:
      return [
        { label: 'Dashboard Toko', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Katalog Produk', href: '/dashboard/products', icon: ShoppingBag },
        { label: 'Riwayat Pesanan', href: '/dashboard/orders', icon: Receipt },
        { label: 'Katalog Template', href: '/templates', icon: Palette },
      ];
  }
};

export const berandaItems = [
  { label: 'Beranda Utama', href: '/#hero-scroll-track', desc: 'Kembali ke tampilan awal hero anime', icon: Home },
  { label: 'Visi & Manifesto', href: '/#manifesto-reveal', desc: 'Misi digitalisasi potensi Banyuwangi', icon: Compass },
  { label: 'Sinergi 3 Pilar', href: '/#synergy', desc: 'Kolaborasi Desainer, UMKM, dan Konsumen', icon: Users },
  { label: 'Alur Kerja (Value Matrix)', href: '/#value-matrix', desc: '3 langkah praktis operasional platform', icon: Layers },
  { label: 'Ulasan & Testimoni', href: '/#testimonials', desc: 'Cerita sukses mitra perajin & UMKM', icon: MessageSquare },
  { label: 'Tanya Jawab (FAQ)', href: '/#faq', desc: 'Jawaban pertanyaan umum seputar platform', icon: HelpCircle },
  { label: 'Kontak & Gabung', href: '/#contact', desc: 'Konsultasi langsung dengan tim Pinoka', icon: PhoneCall },
];

export const helpCenterItems = [
  { label: 'Pusat Bantuan', href: '/#faq', desc: 'Tanya jawab & kontak tim via WhatsApp', icon: HelpCircle },
  { label: 'Syarat & Ketentuan', href: '/terms', desc: 'Aturan layanan & hak kekayaan intelektual', icon: FileText },
  { label: 'Kebijakan Privasi', href: '/privacy', desc: 'Perlindungan data pribadi & keamanan', icon: Shield },
];
