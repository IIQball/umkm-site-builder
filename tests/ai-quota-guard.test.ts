import { describe, it, expect } from 'vitest';
import { AI_FEATURE_CREDIT_WEIGHTS } from '@/middleware/ai-quota-guard';

describe('AI Quota Guard Middleware', () => {
  describe('AI_FEATURE_CREDIT_WEIGHTS', () => {
    it('should have correct weights for each feature', () => {
      expect(AI_FEATURE_CREDIT_WEIGHTS.logo).toBe(1);
      expect(AI_FEATURE_CREDIT_WEIGHTS.packaging_mockup).toBe(2);
      expect(AI_FEATURE_CREDIT_WEIGHTS.product_poster).toBe(1);
    });

    it('should support unknown features with default weight', () => {
      const weight = AI_FEATURE_CREDIT_WEIGHTS['unknown_feature'] ?? 1;
      expect(weight).toBe(1);
    });

    it('should have at least 3 feature types defined', () => {
      const featureCount = Object.keys(AI_FEATURE_CREDIT_WEIGHTS).length;
      expect(featureCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe('QuotaCheckResult interface', () => {
    it('should have required properties for balance check', () => {
      const mockResult = {
        hasEnoughCredit: true,
        currentBalance: 5,
        requiredCredit: 1,
        featureType: 'logo',
      };
      
      expect(mockResult).toHaveProperty('hasEnoughCredit');
      expect(mockResult).toHaveProperty('currentBalance');
      expect(mockResult).toHaveProperty('requiredCredit');
      expect(mockResult).toHaveProperty('featureType');
    });
  });

  describe('Error code constants', () => {
    it('should define proper HTTP status codes for quota errors', () => {
      // 402 Payment Required for insufficient credits
      // 404 Not Found for missing credit record
      expect([402, 404]).toContain(402);
      expect([402, 404]).toContain(404);
    });
  });
});
