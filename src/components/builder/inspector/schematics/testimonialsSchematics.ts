export const getTestimonialsSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Single Spotlight Quote (Bawah-Atas: 1 kutipan ulasan besar terpusat)
  if (id === 'single_spotlight') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="24" y="16" width="192" height="92" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1"/>
      <circle cx="120" cy="34" r="10" fill="#f59e0b"/>
      <rect x="52" y="52" width="136" height="6" rx="2" fill="#f8fafc"/>
      <rect x="68" y="62" width="104" height="5" rx="1.5" fill="#94a3b8"/>
      <rect x="88" y="74" width="64" height="4" rx="1" fill="#64748b"/>
      <circle cx="108" cy="94" r="3" fill="#f59e0b"/>
      <circle cx="116" cy="94" r="3" fill="#334155"/>
      <circle cx="124" cy="94" r="3" fill="#334155"/>
      <circle cx="132" cy="94" r="3" fill="#334155"/>
    </svg>`;
  }

  // 2. Chat Bubble Flow (Gelembung percakapan WhatsApp)
  if (id === 'chat_bubble_flow') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="14" width="138" height="34" rx="8" fill="#052e16" stroke="#22c55e" stroke-width="0.75"/>
      <circle cx="28" cy="26" r="4" fill="#22c55e"/>
      <rect x="38" y="24" width="46" height="5" rx="1.5" fill="#86efac"/>
      <rect x="28" y="34" width="112" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="86" y="52" width="138" height="34" rx="8" fill="#1e293b"/>
      <circle cx="98" cy="64" r="4" fill="#3b82f6"/>
      <rect x="108" y="62" width="46" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="98" y="72" width="112" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="16" y="90" width="128" height="30" rx="8" fill="#052e16"/>
      <circle cx="28" cy="102" r="4" fill="#22c55e"/>
      <rect x="38" y="100" width="46" height="5" rx="1.5" fill="#86efac"/>
      <rect x="28" y="110" width="98" height="4" rx="1" fill="#cbd5e1"/>
    </svg>`;
  }

  // 3. Split Rating Stats (Kanan-Kiri: Skor 4.9 kiri, ulasan kanan)
  if (id === 'split_rating_stats') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="76" height="102" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="28" y="26" width="40" height="16" rx="3" fill="#f59e0b"/>
      <circle cx="34" cy="50" r="3" fill="#f59e0b"/>
      <circle cx="42" cy="50" r="3" fill="#f59e0b"/>
      <circle cx="50" cy="50" r="3" fill="#f59e0b"/>
      <circle cx="58" cy="50" r="3" fill="#f59e0b"/>
      <circle cx="66" cy="50" r="3" fill="#f59e0b"/>
      <rect x="24" y="62" width="60" height="4" rx="1" fill="#94a3b8"/>
      <rect x="24" y="72" width="56" height="5" rx="2" fill="#334155"/>
      <rect x="24" y="80" width="48" height="5" rx="2" fill="#334155"/>
      <rect x="100" y="16" width="124" height="48" rx="6" fill="#1e293b"/>
      <circle cx="114" cy="30" r="6" fill="#3b82f6"/>
      <rect x="126" y="26" width="48" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="114" y="44" width="96" height="4" rx="1" fill="#64748b"/>
      <rect x="100" y="70" width="124" height="48" rx="6" fill="#1e293b"/>
      <circle cx="114" cy="84" r="6" fill="#22c55e"/>
      <rect x="126" y="80" width="48" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="114" y="98" width="96" height="4" rx="1" fill="#64748b"/>
    </svg>`;
  }

  // 4. Video Review Cards (3 kartu dengan tombol play video)
  if (id === 'video_review_cards') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="20" width="62" height="96" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="20" y="24" width="54" height="60" rx="4" fill="#0f172a"/>
      <circle cx="47" cy="54" r="9" fill="#ef4444"/>
      <polygon points="45,50 51,54 45,58" fill="#ffffff"/>
      <rect x="22" y="90" width="44" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="89" y="20" width="62" height="96" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="93" y="24" width="54" height="60" rx="4" fill="#0f172a"/>
      <circle cx="120" cy="54" r="9" fill="#ef4444"/>
      <polygon points="118,50 124,54 118,58" fill="#ffffff"/>
      <rect x="95" y="90" width="44" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="162" y="20" width="62" height="96" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="166" y="24" width="54" height="60" rx="4" fill="#0f172a"/>
      <circle cx="193" cy="54" r="9" fill="#ef4444"/>
      <polygon points="191,50 197,54 191,58" fill="#ffffff"/>
      <rect x="168" y="90" width="44" height="5" rx="1.5" fill="#f8fafc"/>
    </svg>`;
  }

  // 5. Logo Client Cloud (Deretan logo mitra)
  if (id === 'logo_client_cloud') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="74" y="16" width="92" height="8" rx="2" fill="#f8fafc"/>
      <rect x="88" y="28" width="64" height="5" rx="1.5" fill="#64748b"/>
      <rect x="18" y="48" width="46" height="26" rx="4" fill="#1e293b"/>
      <rect x="72" y="48" width="46" height="26" rx="4" fill="#1e293b"/>
      <rect x="126" y="48" width="46" height="26" rx="4" fill="#1e293b"/>
      <rect x="180" y="48" width="46" height="26" rx="4" fill="#1e293b"/>
      <rect x="45" y="82" width="46" height="26" rx="4" fill="#1e293b"/>
      <rect x="99" y="82" width="46" height="26" rx="4" fill="#1e293b"/>
      <rect x="153" y="82" width="46" height="26" rx="4" fill="#1e293b"/>
    </svg>`;
  }

  // Default Masonry Grid (3 Kolom kartu ulasan berbobot)
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#090d16"/>
    <rect x="16" y="20" width="64" height="92" rx="6" fill="#1e293b"/>
    <circle cx="34" cy="36" r="7" fill="#f59e0b"/>
    <rect x="24" y="52" width="48" height="4" rx="1" fill="#f8fafc"/>
    <rect x="24" y="60" width="40" height="4" rx="1" fill="#64748b"/>
    <rect x="24" y="68" width="46" height="4" rx="1" fill="#64748b"/>
    <rect x="88" y="14" width="64" height="106" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="106" cy="30" r="7" fill="#f59e0b"/>
    <rect x="96" y="46" width="48" height="4" rx="1" fill="#f8fafc"/>
    <rect x="96" y="54" width="44" height="4" rx="1" fill="#64748b"/>
    <rect x="96" y="62" width="48" height="4" rx="1" fill="#64748b"/>
    <rect x="96" y="70" width="38" height="4" rx="1" fill="#64748b"/>
    <rect x="160" y="24" width="64" height="88" rx="6" fill="#1e293b"/>
    <circle cx="178" cy="40" r="7" fill="#f59e0b"/>
    <rect x="168" y="56" width="48" height="4" rx="1" fill="#f8fafc"/>
    <rect x="168" y="64" width="40" height="4" rx="1" fill="#64748b"/>
  </svg>`;
};
