/**
 * Browser Canvas Image Compressor
 * Merampingkan dimensi dan ukuran berkas gambar secara iteratif di sisi klien
 * sebelum diunggah ke backend / AI studio.
 */

export interface CompressedImageResult {
  base64: string;
  blob: Blob;
  size: number;
}

const DEFAULT_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_DIMENSION = 1920;
const QUALITY_STEPS = [0.92, 0.82, 0.72, 0.6, 0.45, 0.3];
const MIME_TYPE = 'image/webp';
const FALLBACK_MIME_TYPE = 'image/jpeg';

/**
 * Mengonversi Blob ke string Base64 Data URI
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      // Lingkungan headless fallback
      blob
        .arrayBuffer()
        .then((buf) => {
          if (typeof Buffer !== 'undefined') {
            const b64 = Buffer.from(buf).toString('base64');
            resolve(`data:${blob.type || 'image/png'};base64,${b64}`);
          } else {
            let binary = '';
            const bytes = new Uint8Array(buf);
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const b64 = btoa(binary);
            resolve(`data:${blob.type || 'image/png'};base64,${b64}`);
          }
        })
        .catch(reject);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Gagal mengonversi data gambar ke format base64'));
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca data berkas gambar'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Kompresi gambar browser menggunakan Canvas API dengan reduksi dimensi
 * dan penyesuaian kualitas iteratif hingga ukuran < maxSizeBytes.
 */
export async function compressImageClient(
  file: File,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES
): Promise<CompressedImageResult> {
  if (!file) {
    throw new Error('Berkas gambar wajib disertakan');
  }

  // Guard lingkungan Headless / Server / Bun Test Runner
  const isBrowser =
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function' &&
    typeof Image !== 'undefined';

  if (!isBrowser) {
    const base64 = await blobToBase64(file);
    return {
      base64,
      blob: file,
      size: file.size,
    };
  }

  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('Berkas harus berupa gambar (JPEG, PNG, atau WebP)');
  }

  // 1. Muat gambar ke elemen Image
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Gagal membaca struktur berkas gambar'));
      img.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  // 2. Hitung dimensi awal dengan batas maksimal proporsional
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scaleRatio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.max(1, Math.round(width * scaleRatio));
    height = Math.max(1, Math.round(height * scaleRatio));
  }

  // 3. Render ke Canvas
  let canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');
  if (!ctx) {
    // Fallback jika konteks canvas gagal dibuat
    const base64 = await blobToBase64(file);
    return { base64, blob: file, size: file.size };
  }

  ctx.drawImage(img, 0, 0, width, height);

  let bestBlob: Blob | null = null;
  let currentMime = MIME_TYPE;

  // 4. Iterasi kompresi kualitas & downscale jika diperlukan
  let downscaleTries = 0;
  const maxDownscales = 2;

  while (downscaleTries <= maxDownscales) {
    for (const quality of QUALITY_STEPS) {
      const candidateBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (!b && currentMime !== FALLBACK_MIME_TYPE) {
              // Coba fallback mime type jika format webp tidak disupport oleh browser
              currentMime = FALLBACK_MIME_TYPE;
              canvas.toBlob((fb) => resolve(fb), FALLBACK_MIME_TYPE, quality);
            } else {
              resolve(b);
            }
          },
          currentMime,
          quality
        );
      });

      if (candidateBlob) {
        bestBlob = candidateBlob;
        if (candidateBlob.size <= maxSizeBytes) {
          const base64 = await blobToBase64(candidateBlob);
          return {
            base64,
            blob: candidateBlob,
            size: candidateBlob.size,
          };
        }
      }
    }

    // Jika masih melebihi batas ukuran, perkecil resolusi kanvas sebesar 25%
    downscaleTries++;
    if (downscaleTries <= maxDownscales) {
      width = Math.max(1, Math.round(width * 0.75));
      height = Math.max(1, Math.round(height * 0.75));

      const smallerCanvas = document.createElement('canvas');
      smallerCanvas.width = width;
      smallerCanvas.height = height;
      const smallerCtx = smallerCanvas.getContext('2d');

      if (smallerCtx) {
        smallerCtx.drawImage(canvas, 0, 0, width, height);
        canvas = smallerCanvas;
        ctx = smallerCtx;
      }
    }
  }

  // Kembalikan blob terbaik yang berhasil didapatkan
  const finalBlob = bestBlob || file;
  const base64 = await blobToBase64(finalBlob);

  return {
    base64,
    blob: finalBlob,
    size: finalBlob.size,
  };
}
