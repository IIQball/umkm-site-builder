import type { RouteTourConfig } from './tenantTour';
import { getShellSteps } from './shellTour.helpers';

export const superadminTourRoutes: RouteTourConfig[] = [
  // 1. Superadmin Home (/superadmin)
  {
    match: (path) => path.replace(/\/$/, '') === '/superadmin',
    steps: (isMobile) => [
      ...getShellSteps('superadmin', isMobile),
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Metrik Ekosistem Platform',
          description: 'Statistik menyeluruh: total merchant terdaftar, pendapatan fee kas platform, antrean kurasi, dan volume transaksi.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Log Aktivitas Terbaru Sistem',
          description: 'Pantau jejak aktivitas autentikasi, kurasi template, perubahan komisi, dan operasional terkini platform.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 2. Master Kategori Template (/template-categories)
  {
    match: (path) => path.includes('/template-categories'),
    steps: () => [
      {
        element: '#btn-add-category-top',
        popover: {
          title: 'Tombol Tambah Kategori',
          description: 'Tambahkan master kategori bisnis UMKM baru yang dapat dipilih desainer saat membuat template.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-3',
        popover: {
          title: 'Statistik Master Kategori',
          description: 'Statcard menampilkan total kategori terdaftar, kategori aktif, dan kepatuhan standar pasar.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'input[placeholder*="Cari"]',
        popover: {
          title: 'Pencarian Kategori Bisnis',
          description: 'Saring kategori bisnis berdasarkan nama atau slug secara instan.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Master Kategori & Kontrol Data',
          description: 'Kelola kategori bisnis UMKM. Gunakan tombol edit untuk memperbarui nama/slug atau hapus kategori.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 3. Pengaturan Platform & Komisi (/settings)
  {
    match: (path) => path.includes('/settings') && !path.includes('/account'),
    steps: () => [
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3',
        popover: {
          title: 'Parameter Finansial Platform',
          description: 'Ringkasan potongan fee platform, bagian royalti desainer, fee pendamping admin, dan batas cabang toko.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'form',
        popover: {
          title: 'Formulir Konfigurasi Komisi & Aturan',
          description: 'Tentukan fee platform, komisi pendamping, durasi penahanan settlement delay, dan batas revisi template.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: 'button[type="submit"]',
        popover: {
          title: 'Tombol Simpan Parameter',
          description: 'Simpan konfigurasi parameter komisi dan aturan operasional platform.',
          side: 'top',
          align: 'end',
        },
      },
    ],
  },

  // 4. Kurasi Review Template (/templates in superadmin)
  {
    match: (path) =>
      path.includes('/templates') && path.includes('/superadmin'),
    steps: () => [
      {
        element: 'a[href*="/template-categories"]',
        popover: {
          title: 'Pintasan Master Kategori',
          description: 'Akses cepat master kategori bisnis untuk memastikan taksonomi template sesuai standar.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Antrean Kurasi Desain Template',
          description: 'Pantau total pengajuan template, template disetujui, antrean menunggu review, dan yang butuh revisi.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Review & Keputusan Kurasi',
          description: 'Tinjau visual template, periksa harga jual, dan klik Setujui atau Tolak dengan catatan perbaikan bagi desainer.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 5. Manajemen Pengguna (/users)
  {
    match: (path) => path.includes('/users'),
    steps: () => [
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Statistik Pengguna Platform',
          description: 'Ringkasan akun ditangguhkan, total pengguna terdaftar, pengguna aktif, dan akun menunggu aktivasi.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'input[placeholder*="Cari"]',
        popover: {
          title: 'Pencarian & Filter Pengguna',
          description: 'Temukan data pengguna berdasarkan nama atau email, serta saring berdasarkan peran (Admin, Merchant, Desainer).',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Pengguna & Kontrol Akun',
          description: 'Pantau peran pengguna, status akun aktif, lihat detail profil, atau lakukan penangguhan akun jika terjadi pelanggaran.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 6. Whitelist Admin (/whitelist)
  {
    match: (path) => path.includes('/whitelist'),
    steps: () => [
      {
        element: '#btn-add-admin-whitelist',
        popover: {
          title: 'Tombol Tambah Akun Administrator',
          description: 'Daftarkan administrator baru untuk membantu mengelola operasional dan pendampingan merchant platform.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.md\\:grid-cols-3',
        popover: {
          title: 'Statistik Administrator Platform',
          description: 'Pantau jumlah administrator terdaftar, admin berstatus aktif, dan akun yang sedang diblokir.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Manajemen Otoritas Admin',
          description: 'Kelola status akses administrator, buka rincian akun, atau blokir akses administrator tertentu.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
];
