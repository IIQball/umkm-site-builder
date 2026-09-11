export const getFaqSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Split FAQ Sidebar (Kanan-Kiri: Sidebar bantuan di kiri, akordeon di kanan)
  if (id === 'split_faq_sidebar') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="18" width="76" height="100" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="22" y="26" width="58" height="8" rx="2" fill="#f8fafc"/>
      <rect x="22" y="38" width="48" height="4" rx="1" fill="#64748b"/>
      <rect x="22" y="56" width="60" height="48" rx="5" fill="#0f172a" stroke="#22c55e" stroke-width="0.75"/>
      <circle cx="34" cy="70" r="5" fill="#22c55e"/>
      <rect x="44" y="68" width="32" height="4" rx="1" fill="#f8fafc"/>
      <rect x="26" y="86" width="52" height="12" rx="3" fill="#22c55e"/>
      <rect x="100" y="18" width="126" height="22" rx="4" fill="#1e293b"/>
      <rect x="108" y="26" width="70" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="216" cy="29" r="3" fill="#3b82f6"/>
      <rect x="100" y="44" width="126" height="22" rx="4" fill="#1e293b"/>
      <rect x="108" y="52" width="60" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="216" cy="55" r="3" fill="#3b82f6"/>
      <rect x="100" y="70" width="126" height="22" rx="4" fill="#1e293b"/>
      <rect x="108" y="78" width="66" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="216" cy="81" r="3" fill="#3b82f6"/>
      <rect x="100" y="96" width="126" height="22" rx="4" fill="#1e293b"/>
      <rect x="108" y="104" width="54" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="216" cy="107" r="3" fill="#3b82f6"/>
    </svg>`;
  }

  // 2. Accordion Two Col (2 Kolom akordeon simetris)
  if (id === 'accordion_two_col') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="80" y="12" width="80" height="7" rx="2" fill="#f8fafc"/>
      <rect x="14" y="28" width="102" height="26" rx="4" fill="#1e293b"/>
      <rect x="22" y="38" width="64" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="106" cy="41" r="3" fill="#3b82f6"/>
      <rect x="14" y="58" width="102" height="38" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="22" y="66" width="70" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="22" y="76" width="84" height="4" rx="1" fill="#64748b"/>
      <circle cx="106" cy="69" r="3" fill="#3b82f6"/>
      <rect x="14" y="100" width="102" height="24" rx="4" fill="#1e293b"/>
      <rect x="22" y="110" width="56" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="106" cy="112" r="3" fill="#3b82f6"/>
      <rect x="124" y="28" width="102" height="26" rx="4" fill="#1e293b"/>
      <rect x="132" y="38" width="64" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="216" cy="41" r="3" fill="#3b82f6"/>
      <rect x="124" y="58" width="102" height="26" rx="4" fill="#1e293b"/>
      <rect x="132" y="68" width="64" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="216" cy="71" r="3" fill="#3b82f6"/>
      <rect x="124" y="88" width="102" height="36" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="132" y="96" width="70" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="132" y="106" width="84" height="4" rx="1" fill="#64748b"/>
    </svg>`;
  }

  // 3. Grid 2 Col Cards (Grid 2 kolom kartu terbuka)
  if (id === 'grid_2_col_cards') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="80" y="10" width="80" height="7" rx="2" fill="#f8fafc"/>
      <rect x="16" y="26" width="98" height="44" rx="6" fill="#1e293b"/>
      <rect x="24" y="34" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="24" y="46" width="80" height="4" rx="1" fill="#64748b"/>
      <rect x="24" y="54" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="126" y="26" width="98" height="44" rx="6" fill="#1e293b"/>
      <rect x="134" y="34" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="134" y="46" width="80" height="4" rx="1" fill="#64748b"/>
      <rect x="134" y="54" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="16" y="76" width="98" height="44" rx="6" fill="#1e293b"/>
      <rect x="24" y="84" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="24" y="96" width="80" height="4" rx="1" fill="#64748b"/>
      <rect x="24" y="104" width="68" height="4" rx="1" fill="#64748b"/>
      <rect x="126" y="76" width="98" height="44" rx="6" fill="#1e293b"/>
      <rect x="134" y="84" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="134" y="96" width="80" height="4" rx="1" fill="#64748b"/>
      <rect x="134" y="104" width="68" height="4" rx="1" fill="#64748b"/>
    </svg>`;
  }

  // 4. Chat Style FAQ (Gaya balon chat WA)
  if (id === 'chat_style_faq') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="80" y="10" width="80" height="6" rx="2" fill="#f8fafc"/>
      <rect x="16" y="24" width="136" height="24" rx="6" fill="#1e293b"/>
      <rect x="26" y="32" width="94" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="88" y="52" width="136" height="32" rx="6" fill="#052e16" stroke="#22c55e" stroke-width="0.75"/>
      <rect x="98" y="60" width="112" height="5" rx="1.5" fill="#86efac"/>
      <rect x="98" y="70" width="84" height="4" rx="1" fill="#4ade80"/>
      <rect x="16" y="88" width="128" height="24" rx="6" fill="#1e293b"/>
      <rect x="26" y="96" width="88" height="5" rx="1.5" fill="#f8fafc"/>
    </svg>`;
  }

  // 5. Search Filtered FAQ (Search bar di atas, akordeon di bawah)
  if (id === 'search_filtered_faq') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="36" y="12" width="168" height="20" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="48" cy="22" r="3.5" fill="#64748b"/>
      <rect x="58" y="20" width="60" height="4" rx="1.5" fill="#64748b"/>
      <rect x="36" y="40" width="168" height="22" rx="4" fill="#1e293b"/>
      <rect x="46" y="48" width="80" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="192" cy="51" r="3.5" fill="#3b82f6"/>
      <rect x="36" y="66" width="168" height="36" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="46" y="74" width="90" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="46" y="84" width="130" height="4" rx="1" fill="#64748b"/>
      <rect x="36" y="106" width="168" height="20" rx="4" fill="#1e293b"/>
    </svg>`;
  }

  // 6. Categorized Tabs FAQ (Tab kategori di atas)
  if (id === 'categorized_tabs_faq') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="36" y="12" width="46" height="14" rx="4" fill="#3b82f6"/>
      <rect x="88" y="12" width="46" height="14" rx="4" fill="#1e293b"/>
      <rect x="140" y="12" width="46" height="14" rx="4" fill="#1e293b"/>
      <rect x="36" y="34" width="168" height="24" rx="4" fill="#1e293b"/>
      <rect x="46" y="43" width="80" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="192" cy="46" r="3.5" fill="#3b82f6"/>
      <rect x="36" y="62" width="168" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="46" y="71" width="90" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="46" y="81" width="130" height="4" rx="1" fill="#64748b"/>
      <rect x="46" y="89" width="110" height="4" rx="1" fill="#64748b"/>
      <rect x="36" y="108" width="168" height="20" rx="4" fill="#1e293b"/>
    </svg>`;
  }

  // 7. Compact Numbered List (01, 02, 03 tersusun vertikal)
  if (id === 'compact_numbered_list') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="74" y="10" width="92" height="7" rx="2" fill="#f8fafc"/>
      <rect x="36" y="24" width="168" height="26" rx="4" fill="#1e293b"/>
      <rect x="44" y="32" width="16" height="10" rx="2" fill="#3b82f6"/>
      <rect x="68" y="34" width="80" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="192" cy="37" r="3" fill="#64748b"/>
      <rect x="36" y="54" width="168" height="26" rx="4" fill="#1e293b"/>
      <rect x="44" y="62" width="16" height="10" rx="2" fill="#3b82f6"/>
      <rect x="68" y="64" width="80" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="192" cy="67" r="3" fill="#64748b"/>
      <rect x="36" y="84" width="168" height="26" rx="4" fill="#1e293b"/>
      <rect x="44" y="92" width="16" height="10" rx="2" fill="#3b82f6"/>
      <rect x="68" y="94" width="80" height="5" rx="1.5" fill="#f8fafc"/>
      <circle cx="192" cy="97" r="3" fill="#64748b"/>
    </svg>`;
  }

  // Default Accordion Single Column (Bawah-Atas terpusat)
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#090d16"/>
    <rect x="70" y="10" width="100" height="7" rx="2" fill="#f8fafc"/>
    <rect x="36" y="24" width="168" height="22" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
    <rect x="46" y="32" width="80" height="5" rx="1.5" fill="#f8fafc"/>
    <circle cx="192" cy="35" r="4" fill="#3b82f6"/>
    <rect x="36" y="50" width="168" height="42" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <rect x="46" y="59" width="100" height="5" rx="1.5" fill="#f8fafc"/>
    <rect x="46" y="70" width="140" height="4" rx="1" fill="#64748b"/>
    <rect x="46" y="78" width="120" height="4" rx="1" fill="#64748b"/>
    <rect x="36" y="96" width="168" height="22" rx="4" fill="#1e293b"/>
    <rect x="46" y="104" width="70" height="5" rx="1.5" fill="#f8fafc"/>
    <circle cx="192" cy="107" r="4" fill="#64748b"/>
  </svg>`;
};
