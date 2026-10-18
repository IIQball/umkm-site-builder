/**
 * AI Generation & Quota Domain Types
 * Shared Contract for Virda AI Studio & Store Quota Management
 */

// ==========================================
// 1. ENUMS & CONSTANTS
// ==========================================

export const AI_FEATURE_TYPES = [
  'logo',
  'packaging_mockup',
  'product_poster',
] as const;

export type AiFeatureType = (typeof AI_FEATURE_TYPES)[number];

export const AI_GENERATION_STATUSES = [
  'pending',
  'processing',
  'success',
  'failed',
] as const;

export type AiGenerationStatus = (typeof AI_GENERATION_STATUSES)[number];

export type AiSizeRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export type AiQualityTier = 'standard' | 'hd' | 'ultra';

// ==========================================
// 2. DATABASE ENTITY / MODEL INTERFACES
// ==========================================

export interface TenantAiCredit {
  id: string;
  tenantId: string;
  userId?: string | null;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AiGenerationLog {
  id: string;
  tenantId?: string | null;
  userId?: string | null;
  isTesting: boolean;
  featureType: AiFeatureType;
  modelUsed: string;
  sizeRatio?: string | null;
  qualityTier?: string | null;
  promptFinal: string;
  inputTokens: number;
  outputTokens: number;
  creditsDeducted: number;
  costUsd: number;
  costIdr: number;
  cloudinaryUrl?: string | null;
  status: string;
  errorMessage?: string | null;
  createdAt: string | Date;
}

export interface StoreQuotaPackage {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  additionalProducts: number;
  additionalCategories: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface StoreQuotaPurchase {
  id: string;
  storeId: string;
  userId?: string | null;
  packageId?: string | null;
  transactionId?: string | null;
  productsAdded: number;
  categoriesAdded: number;
  createdAt: string | Date;
}

// ==========================================
// 3. REQUEST & RESPONSE DTOs
// ==========================================

export interface GenerateAiImageRequest {
  featureType: AiFeatureType;
  prompt: string;
  sizeRatio?: AiSizeRatio;
  qualityTier?: AiQualityTier;
  stylePreset?: string;
  negativePrompt?: string;
  referenceImageUrl?: string;
  isTesting?: boolean;
  storeId?: string;
}

export interface GenerateLogoPromptInput {
  storeName: string;
  category: string;
  visualStyle?: string;
  colorPalette?: string;
}

export interface GenerateAiImageResponse {
  success: boolean;
  logId: string;
  imageUrl?: string;
  remainingCredits: number;
  creditsDeducted: number;
  featureType: AiFeatureType;
  modelUsed: string;
  errorMessage?: string;
}

export interface AiCreditBalanceResponse {
  tenantId: string;
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  canGenerate: boolean;
}

export interface PurchaseAiCreditsRequest {
  creditAmount: number;
  storeId?: string;
}

export interface PurchaseQuotaRequest {
  packageId: string;
  storeId: string;
}

export interface AiHistoryFilterParams {
  featureType?: AiFeatureType;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AiHistoryListResponse {
  items: AiGenerationLog[];
  total: number;
  page: number;
  totalPages: number;
}

// ==========================================
// 4. MOCK DATA (FOR PARALLEL WORK)
// ==========================================

export const MOCK_TENANT_AI_CREDIT: TenantAiCredit = {
  id: 'credit_mock_001',
  tenantId: 'store_mock_001',
  userId: 'user_mock_001',
  balance: 2,
  totalPurchased: 0,
  totalUsed: 0,
  createdAt: '2026-10-17T00:00:00.000Z',
  updatedAt: '2026-10-17T00:00:00.000Z',
};

export const MOCK_AI_GENERATION_LOGS: AiGenerationLog[] = [
  {
    id: 'log_mock_001',
    tenantId: 'store_mock_001',
    userId: 'user_mock_001',
    isTesting: false,
    featureType: 'logo',
    modelUsed: 'recraft-v3',
    sizeRatio: '1:1',
    qualityTier: 'standard',
    promptFinal: 'Minimalist coffee shop logo with warm brown and cream tones',
    inputTokens: 120,
    outputTokens: 450,
    creditsDeducted: 1,
    costUsd: 0.04,
    costIdr: 650,
    cloudinaryUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    status: 'success',
    errorMessage: null,
    createdAt: '2026-10-17T08:30:00.000Z',
  },
  {
    id: 'log_mock_002',
    tenantId: 'store_mock_001',
    userId: 'user_mock_001',
    isTesting: false,
    featureType: 'packaging_mockup',
    modelUsed: 'recraft-v3',
    sizeRatio: '4:3',
    qualityTier: 'hd',
    promptFinal: 'Eco-friendly kraft paper pouch mockup for artisan roasted coffee beans',
    inputTokens: 150,
    outputTokens: 520,
    creditsDeducted: 1,
    costUsd: 0.05,
    costIdr: 800,
    cloudinaryUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    status: 'success',
    errorMessage: null,
    createdAt: '2026-10-17T09:15:00.000Z',
  },
  {
    id: 'log_mock_003',
    tenantId: 'store_mock_001',
    userId: 'user_mock_001',
    isTesting: false,
    featureType: 'product_poster',
    modelUsed: 'recraft-v3',
    sizeRatio: '9:16',
    qualityTier: 'standard',
    promptFinal: 'Promotional Instagram story poster for weekend iced latte discount',
    inputTokens: 130,
    outputTokens: 480,
    creditsDeducted: 1,
    costUsd: 0.04,
    costIdr: 650,
    cloudinaryUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
    status: 'success',
    errorMessage: null,
    createdAt: '2026-10-17T10:00:00.000Z',
  },
];

export const MOCK_STORE_QUOTA_PACKAGES: StoreQuotaPackage[] = [
  {
    id: 'pkg_quota_basic',
    name: 'Paket Tambah 20 Produk',
    slug: 'paket-tambah-20-produk',
    description: 'Menambah kuota 20 produk dan 5 kategori baru pada katalog toko',
    price: 25000,
    additionalProducts: 20,
    additionalCategories: 5,
    isActive: true,
    createdAt: '2026-10-17T00:00:00.000Z',
    updatedAt: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'pkg_quota_pro',
    name: 'Paket Tambah 50 Produk',
    slug: 'paket-tambah-50-produk',
    description: 'Menambah kuota 50 produk dan 15 kategori baru untuk katalog lengkap',
    price: 50000,
    additionalProducts: 50,
    additionalCategories: 15,
    isActive: true,
    createdAt: '2026-10-17T00:00:00.000Z',
    updatedAt: '2026-10-17T00:00:00.000Z',
  },
  {
    id: 'pkg_quota_unlimited',
    name: 'Paket Sultan 200 Produk',
    slug: 'paket-sultan-200-produk',
    description: 'Menambah kuota 200 produk dan 50 kategori untuk merchant skala besar',
    price: 150000,
    additionalProducts: 200,
    additionalCategories: 50,
    isActive: true,
    createdAt: '2026-10-17T00:00:00.000Z',
    updatedAt: '2026-10-17T00:00:00.000Z',
  },
];

export const MOCK_AI_GENERATION_SUCCESS_RESPONSE: GenerateAiImageResponse = {
  success: true,
  logId: 'log_mock_001',
  imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  remainingCredits: 1,
  creditsDeducted: 1,
  featureType: 'logo',
  modelUsed: 'recraft-v3',
};
