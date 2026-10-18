import { describe, it, expect } from 'vitest';
import {
  transactionTypeEnum,
  aiFeatureTypeEnum,
  tenantAiCredits,
  aiGenerationLogs,
  storeQuotaPackages,
  storeQuotaPurchases,
} from '@/db/schema';
import {
  AI_FEATURE_TYPES,
  MOCK_TENANT_AI_CREDIT,
  MOCK_AI_GENERATION_LOGS,
  MOCK_STORE_QUOTA_PACKAGES,
  MOCK_AI_GENERATION_SUCCESS_RESPONSE,
  type AiFeatureType,
  type TenantAiCredit,
  type AiGenerationLog,
  type StoreQuotaPackage,
} from '@/types/ai';

describe('AI & Quota Schema Specifications', () => {
  it('should define transactionTypeEnum with all required values', () => {
    expect(transactionTypeEnum.enumValues).toContain('template_purchase');
    expect(transactionTypeEnum.enumValues).toContain('ai_credit_purchase');
    expect(transactionTypeEnum.enumValues).toContain('store_quota_purchase');
  });

  it('should define aiFeatureTypeEnum with logo, packaging_mockup, and product_poster', () => {
    expect(aiFeatureTypeEnum.enumValues).toEqual([
      'logo',
      'packaging_mockup',
      'product_poster',
    ]);
  });

  it('should have correct columns and defaults in tenantAiCredits table', () => {
    expect(tenantAiCredits.id).toBeDefined();
    expect(tenantAiCredits.tenantId).toBeDefined();
    expect(tenantAiCredits.balance).toBeDefined();
    expect(tenantAiCredits.totalPurchased).toBeDefined();
    expect(tenantAiCredits.totalUsed).toBeDefined();
    expect(tenantAiCredits.updatedAt).toBeDefined();
  });

  it('should have correct columns in aiGenerationLogs table', () => {
    expect(aiGenerationLogs.id).toBeDefined();
    expect(aiGenerationLogs.tenantId).toBeDefined();
    expect(aiGenerationLogs.userId).toBeDefined();
    expect(aiGenerationLogs.isTesting).toBeDefined();
    expect(aiGenerationLogs.featureType).toBeDefined();
    expect(aiGenerationLogs.modelUsed).toBeDefined();
    expect(aiGenerationLogs.sizeRatio).toBeDefined();
    expect(aiGenerationLogs.qualityTier).toBeDefined();
    expect(aiGenerationLogs.promptFinal).toBeDefined();
    expect(aiGenerationLogs.inputTokens).toBeDefined();
    expect(aiGenerationLogs.outputTokens).toBeDefined();
    expect(aiGenerationLogs.creditsDeducted).toBeDefined();
    expect(aiGenerationLogs.costUsd).toBeDefined();
    expect(aiGenerationLogs.costIdr).toBeDefined();
    expect(aiGenerationLogs.cloudinaryUrl).toBeDefined();
    expect(aiGenerationLogs.status).toBeDefined();
    expect(aiGenerationLogs.errorMessage).toBeDefined();
    expect(aiGenerationLogs.createdAt).toBeDefined();
  });

  it('should have correct columns in storeQuotaPackages and storeQuotaPurchases', () => {
    expect(storeQuotaPackages.id).toBeDefined();
    expect(storeQuotaPackages.name).toBeDefined();
    expect(storeQuotaPackages.slug).toBeDefined();
    expect(storeQuotaPackages.price).toBeDefined();
    expect(storeQuotaPackages.additionalProducts).toBeDefined();
    expect(storeQuotaPackages.additionalCategories).toBeDefined();

    expect(storeQuotaPurchases.id).toBeDefined();
    expect(storeQuotaPurchases.storeId).toBeDefined();
    expect(storeQuotaPurchases.userId).toBeDefined();
    expect(storeQuotaPurchases.packageId).toBeDefined();
    expect(storeQuotaPurchases.transactionId).toBeDefined();
  });
});

describe('AI & Quota Shared Contract (src/types/ai.ts)', () => {
  it('should align AI_FEATURE_TYPES with AiFeatureType union', () => {
    const validFeature: AiFeatureType = 'logo';
    expect(AI_FEATURE_TYPES).toContain(validFeature);
    expect(AI_FEATURE_TYPES).toHaveLength(3);
  });

  it('should provide valid mock tenant AI credit data', () => {
    const mockCredit: TenantAiCredit = MOCK_TENANT_AI_CREDIT;
    expect(mockCredit.balance).toBe(2);
    expect(mockCredit.totalUsed).toBe(0);
    expect(mockCredit.tenantId).toBeTruthy();
  });

  it('should provide valid mock AI generation logs', () => {
    const logs: AiGenerationLog[] = MOCK_AI_GENERATION_LOGS;
    expect(logs.length).toBeGreaterThanOrEqual(3);
    for (const log of logs) {
      expect(AI_FEATURE_TYPES).toContain(log.featureType);
      expect(log.creditsDeducted).toBeGreaterThan(0);
      expect(log.status).toBe('success');
    }
  });

  it('should provide valid mock quota packages', () => {
    const packages: StoreQuotaPackage[] = MOCK_STORE_QUOTA_PACKAGES;
    expect(packages.length).toBeGreaterThanOrEqual(3);
    for (const pkg of packages) {
      expect(pkg.price).toBeGreaterThan(0);
      expect(pkg.additionalProducts).toBeGreaterThan(0);
      expect(pkg.isActive).toBe(true);
    }
  });

  it('should provide valid mock AI generation response', () => {
    expect(MOCK_AI_GENERATION_SUCCESS_RESPONSE.success).toBe(true);
    expect(MOCK_AI_GENERATION_SUCCESS_RESPONSE.imageUrl).toBeTruthy();
    expect(MOCK_AI_GENERATION_SUCCESS_RESPONSE.remainingCredits).toBe(1);
  });
});
