import { apiFetch } from '@/lib/api/parse-response';
import { compressImageClient } from '@/lib/client-compressor';

export interface SignedUploadParams {
  signature: string;
  timestamp: string;
  apiKey: string;
  folder: string;
  uploadUrl: string;
}

export async function convertImageFileToWebP(file: File): Promise<Blob> {
  const { blob } = await compressImageClient(file);
  return blob;
}

export function validateImageUploadFile(file: File, maxSizeMB: number): string | null {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return 'Format harus PNG atau JPG';
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Ukuran maksimal ${maxSizeMB}MB`;
  }
  return null;
}

export async function requestSignedUploadParams(
  folder: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<SignedUploadParams> {
  const result = await apiFetch<SignedUploadParams>('/api/media/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resourceType === 'video' ? { folder, resourceType } : { folder }),
    fallbackError: 'Gagal mendapatkan signature upload',
  });
  if (!result.success || !result.data) {
    throw new Error(result.message);
  }
  return result.data;
}

export function uploadFormDataWithProgress(
  uploadUrl: string,
  file: Blob,
  fileName: string | undefined,
  params: SignedUploadParams,
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    if (fileName) {
      formData.append('file', file, fileName);
    } else {
      formData.append('file', file);
    }
    formData.append('api_key', params.apiKey);
    formData.append('timestamp', params.timestamp);
    formData.append('signature', params.signature);
    formData.append('folder', params.folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl);

    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText) as { secure_url: string };
          resolve(result.secure_url);
        } catch {
          reject(new Error('Gagal memproses respon upload dari Cloudinary'));
        }
      } else {
        reject(new Error(`Upload ke Cloudinary gagal (HTTP ${xhr.status})`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Koneksi terputus saat upload')));
    xhr.send(formData);
  });
}

export function uploadWebpToCloudinary(
  blob: Blob,
  params: SignedUploadParams,
  onProgress: (percent: number) => void
): Promise<string> {
  return uploadFormDataWithProgress(params.uploadUrl, blob, 'image.webp', params, onProgress);
}

export async function deleteCloudinaryUploadAsset(urlToDelete: string): Promise<void> {
  if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
  try {
    await apiFetch('/api/media/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlToDelete }),
    });
  } catch {
    // Best-effort cleanup
  }
}

