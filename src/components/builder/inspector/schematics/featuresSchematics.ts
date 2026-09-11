export const getFeaturesSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Banner Inline Bar (Pita kontainer horizontal ramping 1 baris)
  if (id === 'banner_inline_bar') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="44" width="212" height="46" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <circle cx="34" cy="67" r="9" fill="#3b82f6"/>
      <rect x="50" y="62" width="28" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="50" y="70" width="20" height="4" rx="1" fill="#64748b"/>
      <line x1="88" y1="52" x2="88" y2="82" stroke="#334155" stroke-width="1"/>
      <circle cx="106" cy="67" r="9" fill="#22c55e"/>
      <rect x="122" y="62" width="28" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="122" y="70" width="20" height="4" rx="1" fill="#64748b"/>
      <line x1="160" y1="52" x2="160" y2="82" stroke="#334155" stroke-width="1"/>
      <circle cx="178" cy="67" r="9" fill="#f59e0b"/>
      <rect x="194" y="62" width="24" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="194" y="70" width="18" height="4" rx="1" fill="#64748b"/>
    </svg>`;
  }

  // 2. Horizontal List (2 Kolom: Judul sticky kiri, baris fitur kanan)
  if (id === 'horizontal_list') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="28" width="68" height="10" rx="3" fill="#f8fafc"/>
      <rect x="16" y="44" width="56" height="5" rx="2" fill="#64748b"/>
      <rect x="16" y="54" width="48" height="5" rx="2" fill="#64748b"/>
      <rect x="94" y="16" width="130" height="28" rx="6" fill="#1e293b"/>
      <circle cx="108" cy="30" r="6" fill="#3b82f6"/>
      <rect x="122" y="25" width="60" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="122" y="33" width="44" height="4" rx="1" fill="#64748b"/>
      <rect x="94" y="52" width="130" height="28" rx="6" fill="#1e293b"/>
      <circle cx="108" cy="66" r="6" fill="#22c55e"/>
      <rect x="122" y="61" width="60" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="122" y="69" width="44" height="4" rx="1" fill="#64748b"/>
      <rect x="94" y="88" width="130" height="28" rx="6" fill="#1e293b"/>
      <circle cx="108" cy="102" r="6" fill="#f59e0b"/>
      <rect x="122" y="97" width="60" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="122" y="105" width="44" height="4" rx="1" fill="#64748b"/>
    </svg>`;
  }

  // 3. Alternating Zigzag Rows (Baris bergantian kiri-kanan)
  if (id === 'alternating_zigzag_rows') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="58" height="44" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="45" cy="38" r="8" fill="#334155"/>
      <rect x="84" y="24" width="70" height="7" rx="2" fill="#f8fafc"/>
      <rect x="84" y="36" width="136" height="4" rx="1" fill="#64748b"/>
      <rect x="84" y="44" width="112" height="4" rx="1" fill="#64748b"/>
      <rect x="16" y="76" width="70" height="7" rx="2" fill="#f8fafc"/>
      <rect x="16" y="88" width="136" height="4" rx="1" fill="#64748b"/>
      <rect x="16" y="96" width="112" height="4" rx="1" fill="#64748b"/>
      <rect x="166" y="68" width="58" height="44" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="195" cy="90" r="8" fill="#334155"/>
    </svg>`;
  }

  // 4. Interactive Tabs (Tab di atas, panel aktif di bawah)
  if (id === 'interactive_tabs') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="36" y="16" width="50" height="14" rx="4" fill="#3b82f6"/>
      <rect x="94" y="16" width="50" height="14" rx="4" fill="#1e293b"/>
      <rect x="152" y="16" width="50" height="14" rx="4" fill="#1e293b"/>
      <rect x="24" y="38" width="192" height="78" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="38" y="50" width="76" height="54" rx="6" fill="#0f172a"/>
      <rect x="124" y="54" width="72" height="8" rx="2" fill="#f8fafc"/>
      <rect x="124" y="68" width="80" height="4" rx="1" fill="#64748b"/>
      <rect x="124" y="76" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="124" y="88" width="38" height="12" rx="4" fill="#3b82f6"/>
    </svg>`;
  }

  // 5. Bento Grid Asymmetric
  if (id === 'bento_grid_asymmetric') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="118" height="102" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="75" cy="50" r="16" fill="#334155"/>
      <rect x="28" y="78" width="60" height="7" rx="2" fill="#f8fafc"/>
      <rect x="28" y="89" width="80" height="4" rx="1" fill="#64748b"/>
      <rect x="142" y="16" width="82" height="48" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <circle cx="156" cy="32" r="6" fill="#22c55e"/>
      <rect x="168" y="30" width="46" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="142" y="70" width="82" height="48" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <circle cx="156" cy="86" r="6" fill="#f59e0b"/>
      <rect x="168" y="84" width="46" height="5" rx="1.5" fill="#f8fafc"/>
    </svg>`;
  }

  // 6. Before & After Comparison (2 Kolom komparasi)
  if (id === 'before_after_comparison') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="20" width="98" height="96" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1"/>
      <rect x="26" y="28" width="46" height="12" rx="3" fill="#ef4444" opacity="0.2"/>
      <rect x="30" y="32" width="38" height="4" rx="1" fill="#f87171"/>
      <circle cx="32" cy="54" r="4" fill="#ef4444"/>
      <rect x="42" y="52" width="62" height="4" rx="1" fill="#94a3b8"/>
      <circle cx="32" cy="68" r="4" fill="#ef4444"/>
      <rect x="42" y="66" width="56" height="4" rx="1" fill="#94a3b8"/>
      <circle cx="32" cy="82" r="4" fill="#ef4444"/>
      <rect x="42" y="80" width="60" height="4" rx="1" fill="#94a3b8"/>
      <rect x="126" y="20" width="98" height="96" rx="6" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="136" y="28" width="46" height="12" rx="3" fill="#22c55e" opacity="0.2"/>
      <rect x="140" y="32" width="38" height="4" rx="1" fill="#4ade80"/>
      <circle cx="142" cy="54" r="4" fill="#22c55e"/>
      <rect x="152" y="52" width="62" height="4" rx="1" fill="#f8fafc"/>
      <circle cx="142" cy="68" r="4" fill="#22c55e"/>
      <rect x="152" y="66" width="56" height="4" rx="1" fill="#f8fafc"/>
      <circle cx="142" cy="82" r="4" fill="#22c55e"/>
      <rect x="152" y="80" width="60" height="4" rx="1" fill="#f8fafc"/>
    </svg>`;
  }

  // 7. Dense Icon Matrix (Matriks ubin ikon kompak 4x2)
  if (id === 'dense_icon_matrix') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="22" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="40" cy="36" r="6" fill="#3b82f6"/>
      <rect x="24" y="48" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="70" y="22" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="94" cy="36" r="6" fill="#22c55e"/>
      <rect x="78" y="48" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="124" y="22" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="148" cy="36" r="6" fill="#f59e0b"/>
      <rect x="132" y="48" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="178" y="22" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="202" cy="36" r="6" fill="#ec4899"/>
      <rect x="186" y="48" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="16" y="72" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="40" cy="86" r="6" fill="#a855f7"/>
      <rect x="24" y="98" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="70" y="72" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="94" cy="86" r="6" fill="#06b6d4"/>
      <rect x="78" y="98" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="124" y="72" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="148" cy="86" r="6" fill="#f97316"/>
      <rect x="132" y="98" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="178" y="72" width="48" height="42" rx="5" fill="#1e293b"/>
      <circle cx="202" cy="86" r="6" fill="#64748b"/>
      <rect x="186" y="98" width="32" height="4" rx="1" fill="#f8fafc"/>
    </svg>`;
  }

  // 8. Vertical Accordion Showcase
  if (id === 'vertical_accordion_showcase') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="24" y="16" width="192" height="22" rx="4" fill="#1e293b"/>
      <circle cx="40" cy="27" r="5" fill="#3b82f6"/>
      <rect x="52" y="24" width="70" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="24" y="42" width="192" height="46" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="40" cy="56" r="5" fill="#3b82f6"/>
      <rect x="52" y="53" width="70" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="52" y="64" width="140" height="4" rx="1" fill="#64748b"/>
      <rect x="52" y="72" width="110" height="4" rx="1" fill="#64748b"/>
      <rect x="24" y="92" width="192" height="22" rx="4" fill="#1e293b"/>
      <circle cx="40" cy="103" r="5" fill="#3b82f6"/>
      <rect x="52" y="100" width="70" height="5" rx="1.5" fill="#f8fafc"/>
    </svg>`;
  }

  // Default Grid 3 Cards
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#090d16"/>
    <rect x="74" y="14" width="92" height="8" rx="2" fill="#f8fafc"/>
    <rect x="16" y="36" width="62" height="82" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <circle cx="34" cy="54" r="8" fill="#3b82f6"/>
    <rect x="24" y="70" width="46" height="5" rx="1.5" fill="#f8fafc"/>
    <rect x="24" y="80" width="38" height="4" rx="1" fill="#64748b"/>
    <rect x="89" y="36" width="62" height="82" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
    <circle cx="107" cy="54" r="8" fill="#3b82f6"/>
    <rect x="97" y="70" width="46" height="5" rx="1.5" fill="#f8fafc"/>
    <rect x="97" y="80" width="38" height="4" rx="1" fill="#64748b"/>
    <rect x="162" y="36" width="62" height="82" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
    <circle cx="180" cy="54" r="8" fill="#3b82f6"/>
    <rect x="170" y="70" width="46" height="5" rx="1.5" fill="#f8fafc"/>
    <rect x="170" y="80" width="38" height="4" rx="1" fill="#64748b"/>
  </svg>`;
};
