<script lang="ts">
  import { Card, Badge } from '@/components/ui';

  export let value: 'standard' | 'high' = 'high';
  export let disabled: boolean = false;

  const OPTIONS = [
    {
      id: 'standard' as const,
      title: 'Kualitas Standar',
      credits: 1,
      model: 'gpt-image-2.5-flare',
      badge: '1 Kredit',
      description: 'Proses cepat, efisien kredit untuk pratinjau dan eksplorasi ide awal desain toko.',
    },
    {
      id: 'high' as const,
      title: 'Kualitas HD Studio',
      credits: 2,
      model: 'gpt-image-2.5-sunburst',
      badge: '2 Kredit (HD)',
      description: 'Resolusi tajam, detail tekstur halus, dan pencahayaan studio profesional.',
    },
  ];

  function selectTier(tier: 'standard' | 'high') {
    if (disabled) return;
    value = tier;
  }
</script>

<div>
  <div class="flex items-center justify-between mb-2">
    <span class="block text-label-caps text-muted">
      Tingkat Kualitas & Model AI <span class="text-error">*</span>
    </span>
    <Badge variant={value === 'high' ? 'primary' : 'slate'} size="sm" dot={false}>
      {value === 'high' ? 'Model HD (2 Kredit)' : 'Model Standar (1 Kredit)'}
    </Badge>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {#each OPTIONS as opt}
      {@const isSelected = value === opt.id}
      <div
        role="button"
        tabindex="0"
        class="text-left cursor-pointer transition-all focus:outline-none {disabled ? 'opacity-50 pointer-events-none' : ''}"
        on:click={() => selectTier(opt.id)}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && selectTier(opt.id)}
      >
        <Card
          variant={isSelected ? 'bordered' : 'nested'}
          padding="sm"
          radius="lg"
          class="h-full border-2 transition-all relative {isSelected
            ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
            : 'border-transparent hover:border-light'}"
        >
          {#if isSelected}
            <div class="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          {/if}

          <div class="flex items-start justify-between gap-2 mb-1 pr-6">
            <span class="font-heading font-semibold text-sm text-main">
              {opt.title}
            </span>
            <Badge variant={isSelected ? 'primary' : 'slate'} size="sm" dot={false}>
              {opt.badge}
            </Badge>
          </div>
          <p class="text-xs text-secondary leading-relaxed mb-2.5">
            {opt.description}
          </p>
          <div class="text-2xs text-muted font-mono flex items-center gap-1.5 pt-2 border-t border-light/60">
            <span class="w-1.5 h-1.5 rounded-full {isSelected ? 'bg-primary' : 'bg-muted'}"></span>
            <span>Mesin: {opt.model}</span>
          </div>
        </Card>
      </div>
    {/each}
  </div>
</div>
