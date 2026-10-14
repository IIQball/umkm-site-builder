import type { RouteTourConfig } from './tenantTour';
import { getShellSteps } from './shellTour.helpers';

export const adminTourRoutes: RouteTourConfig[] = [
  // 1. Admin Home (/admin)
  {
    match: (path) => path.replace(/\/$/, '') === '/admin',
    steps: (isMobile) => [
      ...getShellSteps('admin', isMobile),
      {
        element: 'a[href="/admin/merchants"]',
        popover: {
          title: 'Tombol Kelola Merchant',
          description: 'Akses daftar seluruh merchant UMKM binaan yang berada di bawah pendampingan Anda.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: 'a[href="/templates"]',
        popover: {
          title: 'Pintasan Beli Template',
          description: 'Bantu pilihkan dan pasangkan template marketplace langsung untuk toko UMKM binaan Anda.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Metrik Pendampingan UMKM',
          description: 'Pantau jumlah merchant aktif binaan, transaksi pembelian template toko, dan saldo fee pendampingan Anda.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Aktivitas Terkini Merchant',
          description: 'Daftar pembeli template toko terbaru dan ringkasan riwayat pendaftaran merchant binaan.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 2. Merchant Binaan (/merchants)
  {
    match: (path) => path.includes('/merchants'),
    steps: () => [
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Ringkasan Toko Binaan',
          description: 'Pantau total merchant yang Anda dampingi, toko yang aktif publik, toko draf, dan merchant yang belum mengatur toko.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'input[placeholder*="Cari"]',
        popover: {
          title: 'Pencarian & Filter Status Toko',
          description: 'Cari toko UMKM berdasarkan nama usaha, nama pemilik merchant, atau saring berdasarkan status publikasi.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Toko UMKM Binaan & Aksi Pendampingan',
          description: 'Kelola pendampingan toko UMKM, salin ID merchant, atau buka langsung website toko binaan Anda.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 3. Link Undangan Registrasi (/registrations)
  {
    match: (path) => path.includes('/registrations'),
    steps: () => [
      {
        element: '#btn-create-invitation',
        popover: {
          title: 'Tombol Buat Undangan Baru',
          description: 'Buat tautan undangan pendaftaran khusus bagi pelaku UMKM binaan agar otomatis terhubung dengan akun pendamping Anda.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Statistik Undangan Registrasi',
          description: 'Pantau total undangan yang diterbitkan, pengguna yang sudah mendaftar, masa tunggu, dan link kedaluwarsa.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Daftar Link Undangan & Kontrol Token',
          description: 'Salin tautan pendaftaran, perpanjang masa aktif token jika kedaluwarsa, atau batalkan undangan.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 4. Log Aktivitas Sistem (/audit-logs)
  {
    match: (path) => path.includes('/audit-logs'),
    steps: () => [
      {
        element: 'select',
        popover: {
          title: 'Filter Aktivitas & Role',
          description: 'Saring log sistem berdasarkan tipe tindakan (Aktivasi, Penangguhan, Registrasi) atau peran pengguna.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Log Aktivitas Sistem & Keamanan',
          description: 'Catatan transparansi waktu tindakan, identitas pelaku, kategori aksi, dan detail teknis log.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 5. Riwayat Transaksi (/transactions)
  {
    match: (path) => path.includes('/transactions'),
    steps: () => [
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Ringkasan Transaksi Pembelian Template',
          description: 'Statistik pesanan template toko oleh merchant binaan: transaksi berhasil, tertunda, dan tagihan kedaluwarsa.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Riwayat Transaksi & Rincian Faktur',
          description: 'Daftar invoice resmi transaksi, rincian biaya template toko, dan fee jasa pendampingan admin.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 6. Dompet Admin (/admin/wallet)
  {
    match: (path) => path.includes('/admin/wallet'),
    steps: () => [
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Saldo Dompet Fee Pendampingan',
          description: 'Pantau saldo utama, saldo siap dicairkan, saldo penahanan settlement, dan akumulasi fee pendampingan Anda.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'form, button:has(.material-symbols-outlined)',
        popover: {
          title: 'Rekening Bank & Form Penarikan Dana',
          description: 'Daftarkan nomor rekening bank tujuan dan ajukan pencairan fee pendampingan ke rekening Anda.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Riwayat Mutasi Saldo & Payout Admin',
          description: 'Catatan transparansi seluruh mutasi fee jasa pendampingan dan riwayat status penarikan dana Anda.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 7. Pengaturan Akun (/account)
  {
    match: (path) => path.includes('/account'),
    steps: () => [
      {
        element: 'form:first-of-type, #name',
        popover: {
          title: 'Pengaturan Profil & Nama Lengkap',
          description: 'Perbarui nama lengkap akun Anda yang ditampilkan di dasbor dan dokumen resmi transaksi.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: '#currentPassword, form:last-of-type',
        popover: {
          title: 'Pengaturan Keamanan & Kata Sandi',
          description: 'Perbarui kata sandi akun secara berkala. Perubahan kata sandi dilindungi batas waktu cooldown keamanan 24 jam.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
];
