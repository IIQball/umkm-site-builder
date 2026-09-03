import type { TestimonialItem } from '@/types';

export interface ClientLogoItem {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface VideoReviewItem {
  id: string;
  title: string;
  customerName: string;
  location: string;
  coverImageUrl: string;
  videoUrl?: string;
}

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testi_1',
    customerName: 'Ibu Dian Sastro',
    rating: 5,
    comment: 'Roti sisirnya wangi butter banget, empuknya tahan sampai 3 hari tanpa seret di tenggorokan. Selalu pesan buat sarapan keluarga.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    platform: 'WhatsApp',
    role: 'Pelanggan Setia • Banyuwangi',
    verified: true,
  },
  {
    id: 'testi_2',
    customerName: 'Mas Dimas Pratama',
    rating: 5,
    comment: 'Kopi Ijen roastingannya presisi medium dark, crema tebal waktu dibuat espresso. Cocok banget nemenin kerja santai.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    platform: 'Instagram',
    role: 'Penikmat Kopi • Malang',
    verified: true,
  },
  {
    id: 'testi_3',
    customerName: 'Ibu Hj. Mariam',
    rating: 5,
    comment: 'Pelayanan katering syukuran kemarin sangat memuaskan. Nasi kotak datang tepat waktu dan bumbunya benar-benar gurih meresap.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    platform: 'Google Review',
    role: 'Pemesanan 150 Porsi • Jember',
    verified: true,
  },
];

export const DEFAULT_CLIENT_LOGOS: ClientLogoItem[] = [
  { id: 'logo_1', name: 'BANK BSI' },
  { id: 'logo_2', name: 'TELKOMSEL' },
  { id: 'logo_3', name: 'DISPERINDAG' },
  { id: 'logo_4', name: 'HOTEL SANTIKA' },
  { id: 'logo_5', name: 'POLITEKNIK' },
  { id: 'logo_6', name: 'GARUDA INDONESIA' },
];

export const DEFAULT_VIDEO_REVIEWS: VideoReviewItem[] = [
  {
    id: 'vid_1',
    title: 'Unboxing Madu Murni Alami',
    customerName: 'Kak Amanda',
    location: 'Jakarta Selatan',
    coverImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid_2',
    title: 'Review Seduh Kopi Ijen',
    customerName: 'Barista Reza',
    location: 'Bandung',
    coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'vid_3',
    title: 'Cicip Roti Sisir Hangat',
    customerName: 'Ibu Anita',
    location: 'Malang',
    coverImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  },
];

export const IMAGE_SUPPORTED_TESTIMONIALS_PRESETS = [
  'masonry_grid',
  'video_review_cards',
  'social_post_cards',
  'side_by_side_3_cards',
  'logo_client_cloud',
];

export function isTestimonialsImageSupported(preset: string): boolean {
  return IMAGE_SUPPORTED_TESTIMONIALS_PRESETS.includes(preset);
}

export function calculateAverageRating(testimonials: TestimonialItem[]): {
  average: number;
  total: number;
  satisfactionPercent: number;
} {
  if (!testimonials || testimonials.length === 0) {
    return { average: 5.0, total: 0, satisfactionPercent: 100 };
  }
  const total = testimonials.length;
  const sum = testimonials.reduce((acc, t) => acc + (Number(t.rating) || 5), 0);
  const average = Number((sum / total).toFixed(1));
  const satisfactionPercent = Math.min(100, Math.round((average / 5) * 100));
  return { average, total, satisfactionPercent };
}
