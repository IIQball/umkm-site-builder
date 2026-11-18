export const getMapsSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Split Map Info (Kiri: Alamat & info, Kanan: Peta)
  if (id === 'split_map_info') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="96" height="102" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="26" y="26" width="60" height="8" rx="2" fill="#f8fafc"/>
      <rect x="26" y="40" width="76" height="4" rx="1" fill="#64748b"/>
      <rect x="26" y="48" width="68" height="4" rx="1" fill="#64748b"/>
      <circle cx="32" cy="66" r="4" fill="#22c55e"/>
      <rect x="42" y="64" width="48" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="26" y="82" width="76" height="20" rx="4" fill="#3b82f6"/>
      <rect x="122" y="16" width="102" height="102" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <path d="M122 48L160 36L190 53L224 33V103L190 114L160 96L122 108V48Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="172" cy="70" r="10" fill="#ef4444"/>
      <circle cx="172" cy="70" r="3.5" fill="#ffffff"/>
    </svg>`;
  }

  // 2. Compact Boxed Card (Kartu terpusat di tengah dengan iframe peta)
  if (id === 'compact_boxed') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="36" y="14" width="168" height="106" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="46" y="22" width="148" height="54" rx="5" fill="#0f172a"/>
      <path d="M46 45L95 35L145 50L194 30V76H46V45Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="120" cy="48" r="8" fill="#ef4444"/>
      <circle cx="120" cy="48" r="2.5" fill="#ffffff"/>
      <rect x="46" y="84" width="72" height="6" rx="2" fill="#f8fafc"/>
      <rect x="46" y="94" width="92" height="4" rx="1" fill="#64748b"/>
      <rect x="150" y="86" width="44" height="16" rx="4" fill="#22c55e"/>
    </svg>`;
  }

  // 3. Floating Address Card (Peta luas dengan kartu mengambang di atas tengah)
  if (id === 'floating_address_card') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#0f172a"/>
      <path d="M0 45L70 30L140 50L240 20V120L140 135L70 120L0 130V45Z" fill="#1e293b" opacity="0.5"/>
      <circle cx="120" cy="88" r="10" fill="#ef4444"/>
      <circle cx="120" cy="88" r="3.5" fill="#ffffff"/>
      <!-- Floating card top-center -->
      <rect x="52" y="16" width="136" height="48" rx="8" fill="#020617" stroke="#3b82f6" stroke-width="1"/>
      <rect x="64" y="24" width="68" height="6" rx="2" fill="#f8fafc"/>
      <rect x="64" y="34" width="112" height="4" rx="1" fill="#64748b"/>
      <rect x="64" y="44" width="48" height="12" rx="3" fill="#22c55e"/>
    </svg>`;
  }

  // 4. Two Column Directions (Panduan rute kiri, peta kanan)
  if (id === 'two_column_directions') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="96" height="102" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="26" y="24" width="58" height="7" rx="2" fill="#f8fafc"/>
      <!-- Route steps -->
      <circle cx="32" cy="44" r="5" fill="#3b82f6"/>
      <rect x="42" y="42" width="60" height="4" rx="1" fill="#cbd5e1"/>
      <line x1="32" y1="49" x2="32" y2="61" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="2 2"/>
      <circle cx="32" cy="66" r="5" fill="#f59e0b"/>
      <rect x="42" y="64" width="54" height="4" rx="1" fill="#cbd5e1"/>
      <line x1="32" y1="71" x2="32" y2="83" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2 2"/>
      <circle cx="32" cy="88" r="5" fill="#22c55e"/>
      <rect x="42" y="86" width="50" height="4" rx="1" fill="#cbd5e1"/>
      <!-- Map right -->
      <rect x="122" y="16" width="102" height="102" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <path d="M136 86Q160 50 186 64" stroke="#3b82f6" stroke-width="2.5" fill="none"/>
      <circle cx="186" cy="64" r="8" fill="#ef4444"/>
      <circle cx="186" cy="64" r="2.5" fill="#ffffff"/>
    </svg>`;
  }

  // 5. Store Hours Highlight (Banner jam operasional kiri, peta kanan)
  if (id === 'store_hours_highlight') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="84" height="102" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1"/>
      <rect x="24" y="24" width="48" height="14" rx="4" fill="#052e16" stroke="#22c55e" stroke-width="0.75"/>
      <rect x="30" y="29" width="36" height="4" rx="1" fill="#86efac"/>
      <rect x="24" y="46" width="68" height="6" rx="2" fill="#f8fafc"/>
      <rect x="24" y="58" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="24" y="68" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="24" y="78" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="24" y="92" width="68" height="16" rx="4" fill="#3b82f6"/>
      <!-- Map right -->
      <rect x="110" y="16" width="114" height="102" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <path d="M110 50L150 35L190 55L224 40V105L180 115L140 100L110 110V50Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="168" cy="68" r="9" fill="#ef4444"/>
      <circle cx="168" cy="68" r="3" fill="#ffffff"/>
    </svg>`;
  }

  // 6. Interactive Route Finder (Peta atas, 3 tombol transportasi bawah)
  if (id === 'interactive_route_finder') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="14" width="208" height="72" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <path d="M16 45L80 30L150 50L224 35V80L160 86L90 75L16 82V45Z" fill="#1e293b" opacity="0.6"/>
      <circle cx="120" cy="50" r="8" fill="#ef4444"/>
      <circle cx="120" cy="50" r="2.5" fill="#ffffff"/>
      <!-- 3 route options below -->
      <rect x="16" y="94" width="64" height="26" rx="5" fill="#3b82f6"/>
      <rect x="28" y="104" width="40" height="6" rx="1.5" fill="#ffffff"/>
      <rect x="88" y="94" width="64" height="26" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="100" y="104" width="40" height="6" rx="1.5" fill="#cbd5e1"/>
      <rect x="160" y="94" width="64" height="26" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="172" y="104" width="40" height="6" rx="1.5" fill="#cbd5e1"/>
    </svg>`;
  }

  // 7. Minimal Framed Map (Bingkai peta tipis elegan dengan caption bawah)
  if (id === 'minimal_framed_map') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="24" y="14" width="192" height="84" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <path d="M24 45L80 32L150 52L216 34V92L160 98L90 85L24 94V45Z" fill="#1e293b" opacity="0.5"/>
      <circle cx="120" cy="52" r="7" fill="#ef4444"/>
      <circle cx="120" cy="52" r="2" fill="#ffffff"/>
      <rect x="70" y="106" width="100" height="6" rx="2" fill="#f8fafc"/>
      <rect x="92" y="116" width="56" height="4" rx="1" fill="#3b82f6"/>
    </svg>`;
  }

  // 8. Multi Branch Tabs (Tab pemilih cabang atas, peta bawah)
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

  // 9. Card Overlay Bottom (Bar info transparan melintang di dasar peta)
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

  // 10. Default / Fullwidth Map (Peta penuh dengan floating card di sudut)
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#0f172a"/>
    <path d="M0 45L70 30L140 50L240 20V115L140 135L70 115L0 130V45Z" fill="#1e293b" opacity="0.6"/>
    <line x1="70" y1="30" x2="70" y2="115" stroke="#334155" stroke-width="2"/>
    <line x1="140" y1="50" x2="140" y2="135" stroke="#334155" stroke-width="2"/>
    <circle cx="145" cy="65" r="11" fill="#ef4444"/>
    <circle cx="145" cy="65" r="3.5" fill="white"/>
    <rect x="18" y="18" width="76" height="56" rx="6" fill="#020617" stroke="#3b82f6" stroke-width="1"/>
    <rect x="26" y="26" width="56" height="6" rx="1.5" fill="#f8fafc"/>
    <rect x="26" y="36" width="46" height="4" rx="1" fill="#64748b"/>
    <rect x="26" y="44" width="52" height="4" rx="1" fill="#64748b"/>
    <rect x="26" y="54" width="60" height="11" rx="2" fill="#22c55e"/>
  </svg>`;
};
