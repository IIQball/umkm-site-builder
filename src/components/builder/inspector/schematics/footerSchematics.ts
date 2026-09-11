export const getFooterSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Centered Simple (Bawah-Atas: Logo tengah, links tengah, tombol WA tengah, copyright bawah)
  if (id === 'centered_simple') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#020617"/>
      <rect x="100" y="16" width="40" height="12" rx="3" fill="#3b82f6"/>
      <rect x="52" y="38" width="136" height="5" rx="2" fill="#94a3b8"/>
      <rect x="96" y="52" width="48" height="16" rx="8" fill="#22c55e"/>
      <line x1="36" y1="84" x2="204" y2="84" stroke="#1e293b" stroke-width="1"/>
      <rect x="76" y="96" width="88" height="5" rx="1.5" fill="#475569"/>
    </svg>`;
  }

  // 2. CTA Focused Banner (Floating CTA banner card di atas footer)
  if (id === 'cta_focused') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#020617"/>
      <rect x="16" y="12" width="208" height="42" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1"/>
      <rect x="26" y="22" width="84" height="7" rx="2" fill="#f8fafc"/>
      <rect x="26" y="33" width="112" height="4" rx="1" fill="#94a3b8"/>
      <rect x="156" y="24" width="56" height="18" rx="5" fill="#22c55e"/>
      <rect x="20" y="68" width="40" height="6" rx="2" fill="#3b82f6"/>
      <rect x="80" y="68" width="30" height="5" rx="1.5" fill="#64748b"/>
      <rect x="130" y="68" width="30" height="5" rx="1.5" fill="#64748b"/>
      <rect x="180" y="68" width="30" height="5" rx="1.5" fill="#64748b"/>
      <line x1="16" y1="94" x2="224" y2="94" stroke="#1e293b" stroke-width="1"/>
      <rect x="84" y="106" width="72" height="4" rx="1" fill="#475569"/>
    </svg>`;
  }

  // 3. Minimal Single Row (1 baris ramping)
  if (id === 'minimal_single_row') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#020617"/>
      <rect x="14" y="52" width="212" height="32" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <rect x="24" y="62" width="32" height="12" rx="3" fill="#3b82f6"/>
      <rect x="74" y="65" width="22" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="104" y="65" width="22" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="134" y="65" width="22" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="174" y="65" width="42" height="5" rx="1.5" fill="#475569"/>
    </svg>`;
  }

  // 4. Giant Wordmark (Wordmark besar di bawah)
  if (id === 'giant_wordmark') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#020617"/>
      <rect x="16" y="18" width="40" height="6" rx="2" fill="#3b82f6"/>
      <rect x="80" y="18" width="30" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="130" y="18" width="30" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="180" y="14" width="44" height="14" rx="4" fill="#22c55e"/>
      <rect x="16" y="44" width="208" height="48" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      <rect x="28" y="58" width="184" height="20" rx="3" fill="#1e293b"/>
      <line x1="16" y1="104" x2="224" y2="104" stroke="#1e293b" stroke-width="1"/>
      <rect x="84" y="114" width="72" height="4" rx="1" fill="#475569"/>
    </svg>`;
  }

  // 5. Newsletter Centric (Form langganan WA broadcast di atas)
  if (id === 'newsletter_centric') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#020617"/>
      <rect x="16" y="14" width="208" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <rect x="26" y="22" width="60" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="26" y="32" width="80" height="4" rx="1" fill="#94a3b8"/>
      <rect x="120" y="24" width="56" height="18" rx="4" fill="#0f172a"/>
      <rect x="180" y="24" width="36" height="18" rx="4" fill="#3b82f6"/>
      <rect x="20" y="68" width="40" height="6" rx="2" fill="#3b82f6"/>
      <rect x="80" y="68" width="30" height="5" rx="1.5" fill="#64748b"/>
      <rect x="130" y="68" width="30" height="5" rx="1.5" fill="#64748b"/>
      <rect x="180" y="68" width="30" height="5" rx="1.5" fill="#64748b"/>
      <line x1="16" y1="94" x2="224" y2="94" stroke="#1e293b" stroke-width="1"/>
      <rect x="84" y="106" width="72" height="4" rx="1" fill="#475569"/>
    </svg>`;
  }

  // 6. Split Map Footer (Kanan-Kiri: Link kiri, mini map kanan)
  if (id === 'split_map_footer') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#020617"/>
      <rect x="16" y="20" width="36" height="10" rx="2" fill="#3b82f6"/>
      <rect x="16" y="36" width="48" height="4" rx="1" fill="#64748b"/>
      <rect x="16" y="44" width="40" height="4" rx="1" fill="#64748b"/>
      <rect x="80" y="20" width="28" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="80" y="32" width="36" height="4" rx="1" fill="#64748b"/>
      <rect x="80" y="40" width="32" height="4" rx="1" fill="#64748b"/>
      <rect x="140" y="16" width="84" height="68" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <circle cx="182" cy="50" r="7" fill="#ef4444"/>
      <line x1="16" y1="96" x2="224" y2="96" stroke="#1e293b" stroke-width="1"/>
      <rect x="84" y="108" width="72" height="4" rx="1" fill="#475569"/>
    </svg>`;
  }

  // 7. Boxed Card Footer (Footer berbingkai kartu terpisah)
  if (id === 'boxed_card_footer') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="12" width="212" height="111" rx="10" fill="#020617" stroke="#3b82f6" stroke-width="1"/>
      <rect x="28" y="26" width="36" height="10" rx="2" fill="#3b82f6"/>
      <rect x="28" y="42" width="44" height="4" rx="1" fill="#64748b"/>
      <rect x="88" y="26" width="28" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="88" y="38" width="34" height="4" rx="1" fill="#64748b"/>
      <rect x="136" y="26" width="28" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="136" y="38" width="34" height="4" rx="1" fill="#64748b"/>
      <rect x="180" y="24" width="32" height="14" rx="4" fill="#22c55e"/>
      <line x1="28" y1="78" x2="212" y2="78" stroke="#1e293b" stroke-width="1"/>
      <rect x="84" y="94" width="72" height="4" rx="1" fill="#475569"/>
    </svg>`;
  }

  // Default Multi Column Standard
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#020617"/>
    <rect x="16" y="24" width="40" height="12" rx="3" fill="#3b82f6"/>
    <rect x="16" y="44" width="48" height="5" rx="1.5" fill="#64748b"/>
    <rect x="80" y="24" width="30" height="6" rx="2" fill="#f8fafc"/>
    <rect x="80" y="36" width="36" height="4" rx="1" fill="#64748b"/>
    <rect x="80" y="44" width="32" height="4" rx="1" fill="#64748b"/>
    <rect x="130" y="24" width="30" height="6" rx="2" fill="#f8fafc"/>
    <rect x="130" y="36" width="36" height="4" rx="1" fill="#64748b"/>
    <rect x="180" y="24" width="38" height="14" rx="4" fill="#22c55e"/>
    <line x1="16" y1="92" x2="224" y2="92" stroke="#1e293b" stroke-width="1"/>
    <rect x="88" y="104" width="64" height="4" rx="1" fill="#475569"/>
  </svg>`;
};
