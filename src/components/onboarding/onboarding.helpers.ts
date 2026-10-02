import type { RegionData } from './onboarding.types';

export const DEFAULT_WA_CHECKOUT_TEMPLATE =
  'Halo, saya ingin bertanya seputar produk di toko Anda. Boleh minta informasi lebih lanjut?';

export const DEFAULT_REGION: RegionData = {
  province: 'Jawa Timur',
  city: 'Banyuwangi',
  district: '',
  subDistrict: '',
  hamlet: '',
  street: '',
};

export interface StoreInfoValidationInput {
  storeName: string;
  categoryId: string;
  waNumber: string;
  googleMapsUrl: string;
  address: string;
  regionData: RegionData;
}

export function validateStoreInfo(data: StoreInfoValidationInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  let isValid = true;

  if (!data.storeName || data.storeName.trim().length < 3) {
    errors.storeName = 'Nama toko minimal 3 karakter';
    isValid = false;
  } else if (data.storeName.trim().length > 100) {
    errors.storeName = 'Nama toko maksimal 100 karakter';
    isValid = false;
  }

  if (!data.categoryId) {
    errors.categoryId = 'Kategori bisnis wajib dipilih';
    isValid = false;
  }

  if (!data.waNumber || !/^628[0-9]{7,12}$/.test(data.waNumber.trim())) {
    errors.waNumber = 'Nomor WhatsApp tidak valid. Gunakan format 628...';
    isValid = false;
  }

  if (!data.googleMapsUrl || !data.googleMapsUrl.trim()) {
    errors.googleMapsUrl = 'Link Google Maps wajib diisi';
    isValid = false;
  } else {
    try {
      new URL(data.googleMapsUrl.trim());
    } catch {
      errors.googleMapsUrl = 'URL Google Maps tidak valid';
      isValid = false;
    }
  }

  if (!data.regionData.district) {
    errors.district = 'Pilih kecamatan';
    isValid = false;
  }
  if (!data.regionData.subDistrict) {
    errors.subDistrict = 'Pilih kelurahan / desa';
    isValid = false;
  }
  if (!data.regionData.hamlet?.trim()) {
    errors.hamlet = 'Dusun / lingkungan wajib diisi';
    isValid = false;
  }
  if (!data.regionData.street?.trim()) {
    errors.street = 'Detail jalan & RT/RW wajib diisi';
    isValid = false;
  }
  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Alamat toko wajib diisi lengkap';
    isValid = false;
  }

  return { isValid, errors };
}

export async function checkSubdomainAvailability(val: string): Promise<{
  status: 'available' | 'taken' | 'invalid' | 'error';
  message: string;
}> {
  try {
    const res = await fetch('/api/stores/check-subdomain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subdomain: val }),
    });

    if (res.status === 401) {
      window.location.href = '/auth/login';
      return { status: 'error', message: 'Sesi kedaluwarsa' };
    }

    const data = await res.json();
    if (!data.ok) {
      return { status: 'invalid', message: data.error?.message ?? 'Validasi gagal' };
    }

    if (data.data.available) {
      return { status: 'available', message: 'Subdomain tersedia' };
    }
    return { status: 'taken', message: 'Subdomain sudah digunakan' };
  } catch {
    return { status: 'error', message: 'Gagal memeriksa ketersediaan' };
  }
}

export interface OnboardPayload {
  subdomain: string;
  name: string;
  categoryId: string;
  waNumber: string;
  googleMapsUrl: string;
  address: string;
  regionData: RegionData;
  templateId?: string;
  tenantId?: string;
  customization?: Record<string, unknown>;
}

export async function submitOnboardStore(payload: OnboardPayload): Promise<{
  ok: boolean;
  error?: string;
  code?: string;
}> {
  try {
    const res = await fetch('/api/stores/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      window.location.href = '/auth/login';
      return { ok: false, error: 'Unauthorized' };
    }

    const data = await res.json();
    if (!data.ok) {
      return {
        ok: false,
        error: data.error?.message ?? 'Gagal membuat toko',
        code: data.error?.code,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
  }
}

export interface UpdateStorePayload {
  storeId: string;
  name: string;
  categoryId: string;
  waNumber: string;
  googleMapsUrl: string;
  address: string;
  regionData: RegionData;
  templateId?: string;
  isOpen?: boolean;
  waCheckoutTemplate?: string;
  customization?: Record<string, unknown>;
}

export async function submitUpdateStore(payload: UpdateStorePayload): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const endpoint = `/api/stores/settings?storeId=${encodeURIComponent(payload.storeId)}`;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      window.location.href = '/auth/login';
      return { ok: false, error: 'Unauthorized' };
    }

    const data = await res.json();
    if (!data.success) {
      return {
        ok: false,
        error: data.error || 'Gagal menyimpan pengaturan toko',
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Terjadi kesalahan sistem. Silakan coba lagi.' };
  }
}
