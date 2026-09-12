export const getCatalogSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. List Compact Rows (Bawah-Atas: Daftar baris produk menu resto teratur)
  if (id === 'list_compact') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="70" y="10" width="100" height="7" rx="2" fill="#f8fafc"/>
      <rect x="16" y="26" width="208" height="28" rx="6" fill="#1e293b"/>
      <rect x="22" y="30" width="22" height="20" rx="3" fill="#334155"/>
      <rect x="52" y="33" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="52" y="42" width="40" height="4" rx="1" fill="#f59e0b"/>
      <rect x="180" y="32" width="36" height="16" rx="4" fill="#22c55e"/>
      <rect x="16" y="58" width="208" height="28" rx="6" fill="#1e293b"/>
      <rect x="22" y="62" width="22" height="20" rx="3" fill="#334155"/>
      <rect x="52" y="65" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="52" y="74" width="40" height="4" rx="1" fill="#f59e0b"/>
      <rect x="180" y="64" width="36" height="16" rx="4" fill="#22c55e"/>
      <rect x="16" y="90" width="208" height="28" rx="6" fill="#1e293b"/>
      <rect x="22" y="94" width="22" height="20" rx="3" fill="#334155"/>
      <rect x="52" y="97" width="64" height="6" rx="1.5" fill="#f8fafc"/>
      <rect x="52" y="106" width="40" height="4" rx="1" fill="#f59e0b"/>
      <rect x="180" y="96" width="36" height="16" rx="4" fill="#22c55e"/>
    </svg>`;
  }

  // 2. Carousel Scroll (Snap scroll horizontal geser)
  if (id === 'carousel_scroll') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="12" width="70" height="7" rx="2" fill="#f8fafc"/>
      <rect x="16" y="28" width="68" height="88" rx="6" fill="#1e293b"/>
      <rect x="22" y="34" width="56" height="44" rx="4" fill="#334155"/>
      <rect x="22" y="84" width="44" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="22" y="93" width="32" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="90" y="28" width="68" height="88" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="96" y="34" width="56" height="44" rx="4" fill="#334155"/>
      <rect x="96" y="84" width="44" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="96" y="93" width="32" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="164" y="28" width="68" height="88" rx="6" fill="#1e293b"/>
      <rect x="170" y="34" width="56" height="44" rx="4" fill="#334155"/>
      <circle cx="218" cy="72" r="10" fill="#3b82f6"/>
      <path d="M216 68L220 72L216 76" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  // 3. Bento Product Spotlight (1 produk unggulan besar di kiri, 2 produk di kanan)
  if (id === 'bento_product_spotlight') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="14" width="118" height="106" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="24" y="22" width="102" height="56" rx="5" fill="#334155"/>
      <rect x="24" y="84" width="58" height="7" rx="2" fill="#f8fafc"/>
      <rect x="24" y="95" width="44" height="6" rx="2" fill="#f59e0b"/>
      <rect x="92" y="92" width="34" height="16" rx="4" fill="#22c55e"/>
      <rect x="142" y="14" width="82" height="50" rx="6" fill="#1e293b"/>
      <rect x="148" y="20" width="32" height="38" rx="4" fill="#334155"/>
      <rect x="184" y="24" width="34" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="184" y="33" width="28" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="142" y="70" width="82" height="50" rx="6" fill="#1e293b"/>
      <rect x="148" y="76" width="32" height="38" rx="4" fill="#334155"/>
      <rect x="184" y="80" width="34" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="184" y="89" width="28" height="5" rx="1.5" fill="#f59e0b"/>
    </svg>`;
  }

  // 4. Split Category Sidebar (Sidebar kategori di kiri, grid produk di kanan)
  if (id === 'split_category_sidebar') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="14" width="56" height="106" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="20" y="22" width="36" height="6" rx="2" fill="#f8fafc"/>
      <rect x="20" y="34" width="44" height="12" rx="3" fill="#3b82f6"/>
      <rect x="20" y="50" width="40" height="10" rx="3" fill="#0f172a"/>
      <rect x="20" y="64" width="40" height="10" rx="3" fill="#0f172a"/>
      <rect x="20" y="78" width="40" height="10" rx="3" fill="#0f172a"/>
      <rect x="76" y="14" width="46" height="50" rx="5" fill="#1e293b"/>
      <rect x="80" y="18" width="38" height="26" rx="3" fill="#334155"/>
      <rect x="80" y="48" width="30" height="4" rx="1" fill="#f8fafc"/>
      <rect x="80" y="55" width="24" height="4" rx="1" fill="#f59e0b"/>
      <rect x="128" y="14" width="46" height="50" rx="5" fill="#1e293b"/>
      <rect x="132" y="18" width="38" height="26" rx="3" fill="#334155"/>
      <rect x="132" y="48" width="30" height="4" rx="1" fill="#f8fafc"/>
      <rect x="132" y="55" width="24" height="4" rx="1" fill="#f59e0b"/>
      <rect x="180" y="14" width="46" height="50" rx="5" fill="#1e293b"/>
      <rect x="184" y="18" width="38" height="26" rx="3" fill="#334155"/>
      <rect x="184" y="48" width="30" height="4" rx="1" fill="#f8fafc"/>
      <rect x="184" y="55" width="24" height="4" rx="1" fill="#f59e0b"/>
      <rect x="76" y="70" width="46" height="50" rx="5" fill="#1e293b"/>
      <rect x="128" y="70" width="46" height="50" rx="5" fill="#1e293b"/>
      <rect x="180" y="70" width="46" height="50" rx="5" fill="#1e293b"/>
    </svg>`;
  }

  // 5. Price Table View (Tabel komparasi harga)
  if (id === 'price_table_view') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="208" height="102" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="16" y="16" width="208" height="22" rx="6" fill="#0f172a"/>
      <rect x="28" y="24" width="40" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="90" y="24" width="34" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="144" y="24" width="30" height="5" rx="1.5" fill="#94a3b8"/>
      <line x1="16" y1="38" x2="224" y2="38" stroke="#334155" stroke-width="1"/>
      <rect x="28" y="48" width="46" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="90" y="48" width="28" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="184" y="44" width="32" height="14" rx="4" fill="#22c55e"/>
      <line x1="24" y1="64" x2="216" y2="64" stroke="#334155" stroke-width="0.5"/>
      <rect x="28" y="74" width="46" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="90" y="74" width="28" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="184" y="70" width="32" height="14" rx="4" fill="#22c55e"/>
      <line x1="24" y1="90" x2="216" y2="90" stroke="#334155" stroke-width="0.5"/>
      <rect x="28" y="99" width="46" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="90" y="99" width="28" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="184" y="95" width="32" height="14" rx="4" fill="#22c55e"/>
    </svg>`;
  }

  // 6. Flash Sale Countdown (Banner timer hitung mundur di atas + produk di bawah)
  if (id === 'flash_sale_countdown') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="12" width="212" height="24" rx="6" fill="#ef4444"/>
      <rect x="24" y="20" width="56" height="7" rx="2" fill="#ffffff"/>
      <rect x="146" y="16" width="16" height="14" rx="3" fill="#020617"/>
      <rect x="168" y="16" width="16" height="14" rx="3" fill="#020617"/>
      <rect x="190" y="16" width="16" height="14" rx="3" fill="#020617"/>
      <rect x="14" y="44" width="66" height="78" rx="6" fill="#1e293b"/>
      <rect x="20" y="50" width="54" height="40" rx="4" fill="#334155"/>
      <rect x="20" y="96" width="40" height="4" rx="1" fill="#f8fafc"/>
      <rect x="20" y="104" width="30" height="4" rx="1" fill="#f59e0b"/>
      <rect x="87" y="44" width="66" height="78" rx="6" fill="#1e293b"/>
      <rect x="93" y="50" width="54" height="40" rx="4" fill="#334155"/>
      <rect x="93" y="96" width="40" height="4" rx="1" fill="#f8fafc"/>
      <rect x="93" y="104" width="30" height="4" rx="1" fill="#f59e0b"/>
      <rect x="160" y="44" width="66" height="78" rx="6" fill="#1e293b"/>
      <rect x="166" y="50" width="54" height="40" rx="4" fill="#334155"/>
      <rect x="166" y="96" width="40" height="4" rx="1" fill="#f8fafc"/>
      <rect x="166" y="104" width="30" height="4" rx="1" fill="#f59e0b"/>
    </svg>`;
  }

  // 7. Masonry Catalog (3 kolom ketinggian bervariasi)
  if (id === 'masonry_catalog') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="14" width="64" height="60" rx="5" fill="#1e293b"/>
      <rect x="14" y="80" width="64" height="42" rx="5" fill="#1e293b"/>
      <rect x="88" y="14" width="64" height="40" rx="5" fill="#1e293b"/>
      <rect x="88" y="60" width="64" height="62" rx="5" fill="#1e293b"/>
      <rect x="162" y="14" width="64" height="68" rx="5" fill="#1e293b"/>
      <rect x="162" y="88" width="64" height="34" rx="5" fill="#1e293b"/>
    </svg>`;
  }

  // Default Standard Grid
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#090d16"/>
    <rect x="16" y="12" width="74" height="7" rx="2" fill="#f8fafc"/>
    <rect x="16" y="28" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="20" y="32" width="40" height="24" rx="3" fill="#334155"/>
    <rect x="20" y="60" width="30" height="4" rx="1" fill="#f8fafc"/>
    <rect x="20" y="66" width="22" height="4" rx="1" fill="#f59e0b"/>
    <rect x="70" y="28" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="74" y="32" width="40" height="24" rx="3" fill="#334155"/>
    <rect x="74" y="60" width="30" height="4" rx="1" fill="#f8fafc"/>
    <rect x="74" y="66" width="22" height="4" rx="1" fill="#f59e0b"/>
    <rect x="124" y="28" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="128" y="32" width="40" height="24" rx="3" fill="#334155"/>
    <rect x="128" y="60" width="30" height="4" rx="1" fill="#f8fafc"/>
    <rect x="128" y="66" width="22" height="4" rx="1" fill="#f59e0b"/>
    <rect x="178" y="28" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="182" y="32" width="40" height="24" rx="3" fill="#334155"/>
    <rect x="182" y="60" width="30" height="4" rx="1" fill="#f8fafc"/>
    <rect x="182" y="66" width="22" height="4" rx="1" fill="#f59e0b"/>
    <rect x="16" y="80" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="70" y="80" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="124" y="80" width="48" height="46" rx="4" fill="#1e293b"/>
    <rect x="178" y="80" width="48" height="46" rx="4" fill="#1e293b"/>
  </svg>`;
};
