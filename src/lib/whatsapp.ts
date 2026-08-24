export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppOrderUrl(phone: string, productName: string, productPrice?: number): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  if (!formattedPhone) return '';

  let message = `Halo, saya tertarik dengan produk ${productName}`;
  if (typeof productPrice === 'number') {
    message += ` (Rp ${productPrice.toLocaleString('id-ID')})`;
  }
  message += '.\n\nBerikut detail pesanan saya:\n- Nama:\n- Alamat Lengkap:\n- Jumlah Pesanan:\n- Catatan Tambahan:';

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
