export interface TemplateItem {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  slug?: string;
  categoryName?: string | null;
  isOwned?: boolean;
  config?: unknown;
}

export interface RegionData {
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  hamlet: string;
  street: string;
}

export interface StoreFeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface StoreFaqItem {
  question: string;
  answer: string;
}

export interface StoreTestimonialItem {
  id?: string;
  customerName: string;
  comment: string;
  rating: number;
  role?: string;
  avatar?: string;
}

export interface StoreBranchItem {
  id: string;
  name: string;
  address: string;
  googleMapsUrl?: string;
}

export interface StoreContentCustomization {
  theme: {
    primaryColor: string;
    fontFamily: string;
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
  header: {
    logoText: string;
    logoImageUrl?: string;
    announcementText: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    badgeText: string;
    imageUrl: string;
  };
  features: {
    heading: string;
    subheading: string;
    items: StoreFeatureItem[];
  };
  testimonials?: {
    heading: string;
    subheading: string;
    items: StoreTestimonialItem[];
  };
  faq: {
    heading: string;
    subheading: string;
    faqs: StoreFaqItem[];
  };
  maps?: {
    branchMode?: 'single' | 'multi';
    branches?: StoreBranchItem[];
  };
  footer: {
    brandName?: string;
    logoImageUrl?: string;
    tagline: string;
    storeHours?: string;
    address: string;
    copyrightText?: string;
  };
}

export interface ExistingStoreData {
  id: string;
  name: string;
  subdomain: string;
  categoryId?: string | null;
  waNumber: string;
  googleMapsUrl: string;
  address?: string | null;
  templateId?: string | null;
  regionData?: RegionData | null;
  isOpen?: boolean;
  waCheckoutTemplate?: string | null;
  status?: string;
  registeredByName?: string | null;
  branchMode?: 'single' | 'multi';
  branches?: StoreBranchItem[];
  customization?: Record<string, unknown> | null;
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

export interface SavedOnboardingState {
  currentStep?: OnboardingStep;
  subdomain?: string;
  storeName?: string;
  categoryId?: string;
  waNumber?: string;
  googleMapsUrl?: string;
  address?: string;
  selectedTemplateId?: string;
  regionData?: RegionData;
  subdomainStatus?: ValidationStatus;
  subdomainMessage?: string;
  branchMode?: 'single' | 'multi';
  branches?: StoreBranchItem[];
  contentCustomization?: StoreContentCustomization;
}
