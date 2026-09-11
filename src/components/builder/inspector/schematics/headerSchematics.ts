export const getHeaderSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Floating Pill Island
  if (id === 'floating_pill_island') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="20" y="22" width="200" height="30" rx="15" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <circle cx="40" cy="37" r="7" fill="#3b82f6"/>
      <rect x="64" y="35" width="28" height="4" rx="2" fill="#94a3b8"/>
      <rect x="100" y="35" width="28" height="4" rx="2" fill="#94a3b8"/>
      <rect x="136" y="35" width="24" height="4" rx="2" fill="#94a3b8"/>
      <rect x="172" y="29" width="36" height="16" rx="8" fill="#22c55e"/>
      <rect x="36" y="68" width="168" height="46" rx="6" fill="#1e293b" opacity="0.3"/>
    </svg>`;
  }

  // 2. Centered Stacked (Bawah-Atas: Baris 1 Logo tengah, Baris 2 Nav links di bawah)
  if (id === 'centered_stacked') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="0" y="0" width="240" height="12" fill="#1e293b"/>
      <rect x="100" y="4" width="40" height="4" rx="2" fill="#94a3b8"/>
      <rect x="102" y="20" width="36" height="12" rx="3" fill="#3b82f6"/>
      <line x1="24" y1="38" x2="216" y2="38" stroke="#334155" stroke-width="1"/>
      <rect x="62" y="44" width="24" height="5" rx="2" fill="#94a3b8"/>
      <rect x="94" y="44" width="24" height="5" rx="2" fill="#3b82f6"/>
      <rect x="126" y="44" width="24" height="5" rx="2" fill="#94a3b8"/>
      <rect x="158" y="44" width="24" height="5" rx="2" fill="#94a3b8"/>
      <rect x="24" y="62" width="192" height="58" rx="6" fill="#1e293b" opacity="0.35"/>
    </svg>`;
  }

  // 3. Compact Inline (Single-row ramping 56px, tanpa announcement bar)
  if (id === 'compact_inline') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="0" y="0" width="240" height="26" fill="#1e293b" stroke="#334155" stroke-width="0.75"/>
      <circle cx="24" cy="13" r="6" fill="#3b82f6"/>
      <rect x="36" y="10" width="28" height="6" rx="2" fill="#f8fafc"/>
      <rect x="88" y="11" width="20" height="4" rx="1.5" fill="#94a3b8"/>
      <rect x="116" y="11" width="20" height="4" rx="1.5" fill="#94a3b8"/>
      <rect x="144" y="11" width="20" height="4" rx="1.5" fill="#94a3b8"/>
      <rect x="188" y="6" width="38" height="14" rx="4" fill="#22c55e"/>
      <rect x="20" y="40" width="200" height="80" rx="6" fill="#1e293b" opacity="0.4"/>
    </svg>`;
  }

  // 4. Split Nav Centered Logo
  if (id === 'split_nav_centered_logo') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="0" y="0" width="240" height="10" fill="#1e293b"/>
      <rect x="16" y="24" width="26" height="5" rx="2" fill="#94a3b8"/>
      <rect x="50" y="24" width="26" height="5" rx="2" fill="#94a3b8"/>
      <rect x="100" y="18" width="40" height="16" rx="4" fill="#3b82f6"/>
      <rect x="156" y="24" width="24" height="5" rx="2" fill="#94a3b8"/>
      <rect x="190" y="19" width="36" height="14" rx="4" fill="#22c55e"/>
      <rect x="16" y="46" width="208" height="74" rx="6" fill="#1e293b" opacity="0.4"/>
    </svg>`;
  }

  // 5. Command Search Bar
  if (id === 'command_search_bar') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <circle cx="24" cy="18" r="7" fill="#3b82f6"/>
      <rect x="52" y="10" width="124" height="16" rx="5" fill="#1e293b" stroke="#475569" stroke-width="1"/>
      <circle cx="64" cy="18" r="3" fill="#64748b"/>
      <rect x="74" y="16" width="56" height="4" rx="1.5" fill="#64748b"/>
      <rect x="154" y="13" width="16" height="10" rx="2" fill="#334155"/>
      <rect x="188" y="11" width="38" height="14" rx="4" fill="#22c55e"/>
      <rect x="16" y="38" width="208" height="82" rx="6" fill="#1e293b" opacity="0.4"/>
    </svg>`;
  }

  // 6. Top Contact Bar (Baris 1 jam/alamat, Baris 2 navbar)
  if (id === 'top_contact_bar') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="0" y="0" width="240" height="14" fill="#0f172a" stroke="#334155" stroke-width="0.5"/>
      <circle cx="20" cy="7" r="3" fill="#10b981"/>
      <rect x="28" y="5" width="46" height="4" rx="1" fill="#cbd5e1"/>
      <circle cx="90" cy="7" r="3" fill="#3b82f6"/>
      <rect x="98" y="5" width="50" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="184" y="4" width="42" height="6" rx="2" fill="#10b981"/>
      <rect x="16" y="24" width="26" height="12" rx="3" fill="#3b82f6"/>
      <rect x="68" y="28" width="26" height="4" rx="2" fill="#94a3b8"/>
      <rect x="104" y="28" width="26" height="4" rx="2" fill="#94a3b8"/>
      <rect x="188" y="23" width="38" height="14" rx="4" fill="#22c55e"/>
      <rect x="16" y="48" width="208" height="72" rx="6" fill="#1e293b" opacity="0.4"/>
    </svg>`;
  }

  // 7. Promo Countdown Banner (Banner timer promo di atas)
  if (id === 'promo_countdown_banner') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="0" y="0" width="240" height="16" fill="#ef4444"/>
      <rect x="20" y="6" width="68" height="4" rx="2" fill="#ffffff"/>
      <rect x="144" y="4" width="14" height="8" rx="2" fill="#ffffff"/>
      <rect x="162" y="4" width="14" height="8" rx="2" fill="#ffffff"/>
      <rect x="180" y="4" width="14" height="8" rx="2" fill="#ffffff"/>
      <rect x="16" y="26" width="26" height="12" rx="3" fill="#3b82f6"/>
      <rect x="70" y="30" width="26" height="4" rx="2" fill="#94a3b8"/>
      <rect x="106" y="30" width="26" height="4" rx="2" fill="#94a3b8"/>
      <rect x="188" y="25" width="38" height="14" rx="4" fill="#22c55e"/>
      <rect x="16" y="50" width="208" height="70" rx="6" fill="#1e293b" opacity="0.4"/>
    </svg>`;
  }

  // Default Split Header
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#090d16"/>
    <rect x="0" y="0" width="240" height="14" fill="#1e293b"/>
    <rect x="80" y="5" width="80" height="4" rx="2" fill="#f59e0b"/>
    <rect x="16" y="22" width="26" height="12" rx="3" fill="#3b82f6"/>
    <rect x="68" y="26" width="26" height="4" rx="2" fill="#94a3b8"/>
    <rect x="102" y="26" width="26" height="4" rx="2" fill="#94a3b8"/>
    <rect x="136" y="26" width="26" height="4" rx="2" fill="#94a3b8"/>
    <rect x="186" y="22" width="38" height="14" rx="4" fill="#22c55e"/>
    <rect x="16" y="50" width="208" height="68" rx="6" fill="#1e293b" opacity="0.4"/>
  </svg>`;
};
