import type { ProductItem } from '@/types/builder';

export const DEFAULT_DEMO_PRODUCTS: ProductItem[] = [
  {
    name: 'Kopi Arabika Gayo Specialty 250g',
    price: 85000,
    badge: 'Terlaris',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Madu Hutan Alami Murni 500ml',
    price: 120000,
    badge: 'Organik',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Keripik Tempe Renyah Gurih 200g',
    price: 25000,
    badge: 'Baru',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sambal Cakalang Khas Nusantara',
    price: 45000,
    badge: 'Favorit',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  },
];

export const getBadgeColorClass = (color: string): string => {
  switch (color) {
    case 'emerald': return 'bg-emerald-500 text-white shadow-sm dark:bg-emerald-600';
    case 'amber': return 'bg-amber-500 text-white shadow-sm dark:bg-amber-600';
    case 'blue': return 'bg-blue-600 text-white shadow-sm dark:bg-blue-500';
    case 'violet': return 'bg-violet-600 text-white shadow-sm dark:bg-violet-500';
    case 'slate': return 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900';
    case 'rose':
    default: return 'bg-rose-500 text-white shadow-sm dark:bg-rose-600';
  }
};

export const getCardPresetClass = (preset: string): string => {
  switch (preset) {
    case 'minimal_bordered':
      return 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-none hover:border-slate-400 dark:hover:border-slate-600';
    case 'flat_filled':
      return 'bg-slate-100/90 dark:bg-slate-800/80 border-0 shadow-none hover:bg-slate-200/80 dark:hover:bg-slate-800';
    case 'horizontal':
      return 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md';
    case 'elevated_shadow':
    default:
      return 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:-translate-y-0.5';
  }
};
