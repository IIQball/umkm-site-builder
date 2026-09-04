/**
 * Helper for image compression to WebP and Cloudinary upload
 */

export async function compressToWebP(file: File, maxWidth = 1920, maxHeight = 1080): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
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
          q
        );
      };
      tryExport(quality);
    };
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = URL.createObjectURL(file);
  });
}

export async function deleteOldImage(urlToDelete: string): Promise<void> {
  if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
  try {
    await fetch('/api/media/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlToDelete }),
    });
  } catch {
    // Ignore background cleanup failure
  }
}

export async function uploadToCloudinary(
  blob: Blob,
  folder = 'templates',
  fileName = `${Date.now()}_image.webp`
): Promise<string> {
  const signRes = await fetch('/api/media/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });

  if (!signRes.ok) throw new Error('Gagal mendapatkan signature upload');
  const { data: signData } = await signRes.json();

  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('api_key', signData.apiKey);
  formData.append('timestamp', signData.timestamp);
  formData.append('signature', signData.signature);
  formData.append('folder', signData.folder);

  const cloudRes = await fetch(signData.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!cloudRes.ok) throw new Error('Upload ke Cloudinary gagal');
  const cloudData = await cloudRes.json();
  return cloudData.secure_url;
}
