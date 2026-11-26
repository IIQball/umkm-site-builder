import { describe, it, expect } from 'vitest';
import {
  aiPosterSchema,
  validateAiPoster,
  POSTER_STYLES,
  POSTER_BACKGROUND_MOODS,
  POSTER_SIZE_RATIOS,
} from '@/lib/validators/ai-poster';

describe('AI Wizard Validators - aiPosterSchema', () => {
  const fakeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const validPosterPayload = {
    productName: 'Sambal Bawang Mantap',
    titleText: 'Sensasi Pedas Sambal Bawang',
    subText: '100% Cabai Segar Asli',
    posterStyle: 'vietnam_editorial' as const,
    sizeRatio: '1:1' as const,
    referenceImageBase64: fakeBase64,
  };

  it('validates poster with productName, titleText, and optional reference image', () => {
    const res = aiPosterSchema.safeParse(validPosterPayload);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.productName).toBe('Sambal Bawang Mantap');
      expect(res.data.titleText).toBe('Sensasi Pedas Sambal Bawang');
      expect(res.data.subText).toBe('100% Cabai Segar Asli');
      expect(res.data.posterStyle).toBe('vietnam_editorial');
      expect(res.data.referenceImageBase64).toBe(fakeBase64);
    }
  });

  it('accepts all 10 curated poster styles', () => {
    for (const style of POSTER_STYLES) {
      const res = aiPosterSchema.safeParse({ ...validPosterPayload, posterStyle: style });
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.posterStyle).toBe(style);
      }
    }
    expect(validateAiPoster({ ...validPosterPayload, posterStyle: 'disney_cartoon' }).success).toBe(false);
  });

  it('accepts legacy background moods and size ratios', () => {
    for (const mood of POSTER_BACKGROUND_MOODS) {
      for (const ratio of POSTER_SIZE_RATIOS) {
        expect(aiPosterSchema.safeParse({ ...validPosterPayload, backgroundMood: mood, sizeRatio: ratio }).success).toBe(true);
      }
    }
  });

  it('trims whitespace on text fields and validates boundaries', () => {
    const trimmed = validateAiPoster({
      ...validPosterPayload,
      productName: '  Kopi Susu Aren  ',
      titleText: '  Promo Kopi Mantap  ',
      subText: '  Hanya Hari Ini  ',
    });
    expect(trimmed.success).toBe(true);
    expect(trimmed.data?.productName).toBe('Kopi Susu Aren');
    expect(trimmed.data?.titleText).toBe('Promo Kopi Mantap');
    expect(trimmed.data?.subText).toBe('Hanya Hari Ini');

    expect(validateAiPoster({ ...validPosterPayload, titleText: 'A' }).success).toBe(false);
    expect(validateAiPoster({ ...validPosterPayload, titleText: 'A'.repeat(61) }).success).toBe(false);
    expect(validateAiPoster({ ...validPosterPayload, subText: 'B'.repeat(101) }).success).toBe(false);
    expect(validateAiPoster({ ...validPosterPayload, productName: 'C'.repeat(81) }).success).toBe(false);
  });

  it('rejects invalid referenceImageBase64 format in poster', () => {
    const invalidImage = validateAiPoster({
      ...validPosterPayload,
      referenceImageBase64: 'invalid-image-base64-payload',
    });
    expect(invalidImage.success).toBe(false);
    expect(invalidImage.errors?.referenceImageBase64).toContain('Format');
  });

  it('accepts remote image URL for referenceImageBase64', () => {
    const urlPayload = {
      ...validPosterPayload,
      referenceImageBase64: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    };
    const res = validateAiPoster(urlPayload);
    expect(res.success).toBe(true);
    expect(res.data?.referenceImageBase64).toBe('https://res.cloudinary.com/demo/image/upload/sample.jpg');
  });

  it('validates qualityTier in poster', () => {
    const valid = validateAiPoster({ ...validPosterPayload, qualityTier: 'high', isTesting: false });
    expect(valid.success).toBe(true);
    expect(valid.data?.qualityTier).toBe('high');
    expect(validateAiPoster({ ...validPosterPayload, qualityTier: 'ultra' }).success).toBe(false);
  });
});
