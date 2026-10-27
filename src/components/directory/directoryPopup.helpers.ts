import { type DirectoryStore, getStoreUrl } from './directory.types';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { formatNumber } from '@/lib/currency';
import { escapeHtml } from '@/lib/utils/format';

export function renderPopupContent(store: DirectoryStore): string {
  const storeUrl = getStoreUrl(store.subdomain);
  const safeName = escapeHtml(store.name);
  const safeAddress = store.address ? escapeHtml(store.address) : '';
  const safeCategory = store.category ? escapeHtml(store.category.name) : '';
  const safeDistance = store.distance !== null ? escapeHtml(store.distance) : '';

  const categoryHtml = safeCategory
    ? `<span class="inline-block px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-primary/15 text-primary-dark dark:text-primary-light border border-primary/25 mb-1.5">${safeCategory}</span>`
    : '';

  const viewsHtml = `<div class="flex items-center gap-1.5 text-2xs font-medium text-muted mb-1">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-orange dark:text-orange-light">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    <span>${formatNumber(store.totalViews || 0)} Kunjungan</span>
  </div>`;

  const distanceHtml = safeDistance
    ? `<div class="flex items-center gap-1.5 text-xs font-semibold text-main mb-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span>${safeDistance} km dari Anda</span>
    </div>`
    : '';

  const addressHtml = safeAddress
    ? `<div class="text-2xs text-muted mb-2 line-clamp-2 leading-relaxed">${safeAddress}</div>`
    : '';

  const waButton = store.waNumber
    ? `<a href="${generateWhatsAppLink(store.waNumber, `Halo ${store.name}, saya menemukan toko Anda di Direktori UMKM.`)}" target="_blank" rel="noopener noreferrer" class="popup-btn-wa">WhatsApp</a>`
    : '';

  return `
    <div class="min-w-[200px] max-w-[250px] p-0.5 font-sans text-main">
      <div class="font-bold text-sm text-main mb-1 tracking-tight font-heading leading-snug">${safeName}</div>
      ${categoryHtml}
      ${viewsHtml}
      ${distanceHtml}
      ${addressHtml}
      <div class="flex gap-2 mt-2.5 pt-2 border-t border-border">
        <a href="${storeUrl}" target="_blank" rel="noopener noreferrer" class="popup-btn-visit flex-1">Kunjungi</a>
        ${waButton}
      </div>
    </div>
  `;
}

export function renderUserLocationPopup(label?: string): string {
  const safeLabel = label ? escapeHtml(label) : 'Lokasi Anda Saat Ini';
  return `<div class="text-xs font-semibold text-main p-1 font-sans">${safeLabel}</div>`;
}

