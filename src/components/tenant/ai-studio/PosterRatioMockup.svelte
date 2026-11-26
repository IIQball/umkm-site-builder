<script lang="ts">
  import type { PosterSizeRatio } from '@/lib/validators/ai-poster';

  export let ratio: PosterSizeRatio;
  export let selected: boolean = false;
</script>

<div
  class="w-full h-28 rounded-xl overflow-hidden relative flex items-center justify-center p-2 transition-colors {selected
    ? 'bg-primary/10 border border-primary/30'
    : 'bg-nested/80 border border-light/60 group-hover:border-light'}"
>
  {#if ratio === '1:1'}
    <!-- Canva-style Square Feed Post Mockup -->
    <div
      class="w-20 h-20 rounded-lg bg-card border-2 shadow-2xs overflow-hidden flex flex-col justify-between p-1.5 transition-transform group-hover:scale-105 {selected
        ? 'border-primary'
        : 'border-light'}"
    >
      <!-- Feed Header (Avatar + Username placeholder) -->
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 rounded-full bg-primary/70"></div>
        <div class="w-6 h-1 rounded-full bg-muted/40"></div>
      </div>
      <!-- Center Image Canvas -->
      <div class="flex-1 my-1 rounded bg-nested flex items-center justify-center border border-light/50">
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-secondary opacity-60" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
      <!-- Feed Footer (Like & Share dots) -->
      <div class="flex items-center justify-between px-0.5">
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-error/70"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-muted/40"></div>
        </div>
        <div class="w-3 h-1 rounded-full bg-muted/40"></div>
      </div>
    </div>
  {:else}
    <!-- Canva-style Smartphone Story Mockup (2:3) -->
    <div
      class="w-16 h-24 rounded-xl bg-card border-2 shadow-2xs overflow-hidden flex flex-col justify-between p-1 transition-transform group-hover:scale-105 {selected
        ? 'border-primary'
        : 'border-light'}"
    >
      <!-- Top Story Bar Progress Indicators -->
      <div class="space-y-0.5 pt-0.5 px-0.5">
        <div class="flex items-center gap-0.5">
          <div class="flex-1 h-0.5 rounded-full bg-primary"></div>
          <div class="flex-1 h-0.5 rounded-full bg-muted/40"></div>
          <div class="flex-1 h-0.5 rounded-full bg-muted/40"></div>
        </div>
        <!-- Story User Header -->
        <div class="flex items-center gap-1 pt-0.5">
          <div class="w-1.5 h-1.5 rounded-full bg-secondary/80"></div>
          <div class="w-5 h-0.5 rounded-full bg-muted/60"></div>
        </div>
      </div>
      <!-- Vertical Full Canvas Content -->
      <div class="flex-1 my-0.5 rounded-md bg-nested flex flex-col items-center justify-center border border-light/50 px-1 py-0.5">
        <div class="w-8 h-1 rounded-full bg-primary/40 mb-1"></div>
        <svg viewBox="0 0 24 24" class="w-4 h-4 text-secondary opacity-60" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M12 18h.01" />
        </svg>
        <div class="w-6 h-1 rounded-full bg-muted/40 mt-1"></div>
      </div>
      <!-- Bottom WhatsApp/Story Reply Bar -->
      <div class="flex items-center justify-center pb-0.5 px-1">
        <div class="w-full h-1.5 rounded-full bg-muted/30 border border-light/60"></div>
      </div>
    </div>
  {/if}
</div>
