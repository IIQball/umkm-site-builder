import type {
  PackagingType,
  MockupPresentationStyle,
} from '@/lib/validators/ai-packaging';

export interface PackagingTypeOption {
  id: PackagingType;
  title: string;
  badge: string;
  description: string;
  recommendation: string;
}

export const PACKAGING_TYPE_OPTIONS: PackagingTypeOption[] = [
  {
    id: 'standing_pouch',
    title: 'Standing Pouch',
    badge: 'Paling Populer',
    description: 'Kantong berdiri fleksibel dengan ritsleting ziplock atas.',
    recommendation: 'Cocok untuk keripik, biji kopi, biskuit, & abon',
  },
  {
    id: 'aluminium_pouch',
    title: 'Aluminium Pouch',
    badge: 'Kedap Udara',
    description: 'Bahan foil metalik matte kedap udara & cahaya matahari.',
    recommendation: 'Ideal untuk bubuk kopi, teh herbal, & rempah',
  },
  {
    id: 'box_kraft',
    title: 'Box Kraft Karton',
    badge: 'Eco-Friendly',
    description: 'Kardus boks lipat warna cokelat alami ramah lingkungan.',
    recommendation: 'Bagus untuk bakery, pastry, sabun organik, & souvenir',
  },
  {
    id: 'paper_bowl',
    title: 'Paper Bowl',
    badge: 'Kuliner',
    description: 'Mangkok kertas tebal laminasi anti minyak dengan tutup bening.',
    recommendation: 'Pas untuk rice bowl, salad, mie, & dessert basah',
  },
];

export interface MockupPresentationOption {
  id: MockupPresentationStyle;
  title: string;
  badge: string;
  description: string;
  lightingNote: string;
  bgColor: string;
}

export const MOCKUP_PRESENTATION_OPTIONS: MockupPresentationOption[] = [
  {
    id: 'clean_studio',
    title: 'Studio Foto Bersih',
    badge: 'Katalog Marketplace',
    description: 'Latar abu-abu terang yang bersih dan rapi dengan pencahayaan merata untuk etalase produk toko.',
    lightingNote: 'Pencahayaan studio terang merata',
    bgColor: '#F6F5F2',
  },
  {
    id: 'monolith_podium',
    title: 'Podium Batu Modern',
    badge: 'Minimalis Elegan',
    description: 'Diletakkan di atas podium batu estetik dengan bayangan dedaunan alami yang anggun.',
    lightingNote: 'Sinar matahari dengan bayangan daun',
    bgColor: '#E2E8F0',
  },
  {
    id: 'vietnam_tabletop',
    title: 'Meja Kayu Kafe',
    badge: 'Kesan Hangat',
    description: 'Permukaan meja kayu alami berkesan ramah dengan cahaya matahari samping dari jendela.',
    lightingNote: 'Cahaya pagi dari jendela',
    bgColor: '#EAD7BB',
  },
  {
    id: 'eco_craft',
    title: 'Nuansa Alami & Kain',
    badge: 'Ramah Lingkungan',
    description: 'Alas kain tenun alami dengan latar warna terakota hangat yang cocok untuk produk organik.',
    lightingNote: 'Cahaya hangat lembut',
    bgColor: '#D4A373',
  },
  {
    id: 'dark_spotlight',
    title: 'Studio Gelap Mewah',
    badge: 'Eksklusif',
    description: 'Latar gelap elegan dengan sorotan lampu fokus yang mempertegas lekuk kemasan produk.',
    lightingNote: 'Lampu sorot fokus & tepi bersinar',
    bgColor: '#1C1C1E',
  },
  {
    id: 'floating_hero',
    title: 'Melayang Dinamis',
    badge: 'Modern Menarik',
    description: 'Kemasan melayang dengan sudut dinamis dan bayangan jatuh lembut yang memikat pembeli.',
    lightingNote: 'Efek melayang 3 dimensi',
    bgColor: '#CBD5E1',
  },
];
