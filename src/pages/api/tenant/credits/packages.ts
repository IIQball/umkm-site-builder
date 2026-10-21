import type { APIRoute } from 'astro';
import { jsonSuccess, jsonError, handleApiRoute } from '@/lib/utils/api-handler';

interface CreditPackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  credits: number;
  description: string;
  benefits: string[];
  isPopular: boolean;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'pkg-hemat',
    name: 'Paket Hemat',
    slug: 'paket-hemat',
    price: 15000,
    credits: 6,
    description: 'Cocok untuk pemula yang ingin mencoba AI features',
    benefits: [
      '6 kredit AI',
      'Akses fitur logo generation',
      'Hasil berkualitas standar',
    ],
    isPopular: false,
  },
  {
    id: 'pkg-reguler',
    name: 'Paket Reguler',
    slug: 'paket-reguler',
    price: 25000,
    credits: 12,
    description: 'Pilihan terbaik untuk bisnis berkembang',
    benefits: [
      '12 kredit AI',
      'Semua fitur AI tersedia',
      'Hasil berkualitas tinggi',
      'Prioritas support',
    ],
    isPopular: true,
  },
  {
    id: 'pkg-juragan',
    name: 'Paket Juragan',
    slug: 'paket-juragan',
    price: 50000,
    credits: 30,
    description: 'Untuk bisnis scale-up dengan kebutuhan tinggi',
    benefits: [
      '30 kredit AI',
      'Semua fitur unlimited',
      'Hasil berkualitas premium',
      '24/7 dedicated support',
      'Konsultasi desain gratis',
    ],
    isPopular: false,
  },
];

export const GET: APIRoute = async (): Promise<Response> =>
  handleApiRoute(async () => {
    try {
      return jsonSuccess(
        {
          packages: CREDIT_PACKAGES,
          total: CREDIT_PACKAGES.length,
        },
        200
      );
    } catch (error: unknown) {
      console.error('[CREDIT_PACKAGES] fetch error:', error);
      return jsonError('Gagal mengambil data paket kredit', 500);
    }
  });
