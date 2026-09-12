export const getHeroSchematicSvg = (presetId: string): string => {
  const id = presetId.toLowerCase();

  // 1. Centered Minimal (Judul tengah, CTA tengah, mockup visual di bawah)
  if (id === 'centered_minimal') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="96" y="14" width="48" height="6" rx="3" fill="#3b82f6" opacity="0.8"/>
      <rect x="52" y="26" width="136" height="10" rx="3" fill="#f8fafc"/>
      <rect x="70" y="40" width="100" height="5" rx="2" fill="#64748b"/>
      <rect x="94" y="50" width="52" height="14" rx="4" fill="#3b82f6"/>
      <rect x="36" y="70" width="168" height="52" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <circle cx="120" cy="96" r="10" fill="#334155"/>
    </svg>`;
  }

  // 2. Full Banner Overlay & Video Background (Bawah-Atas, banner luas penuh layar dengan teks kontras tengah)
  if (id === 'full_banner_overlay' || id === 'video_background_loop') {
    const isVideo = id === 'video_background_loop';
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="12" y="10" width="216" height="115" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="12" y="10" width="216" height="115" rx="6" fill="#020617" opacity="0.65"/>
      ${isVideo ? '<circle cx="120" cy="40" r="11" fill="#3b82f6"/><polygon points="117,35 125,40 117,45" fill="#ffffff"/>' : '<rect x="92" y="24" width="56" height="6" rx="3" fill="#ffffff" opacity="0.7"/>'}
      <rect x="44" y="${isVideo ? '58' : '38'}" width="152" height="11" rx="3" fill="#ffffff"/>
      <rect x="68" y="${isVideo ? '74' : '55'}" width="104" height="6" rx="2" fill="#cbd5e1"/>
      <rect x="92" y="${isVideo ? '86' : '70'}" width="56" height="16" rx="5" fill="#3b82f6"/>
    </svg>`;
  }

  // 3. Gradient Mesh Glow (Bawah-atas, teks tengah dengan floating glass badge bar di bawah)
  if (id === 'gradient_mesh_glow') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <circle cx="50" cy="40" r="38" fill="#3b82f6" opacity="0.25"/>
      <circle cx="190" cy="95" r="42" fill="#8b5cf6" opacity="0.2"/>
      <rect x="56" y="22" width="128" height="10" rx="3" fill="#f8fafc"/>
      <rect x="74" y="38" width="92" height="5" rx="2" fill="#94a3b8"/>
      <rect x="96" y="48" width="48" height="13" rx="4" fill="#3b82f6"/>
      <rect x="42" y="74" width="156" height="38" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1"/>
      <circle cx="62" cy="93" r="5" fill="#22c55e"/>
      <rect x="72" y="90" width="30" height="5" rx="2" fill="#cbd5e1"/>
      <circle cx="114" cy="93" r="5" fill="#22c55e"/>
      <rect x="124" y="90" width="30" height="5" rx="2" fill="#cbd5e1"/>
      <circle cx="166" cy="93" r="5" fill="#22c55e"/>
      <rect x="176" y="90" width="16" height="5" rx="2" fill="#cbd5e1"/>
    </svg>`;
  }

  // 4. Oversized Bold Typography (Bawah-Atas, teks raksasa display penuh)
  if (id === 'oversized_bold_typography') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="95" y="14" width="50" height="6" rx="3" fill="#334155"/>
      <rect x="20" y="28" width="200" height="24" rx="4" fill="#f8fafc"/>
      <rect x="36" y="58" width="168" height="20" rx="4" fill="#94a3b8"/>
      <rect x="64" y="86" width="112" height="6" rx="2" fill="#64748b"/>
      <rect x="92" y="100" width="56" height="16" rx="8" fill="#3b82f6"/>
    </svg>`;
  }

  // 5. Inline Email Capture (Bawah-Atas, teks tengah + form pill menyatu di bawah)
  if (id === 'inline_email_capture') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="92" y="18" width="56" height="6" rx="3" fill="#3b82f6" opacity="0.8"/>
      <rect x="46" y="32" width="148" height="12" rx="3" fill="#f8fafc"/>
      <rect x="68" y="50" width="104" height="6" rx="2" fill="#64748b"/>
      <rect x="38" y="74" width="164" height="30" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
      <rect x="48" y="84" width="80" height="10" rx="3" fill="#334155"/>
      <rect x="136" y="79" width="60" height="20" rx="6" fill="#3b82f6"/>
    </svg>`;
  }

  // 6. Social Proof Community (Bawah-Atas, avatar wall di atas judul tengah)
  if (id === 'social_proof_community') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <circle cx="86" cy="24" r="8" fill="#f59e0b"/>
      <circle cx="98" cy="24" r="8" fill="#3b82f6"/>
      <circle cx="110" cy="24" r="8" fill="#ec4899"/>
      <circle cx="122" cy="24" r="8" fill="#10b981"/>
      <rect x="136" y="21" width="38" height="6" rx="2" fill="#f59e0b"/>
      <rect x="44" y="42" width="152" height="12" rx="3" fill="#f8fafc"/>
      <rect x="66" y="60" width="108" height="6" rx="2" fill="#64748b"/>
      <rect x="88" y="76" width="64" height="18" rx="5" fill="#3b82f6"/>
      <rect x="58" y="104" width="124" height="14" rx="4" fill="#1e293b"/>
    </svg>`;
  }

  // 7. Pill Category Selector (Bawah-Atas, teks tengah + row pills kategori di bawah)
  if (id === 'pill_category_selector') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="52" y="18" width="136" height="11" rx="3" fill="#f8fafc"/>
      <rect x="76" y="34" width="88" height="5" rx="2" fill="#64748b"/>
      <rect x="20" y="50" width="44" height="14" rx="7" fill="#3b82f6"/>
      <rect x="70" y="50" width="46" height="14" rx="7" fill="#1e293b"/>
      <rect x="122" y="50" width="46" height="14" rx="7" fill="#1e293b"/>
      <rect x="174" y="50" width="46" height="14" rx="7" fill="#1e293b"/>
      <rect x="28" y="74" width="184" height="48" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    </svg>`;
  }

  // 8. Bento Masonry Hero (Grid asimetris)
  if (id === 'bento_masonry_hero') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="14" width="128" height="66" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <rect x="24" y="24" width="70" height="8" rx="2" fill="#f8fafc"/>
      <rect x="24" y="38" width="90" height="4" rx="2" fill="#64748b"/>
      <rect x="24" y="52" width="42" height="14" rx="4" fill="#3b82f6"/>
      <rect x="150" y="14" width="76" height="50" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <rect x="150" y="70" width="76" height="50" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <rect x="14" y="86" width="128" height="34" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
    </svg>`;
  }

  // 9. Interactive Terminal Code (Kanan-Kiri: Teks kiri, Terminal kanan)
  if (id === 'interactive_terminal_code') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="24" width="94" height="12" rx="3" fill="#f8fafc"/>
      <rect x="16" y="44" width="80" height="6" rx="2" fill="#64748b"/>
      <rect x="16" y="66" width="48" height="14" rx="4" fill="#3b82f6"/>
      <rect x="118" y="18" width="106" height="98" rx="6" fill="#020617" stroke="#22c55e" stroke-width="1"/>
      <circle cx="127" cy="27" r="2.5" fill="#ef4444"/>
      <circle cx="135" cy="27" r="2.5" fill="#eab308"/>
      <circle cx="143" cy="27" r="2.5" fill="#22c55e"/>
      <rect x="127" y="38" width="62" height="4" rx="1" fill="#22c55e"/>
      <rect x="127" y="48" width="78" height="4" rx="1" fill="#94a3b8"/>
      <rect x="127" y="58" width="50" height="4" rx="1" fill="#3b82f6"/>
    </svg>`;
  }

  // 10. Sticky WhatsApp Pill Float (Kanan-Kiri: Teks kiri, dialog chat bubble WA kanan)
  if (id === 'sticky_whatsapp_pill_float') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="26" width="92" height="12" rx="3" fill="#f8fafc"/>
      <rect x="16" y="46" width="76" height="6" rx="2" fill="#64748b"/>
      <rect x="16" y="66" width="52" height="15" rx="4" fill="#22c55e"/>
      <rect x="120" y="16" width="106" height="102" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="1"/>
      <rect x="126" y="24" width="72" height="20" rx="5" fill="#1e293b"/>
      <rect x="132" y="31" width="56" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="146" y="52" width="72" height="22" rx="5" fill="#052e16" stroke="#22c55e" stroke-width="0.75"/>
      <rect x="152" y="60" width="56" height="4" rx="1" fill="#86efac"/>
      <rect x="126" y="82" width="68" height="18" rx="5" fill="#1e293b"/>
    </svg>`;
  }

  // 11. Side Card Booking (Kanan-Kiri: Teks kiri, Card Form Reservasi kanan)
  if (id === 'side_card_booking') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="24" width="94" height="12" rx="3" fill="#f8fafc"/>
      <rect x="16" y="44" width="80" height="6" rx="2" fill="#64748b"/>
      <rect x="122" y="14" width="102" height="106" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <rect x="130" y="22" width="60" height="6" rx="2" fill="#f8fafc"/>
      <rect x="130" y="34" width="86" height="14" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="130" y="54" width="86" height="14" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="130" y="74" width="86" height="14" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="130" y="94" width="86" height="18" rx="4" fill="#3b82f6"/>
    </svg>`;
  }

  // 12. Split Stat Counter (Kanan-Kiri: Teks kiri, 3 box metric kanan)
  if (id === 'split_stat_counter') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="26" width="92" height="12" rx="3" fill="#f8fafc"/>
      <rect x="16" y="46" width="76" height="6" rx="2" fill="#64748b"/>
      <rect x="16" y="68" width="48" height="15" rx="4" fill="#3b82f6"/>
      <rect x="122" y="16" width="102" height="30" rx="5" fill="#1e293b"/>
      <rect x="130" y="22" width="34" height="8" rx="2" fill="#3b82f6"/>
      <rect x="130" y="33" width="54" height="4" rx="1" fill="#64748b"/>
      <rect x="122" y="52" width="102" height="30" rx="5" fill="#1e293b"/>
      <rect x="130" y="58" width="34" height="8" rx="2" fill="#22c55e"/>
      <rect x="130" y="69" width="54" height="4" rx="1" fill="#64748b"/>
      <rect x="122" y="88" width="102" height="30" rx="5" fill="#1e293b"/>
      <rect x="130" y="94" width="34" height="8" rx="2" fill="#f59e0b"/>
    </svg>`;
  }

  // 13. Brand Story Founder (Kanan-Kiri: Portrait founder di kiri, narasi kisah di kanan)
  if (id === 'brand_story_founder') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="16" width="84" height="102" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <circle cx="58" cy="50" r="18" fill="#334155"/>
      <rect x="24" y="88" width="68" height="18" rx="3" fill="#0f172a"/>
      <rect x="114" y="22" width="42" height="5" rx="2" fill="#f59e0b"/>
      <rect x="114" y="34" width="110" height="12" rx="3" fill="#f8fafc"/>
      <rect x="114" y="52" width="102" height="5" rx="2" fill="#64748b"/>
      <rect x="114" y="62" width="96" height="5" rx="2" fill="#64748b"/>
      <rect x="114" y="78" width="106" height="24" rx="4" fill="#1e293b"/>
    </svg>`;
  }

  // 14. Dual Contrast Split (Kanan-Kiri: 50% sisi terang/biru, 50% sisi gelap kontras)
  if (id === 'dual_contrast_split') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="8" y="8" width="110" height="119" rx="6" fill="#1d4ed8"/>
      <rect x="20" y="28" width="76" height="10" rx="3" fill="#ffffff"/>
      <rect x="20" y="44" width="60" height="5" rx="2" fill="#bfdbfe"/>
      <rect x="20" y="66" width="50" height="15" rx="4" fill="#ffffff"/>
      <rect x="122" y="8" width="110" height="119" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1"/>
      <rect x="134" y="28" width="76" height="10" rx="3" fill="#f8fafc"/>
      <rect x="134" y="44" width="60" height="5" rx="2" fill="#64748b"/>
      <rect x="134" y="66" width="50" height="15" rx="4" fill="#3b82f6"/>
    </svg>`;
  }

  // 15. Dual Product Showcase (Kanan-Kiri: Teks kiri, 2 kartu produk berdampingan kanan)
  if (id === 'dual_product_showcase') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="14" y="28" width="84" height="12" rx="3" fill="#f8fafc"/>
      <rect x="14" y="48" width="70" height="6" rx="2" fill="#64748b"/>
      <rect x="14" y="70" width="48" height="15" rx="4" fill="#3b82f6"/>
      <rect x="108" y="20" width="58" height="94" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="114" y="26" width="46" height="38" rx="3" fill="#334155"/>
      <rect x="114" y="70" width="36" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="114" y="80" width="28" height="5" rx="1.5" fill="#f59e0b"/>
      <rect x="170" y="20" width="58" height="94" rx="5" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="176" y="26" width="46" height="38" rx="3" fill="#334155"/>
      <rect x="176" y="70" width="36" height="5" rx="1.5" fill="#f8fafc"/>
      <rect x="176" y="80" width="28" height="5" rx="1.5" fill="#f59e0b"/>
    </svg>`;
  }

  // 16. Split Right Text (Kanan-Kiri: Foto kiri, Teks kanan)
  if (id === 'split_right_text') {
    return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="135" rx="8" fill="#090d16"/>
      <rect x="16" y="18" width="98" height="98" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
      <circle cx="65" cy="67" r="16" fill="#334155"/>
      <rect x="126" y="24" width="98" height="12" rx="3" fill="#f8fafc"/>
      <rect x="126" y="44" width="88" height="6" rx="2" fill="#64748b"/>
      <rect x="126" y="56" width="72" height="6" rx="2" fill="#64748b"/>
      <rect x="126" y="74" width="54" height="16" rx="5" fill="#3b82f6"/>
    </svg>`;
  }

  // Default Split Left Text (Kanan-Kiri: Teks kiri, Media kanan)
  return `<svg viewBox="0 0 240 135" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="135" rx="8" fill="#090d16"/>
    <rect x="16" y="24" width="96" height="12" rx="3" fill="#f8fafc"/>
    <rect x="16" y="44" width="88" height="6" rx="2" fill="#64748b"/>
    <rect x="16" y="56" width="72" height="6" rx="2" fill="#64748b"/>
    <rect x="16" y="74" width="54" height="16" rx="5" fill="#3b82f6"/>
    <rect x="124" y="20" width="100" height="94" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="1"/>
    <circle cx="174" cy="62" r="16" fill="#334155"/>
  </svg>`;
};
