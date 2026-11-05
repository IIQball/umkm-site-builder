<script lang="ts">
  import type { PackagingType } from '@/lib/validators/ai-packaging';

  export let type: PackagingType;
  export let selected: boolean = false;
</script>

<div
  class="w-full h-24 rounded-xl overflow-hidden relative flex items-center justify-center transition-colors {selected
    ? 'bg-primary/10 border border-primary/30'
    : 'bg-nested/80 border border-light/60 group-hover:border-light'}"
>
  {#if type === 'standing_pouch'}
    <!-- Standing Pouch Illustration -->
    <svg viewBox="0 0 100 80" class="w-20 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <defs>
        <linearGradient id="pouchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.15" />
          <stop offset="50%" stop-color="currentColor" stop-opacity="0.08" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.22" />
        </linearGradient>
      </defs>
      <!-- Pouch Body -->
      <path
        d="M28 20 L35 10 L65 10 L72 20 L76 65 Q76 72 65 72 L35 72 Q24 72 24 65 Z"
        fill="url(#pouchGrad)"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
      <!-- Top Seal / Zip Lines -->
      <line x1="33" y1="14" x2="67" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <line x1="30" y1="18" x2="70" y2="18" stroke="currentColor" stroke-width="1" stroke-dasharray="2 1.5" />
      <!-- Tear Notch -->
      <path d="M26 16 L28 17 L26 18" fill="none" stroke="currentColor" stroke-width="1.2" />
      <path d="M74 16 L72 17 L74 18" fill="none" stroke="currentColor" stroke-width="1.2" />
      <!-- Label Area -->
      <rect x="36" y="32" width="28" height="24" rx="3" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1" />
      <line x1="41" y1="40" x2="59" y2="40" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <line x1="43" y1="46" x2="57" y2="46" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
      <!-- Bottom Fold Accent -->
      <path d="M30 65 Q50 70 70 65" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.5" />
    </svg>
  {:else if type === 'aluminium_pouch'}
    <!-- Aluminium Foil Pouch Illustration -->
    <svg viewBox="0 0 100 80" class="w-20 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <defs>
        <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.25" />
          <stop offset="35%" stop-color="currentColor" stop-opacity="0.08" />
          <stop offset="65%" stop-color="currentColor" stop-opacity="0.2" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      <!-- Foil Body with metallic sheen -->
      <path
        d="M26 12 L74 12 L74 68 Q74 72 68 72 L32 72 Q26 72 26 68 Z"
        fill="url(#foilGrad)"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
      <!-- Crimped Top Seal -->
      <rect x="26" y="12" width="48" height="7" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1" />
      <line x1="28" y1="15" x2="72" y2="15" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1 1" />
      <!-- Side Ribbed Margins -->
      <line x1="30" y1="20" x2="30" y2="66" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1.5 1.5" stroke-opacity="0.6" />
      <line x1="70" y1="20" x2="70" y2="66" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1.5 1.5" stroke-opacity="0.6" />
      <!-- Matte Metallic Label Frame -->
      <rect x="35" y="28" width="30" height="28" rx="2" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.2" />
      <circle cx="50" cy="38" r="4" fill="currentColor" fill-opacity="0.25" />
      <line x1="40" y1="48" x2="60" y2="48" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    </svg>
  {:else if type === 'box_kraft'}
    <!-- Box Kraft Cardboard Illustration -->
    <svg viewBox="0 0 100 80" class="w-20 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <!-- 3D Isometric Cardboard Box -->
      <!-- Top Face -->
      <polygon
        points="50,14 78,26 50,38 22,26"
        fill="currentColor"
        fill-opacity="0.22"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <!-- Left Face -->
      <polygon
        points="22,26 50,38 50,66 22,54"
        fill="currentColor"
        fill-opacity="0.12"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <!-- Right Face -->
      <polygon
        points="50,38 78,26 78,54 50,66"
        fill="currentColor"
        fill-opacity="0.18"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <!-- Sealing Tape strip on top -->
      <line x1="50" y1="14" x2="50" y2="38" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.6" />
      <!-- Eco Box Stamp / Label on Front -->
      <rect
        x="30"
        y="38"
        width="14"
        height="12"
        transform="skewY(23) translate(2, -8)"
        fill="currentColor"
        fill-opacity="0.2"
        stroke="currentColor"
        stroke-width="0.8"
      />
    </svg>
  {:else if type === 'paper_bowl'}
    <!-- Paper Bowl with Transparent Dome Lid -->
    <svg viewBox="0 0 100 80" class="w-20 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <!-- Clear Dome Lid -->
      <path
        d="M24 38 Q50 16 76 38"
        fill="currentColor"
        fill-opacity="0.08"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <ellipse cx="50" cy="38" rx="27" ry="5" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.4" />
      <!-- Dome Light Reflection Arc -->
      <path d="M34 32 Q50 22 64 28" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.5" />
      <!-- Bowl Lower Body -->
      <path
        d="M23 38 L32 68 Q50 74 68 68 L77 38"
        fill="currentColor"
        fill-opacity="0.18"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
      <!-- Bowl Bottom Rim -->
      <ellipse cx="50" cy="68" rx="18" ry="3.5" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.2" />
      <!-- Front Badge Label -->
      <rect x="40" y="46" width="20" height="12" rx="2" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="0.9" />
    </svg>
  {/if}
</div>
