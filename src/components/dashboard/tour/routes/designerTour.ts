import type { RouteTourConfig } from './tenantTour';
import { getShellSteps } from './shellTour.helpers';

export const designerTourRoutes: RouteTourConfig[] = [
  // 1. Designer Home (/designer)
  {
    match: (path) => path.replace(/\/$/, '') === '/designer',
    steps: (isMobile) => [
      ...getShellSteps('designer', isMobile),
      {
        element: 'a[href="/builder/new"]',
        popover: {
          title: 'Tombol Buat Template Baru',
          description: 'Mulai rancang tema website toko online baru dengan visual drag-and-drop builder kami.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: 'a[href="/designer/wallet"]',
        popover: {
          title: 'Pintasan Dompet & Finansial',
          description: 'Akses cepat ke ringkasan saldo komisi, rekening bank, dan pengajuan penarikan dana payout.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4, .grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4',
        popover: {
          title: 'Metrik Performa Portofolio',
          description: 'Pantau jumlah template yang Anda buat, template yang telah disetujui kurator, pesanan masuk, dan total royalti.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.space-y-6',
        popover: {
          title: 'Grafik Tren Pertumbuhan Desain',
          description: 'Visualisasi analitik pertumbuhan pembuatan karya dan tren pembelian template oleh merchant UMKM dari waktu ke waktu.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 2. Designer Template Saya (/designer/templates)
  {
    match: (path) => path.includes('/designer/templates'),
    steps: () => [
      {
        element: 'a[href="/builder/new"]',
        popover: {
          title: 'Tombol Rancang Template Baru',
          description: 'Buka no-code visual builder untuk mendesain tema toko baru dengan preset section lengkap.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2, .grid.grid-cols-1.lg\\:grid-cols-4, .grid.gap-5',
        popover: {
          title: 'Ringkasan Status Kurasi Template',
          description: 'Pantau total portofolio tema Anda: draf yang sedang dikerjakan, menunggu kurasi admin, disetujui, atau butuh revisi.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Portofolio Karya & Kontrol Status',
          description: 'Kelola seluruh karya desain Anda, periksa harga jual, buka builder untuk mengedit, atau ajukan ke kurasi admin.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 3. Designer Pesanan Masuk (/designer/orders)
  {
    match: (path) => path.includes('/designer/orders'),
    steps: () => [
      {
        element: 'a[href="/designer/wallet"]',
        popover: {
          title: 'Pintasan Dompet Keuangan',
          description: 'Buka halaman saldo dan transfer royalti untuk mencairkan penghasilan dari pesanan yang telah lunas.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Statistik Pesanan Template Masuk',
          description: 'Pantau total pesanan template yang dibeli oleh merchant UMKM, komisi bersih hak Anda, dan tagihan pending.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Tabel Transaksi Pembelian Template',
          description: 'Rincian transaksi invoice, nama merchant pembeli, harga template, dan persentase komisi bersih hak kreator Anda.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },

  // 4. Designer Dompet Keuangan & Payout (/designer/wallet)
  {
    match: (path) => path.includes('/designer/wallet'),
    steps: () => [
      {
        element: '.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-4',
        popover: {
          title: 'Ringkasan Saldo & Royalti',
          description: 'Pantau saldo utama, saldo yang siap dicairkan, saldo penahanan masa settlement delay, dan akumulasi royalti.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: 'form, button:has(.material-symbols-outlined)',
        popover: {
          title: 'Rekening Bank & Pengajuan Payout',
          description: 'Daftarkan nomor rekening bank tujuan dan ajukan pencairan saldo royalti langsung ke rekening Anda.',
          side: 'top',
          align: 'center',
        },
      },
      {
        element: 'table',
        popover: {
          title: 'Riwayat Mutasi Saldo & Payout',
          description: 'Catatan transparansi mutasi kredit penjualan template serta riwayat dan status permohonan penarikan dana Anda.',
          side: 'top',
          align: 'center',
        },
      },
    ],
  },
];
