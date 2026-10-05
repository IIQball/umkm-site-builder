import { formatIDR } from '@/lib/currency';
import { formatDate } from '@/lib/utils/format';

export interface ReceiptOrderData {
  id?: string;
  externalId?: string | null;
  amount: number | string;
  adminFee?: number | string | null;
  basePrice?: number | string | null;
  assistedBy?: string | null;
  merchantName?: string | null;
  merchantEmail?: string | null;
  storeName?: string | null;
  adminName?: string | null;
  adminEmail?: string | null;
  paymentChannel?: string | null;
  paymentGatewayRef?: string | null;
  createdAt?: string | Date | null;
  template?: {
    id?: string;
    name?: string | null;
    thumbnailUrl?: string | null;
    price?: number | null;
  } | null;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateReceiptHtml(
  order: ReceiptOrderData,
  isAdmin: boolean = false
): string {
  const adminFee = Number(order?.adminFee || 0);
  const amount = Number(order?.amount || 0);
  const basePrice =
    order?.basePrice !== undefined
      ? Number(order.basePrice)
      : Math.max(0, amount - adminFee);
  const showAdminFee = isAdmin || (adminFee > 0 && Boolean(order?.assistedBy));
  const rawDisplayId = order?.externalId || order?.id || 'INV/PNK/20260813/C-1786462099001';
  const displayId = escapeHtml(rawDisplayId);

  const rawCustomerName =
    order?.merchantName ||
    order?.user?.name ||
    (order?.merchantEmail ? order.merchantEmail.split('@')[0] : null) ||
    'Merchant Terdaftar';
  const customerName = escapeHtml(rawCustomerName);
  const merchantEmail = escapeHtml(order?.merchantEmail || '');

  const paymentDate = escapeHtml(
    order?.createdAt
      ? formatDate(order.createdAt, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : formatDate(new Date(), {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
  );

  const rawPaymentMethod =
    order?.paymentChannel ||
    (order?.paymentGatewayRef ? 'Xendit Invoice' : 'Transfer Bank / QRIS');
  const paymentMethod = escapeHtml(rawPaymentMethod);

  const templateName = escapeHtml(order?.template?.name || 'Lisensi Template Toko Online');
  const storeName = escapeHtml(order?.storeName || '');
  const adminInfo = order?.adminName
    ? escapeHtml(`${order.adminName} ${order.adminEmail ? `(${order.adminEmail})` : ''}`)
    : '';

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const logoUrl = `${origin}/assets/logo/logo-pin.webp`;

  const isAssisted = Boolean(order?.adminName || order?.assistedBy);
  const transactionType = escapeHtml(isAssisted ? 'Pendampingan Admin' : 'Pembelian Mandiri');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Nota Transaksi - ${displayId}</title>
  <style>
    @page { size: A4 portrait; margin: 1cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .card-sheet {
      background: #ffffff;
      width: 100%;
      border-radius: 16px;
      border: 1px solid #cbd5e1;
      padding: 32px 28px;
      box-sizing: border-box;
    }
    .brand-header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; }
    .brand-header img { height: 28px; width: auto; object-fit: contain; }
    .brand-header .brand-title { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
    .greeting-title { font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; margin-bottom: 4px; }
    .greeting-desc { font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
    .section-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
    .section-subtitle { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.2px; margin-top: 24px; margin-bottom: 12px; }
    .kv-table { width: 100%; border-collapse: collapse; }
    .kv-table td { padding: 4px 0; font-size: 12px; vertical-align: top; }
    .kv-label { color: #64748b; width: 38%; }
    .kv-value { color: #0f172a; font-weight: 600; text-align: right; word-break: break-word; }
    .kv-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; }
    .badge-tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-assisted { background-color: #eff6ff; color: #1d4ed8; }
    .badge-direct { background-color: #ecfdf5; color: #047857; }
    .components-table { width: 100%; border-collapse: collapse; }
    .components-table td { padding: 5px 0; font-size: 12px; }
    .comp-name { color: #334155; padding-right: 12px; }
    .comp-price { color: #0f172a; font-weight: 600; text-align: right; white-space: nowrap; }
    .divider { border-top: 1px solid #e2e8f0; margin: 16px 0; }
    .total-row { display: flex; align-items: center; justify-content: space-between; padding-top: 2px; }
    .total-label { font-size: 15px; font-weight: 700; color: #0f172a; }
    .total-amount { font-size: 20px; font-weight: 800; color: #1e3a8a; }
    .archive-note { font-size: 11px; color: #94a3b8; line-height: 1.5; margin-top: 18px; }
    .contact-note { font-size: 11px; color: #64748b; line-height: 1.5; }
    .contact-note strong { color: #1e293b; font-weight: 600; }
    .card-footer { text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px dashed #e2e8f0; color: #94a3b8; font-size: 10px; line-height: 1.6; }
    .card-footer .company { font-size: 11px; font-weight: 600; color: #64748b; margin-top: 2px; }
    @media print {
      body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
      .card-sheet { box-shadow: none !important; border: 1px solid #cbd5e1 !important; margin: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="card-sheet">
    <div class="brand-header">
      <img src="${logoUrl}" alt="Pinoka" />
      <span class="brand-title">Pinoka</span>
    </div>

    <div class="greeting-title">Halo, ${customerName}</div>
    <div class="greeting-desc">
      Pembayaranmu sudah kami terima dan pesananmu tercatat lunas. Berikut rincian transaksinya.
    </div>

    <div class="section-title">Rincian Pembayaran</div>
    <table class="kv-table">
      <tr class="kv-row">
        <td class="kv-label">Nomor Invoice</td>
        <td class="kv-value kv-mono">${displayId}</td>
      </tr>
      <tr class="kv-row">
        <td class="kv-label">Tanggal Pembayaran</td>
        <td class="kv-value">${paymentDate}</td>
      </tr>
      <tr class="kv-row">
        <td class="kv-label">Metode Pembayaran</td>
        <td class="kv-value">${paymentMethod}</td>
      </tr>
      <tr class="kv-row">
        <td class="kv-label">Paket / Layanan</td>
        <td class="kv-value">${templateName}</td>
      </tr>
      <tr class="kv-row">
        <td class="kv-label">Jenis Pembelian</td>
        <td class="kv-value">
          <span class="badge-tag ${isAssisted ? 'badge-assisted' : 'badge-direct'}">${transactionType}</span>
        </td>
      </tr>
      ${isAssisted && adminInfo ? `
      <tr class="kv-row">
        <td class="kv-label">Admin Pembeli</td>
        <td class="kv-value">${adminInfo}</td>
      </tr>
      <tr class="kv-row">
        <td class="kv-label">Merchant Penerima</td>
        <td class="kv-value">${customerName} ${merchantEmail ? `(${merchantEmail})` : ''}</td>
      </tr>` : `
      <tr class="kv-row">
        <td class="kv-label">Pembeli (Merchant)</td>
        <td class="kv-value">${customerName} ${merchantEmail ? `(${merchantEmail})` : ''}</td>
      </tr>`}
      ${storeName ? `
      <tr class="kv-row">
        <td class="kv-label">Toko UMKM</td>
        <td class="kv-value">${storeName}</td>
      </tr>` : ''}
    </table>

    <div class="section-subtitle">RINCIAN KOMPONEN</div>
    <table class="components-table">
      <tr class="comp-row">
        <td class="comp-name">${templateName} (Lisensi Selamanya) x1</td>
        <td class="comp-price">${formatIDR(basePrice)}</td>
      </tr>
      ${showAdminFee && adminFee > 0 ? `
      <tr class="comp-row">
        <td class="comp-name">Jasa Pendampingan & Setup Template (Admin) x1</td>
        <td class="comp-price">${formatIDR(adminFee)}</td>
      </tr>` : ''}
      <tr class="comp-row">
        <td class="comp-name">Biaya Pemeliharaan & Integrasi Sistem x1</td>
        <td class="comp-price">Rp 0</td>
      </tr>
    </table>

    <div class="divider"></div>

    <div class="total-row">
      <div class="total-label">Total</div>
      <div class="total-amount">${formatIDR(amount)}</div>
    </div>

    <div class="archive-note">
      Invoice resmi terlampir pada email ini dalam bentuk PDF untuk keperluan arsip.
    </div>

    <div class="divider"></div>

    <div class="contact-note">
      Butuh bantuan? Hubungi kami di <strong>support@pinoka.id</strong> atau <strong>+62 812-3444-5565</strong>.
    </div>

    <div class="card-footer">
      <div>Instagram · Threads · X</div>
      <div class="company">PT. Pinoka Inovasi Nusantara</div>
      <div>Banyuwangi, Jawa Timur, Indonesia</div>
    </div>
  </div>
</body>
</html>`;
}

export function printReceiptDocument(
  order: ReceiptOrderData,
  isAdmin: boolean = false
): void {
  const html = generateReceiptHtml(order, isAdmin);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '800px';
  iframe.style.height = '1200px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('[PrintReceipt] Gagal mencetak dokumen:', e);
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 3000);
    }
  }, 250);
}
