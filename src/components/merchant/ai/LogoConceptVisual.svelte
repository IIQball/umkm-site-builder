<script lang="ts">
  import type { LogoConceptType } from '@/lib/validators/ai-logo';

  export let concept: LogoConceptType;
  export let selected: boolean = false;
</script>

<div
  class="w-full h-24 rounded-xl overflow-hidden relative flex items-center justify-center p-3 transition-colors {selected
    ? 'bg-primary/10 border border-primary/30'
    : 'bg-nested/80 border border-light/60 group-hover:border-light'}"
>
  {#if concept === 'letter_fusion'}
    <!-- Letter Fusion (Letter 'H' with chair silhouette in negative space) -->
    <svg viewBox="0 0 80 80" class="w-16 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <defs>
        <mask id="letterMask">
          <!-- White solid background: everything shows -->
          <rect x="0" y="0" width="80" height="80" fill="white" />
          <!-- Black cutout in negative space: chair / seat shape cut inside crossbar -->
          <path d="M36 32 L44 32 L44 48 L36 48 Z" fill="black" />
          <path d="M34 26 L46 26 L46 30 L34 30 Z" fill="black" />
        </mask>
      </defs>
      <!-- Bold Architectural Letter H -->
      <path
        d="M20 16 H32 V34 H48 V16 H60 V64 H48 V46 H32 V64 H20 Z"
        fill="currentColor"
        mask="url(#letterMask)"
      />
      <!-- Clever Negative Space Object Highlight -->
      <circle cx="40" cy="22" r="2.5" fill="currentColor" opacity="0.8" />
    </svg>
  {:else if concept === 'animal_character'}
    <!-- Siluet Karakter / Hewan (Sharp Geometric Falcon / Bird Silhouette) -->
    <svg viewBox="0 0 80 80" class="w-16 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <!-- Faceted planar eagle/bird profile -->
      <!-- Head / Crown -->
      <polygon points="40,14 54,26 42,32 30,22" fill="currentColor" fill-opacity="0.9" />
      <!-- Sharp Beak -->
      <polygon points="54,26 66,32 50,38" fill="currentColor" />
      <!-- Chest / Wing Plane -->
      <polygon points="30,22 42,32 36,54 22,44" fill="currentColor" fill-opacity="0.75" />
      <polygon points="42,32 50,38 46,62 36,54" fill="currentColor" fill-opacity="0.85" />
      <!-- Lower Body / Tail Feather Plane -->
      <polygon points="36,54 46,62 38,70 28,62" fill="currentColor" fill-opacity="0.65" />
    </svg>
  {:else if concept === 'pictorial_symbol'}
    <!-- Simbol Objek Ikonik (Architectural Minimalist Coffee Cup & Modern Arc) -->
    <svg viewBox="0 0 80 80" class="w-16 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <!-- Minimalist Cup Body with Negative Arc -->
      <path
        d="M22 26 H54 Q54 52 38 52 Q22 52 22 26 Z"
        fill="currentColor"
      />
      <!-- Cup Handle as Geometric Ring Cut -->
      <path
        d="M52 30 H58 Q64 30 64 38 Q64 46 58 46 H50"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      />
      <!-- Golden Ratio Steam Blade Cut -->
      <path
        d="M32 14 Q38 18 34 22"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M44 12 Q50 16 46 20"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <!-- Clean Saucer Line -->
      <line x1="18" y1="58" x2="58" y2="58" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
    </svg>
  {:else if concept === 'abstract_mark'}
    <!-- Glif Geometris Modern (Interlocking Clean Balanced Loops) -->
    <svg viewBox="0 0 80 80" class="w-16 h-16 transition-transform group-hover:scale-105" aria-hidden="true">
      <!-- Interlocking Dual Ring Geometry -->
      <circle
        cx="34"
        cy="40"
        r="18"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-dasharray="80 20"
        stroke-linecap="round"
      />
      <circle
        cx="46"
        cy="40"
        r="18"
        fill="none"
        stroke="currentColor"
        stroke-width="5"
        stroke-dasharray="75 25"
        stroke-dashoffset="40"
        stroke-linecap="round"
        opacity="0.8"
      />
      <!-- Central Negative Balance Core -->
      <circle cx="40" cy="40" r="4" fill="currentColor" />
    </svg>
  {/if}
</div>
