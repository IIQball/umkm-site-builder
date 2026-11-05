<script lang="ts">
  import { Card, Badge } from '@/components/ui';
  import { POSTER_STYLE_OPTIONS } from './poster-wizard.constants';
  import PosterStyleVisual from './PosterStyleVisual.svelte';
  import type { PosterStyle } from '@/lib/validators/ai-poster';

  export let selectedStyle: PosterStyle = 'vietnam_editorial';
  export let error: string | undefined = undefined;

  function handleSelect(styleId: PosterStyle) {
    selectedStyle = styleId;
  }
</script>

<div class="space-y-2.5">
  <div class="flex items-center justify-between">
    <span class="block text-label-caps text-muted">
      Pilihan 10 Gaya Desain Poster <span class="text-error">*</span>
    </span>
    <span class="text-2xs text-secondary font-medium">Pratinjau Visual & Tipografi</span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {#each POSTER_STYLE_OPTIONS as opt}
      {@const isSelected = selectedStyle === opt.id}
      <div
        role="button"
        tabindex="0"
        class="text-left cursor-pointer transition-all focus:outline-none flex flex-col group"
        on:click={() => handleSelect(opt.id)}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(opt.id)}
      >
        <Card
          variant={isSelected ? 'bordered' : 'nested'}
          padding="sm"
          radius="lg"
          class="h-full border-2 transition-all flex flex-col justify-between relative {isSelected
            ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
            : 'border-transparent hover:border-light'}"
        >
          <div>
            <!-- Pratinjau Visual Desain Poster -->
            <div class="mb-2.5 relative">
              <PosterStyleVisual styleId={opt.id} selected={isSelected} />
              {#if isSelected}
                <div class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              {/if}
            </div>

            <div class="flex items-start justify-between gap-1.5 mb-1">
              <span class="font-heading font-semibold text-xs text-main">{opt.title}</span>
              <Badge variant={isSelected ? 'primary' : 'slate'} size="sm" dot={false}>
                {opt.badge}
              </Badge>
            </div>
            <p class="text-2xs text-secondary leading-snug mb-2">{opt.description}</p>
          </div>

          <div class="pt-2 border-t border-light/60 space-y-1">
            <div class="text-2xs text-main font-medium flex items-center gap-1">
              <span class="text-muted">Font:</span>
              <span class="truncate">{opt.fontPairing}</span>
            </div>
            <div class="text-2xs text-muted flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full {isSelected ? 'bg-primary' : 'bg-muted'}"></span>
              <span class="truncate">{opt.lightingNote}</span>
            </div>
          </div>
        </Card>
      </div>
    {/each}
  </div>

  {#if error}
    <p class="text-xs text-error mt-1">{error}</p>
  {/if}
</div>
