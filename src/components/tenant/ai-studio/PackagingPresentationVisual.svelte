<script lang="ts">
  import type { MockupPresentationStyle } from '@/lib/validators/ai-packaging';

  export let styleId: MockupPresentationStyle;
  export let selected: boolean = false;
</script>

<div
  class="w-full h-20 rounded-xl overflow-hidden relative flex items-center justify-center transition-colors {selected
    ? 'bg-primary/10 border-2 border-primary'
    : 'bg-nested/80 border border-light/60 group-hover:border-light'}"
>
  {#if styleId === 'clean_studio'}
    <!-- Studio Foto Bersih: Riser bulat di atas lantai studio netral, pencahayaan softbox halus -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#F8FAFC" />
      <!-- Garis horizon lantai studio halus -->
      <line x1="0" y1="42" x2="100" y2="42" stroke="#E2E8F0" stroke-width="1" />
      <!-- Softbox gradient ellipse di lantai -->
      <ellipse cx="50" cy="48" rx="28" ry="7" fill="#E2E8F0" opacity="0.6" />
      <!-- Podium bulat tipis -->
      <ellipse cx="50" cy="44" rx="20" ry="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
      <!-- Siluet kemasan standing pouch tegak -->
      <path d="M43 20 L57 20 L59 42 L41 42 Z" fill="#36C6FD" opacity="0.9" />
      <!-- Lipatan ziplock atas -->
      <rect x="42" y="18" width="16" height="3" rx="1" fill="#00A2EE" />
      <!-- Label kemasan minimalis -->
      <rect x="45" y="27" width="10" height="8" rx="1" fill="#FFFFFF" opacity="0.9" />
    </svg>
  {:else if styleId === 'monolith_podium'}
    <!-- Podium Batu Modern: Balok batu geometris dengan bayangan dedaunan alami -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#E2E8F0" />
      <!-- Bayangan daun gobo dari jendela atas -->
      <path d="M10 0 Q30 15 25 35 Q18 20 5 15 Z" fill="#94A3B8" opacity="0.4" />
      <path d="M22 10 Q45 25 40 45 Q30 30 15 25 Z" fill="#94A3B8" opacity="0.3" />
      <!-- Balok batu podium 3D -->
      <polygon points="32,38 68,38 62,32 26,32" fill="#CBD5E1" />
      <polygon points="32,38 68,38 68,52 32,52" fill="#94A3B8" />
      <!-- Kemasan berdiri di atas podium -->
      <path d="M44 14 L56 14 L58 35 L42 35 Z" fill="#36C6FD" />
      <rect x="46" y="21" width="8" height="7" rx="1" fill="#FFFFFF" opacity="0.9" />
    </svg>
  {:else if styleId === 'vietnam_tabletop'}
    <!-- Meja Kayu Kafe: Garis serat kayu hangat dengan pantulan cahaya jendela samping -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#FBF7EE" />
      <!-- Serat papan kayu meja -->
      <rect x="0" y="32" width="100" height="28" fill="#EAD7BB" />
      <line x1="0" y1="41" x2="100" y2="41" stroke="#D5B895" stroke-width="1" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="#D5B895" stroke-width="1" />
      <!-- Cahaya jendela miring dari kiri -->
      <polygon points="0,0 45,0 75,60 15,60" fill="#FFFBEB" opacity="0.5" />
      <!-- Kemasan pouch di atas meja -->
      <ellipse cx="50" cy="46" rx="15" ry="3.5" fill="#8C6D46" opacity="0.3" />
      <path d="M43 22 L57 22 L59 44 L41 44 Z" fill="#36C6FD" />
      <rect x="45" y="28" width="10" height="8" rx="1" fill="#FFFFFF" opacity="0.9" />
    </svg>
  {:else if styleId === 'eco_craft'}
    <!-- Nuansa Alami & Kain: Latar terakota hangat dengan alas kain tenun bertekstur -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#D4A373" />
      <!-- Alas kain linen terlipat lembut di bawah -->
      <path d="M0 34 Q30 30 60 36 Q85 32 100 35 L100 60 L0 60 Z" fill="#F4EAE0" />
      <ellipse cx="50" cy="48" rx="18" ry="4" fill="#C29463" opacity="0.4" />
      <!-- Boks kraft kemasan eco ramah lingkungan -->
      <polygon points="40,24 54,20 62,25 48,29" fill="#B08968" />
      <polygon points="40,24 48,29 48,46 40,41" fill="#9C6644" />
      <polygon points="48,29 62,25 62,42 48,46" fill="#7F5539" />
      <!-- Label daun hijau kecil -->
      <circle cx="55" cy="35" r="3" fill="#10B981" />
    </svg>
  {:else if styleId === 'dark_spotlight'}
    <!-- Studio Gelap Mewah: Latar gelap arang dengan kerucut lampu sorot fokus dan rim-light -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#0F172A" />
      <!-- Kerucut sinar spotlight dari atas -->
      <polygon points="50,0 25,60 75,60" fill="#1E293B" opacity="0.7" />
      <ellipse cx="50" cy="52" rx="20" ry="4" fill="#334155" opacity="0.8" />
      <!-- Siluet kemasan dengan rim-light biru terang di tepinya -->
      <path d="M43 20 L57 20 L59 48 L41 48 Z" fill="#020617" stroke="#36C6FD" stroke-width="1.5" />
      <rect x="45" y="28" width="10" height="10" rx="1" fill="#1E293B" stroke="#36C6FD" stroke-width="0.8" />
      <!-- Titik kilau pantulan cahaya -->
      <circle cx="44" cy="24" r="1.5" fill="#FFFFFF" />
    </svg>
  {:else if styleId === 'floating_hero'}
    <!-- Melayang Dinamis: Kemasan miring di udara dengan bayangan jatuh realistis -->
    <svg viewBox="0 0 100 60" class="w-full h-full" aria-hidden="true">
      <rect width="100" height="60" fill="#F1F5F9" />
      <!-- Bayangan oval terpisah di lantai karena melayang -->
      <ellipse cx="48" cy="50" rx="16" ry="4" fill="#94A3B8" opacity="0.4" />
      <!-- Kemasan melayang miring ~12 derajat -->
      <g transform="translate(50, 26) rotate(10) translate(-50, -26)">
        <path d="M42 12 L58 12 L60 38 L40 38 Z" fill="#36C6FD" stroke="#00A2EE" stroke-width="1" />
        <rect x="42" y="10" width="16" height="3" rx="1" fill="#00A2EE" />
        <rect x="45" y="20" width="10" height="10" rx="1" fill="#FFFFFF" opacity="0.95" />
      </g>
      <!-- Efek garis kecepatan halus melayang -->
      <line x1="32" y1="38" x2="36" y2="44" stroke="#36C6FD" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="64" y1="20" x2="68" y2="26" stroke="#36C6FD" stroke-width="1" stroke-dasharray="2 2" />
    </svg>
  {/if}
</div>
