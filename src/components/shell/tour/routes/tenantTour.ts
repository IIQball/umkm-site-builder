import type { DriveStep } from 'driver.js';
import { getShellSteps } from './shellTour.helpers';

export interface RouteTourConfig {
  match: (path: string) => boolean;
  steps: (isMobile: boolean) => DriveStep[];
}

export const tenantTourRoutes: RouteTourConfig[] = [
  // 1. Merchant Home (/dashboard)
  {
    match: (path) => path.replace(/\/$/, '') === '/dashboard',
    steps: (isMobile) => [
      ...getShellSteps('tenant', isMobile),
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Metrik Kunjungan & Konversi',
          description: 'Pantau pengunjung total toko, jumlah klik WhatsApp pembeli, serta skor konversi toko Anda secara real-time.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '#merchant-traffic-chart',
        popover: {
          title: 'Grafik Tren Pengunjung & Konversi',
          description: 'Visualisasi grafik interaktif pergerakan pengunjung toko dan klik WhatsApp berdasarkan rentang waktu 7 hari, 30 hari, atau 12 bulan.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: 'a[href="/dashboard/store"]',
        popover: {
          title: 'Pintasan Pengaturan Toko',
          description: 'Akses cepat untuk memperbarui nama toko, subdomain, logo, dan nomor kontak WhatsApp bisnis Anda.',
          side: 'top',
          align: 'start',
        },
      },
    ],
  },

  // 2. Merchant Katalog Produk (/dashboard/products)
  {
    match: (path) => path.includes('/dashboard/products'),
    steps: () => [
      {
        element: '#add-product-btn',
        popover: {
          title: 'Tombol Tambah Produk',
          description: 'Klik di sini untuk mengunggah foto produk, memberi harga, mengatur varian stok, dan deskripsi dagangan.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Ringkasan Katalog Produk',
          description: 'Statcard menampilkan total produk yang terdaftar, produk aktif dijual, peringatan stok menipis, dan jumlah kategori.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'input[placeholder*="Cari"]',
        popover: {
          title: 'Pencarian & Filter Kategori',
          description: 'Saring barang dagangan berdasarkan nama produk atau pilih kategori etalase secara instan.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Daftar Produk & Manajemen Stok',
          description: 'Periksa foto, harga jual, ubah ketersediaan stok aktif, serta gunakan tombol edit dan hapus produk.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 3. Merchant Kategori Produk (/dashboard/categories)
  {
    match: (path) => path.includes('/dashboard/categories'),
    steps: () => [
      {
        element: '#add-category-btn',
        popover: {
          title: 'Tombol Tambah Kategori',
          description: 'Kelompokkan barang dagangan toko Anda (misal: Makanan, Minuman, Pakaian) agar calon pembeli nyaman menjelajah etalase.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Statistik Kategori Etalase',
          description: 'Pantau total kategori toko, kategori yang aktif ditampilkan di etalase, dan kategori yang disembunyikan.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Kategori Produk & Aksi',
          description: 'Daftar seluruh kategori etalase toko aktif yang dapat Anda sesuaikan, edit nama atau hapus sewaktu-waktu.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 4. Merchant Riwayat Pesanan & Tagihan (/dashboard/orders)
  {
    match: (path) => path.includes('/dashboard/orders'),
    steps: () => [
      {
        element: 'a[href="/dashboard/templates"]',
        popover: {
          title: 'Pintasan Galeri Template Toko',
          description: 'Buka galeri template untuk melihat koleksi tema website yang telah Anda miliki atau eksplor tema baru.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Statistik Tagihan & Faktur',
          description: 'Ringkasan total transaksi pemesanan template, tagihan lunas dengan faktur resmi, pembayaran tertunda, dan akumulasi pengeluaran.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Riwayat Invoice & Pembayaran',
          description: 'Daftar invoice pembelian template toko, nomor transaksi, status lunas/pending, dan tombol untuk menyelesaikan pembayaran.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 5. Merchant Koleksi Template Toko (/dashboard/templates)
  {
    match: (path) => path.includes('/dashboard/templates'),
    steps: () => [
      {
        element: 'a[href="/templates"]',
        popover: {
          title: 'Eksplor Marketplace Template',
          description: 'Kunjungi katalog marketplace Pinoka untuk melihat dan membeli berbagai karya tema website profesional rancangan para desainer.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Statistik Koleksi Tema Toko',
          description: 'Pantau jumlah template yang tersedia di sistem, template yang aktif terpasang di toko online Anda, serta varian gratis/premium.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3, .bg-card.border.rounded-3xl',
        popover: {
          title: 'Koleksi Tema Milik Anda & Terapkan',
          description: 'Daftar template yang telah Anda miliki. Klik "Terapkan ke Toko" untuk langsung mengganti tampilan storefront website toko Anda.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
];
