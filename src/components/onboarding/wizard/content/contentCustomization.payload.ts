import type { StoreContentCustomization } from '../../onboarding.types';

export function buildTemplateCustomizationPayload(
  custom: StoreContentCustomization
): Record<string, unknown> {
  const mappedFeatureItems = custom.features.items.map((it, idx) => ({
    id: `f-${idx}`,
    icon: it.icon,
    iconName: it.icon,
    title: it.title,
    description: it.description,
  }));

  const mappedFaqs = custom.faq.faqs.map((f, idx) => ({
    id: `faq-${idx}`,
    question: f.question,
    answer: f.answer,
  }));

  const mappedTestimonials = (custom.testimonials?.items || []).map((t, idx) => ({
    id: t.id || `testi_${idx + 1}`,
    customerName: t.customerName,
    comment: t.comment,
    rating: t.rating || 5,
    role: t.role || 'Pelanggan Terverifikasi',
    avatar: t.avatar || '',
    verified: true,
    platform: 'WhatsApp',
  }));

  const sections: Array<Record<string, unknown>> = [
    {
      type: 'header_announcement',
      props: {
        logoText: custom.header.logoText,
        logoImageUrl: custom.header.logoImageUrl || '',
        announcementText: custom.header.announcementText,
        promoTitle: custom.header.announcementText,
        deliveryText: custom.header.announcementText,
        showAnnouncement: true,
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
        title: custom.features.heading,
        heading: custom.features.heading,
        subtitle: custom.features.subheading,
        subheading: custom.features.subheading,
        items: mappedFeatureItems,
        features: mappedFeatureItems,
      },
    },
    {
      type: 'testimonials',
      props: {
        title: custom.testimonials?.heading || 'Apa Kata Pelanggan Kami',
        subtitle: custom.testimonials?.subheading || '',
        testimonials: mappedTestimonials,
      },
    },
    {
      type: 'faq',
      props: {
        title: custom.faq.heading,
        heading: custom.faq.heading,
        subtitle: custom.faq.subheading,
        subheading: custom.faq.subheading,
        faqs: mappedFaqs,
      },
    },
    {
      type: 'footer',
      props: {
        brandName: custom.footer.brandName || custom.header.logoText || custom.hero.title,
        logoImageUrl: custom.footer.logoImageUrl || custom.header.logoImageUrl || '',
        tagline: custom.footer.tagline,
        description: custom.footer.tagline,
        storeHours: custom.footer.storeHours,
        address: custom.footer.address,
        copyrightText: custom.footer.copyrightText,
      },
    },
  ];

  if (custom.maps && custom.maps.branches && custom.maps.branches.length > 0) {
    sections.push({
      type: 'google_maps',
      props: {
        branchMode: custom.maps.branchMode || 'single',
        branches: custom.maps.branches,
      },
    });
  }

  return {
    theme: {
      primaryColor: custom.theme.primaryColor,
      fontFamily: custom.theme.typography?.bodyFont || custom.theme.fontFamily,
      typography: {
        headingFont: custom.theme.typography.headingFont,
        bodyFont: custom.theme.typography.bodyFont,
      },
      colors: {
        primary: custom.theme.primaryColor,
      },
    },
    sections,
    branchMode: custom.maps?.branchMode || 'single',
    branches: custom.maps?.branches || [],
  };
}
