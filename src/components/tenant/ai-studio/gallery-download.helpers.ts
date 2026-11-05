/**
 * Helper modul pengunduhan aset visual AI (PNG & JPG)
 * Mendukung injeksi transformasi Cloudinary (fl_attachment) & fallback client-side blob
 */

export type ImageDownloadFormat = 'png' | 'jpg';

/**
 * Format nama berkas standar: ${item.featureType}_${item.id.slice(0, 8)}.${format}
 */
export function buildGalleryFilename(
  featureType: string,
  id: string,
  format: ImageDownloadFormat
): string {
  const cleanId = (id || '').replace(/[^a-z0-9]/gi, '').slice(0, 8);
  const cleanType = featureType || 'ai_design';
  return `${cleanType}_${cleanId || 'asset'}.${format}`;
}

/**
 * Injeksi transformasi Cloudinary: f_png/f_jpg dengan fl_attachment
 */
export function getCloudinaryDownloadUrl(
  cloudinaryUrl: string,
  format: ImageDownloadFormat,
  filename: string
): string {
  if (!cloudinaryUrl) return '';
  if (cloudinaryUrl.includes('/upload/')) {
    const cleanBasename = filename.replace(/\.[^/.]+$/, '');
    return cloudinaryUrl.replace(
      '/upload/',
      `/upload/f_${format},fl_attachment:${encodeURIComponent(cleanBasename)}/`
    );
  }
  return cloudinaryUrl;
}

/**
 * Eksekusi pengunduhan berkas gambar secara langsung ke disk pengguna
 * Menjamin berkas tersimpan dengan ekstensi .png / .jpg yang benar tanpa membuka webp mentah
 */
export async function downloadAssetImage(
  cloudinaryUrl: string,
  featureType: string,
  id: string,
  format: ImageDownloadFormat
): Promise<void> {
  const filename = buildGalleryFilename(featureType, id, format);
  const targetUrl = getCloudinaryDownloadUrl(cloudinaryUrl, format, filename);

  try {
    const response = await fetch(targetUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('Download network error');

    const blob = await response.blob();
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const cleanBlob = blob.type === mimeType ? blob : new Blob([blob], { type: mimeType });
    const blobUrl = URL.createObjectURL(cleanBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
  } catch {
    // Fallback: Langsung picu unduhan via direct attachment URL Cloudinary
    const fallbackLink = document.createElement('a');
    fallbackLink.href = targetUrl;
    fallbackLink.download = filename;
    fallbackLink.target = '_self';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
  }
}
