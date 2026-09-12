export const getMapsSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Split Map Info (Kanan-Kiri: Info alamat kiri, peta kanan)
  if (id === 'split_map_info') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="18" width="96" height="98" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="26" y="28" width="60" height="8" rx="2" fill="#f8fafc"/>
      <rect x="26" y="42" width="76" height="4" rx="1" fill="#64748b"/>
      <rect x="26" y="50" width="68" height="4" rx="1" fill="#64748b"/>
      <circle cx="32" cy="68" r="4" fill="#22c55e"/>
      <rect x="42" y="66" width="48" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="26" y="84" width="76" height="18" rx="4" fill="#3b82f6"/>
      <rect x="122" y="18" width="102" height="98" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <path d="M122 50L160 38L190 55L224 35V105L190 116L160 98L122 110V50Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="172" cy="72" r="10" fill="#ef4444"/>
      <circle cx="172" cy="72" r="3.5" fill="#ffffff"/>
    </svg>`;
  }

  // 2. Compact Boxed Card (Kartu terpusat di tengah)
  if (id === 'compact_boxed') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="42" y="16" width="156" height="102" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="52" y="24" width="136" height="52" rx="5" fill="#0f172a"/>
      <circle cx="120" cy="50" r="8" fill="#ef4444"/>
      <rect x="52" y="84" width="68" height="6" rx="2" fill="#f8fafc"/>
      <rect x="52" y="94" width="90" height="4" rx="1" fill="#64748b"/>
      <rect x="156" y="88" width="32" height="14" rx="4" fill="#22c55e"/>
    </svg>`;
  }

  // 3. Multi Branch Tabs (Tab cabang di atas, peta di bawah)
  if (id === 'multi_branch_tabs') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="36" y="12" width="50" height="14" rx="4" fill="#3b82f6"/>
      <rect x="94" y="12" width="50" height="14" rx="4" fill="#1e293b"/>
      <rect x="152" y="12" width="50" height="14" rx="4" fill="#1e293b"/>
      <rect x="16" y="34" width="208" height="86" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <path d="M16 65L75 50L145 70L224 45V115L145 120L75 105L16 120V65Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="120" cy="75" r="10" fill="#ef4444"/>
      <circle cx="120" cy="75" r="3.5" fill="#ffffff"/>
    </svg>`;
  }

  // 4. Card Overlay Bottom (Bar info kaca transparan di bawah frame peta)
  if (id === 'card_overlay_bottom') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#0f172a"/>
      <path d="M0 45L70 30L140 50L240 20V120L140 135L70 120L0 130V45Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="120" cy="50" r="10" fill="#ef4444"/>
      <circle cx="120" cy="50" r="3.5" fill="#ffffff"/>
      <rect x="16" y="82" width="208" height="38" rx="6" fill="#020617" stroke="#3b82f6" stroke-width="1"/>
      <rect x="28" y="90" width="70" height="6" rx="2" fill="#f8fafc"/>
      <rect x="28" y="100" width="110" height="4" rx="1" fill="#64748b"/>
      <rect x="172" y="90" width="40" height="18" rx="4" fill="#22c55e"/>
    </svg>`;
  }

  // Default Fullwidth Floating Card
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#0f172a"/>
    <path d="M0 45L70 30L140 50L240 20V115L140 135L70 115L0 130V45Z" fill="#1e293b" opacity="0.6"/>
    <line x1="70" y1="30" x2="70" y2="115" stroke="#334155" stroke-width="2"/>
    <line x1="140" y1="50" x2="140" y2="135" stroke="#334155" stroke-width="2"/>
    <circle cx="130" cy="65" r="12" fill="#ef4444"/>
    <circle cx="130" cy="65" r="4" fill="white"/>
    <rect x="20" y="18" width="72" height="54" rx="6" fill="#020617" stroke="#3b82f6" stroke-width="1"/>
    <rect x="28" y="26" width="54" height="6" rx="1.5" fill="#f8fafc"/>
    <rect x="28" y="36" width="44" height="4" rx="1" fill="#64748b"/>
    <rect x="28" y="44" width="50" height="4" rx="1" fill="#64748b"/>
    <rect x="28" y="54" width="56" height="10" rx="2" fill="#22c55e"/>
  </svg>`;
};
