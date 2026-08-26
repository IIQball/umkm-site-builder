export interface SignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  folder: string;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: `Format berkas ${file.name} tidak valid. Sistem hanya menerima format JPG, PNG, dan JPEG.`,
    };
  }

  const maxRawSizeBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxRawSizeBytes) {
    return {
      valid: false,
      error: `Ukuran berkas ${file.name} melebihi batas maksimal 5MB.`,
    };
  }

  return { valid: true };
}

export async function compressToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width / height > MAX_WIDTH / MAX_HEIGHT) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        } else {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context tidak tersedia'));
      ctx.drawImage(img, 0, 0, width, height);

      const quality = 0.8;
      const tryExport = (q: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Gagal kompresi WebP'));
            if (blob.size > 200 * 1024 && q > 0.4) {
              tryExport(q - 0.15);
            } else {
              resolve(blob);
            }
          },
          'image/webp',
          q,
        );
      };
      tryExport(quality);
    };
    img.onerror = () => reject(new Error('Gagal memuat gambar untuk dikonversi'));
    img.src = URL.createObjectURL(file);
  });
}

export async function fetchUploadSignature(folder: string): Promise<SignatureResponse> {
  const sigRes = await fetch('/api/media/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  if (!sigRes.ok) {
    const errData = await sigRes.json();
    throw new Error(errData.message || 'Gagal mendapatkan otorisasi unggah');
  }
  const { data: sig } = await sigRes.json();
  return sig;
}

export async function deleteCloudinaryMedia(urlToDelete: string) {
  if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
  try {
    await fetch('/api/media/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlToDelete }),
    });
  } catch {
    // Ignored
  }
}
