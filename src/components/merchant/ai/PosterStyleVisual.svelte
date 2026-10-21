<script lang="ts">
  import type { PosterStyle } from '@/lib/validators/ai-poster';

  export let styleId: PosterStyle;
  export let selected: boolean = false;
</script>

<div
  class="w-full h-20 rounded-xl overflow-hidden relative flex items-center justify-center transition-colors {selected
    ? 'bg-primary/10 border-2 border-primary'
    : 'bg-nested/80 border border-light/60 group-hover:border-light'}"
>
  {#if styleId === 'vietnam_editorial'}
    <!-- Kafe Butik Hangat: Latar linen krem, tipografi editorial elegan di atas, cangkir kopi minimalis -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#EDE8DF" />
      <rect x="12" y="10" width="45" height="4" rx="1" fill="#4A3E3D" />
      <rect x="12" y="16" width="30" height="2" rx="1" fill="#8C7A78" />
      <ellipse cx="68" cy="38" rx="14" ry="4" fill="#D3C9BE" />
      <path d="M58 26 H78 L75 42 H61 Z" fill="#4A3E3D" />
      <path d="M76 29 H81 Q84 29 84 33 Q84 37 81 37 H76" fill="none" stroke="#4A3E3D" stroke-width="1.5" />
    </svg>
  {:else if styleId === 'thai_commercial'}
    <!-- Pop Kuliner Berani: Blok warna terbelah tegas oranye & biru dengan stiker bintang promo -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="50" height="60" fill="#FF6B35" />
      <rect x="50" width="50" height="60" fill="#00A2EE" />
      <rect x="10" y="8" width="80" height="8" rx="2" fill="#FFFFFF" />
      <circle cx="50" cy="36" r="14" fill="#FFFFFF" />
      <circle cx="50" cy="36" r="10" fill="#FECF02" />
      <polygon points="78,16 83,18 81,23 86,26 80,28 81,34 76,31 73,36 72,30 67,31 70,26 66,22 71,21 70,16 75,19" fill="#FC018B" />
    </svg>
  {:else if styleId === 'neo_brutalism'}
    <!-- Urban Modern Bergaris: Kotak garis hitam tegas 2px dengan bayangan solid offset dan warna kuning -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#FEF9C3" />
      <!-- Bayangan solid hitam -->
      <rect x="18" y="14" width="68" height="36" rx="2" fill="#0F172A" />
      <!-- Kartu utama di atas bayangan -->
      <rect x="14" y="10" width="68" height="36" rx="2" fill="#FDE047" stroke="#0F172A" stroke-width="2" />
      <rect x="20" y="16" width="34" height="6" fill="#0F172A" />
      <circle cx="64" cy="28" r="8" fill="#36C6FD" stroke="#0F172A" stroke-width="2" />
    </svg>
  {:else if styleId === 'swiss_grid'}
    <!-- Katalog Bersih & Rapi: Garis grid modular rapi, judul rata kiri, tata letak lega -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#F8FAFC" />
      <line x1="12" y1="0" x2="12" y2="60" stroke="#E2E8F0" stroke-width="1" />
      <line x1="50" y1="0" x2="50" y2="60" stroke="#E2E8F0" stroke-width="1" />
      <line x1="0" y1="24" x2="100" y2="24" stroke="#E2E8F0" stroke-width="1" />
      <rect x="16" y="8" width="28" height="4" fill="#0F172A" />
      <rect x="16" y="14" width="18" height="2" fill="#64748B" />
      <rect x="56" y="30" width="32" height="22" rx="2" fill="#36C6FD" opacity="0.8" />
    </svg>
  {:else if styleId === 'japanese_muji'}
    <!-- Minimalis Zen Natural: Ruang sangat lega, warna krem linen, ranting tanaman alami halus -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#F4F1EA" />
      <path d="M15 48 Q30 35 45 38 Q60 42 75 25" fill="none" stroke="#8A7968" stroke-width="1.2" />
      <circle cx="36" cy="36" r="2.5" fill="#A89F91" />
      <circle cx="52" cy="40" r="2" fill="#A89F91" />
      <circle cx="68" cy="30" r="2.5" fill="#A89F91" />
      <rect x="68" y="10" width="16" height="3" rx="0.5" fill="#5C5346" />
    </svg>
  {:else if styleId === 'kopitiam_retro'}
    <!-- Nusantara Klasik Antik: Bingkai ganda vintage dengan warna kertas krem antik -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#F7F0E4" />
      <rect x="6" y="6" width="88" height="48" rx="1" fill="none" stroke="#78350F" stroke-width="1.5" />
      <rect x="9" y="9" width="82" height="42" rx="1" fill="none" stroke="#B45309" stroke-width="0.75" />
      <rect x="25" y="14" width="50" height="5" rx="1" fill="#78350F" />
      <circle cx="50" cy="34" r="9" fill="#047857" opacity="0.85" />
      <circle cx="50" cy="34" r="6" fill="#F7F0E4" />
    </svg>
  {:else if styleId === 'korean_pastel'}
    <!-- Kafe Estetik Pastel: Latar kuning-mint pastel dengan bayangan tirai garis-garis lembut -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#FEF9C3" />
      <!-- Garis bayangan tirai jendela slatted -->
      <line x1="0" y1="12" x2="100" y2="12" stroke="#FDE047" stroke-width="4" opacity="0.6" />
      <line x1="0" y1="24" x2="100" y2="24" stroke="#FDE047" stroke-width="4" opacity="0.6" />
      <line x1="0" y1="36" x2="100" y2="36" stroke="#FDE047" stroke-width="4" opacity="0.6" />
      <line x1="0" y1="48" x2="100" y2="48" stroke="#FDE047" stroke-width="4" opacity="0.6" />
      <!-- Siluet kue/minuman estetik -->
      <rect x="38" y="24" width="24" height="22" rx="4" fill="#F472B6" />
      <circle cx="50" cy="20" r="4" fill="#EF4444" />
    </svg>
  {:else if styleId === 'dark_luxury'}
    <!-- Studio Gelap Elegan: Latar arang gelap pekat dengan garis emas sampanye berkelas -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#0F172A" />
      <rect x="10" y="8" width="80" height="44" fill="none" stroke="#FECF02" stroke-width="0.8" opacity="0.6" />
      <ellipse cx="50" cy="46" rx="20" ry="4" fill="#1E293B" />
      <path d="M42 22 L58 22 L55 42 L45 42 Z" fill="#020617" stroke="#FECF02" stroke-width="1.2" />
      <circle cx="50" cy="18" r="1.5" fill="#FECF02" />
    </svg>
  {:else if styleId === 'tropical_podium'}
    <!-- Podium Tropis Alami: Podium terakota bulat dengan bayangan daun palem/monstera tajam -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#FFFBEB" />
      <ellipse cx="50" cy="42" rx="26" ry="8" fill="#D97706" />
      <ellipse cx="50" cy="38" rx="26" ry="8" fill="#F59E0B" />
      <!-- Siluet daun monstera di atas podium -->
      <path d="M75 0 Q65 20 50 25 Q65 15 80 5 Z" fill="#047857" opacity="0.7" />
      <path d="M85 10 Q70 28 55 30 Q70 22 90 15 Z" fill="#047857" opacity="0.6" />
    </svg>
  {:else if styleId === 'pop_halftone'}
    <!-- Promo Diskon Heboh: Garis diagonal kontras dengan stiker diskon bundar menyala -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <polygon points="0,0 100,0 100,28 0,55" fill="#EC4899" />
      <polygon points="0,55 100,28 100,60 0,60" fill="#FECF02" />
      <polygon points="20,15 28,15 32,25 24,25" fill="#FFFFFF" />
      <circle cx="70" cy="30" r="14" fill="#00A2EE" stroke="#FFFFFF" stroke-width="2" />
      <text x="70" y="34" font-size="7" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SALE</text>
    </svg>
  {/if}
</div>
