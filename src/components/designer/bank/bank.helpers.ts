export const POPULAR_BANKS = [
  'BCA',
  'Mandiri',
  'BNI',
  'BRI',
  'BSI',
  'CIMB Niaga',
  'Permata',
  'Bank Jago',
  'SeaBank',
  'BTPN / Jenius',
  'Danamon',
  'OCBC NISP',
];

export function getPayoutStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return { class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', label: 'Selesai' };
    case 'pending':
    case 'processing':
      return { class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', label: 'Diproses' };
    case 'failed':
    case 'rejected':
      return { class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20', label: 'Gagal' };
    default:
      return { class: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20', label: status };
  }
}
