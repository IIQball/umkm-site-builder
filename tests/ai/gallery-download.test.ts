import { describe, it, expect } from 'bun:test';
import {
  buildGalleryFilename,
  getCloudinaryDownloadUrl,
  getWebpProductUrl,
} from '@/components/tenant/ai-studio/gallery-download.helpers';
import {
  buildLogoPayload,
  buildPackagingPayload,
  buildPosterPayload,
  getCreditStatusStyle,
} from '@/components/tenant/ai-studio/studio.helpers';

describe('Gallery Download Helpers & Format Transformations', () => {
  it('builds proper filenames for all 4 download formats (png, jpg, pdf, svg)', () => {
    expect(buildGalleryFilename('logo', 'asset_12345678', 'png')).toBe('logo_asset123.png');
    expect(buildGalleryFilename('product_poster', 'abc-def-ghi', 'jpg')).toBe('product_poster_abcdefgh.jpg');
    expect(buildGalleryFilename('packaging_mockup', 'xyz999', 'pdf')).toBe('packaging_mockup_xyz999.pdf');
    expect(buildGalleryFilename('logo', 'logo-uuid-99', 'svg')).toBe('logo_logouuid.svg');
  });

  it('injects q_100 (HD quality) and fl_attachment into Cloudinary URLs', () => {
    const rawUrl = 'https://res.cloudinary.com/demo/image/upload/v12345/pinoka/logos/my-logo.png';

    const pngUrl = getCloudinaryDownloadUrl(rawUrl, 'png', 'logo_clean.png');
    expect(pngUrl).toContain('/upload/q_100,f_png,fl_attachment:logo_clean/');

    const jpgUrl = getCloudinaryDownloadUrl(rawUrl, 'jpg', 'logo_clean.jpg');
    expect(jpgUrl).toContain('/upload/q_100,f_jpg,fl_attachment:logo_clean/');

    const pdfUrl = getCloudinaryDownloadUrl(rawUrl, 'pdf', 'logo_clean.pdf');
    expect(pdfUrl).toContain('/upload/q_100,f_pdf,fl_attachment:logo_clean/');

    const svgUrl = getCloudinaryDownloadUrl(rawUrl, 'svg', 'logo_clean.svg');
    expect(svgUrl).toContain('/upload/q_100,f_png,fl_attachment:logo_clean/');
  });

  it('converts Cloudinary URLs to optimized WebP format for product attachment', () => {
    const masterUrl = 'https://res.cloudinary.com/demo/image/upload/v12345/pinoka/logos/my-logo.png';
    const webpUrl = getWebpProductUrl(masterUrl);
    expect(webpUrl).toBe('https://res.cloudinary.com/demo/image/upload/f_webp,q_auto/v12345/pinoka/logos/my-logo.png');

    // Idempotent if already has f_webp
    expect(getWebpProductUrl(webpUrl)).toBe(webpUrl);
    expect(getWebpProductUrl('')).toBe('');
    expect(getWebpProductUrl(null)).toBe('');
  });

  it('builds logo payload with background and color options', () => {
    const payload = buildLogoPayload({
      storeName: 'Kopi Toko',
      businessCategory: 'Kuliner',
      conceptType: 'letter_fusion',
      logoText: 'KOPI',
      lockupType: 'vertical',
      fontFamily: 'Plus Jakarta Sans',
      colorPalette: ['#C85A32', '#000000'],
      hasBackground: false,
      backgroundColor: '#FFFFFF',
      qualityTier: 'high',
    });

    expect(payload.featureType).toBe('logo');
    expect(payload.storeName).toBe('Kopi Toko');
    expect(payload.hasBackground).toBe(false);
    expect(payload.colorPalette).toBe('#C85A32, #000000');
  });

  it('builds packaging and poster payloads accurately', () => {
    const packaging = buildPackagingPayload({
      packagingType: 'standing_pouch',
      productLabel: 'Keripik Tempe',
      presentationStyle: 'clean_studio',
      referenceImageBase64: 'data:image/png;base64,...',
      qualityTier: 'high',
    });
    expect(packaging.featureType).toBe('packaging_mockup');
    expect(packaging.packagingType).toBe('standing_pouch');

    const poster = buildPosterPayload({
      productName: 'Ayam Geprek',
      titleText: 'Pedas Mantap',
      subText: 'Diskon 20%',
      posterStyle: 'vietnam_editorial',
      referenceImageBase64: 'data:image/png;base64,...',
      sizeRatio: '2:3',
      qualityTier: 'standard',
    });
    expect(poster.featureType).toBe('product_poster');
    expect(poster.size).toBe('1024x1536');
  });

  it('returns appropriate credit status badge styles', () => {
    expect(getCreditStatusStyle(0).badge).toContain('bg-error');
    expect(getCreditStatusStyle(2).badge).toContain('bg-warning');
    expect(getCreditStatusStyle(5).badge).toContain('bg-success');
  });
});
