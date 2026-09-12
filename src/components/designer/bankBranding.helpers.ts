/**
 * Bank Branding Helpers
 * Maps Indonesian banks to official branding tokens, local vector SVGs, and Tailwind accents.
 */

export interface BankBrandConfig {
  code: string;
  name: string;
  xenditCode: string;
  gradientClass: string;
  borderClass: string;
  glowClass: string;
  badgeClass: string;
  accentTextClass: string;
  logoSvg: string;
  logoPath: string;
}

export const BANK_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'BCA', label: 'BCA (Bank Central Asia)' },
  { value: 'BRI', label: 'BRI (Bank Rakyat Indonesia)' },
  { value: 'MANDIRI', label: 'Mandiri (Bank Mandiri)' },
  { value: 'BNI', label: 'BNI (Bank Negara Indonesia)' },
  { value: 'BTN', label: 'BTN (Bank Tabungan Negara)' },
  { value: 'BSI', label: 'BSI (Bank Syariah Indonesia)' },
  { value: 'CIMB', label: 'CIMB Niaga' },
  { value: 'MAYBANK', label: 'Maybank' },
  { value: 'PERMATA', label: 'Permata' },
];

const BANK_CONFIGS: Record<string, BankBrandConfig> = {
  BCA: {
    code: 'BCA',
    name: 'BCA',
    xenditCode: 'BCA',
    gradientClass: 'bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900',
    borderClass: 'border-blue-500/35 group-hover:border-blue-400/70',
    glowClass: 'bg-blue-600/20',
    badgeClass: 'bg-blue-500/20 border-blue-400/30 text-blue-200',
    accentTextClass: 'text-blue-400',
    logoPath: '/assets/banks/bca.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" class="h-6 w-auto" fill="none"><rect width="120" height="40" rx="8" fill="#0060AF"/><path d="M26 10L14 20L26 30L38 20L26 10Z" fill="#FFFFFF"/><path d="M26 14L18 20L26 26L34 20L26 14Z" fill="#0060AF"/><text x="46" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="19" letter-spacing="1">BCA</text></svg>`,
  },
  MANDIRI: {
    code: 'MANDIRI',
    name: 'Mandiri',
    xenditCode: 'MANDIRI',
    gradientClass: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
    borderClass: 'border-amber-500/35 group-hover:border-amber-400/70',
    glowClass: 'bg-amber-500/15',
    badgeClass: 'bg-amber-500/20 border-amber-400/30 text-amber-200',
    accentTextClass: 'text-amber-400',
    logoPath: '/assets/banks/mandiri.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 40" class="h-6 w-auto" fill="none"><rect width="140" height="40" rx="8" fill="#002D62"/><path d="M16 26C18 20 22 14 28 14C24 17 22 22 22 26H16Z" fill="#FFB81C"/><path d="M22 26C24 19 30 14 36 14C32 17 29 22 29 26H22Z" fill="#FFB81C"/><text x="42" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="16" letter-spacing="1">MANDIRI</text></svg>`,
  },
  BRI: {
    code: 'BRI',
    name: 'BRI',
    xenditCode: 'BRI',
    gradientClass: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
    borderClass: 'border-blue-500/35 group-hover:border-orange/70',
    glowClass: 'bg-blue-600/20',
    badgeClass: 'bg-orange/20 border-orange/30 text-orange-light',
    accentTextClass: 'text-orange',
    logoPath: '/assets/banks/bri.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" class="h-6 w-auto" fill="none"><rect width="120" height="40" rx="8" fill="#00529C"/><rect x="14" y="11" width="18" height="18" rx="4" fill="#F37021"/><circle cx="23" cy="20" r="5" fill="#FFFFFF"/><text x="42" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="20" letter-spacing="1">BRI</text></svg>`,
  },
  BNI: {
    code: 'BNI',
    name: 'BNI',
    xenditCode: 'BNI',
    gradientClass: 'bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950',
    borderClass: 'border-teal-500/35 group-hover:border-orange/70',
    glowClass: 'bg-teal-500/20',
    badgeClass: 'bg-teal-500/20 border-teal-400/30 text-teal-200',
    accentTextClass: 'text-teal-300',
    logoPath: '/assets/banks/bni.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" class="h-6 w-auto" fill="none"><rect width="120" height="40" rx="8" fill="#006677"/><circle cx="23" cy="20" r="10" fill="#F15A24"/><path d="M19 25L23 15L27 25" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/><text x="44" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="20" letter-spacing="1">BNI</text></svg>`,
  },
  BTN: {
    code: 'BTN',
    name: 'BTN',
    xenditCode: 'BTN',
    gradientClass: 'bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950',
    borderClass: 'border-yellow-500/35 group-hover:border-yellow-400/70',
    glowClass: 'bg-blue-600/20',
    badgeClass: 'bg-blue-500/20 border-yellow-400/30 text-yellow-200',
    accentTextClass: 'text-yellow-400',
    logoPath: '/assets/banks/btn.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" class="h-6 w-auto" fill="none"><rect width="120" height="40" rx="8" fill="#004B87"/><rect x="13" y="11" width="18" height="18" rx="3" fill="#FAA61A"/><path d="M18 16H26V24H18Z" fill="#004B87"/><text x="42" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="20" letter-spacing="1">BTN</text></svg>`,
  },
  BSI: {
    code: 'BSI',
    name: 'BSI',
    xenditCode: 'BSI',
    gradientClass: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950',
    borderClass: 'border-emerald-500/35 group-hover:border-emerald-400/70',
    glowClass: 'bg-emerald-500/20',
    badgeClass: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200',
    accentTextClass: 'text-emerald-400',
    logoPath: '/assets/banks/bsi.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" class="h-6 w-auto" fill="none"><rect width="120" height="40" rx="8" fill="#00A39D"/><path d="M23 10L25 17L32 17L26 21L28 28L23 23L18 28L20 21L14 17L21 17Z" fill="#F39200"/><text x="44" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="20" letter-spacing="1">BSI</text></svg>`,
  },
  CIMB: {
    code: 'CIMB Niaga',
    name: 'CIMB Niaga',
    xenditCode: 'CIMB',
    gradientClass: 'bg-gradient-to-br from-rose-950 via-slate-900 to-red-950',
    borderClass: 'border-rose-600/35 group-hover:border-rose-500/70',
    glowClass: 'bg-rose-600/20',
    badgeClass: 'bg-rose-500/20 border-rose-400/30 text-rose-200',
    accentTextClass: 'text-rose-400',
    logoPath: '/assets/banks/cimb.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 40" class="h-6 w-auto" fill="none"><rect width="130" height="40" rx="8" fill="#7E121D"/><path d="M15 13L27 20L15 27V13Z" fill="#EE1B24"/><rect x="23" y="15" width="4" height="10" fill="#FFFFFF"/><text x="36" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="17" letter-spacing="1">CIMB</text></svg>`,
  },
  MAYBANK: {
    code: 'MAYBANK',
    name: 'Maybank',
    xenditCode: 'MAYBANK',
    gradientClass: 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950',
    borderClass: 'border-yellow-400/40 group-hover:border-yellow-300/70',
    glowClass: 'bg-yellow-500/20',
    badgeClass: 'bg-yellow-400/20 border-yellow-400/30 text-yellow-200',
    accentTextClass: 'text-yellow-400',
    logoPath: '/assets/banks/maybank.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 40" class="h-6 w-auto" fill="none"><rect width="140" height="40" rx="8" fill="#FFC72C"/><circle cx="23" cy="20" r="10" fill="#000000"/><path d="M18 20C18 16 28 16 28 20C28 24 18 24 18 20Z" fill="#FFC72C"/><text x="40" y="27" fill="#000000" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="16" letter-spacing="1">MAYBANK</text></svg>`,
  },
  PERMATA: {
    code: 'Permata',
    name: 'Permata',
    xenditCode: 'PERMATA',
    gradientClass: 'bg-gradient-to-br from-lime-950 via-slate-900 to-slate-950',
    borderClass: 'border-lime-500/35 group-hover:border-lime-400/70',
    glowClass: 'bg-lime-600/20',
    badgeClass: 'bg-lime-500/20 border-lime-400/30 text-lime-200',
    accentTextClass: 'text-lime-400',
    logoPath: '/assets/banks/permata.svg',
    logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 40" class="h-6 w-auto" fill="none"><rect width="140" height="40" rx="8" fill="#008751"/><path d="M22 12L15 20L22 28L29 20L22 12Z" fill="#FFFFFF"/><circle cx="22" cy="20" r="3" fill="#008751"/><text x="38" y="27" fill="#FFFFFF" font-family="'League Spartan', 'Poppins', sans-serif" font-weight="900" font-size="16" letter-spacing="1">PERMATA</text></svg>`,
  },
};

const DEFAULT_BANK_CONFIG: BankBrandConfig = {
  code: 'BANK',
  name: 'Bank Transfer',
  xenditCode: 'BANK',
  gradientClass: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
  borderClass: 'border-slate-800 group-hover:border-orange/50',
  glowClass: 'bg-orange/10',
  badgeClass: 'bg-slate-800/80 border-slate-700 text-slate-200',
  accentTextClass: 'text-orange',
  logoPath: '/assets/banks/bca.svg',
  logoSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
};

export function resolveBankKey(bankIdentifier?: string | null): string {
  if (!bankIdentifier) return '';
  const clean = bankIdentifier.trim().toUpperCase();
  if (clean.includes('BCA')) return 'BCA';
  if (clean.includes('MANDIRI')) return 'MANDIRI';
  if (clean.includes('BRI')) return 'BRI';
  if (clean.includes('BNI')) return 'BNI';
  if (clean.includes('BTN')) return 'BTN';
  if (clean.includes('BSI') || clean.includes('SYARIAH INDONESIA')) return 'BSI';
  if (clean.includes('CIMB')) return 'CIMB';
  if (clean.includes('MAYBANK')) return 'MAYBANK';
  if (clean.includes('PERMATA')) return 'PERMATA';
  return '';
}

export function getBankBrandConfig(bankIdentifier?: string | null): BankBrandConfig {
  const key = resolveBankKey(bankIdentifier);
  return key && BANK_CONFIGS[key] ? BANK_CONFIGS[key] : DEFAULT_BANK_CONFIG;
}

export function formatMaskedAccountNumber(accountNumber?: string | null): string {
  if (!accountNumber) return '•••• •••• •••• ••••';
  const clean = accountNumber.replace(/\D/g, '');
  if (clean.length <= 4) return clean;
  const lastFour = clean.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
}
