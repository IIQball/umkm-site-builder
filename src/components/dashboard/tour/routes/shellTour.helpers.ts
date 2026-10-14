import type { DriveStep } from 'driver.js';

export function getSidebarSelector(): string {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return '#mobile-sidebar-fab';
  }
  return '#dashboard-sidebar';
}

export function getShellSteps(role: string, isMobile: boolean): DriveStep[] {
  const sidebarSelector = getSidebarSelector();
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === 'designer') {
    return [
      {
        element: sidebarSelector,
        popover: {
          title: 'Navigasi Studio Desainer',
          description: 'Akses portofolio template Anda, rancang tema baru, pantau pesanan masuk, dan cek dompet royalti.',
          side: isMobile ? 'top' : 'right',
          align: 'start',
        },
      },
      {
        element: '#navbar-search',
        popover: {
          title: 'Pencarian Cepat Desain',
          description: 'Cari template desain, nomor invoice pembeli, atau fitur sistem dalam sekejap.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#navbar-notifications',
        popover: {
          title: 'Notifikasi Kurasi & Penjualan',
          description: 'Kabar instan saat template Anda disetujui kurator admin atau saat dibeli oleh merchant UMKM.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '#navbar-user-menu',
        popover: {
          title: 'Profil Desainer & Tema',
          description: 'Kelola informasi profil kreator Anda, ganti mode tema dasbor, dan akses pengaturan akun.',
          side: 'bottom',
          align: 'end',
        },
      },
    ];
  }

  if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
    return [
      {
        element: sidebarSelector,
        popover: {
          title: 'Navigasi Administrasi Platform',
          description: 'Pusat kontrol merchant binaan, antrean kurasi template, komisi platform, dan audit log.',
          side: isMobile ? 'top' : 'right',
          align: 'start',
        },
      },
      {
        element: '#navbar-search',
        popover: {
          title: 'Pencarian Global Platform',
          description: 'Cari toko UMKM binaan, akun pengguna, template marketplace, atau mutasi data sistem.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#navbar-notifications',
        popover: {
          title: 'Notifikasi Sistem & Pengajuan',
          description: 'Pantau pengajuan review template baru oleh desainer dan aktivitas penting operasional.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '#navbar-user-menu',
        popover: {
          title: 'Profil Administrator & Tema',
          description: 'Akses informasi akun admin Anda, aktifkan mode malam, atau keluar dari sesi dasbor.',
          side: 'bottom',
          align: 'end',
        },
      },
    ];
  }

  // Default: Merchant (Tenant)
  return [
    {
      element: sidebarSelector,
      popover: {
        title: 'Bilah Navigasi Toko',
        description: 'Akses ringkasan statistik toko, kelola katalog produk, kategori, dan riwayat pesanan.',
        side: isMobile ? 'top' : 'right',
        align: 'start',
      },
    },
    {
      element: '#navbar-search',
      popover: {
        title: 'Pencarian Menu & Fitur',
        description: 'Ketik kata kunci apa pun untuk langsung menemukan fitur toko atau transaksi.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#navbar-notifications',
      popover: {
        title: 'Lonceng Notifikasi Toko',
        description: 'Periksa notifikasi pembaruan pesanan WhatsApp pembeli dan panduan admin pendamping.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#navbar-user-menu',
      popover: {
        title: 'Menu Akun & Mode Tampilan',
        description: 'Kelola preferensi akun toko, ganti tema tampilan ke mode gelap/terang, dan sesi login.',
        side: 'bottom',
        align: 'end',
      },
    },
  ];
}
