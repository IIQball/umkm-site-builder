<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Card, Badge } from '@/components/ui';
  import { DESIGN_TIPS } from './poster-wizard.constants';

  export let active: boolean = true;
  export let progress: number = 15;
  export let title: string = 'Merancang Visual AI Toko Anda...';

  let currentTipIndex = 0;
  let tipIntervalId: ReturnType<typeof setInterval> | null = null;
  let autoProgressIntervalId: ReturnType<typeof setInterval> | null = null;

  interface StageItem {
    id: number;
    title: string;
    description: string;
    minProgress: number;
    maxProgress: number;
  }

  const STAGES: StageItem[] = [
    {
      id: 1,
      title: 'Meramu Prompt Desain',
      description: 'Menyusun keyword tipografi dan komposisi visual',
      minProgress: 0,
      maxProgress: 30,
    },
    {
      id: 2,
      title: 'Rendering Gambar AI',
      description: 'Membangun tekstur, pencahayaan, dan detail subjek',
      minProgress: 30,
      maxProgress: 80,
    },
    {
      id: 3,
      title: 'Optimasi Format WebP',
      description: 'Kompresi lossless & penyiapan CDN Cloudinary',
      minProgress: 80,
      maxProgress: 100,
    },
  ];

  $: activeStageIndex = progress >= 80 ? 2 : progress >= 30 ? 1 : 0;

  onMount(() => {
    // Rotasi tips desain setiap 3.5 detik
    tipIntervalId = setInterval(() => {
      currentTipIndex = (currentTipIndex + 1) % DESIGN_TIPS.length;
    }, 3500);

    // Otomatis simulasi peningkatan progres jika proses aktif
    if (active && progress < 90) {
      autoProgressIntervalId = setInterval(() => {
        if (progress < 85) {
          progress = Math.min(85, progress + 3);
        }
      }, 700);
    }
  });

  onDestroy(() => {
    if (tipIntervalId) clearInterval(tipIntervalId);
    if (autoProgressIntervalId) clearInterval(autoProgressIntervalId);
  });
</script>

<Card variant="bordered" padding="md" radius="2xl" class="space-y-6 bg-card overflow-hidden relative">
  <!-- Bar Progres Utama -->
  <div class="space-y-2">
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
        <span class="font-heading font-bold text-main text-sm">{title}</span>
      </div>
      <Badge variant="primary" size="sm" dot={false}>
        {Math.round(progress)}%
      </Badge>
    </div>

    <div class="w-full bg-nested h-2.5 rounded-full overflow-hidden border border-light/60 p-0.5">
      <div
        class="bg-gradient-to-r from-primary/80 to-primary h-full rounded-full transition-all duration-300 shadow-sm"
        style="width: {Math.min(100, Math.max(5, progress))}%;"
      ></div>
    </div>
  </div>

  <!-- 3 Tahapan Visual -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each STAGES as stage, idx}
      {@const isDone = progress >= stage.maxProgress}
      {@const isCurrent = idx === activeStageIndex}
      <div
        class="p-3 rounded-xl border transition-all {isCurrent
          ? 'bg-primary/5 border-primary shadow-2xs'
          : isDone
            ? 'bg-nested/80 border-success/30'
            : 'bg-nested/30 border-light/60 opacity-60'}"
      >
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-5 h-5 rounded-full flex items-center justify-center text-micro font-bold {isDone
              ? 'bg-success text-white'
              : isCurrent
                ? 'bg-primary text-primary-content font-bold'
                : 'bg-nested text-muted border border-light'}"
          >
            {#if isDone}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            {:else}
              {stage.id}
            {/if}
          </div>
          <span class="font-heading font-semibold text-xs text-main truncate">
            {stage.title}
          </span>
        </div>
        <p class="text-2xs text-secondary leading-snug pl-7">
          {stage.description}
        </p>
      </div>
    {/each}
  </div>

  <!-- Skeleton Mockup Animasi -->
  <div class="p-4 rounded-2xl bg-nested/50 border border-light/80 space-y-3">
    <div class="flex items-center justify-between text-micro text-muted font-mono uppercase tracking-wider">
      <span>Kanvas Virtual Studio</span>
      <span class="animate-pulse flex items-center gap-1 text-primary">
        <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
        Memproses Pola Visual...
      </span>
    </div>

    <!-- Skeleton Layout -->
    <div class="grid grid-cols-12 gap-3 animate-pulse">
      <div class="col-span-4 h-24 bg-card rounded-xl border border-light/80 flex items-center justify-center">
        <div class="w-10 h-10 rounded-lg bg-nested flex items-center justify-center text-muted">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      </div>
      <div class="col-span-8 flex flex-col justify-center space-y-2">
        <div class="h-3.5 bg-card rounded-md w-3/4"></div>
        <div class="h-2.5 bg-card rounded-md w-full"></div>
        <div class="h-2.5 bg-card rounded-md w-1/2"></div>
      </div>
    </div>
  </div>

  <!-- Rotasi Tips Desain UMKM -->
  <div class="pt-2 border-t border-light flex items-start gap-2.5 text-xs text-secondary">
    <div class="w-5 h-5 rounded-md bg-warning/15 flex items-center justify-center flex-shrink-0 text-warning mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
      </svg>
    </div>
    <div class="min-w-0">
      <span class="font-bold text-main text-micro uppercase tracking-wider block mb-0.5">
        Tips Desain UMKM:
      </span>
      <p class="text-2xs text-secondary italic leading-relaxed transition-opacity duration-300">
        "{DESIGN_TIPS[currentTipIndex]}"
      </p>
    </div>
  </div>
</Card>
