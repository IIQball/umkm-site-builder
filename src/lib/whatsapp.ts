import { formatIDR } from './currency';

export const DEFAULT_DEMO_WA_NUMBER = '6281234567890';

export function normalizeWhatsAppNumber(phone?: string | null): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('620')) {
    cleaned = '62' + cleaned.substring(3);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function formatWhatsAppNumber(phone: string): string {
  return normalizeWhatsAppNumber(phone);
}

export function getEffectiveWhatsAppNumber(phone?: string | null): string {
  const formatted = normalizeWhatsAppNumber(phone);
  return formatted || DEFAULT_DEMO_WA_NUMBER;
}

export function generateWhatsAppLink(phone?: string | null, customText?: string): string {
  const formattedPhone = getEffectiveWhatsAppNumber(phone);
  const message = customText || 'Halo, saya tertarik dengan produk di toko Anda. Boleh minta informasi lebih lanjut?';
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppUrl(phone?: string | null, customText?: string): string {
  return generateWhatsAppLink(phone, customText);
}

export function generateWhatsAppOrderUrl(phone: string, productName: string, productPrice?: number, variantInfo?: string): string {
  const formattedPhone = getEffectiveWhatsAppNumber(phone);

  let message = `Halo, saya tertarik dengan produk ${productName}`;
  if (typeof productPrice === 'number') {
    message += ` (${formatIDR(productPrice)})`;
  }
  if (variantInfo) {
    message += `\n*Varian: ${variantInfo}*`;
  }
  message += '.\n\nBerikut detail pesanan saya:\n- Nama:\n- Nomor Telepon:\n- Alamat Lengkap:\n- Opsi Pengantaran:\n- Jumlah Pesanan:\n- Catatan Tambahan:';

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

