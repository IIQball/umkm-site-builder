/**
 * Tipe data payload dan state untuk Studio Desain AI Merchant
 */

export type AiStudioMainTab = 'studio' | 'gallery';
export type AiStudioSubTab = 'packaging' | 'poster' | 'logo';

export interface AiStudioGeneratePayload {
  featureType: 'logo' | 'packaging_mockup' | 'product_poster';
  prompt: string;
  image?: string;
  size?: '1024x1024' | '1024x1536';
  storeName?: string;
  visualStyle?: string;
  conceptType?: string;
  businessCategory?: string;
  logoText?: string;
  lockupType?: string;
  fontFamily?: string;
  packagingType?: string;
  productLabel?: string;
  presentationStyle?: string;
  posterStyle?: string;
  productName?: string;
  titleText?: string;
  subText?: string;
  colorPalette?: string;
  focalSubject?: string;
  qualityTier?: 'standard' | 'high';
}
