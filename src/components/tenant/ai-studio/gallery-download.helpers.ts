/**
 * Helper modul pengunduhan aset visual AI (PNG, JPG, PDF, SVG)
 * Mendukung injeksi transformasi Cloudinary kualitas HD (q_100) & pembungkus SVG
 */

export type ImageDownloadFormat = 'png' | 'jpg' | 'pdf' | 'svg';

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
 * Konversi URL Cloudinary ke format WebP teroptimasi untuk kartu produk toko
 */
export function getWebpProductUrl(cloudinaryUrl?: string | null): string {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') return '';
  if (cloudinaryUrl.includes('/upload/') && !cloudinaryUrl.includes('f_webp')) {
    return cloudinaryUrl.replace('/upload/', '/upload/f_webp,q_auto/');
  }
  return cloudinaryUrl;
}

/**
 * Injeksi transformasi Cloudinary kualitas maksimal (q_100) dan attachment download
 */
export function getCloudinaryDownloadUrl(
  cloudinaryUrl: string,
  format: ImageDownloadFormat,
  filename: string
): string {
  if (!cloudinaryUrl) return '';
  if (cloudinaryUrl.includes('/upload/')) {
    const cleanBasename = filename.replace(/\.[^/.]+$/, '');
    const cleanUrl = cloudinaryUrl.replace(/\/upload\/(?:f_[^,/]+|q_[^,/]+|w_\d+|c_[^,/]+|fl_[^,/]+)*\/?/, '/upload/');
    const targetFormat = format === 'svg' ? 'png' : format;
    const urlWithExt = cleanUrl.replace(/\.[a-z0-9]+$/i, `.${targetFormat}`);
    return urlWithExt.replace(
      '/upload/',
      `/upload/q_100,f_${targetFormat},fl_attachment:${encodeURIComponent(cleanBasename)}/`
    );
  }
  return cloudinaryUrl;
}

/**
 * Membangun berkas PDF 1.4 valid langsung di sisi klien dengan membungkus citra JPEG
 */
export function buildPdfFromJpeg(jpegBytes: Uint8Array, width = 1024, height = 1024): Uint8Array {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let byteOffset = 0;
  const offsets: number[] = [];

  function addString(str: string) {
    const bytes = enc.encode(str);
    chunks.push(bytes);
    byteOffset += bytes.length;
  }

  function addBytes(bytes: Uint8Array) {
    chunks.push(bytes);
    byteOffset += bytes.length;
  }

  addString('%PDF-1.4\n%âãÏÓ\n');

  offsets.push(byteOffset);
  addString('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  offsets.push(byteOffset);
  addString('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  offsets.push(byteOffset);
  addString(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);

  offsets.push(byteOffset);
  addString(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  addBytes(jpegBytes);
  addString('\nendstream\nendobj\n');

  const content = `q\n${width} 0 0 ${height} 0 0 cm\n/Im1 Do\nQ\n`;
  offsets.push(byteOffset);
  addString(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

  const startXref = byteOffset;
  addString('xref\n0 6\n0000000000 65535 f \n');
  for (const off of offsets) {
    addString(`${String(off).padStart(10, '0')} 00000 n \n`);
  }

  addString(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`);

  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const chunk of chunks) {
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
}

/**
 * Konversi gambar ke berkas PDF resolusi tinggi siap cetak
 */
async function downloadAsPdf(
  targetUrl: string,
  filename: string
): Promise<void> {
  const response = await fetch(targetUrl, { mode: 'cors' });
  if (!response.ok) throw new Error('Gagal mengambil sumber gambar untuk PDF');

  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const width = bitmap.width || 1024;
  const height = bitmap.height || 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Kanvas grafis tidak tersedia');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0);

  const jpegBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 1.0)
  );
  if (!jpegBlob) throw new Error('Gagal mengonversi citra ke JPEG');

  const arrayBuffer = await jpegBlob.arrayBuffer();
  const pdfBytes = buildPdfFromJpeg(new Uint8Array(arrayBuffer), width, height);
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  triggerBlobDownload(pdfBlob, filename);
}

/**
 * Konversi gambar HD ke berkas SVG berbasis kontainer vektor skalabel
 */
async function downloadAsSvg(
  targetUrl: string,
  filename: string
): Promise<void> {
  const response = await fetch(targetUrl, { mode: 'cors' });
  if (!response.ok) throw new Error('Gagal mengambil sumber gambar untuk SVG');

  const blob = await response.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" width="1024" height="1024">
  <image width="1024" height="1024" href="${dataUrl}"/>
</svg>`;

  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  triggerBlobDownload(svgBlob, filename);
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
}

/**
 * Eksekusi pengunduhan berkas gambar secara langsung ke disk pengguna dalam resolusi HD
 */
export async function downloadAssetImage(
  cloudinaryUrl: string,
  featureType: string,
  id: string,
  format: ImageDownloadFormat
): Promise<void> {
  const filename = buildGalleryFilename(featureType, id, format);
  const targetUrl = getCloudinaryDownloadUrl(cloudinaryUrl, format, filename);

  if (format === 'svg') {
    try {
      await downloadAsSvg(targetUrl, filename);
      return;
    } catch {
      // Fallback lanjut ke download langsung
    }
  }

  if (format === 'pdf') {
    try {
      const pngSourceUrl = getCloudinaryDownloadUrl(cloudinaryUrl, 'png', filename);
      await downloadAsPdf(pngSourceUrl, filename);
      return;
    } catch {
      // Fallback lanjut ke download langsung
    }
  }

  try {
    const response = await fetch(targetUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('Download network error');

    const blob = await response.blob();
    const mimeType =
      format === 'png'
        ? 'image/png'
        : format === 'jpg'
          ? 'image/jpeg'
          : format === 'pdf'
            ? 'application/pdf'
            : 'image/svg+xml';
    const cleanBlob = blob.type === mimeType ? blob : new Blob([blob], { type: mimeType });
    triggerBlobDownload(cleanBlob, filename);
  } catch {
    // Fallback: picu unduhan via tautan langsung
    const fallbackLink = document.createElement('a');
    fallbackLink.href = targetUrl;
    fallbackLink.download = filename;
    fallbackLink.target = '_self';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
  }
}
