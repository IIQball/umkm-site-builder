import type { StoreContentCustomization } from '../../onboarding.types';

export const FONT_HEADING_OPTIONS = [
  { label: 'Plus Jakarta Sans (Modern & Bersih)', value: 'Plus Jakarta Sans' },
  { label: 'Inter (Standar Digital)', value: 'Inter' },
  { label: 'Outfit (Trendy & Minimalis)', value: 'Outfit' },
  { label: 'Poppins (Geometris & Ramah)', value: 'Poppins' },
  { label: 'Montserrat (Klasik Elegan)', value: 'Montserrat' },
  { label: 'Playfair Display (Mewah & Eksklusif)', value: 'Playfair Display' },
];

export const FONT_BODY_OPTIONS = [
  { label: 'Inter (Sangat Nyaman Dibaca)', value: 'Inter' },
  { label: 'Plus Jakarta Sans (Harmonis)', value: 'Plus Jakarta Sans' },
  { label: 'Roboto (Jelas & Netral)', value: 'Roboto' },
  { label: 'Open Sans (Seimbang)', value: 'Open Sans' },
];

export const COLOR_PALETTES = [
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Royal Indigo', hex: '#6366f1' },
  { name: 'Rose Pink', hex: '#f43f5e' },
  { name: 'Warm Amber', hex: '#f59e0b' },
  { name: 'Deep Slate', hex: '#334155' },
];

export const HERO_IMAGE_PRESETS = [
  {
    name: 'Toko Modern',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Kuliner & Makanan',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Fashion & Pakaian',
    url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Kerajinan Tangan',
    url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
  },
];

export function createDefaultContentCustomization(
  storeName = '',
  categoryName = ''
): StoreContentCustomization {
  const name = storeName.trim() || 'Toko Unggulan Anda';
  const subtitle = categoryName
    ? `Pusat penyedia ${categoryName} berkualitas tinggi dengan jaminan mutu dan kemudahan order via WhatsApp.`
    : 'Produk terbaik pilihan pelanggan dengan kualitas teruji, pelayanan ramah, dan pemesanan WhatsApp instan.';

  return {
    theme: {
      primaryColor: '#0ea5e9',
      fontFamily: 'Inter',
      typography: {
        headingFont: 'Plus Jakarta Sans',
        bodyFont: 'Inter',
      },
    },
    header: {
      logoText: name,
      announcementText: 'Promo Spesial: Belanja hemat & gratis konsultasi produk via WhatsApp!',
    },
    hero: {
      title: name,
      subtitle,
      ctaText: 'Hubungi Penjual',
      badgeText: 'Koleksi Resmi 2026',
      imageUrl: HERO_IMAGE_PRESETS[0].url,
    },
    features: {
      heading: 'Mengapa Memilih Kami?',
      subheading: 'Dedikasi kami untuk memberikan pengalaman berbelanja terbaik bagi setiap pelanggan.',
      items: [
        {
          icon: 'ShieldCheck',
          title: 'Kualitas Terjamin 100%',
          description: 'Setiap produk diproduksi dan dikurasi secara teliti dengan standar mutu tinggi.',
        },
        {
          icon: 'Truck',
          title: 'Pengiriman Cepat & Aman',
          description: 'Didukung ekspedisi terpercaya dengan pengemasan ekstra aman sampai ke tujuan.',
        },
        {
          icon: 'MessageCircle',
          title: 'Layanan WhatsApp Ramah',
          description: 'Konsultasi cepat, responsif, dan siap membantu kebutuhan belanja Anda setiap hari.',
        },
      ],
    },
    faq: {
      heading: 'Pertanyaan yang Sering Diajukan',
      subheading: 'Jawaban praktis untuk pertanyaan umum seputar pesanan, pembayaran, dan pengiriman.',
      faqs: [
        {
          question: 'Bagaimana cara melakukan pemesanan?',
          answer: 'Pilih produk yang diinginkan dari katalog, lalu klik tombol pesan untuk otomatis tersambung ke WhatsApp kami.',
        },
        {
          question: 'Metode pembayaran apa saja yang diterima?',
          answer: 'Kami menerima transfer bank, QRIS, e-wallet, dan sistem pembayaran terverifikasi lainnya.',
        },
        {
          question: 'Berapa lama estimasi pesanan sampai?',
          answer: 'Pesanan dikirim dalam 1x24 jam kerja dengan estimasi tiba 2-4 hari kerja tergantung wilayah tujuan Anda.',
        },
      ],
    },
    footer: {
      brandName: name,
      tagline: 'Pilihan terbaik untuk produk berkualitas tinggi dan pelayanan terpercaya.',
      address: 'Jl. Merdeka No. 45, Banyuwangi, Jawa Timur',
    },
  };
}

export function buildTemplateCustomizationPayload(
  custom: StoreContentCustomization
): Record<string, unknown> {
  return {
    theme: {
      primaryColor: custom.theme.primaryColor,
      fontFamily: custom.theme.fontFamily,
      typography: {
        headingFont: custom.theme.typography.headingFont,
        bodyFont: custom.theme.typography.bodyFont,
      },
      colors: {
        primary: custom.theme.primaryColor,
      },
    },
    sections: [
      {
        type: 'header_announcement',
        props: {
          logoText: custom.header.logoText,
          announcementText: custom.header.announcementText,
        },
      },
      {
        type: 'hero',
        props: {
          title: custom.hero.title,
          subtitle: custom.hero.subtitle,
          ctaText: custom.hero.ctaText,
          badgeText: custom.hero.badgeText,
          imageUrl: custom.hero.imageUrl,
        },
      },
      {
        type: 'features',
        props: {
          heading: custom.features.heading,
          subheading: custom.features.subheading,
          items: custom.features.items,
        },
      },
      {
        type: 'faq',
        props: {
          heading: custom.faq.heading,
          subheading: custom.faq.subheading,
          faqs: custom.faq.faqs,
        },
      },
      {
        type: 'footer',
        props: {
          brandName: custom.footer.brandName,
          tagline: custom.footer.tagline,
          address: custom.footer.address,
        },
      },
    ],
  };
}

export function extractContentCustomizationFromStore(
  raw: unknown,
  storeName = '',
  categoryName = ''
): StoreContentCustomization {
  const fallback = createDefaultContentCustomization(storeName, categoryName);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const obj = raw as Record<string, unknown>;
  const theme = (obj.theme && typeof obj.theme === 'object') ? (obj.theme as Record<string, unknown>) : {};
  const typography = (theme.typography && typeof theme.typography === 'object') ? (theme.typography as Record<string, unknown>) : {};

  // Extract from sections
  const sections = Array.isArray(obj.sections) ? (obj.sections as Array<Record<string, unknown>>) : [];
  const headerSec = sections.find((s) => s.type === 'header_announcement')?.props as Record<string, unknown> | undefined;
  const heroSec = sections.find((s) => s.type === 'hero')?.props as Record<string, unknown> | undefined;
  const featuresSec = sections.find((s) => s.type === 'features')?.props as Record<string, unknown> | undefined;
  const faqSec = sections.find((s) => s.type === 'faq')?.props as Record<string, unknown> | undefined;
  const footerSec = sections.find((s) => s.type === 'footer')?.props as Record<string, unknown> | undefined;

  return {
    theme: {
      primaryColor: (theme.primaryColor as string) || fallback.theme.primaryColor,
      fontFamily: (theme.fontFamily as string) || fallback.theme.fontFamily,
      typography: {
        headingFont: (typography.headingFont as string) || fallback.theme.typography.headingFont,
        bodyFont: (typography.bodyFont as string) || fallback.theme.typography.bodyFont,
      },
    },
    header: {
      logoText: (headerSec?.logoText as string) || fallback.header.logoText,
      announcementText: (headerSec?.announcementText as string) || fallback.header.announcementText,
    },
    hero: {
      title: (heroSec?.title as string) || fallback.hero.title,
      subtitle: (heroSec?.subtitle as string) || fallback.hero.subtitle,
      ctaText: (heroSec?.ctaText as string) || fallback.hero.ctaText,
      badgeText: (heroSec?.badgeText as string) || fallback.hero.badgeText,
      imageUrl: (heroSec?.imageUrl as string) || fallback.hero.imageUrl,
    },
    features: {
      heading: (featuresSec?.heading as string) || fallback.features.heading,
      subheading: (featuresSec?.subheading as string) || fallback.features.subheading,
      items: Array.isArray(featuresSec?.items) && featuresSec.items.length > 0
        ? (featuresSec.items as Array<Record<string, unknown>>).map((it) => ({
            icon: typeof it.icon === 'string' ? it.icon : 'ShieldCheck',
            title: typeof it.title === 'string' ? it.title : 'Keunggulan',
            description: typeof it.description === 'string' ? it.description : '',
          }))
        : fallback.features.items,
    },
    faq: {
      heading: (faqSec?.heading as string) || fallback.faq.heading,
      subheading: (faqSec?.subheading as string) || fallback.faq.subheading,
      faqs: Array.isArray(faqSec?.faqs) && faqSec.faqs.length > 0
        ? (faqSec.faqs as Array<Record<string, unknown>>).map((f) => ({
            question: typeof f.question === 'string' ? f.question : '',
            answer: typeof f.answer === 'string' ? f.answer : '',
          }))
        : fallback.faq.faqs,
    },
    footer: {
      brandName: (footerSec?.brandName as string) || fallback.footer.brandName,
      tagline: (footerSec?.tagline as string) || fallback.footer.tagline,
      address: (footerSec?.address as string) || fallback.footer.address,
    },
  };
}
