import type {
  StoreContentCustomization,
  StoreBranchItem,
} from '../../onboarding.types';
import {
  createDefaultContentCustomization,
  DEFAULT_ONBOARDING_TESTIMONIALS,
} from './contentCustomization.defaults';

export function extractContentCustomizationFromStore(
  raw: unknown,
  storeName = '',
  categoryName = '',
  storeAddress = ''
): StoreContentCustomization {
  const fallback = createDefaultContentCustomization(storeName, categoryName, storeAddress);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return fallback;
  }

  const obj = raw as Record<string, unknown>;
  const theme = (obj.theme && typeof obj.theme === 'object') ? (obj.theme as Record<string, unknown>) : {};
  const typography = (theme.typography && typeof theme.typography === 'object') ? (theme.typography as Record<string, unknown>) : {};

  const sections = Array.isArray(obj.sections) ? (obj.sections as Array<Record<string, unknown>>) : [];
  const headerSec = sections.find((s) => s.type === 'header_announcement')?.props as Record<string, unknown> | undefined;
  const heroSec = sections.find((s) => s.type === 'hero')?.props as Record<string, unknown> | undefined;
  const featuresSec = sections.find((s) => s.type === 'features')?.props as Record<string, unknown> | undefined;
  const testiSec = sections.find((s) => s.type === 'testimonials')?.props as Record<string, unknown> | undefined;
  const faqSec = sections.find((s) => s.type === 'faq')?.props as Record<string, unknown> | undefined;
  const mapsSec = sections.find((s) => s.type === 'google_maps')?.props as Record<string, unknown> | undefined;
  const footerSec = sections.find((s) => s.type === 'footer')?.props as Record<string, unknown> | undefined;

  const rawFeatures = (Array.isArray(featuresSec?.items) && featuresSec.items.length > 0)
    ? featuresSec.items
    : (Array.isArray(featuresSec?.features) && featuresSec.features.length > 0)
      ? featuresSec.features
      : null;

  const rawTestimonials = (Array.isArray(testiSec?.testimonials) && testiSec.testimonials.length > 0)
    ? testiSec.testimonials
    : null;

  const colors = (theme.colors && typeof theme.colors === 'object') ? (theme.colors as Record<string, string>) : undefined;
  const primaryColor = (typeof theme.primaryColor === 'string' && theme.primaryColor)
    || (colors && typeof colors.primary === 'string' ? colors.primary : '')
    || fallback.theme.primaryColor;
  const fontFamily = (typeof theme.fontFamily === 'string' && theme.fontFamily) || fallback.theme.fontFamily;

  const branchList = (Array.isArray(mapsSec?.branches) && mapsSec.branches.length > 0
    ? mapsSec.branches
    : Array.isArray(obj.branches) && obj.branches.length > 0
      ? obj.branches
      : []) as StoreBranchItem[];

  return {
    theme: {
      primaryColor,
      fontFamily,
      typography: {
        headingFont: (typography.headingFont as string) || fallback.theme.typography.headingFont,
        bodyFont: (typography.bodyFont as string) || fallback.theme.typography.bodyFont,
      },
    },
    header: {
      logoText: (headerSec?.logoText as string) || storeName || fallback.header.logoText,
      logoImageUrl: (headerSec?.logoImageUrl as string) || (footerSec?.logoImageUrl as string) || fallback.header.logoImageUrl || '',
      announcementText: (headerSec?.announcementText as string) || (headerSec?.promoTitle as string) || fallback.header.announcementText,
    },
    hero: {
      title: (heroSec?.title as string) || storeName || fallback.hero.title,
      subtitle: (heroSec?.subtitle as string) || fallback.hero.subtitle,
      ctaText: (heroSec?.ctaText as string) || fallback.hero.ctaText,
      badgeText: (heroSec?.badgeText as string) || fallback.hero.badgeText,
      imageUrl: (heroSec?.imageUrl as string) || fallback.hero.imageUrl,
    },
    features: {
      heading: (featuresSec?.heading as string) || (featuresSec?.title as string) || fallback.features.heading,
      subheading: (featuresSec?.subheading as string) || (featuresSec?.subtitle as string) || fallback.features.subheading,
      items: rawFeatures
        ? (rawFeatures as Array<Record<string, unknown>>).map((it) => ({
            icon: typeof it.icon === 'string' ? it.icon : (typeof it.iconName === 'string' ? it.iconName : 'ShieldCheck'),
            title: typeof it.title === 'string' ? it.title : 'Keunggulan',
            description: typeof it.description === 'string' ? it.description : '',
          }))
        : fallback.features.items,
    },
    testimonials: {
      heading: (testiSec?.title as string) || fallback.testimonials?.heading || 'Apa Kata Pelanggan Kami',
      subheading: (testiSec?.subtitle as string) || fallback.testimonials?.subheading || '',
      items: rawTestimonials
        ? (rawTestimonials as Array<Record<string, unknown>>).map((t, idx) => ({
            id: typeof t.id === 'string' ? t.id : `testi_${idx + 1}`,
            customerName: typeof t.customerName === 'string' ? t.customerName : 'Pelanggan',
            comment: typeof t.comment === 'string' ? t.comment : '',
            rating: typeof t.rating === 'number' ? t.rating : 5,
            role: typeof t.role === 'string' ? t.role : 'Pelanggan Terverifikasi',
            avatar: typeof t.avatar === 'string' ? t.avatar : '',
          }))
        : [...DEFAULT_ONBOARDING_TESTIMONIALS],
    },
    faq: {
      heading: (faqSec?.heading as string) || (faqSec?.title as string) || fallback.faq.heading,
      subheading: (faqSec?.subheading as string) || (faqSec?.subtitle as string) || fallback.faq.subheading,
      faqs: Array.isArray(faqSec?.faqs) && faqSec.faqs.length > 0
        ? (faqSec.faqs as Array<Record<string, unknown>>).map((f) => ({
            question: typeof f.question === 'string' ? f.question : '',
            answer: typeof f.answer === 'string' ? f.answer : '',
          }))
        : fallback.faq.faqs,
    },
    maps: {
      branchMode: ((mapsSec?.branchMode as string) || (obj.branchMode as string) || (branchList.length > 1 ? 'multi' : 'single')) as 'single' | 'multi',
      branches: branchList,
    },
    footer: {
      brandName: (footerSec?.brandName as string) || (headerSec?.logoText as string) || storeName || fallback.footer.brandName,
      logoImageUrl: (footerSec?.logoImageUrl as string) || (headerSec?.logoImageUrl as string) || fallback.footer.logoImageUrl || '',
      tagline: (footerSec?.tagline as string) || (footerSec?.description as string) || fallback.footer.tagline,
      storeHours: (footerSec?.storeHours as string) || fallback.footer.storeHours,
      address: storeAddress || (footerSec?.address as string) || fallback.footer.address,
      copyrightText: (footerSec?.copyrightText as string) || fallback.footer.copyrightText,
    },
  };
}
