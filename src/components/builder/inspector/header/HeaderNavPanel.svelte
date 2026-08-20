<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: navGap = section.props?.navGap || 'normal';
  $: navFontSize = section.props?.navFontSize || '14px';
  $: navFontWeight = section.props?.navFontWeight || '500';
  $: navTextTransform = section.props?.navTextTransform || 'none';
  $: navColor = section.props?.navColor || '#475569';
  $: navHoverColor = section.props?.navHoverColor || '#2563eb';

  const gapPresets = [
    { label: 'Compact (12px)', value: 'compact' },
    { label: 'Normal (20px)', value: 'normal' },
    { label: 'Relaxed (32px)', value: 'relaxed' },
  ];

  const fontSizePresets = [
    { label: '12px (xs)', value: '12px' },
    { label: '14px (sm)', value: '14px' },
    { label: '16px (base)', value: '16px' },
    { label: '18px (lg)', value: '18px' },
  ];

  const fontWeightPresets = [
    { label: '400', value: '400' },
    { label: '500', value: '500' },
    { label: '600', value: '600' },
  ];

  const transformPresets = [
    { label: 'Normal', value: 'none' },
    { label: 'UPPER', value: 'uppercase' },
    { label: 'Capital', value: 'capitalize' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 dark:border-slate-800 pb-2">
    <Menu size={14} class="text-blue-500" />
    <span>Gaya & Tipografi Menu Navigasi</span>
  </div>

  <!-- Gap Spacing -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Jarak Antar Menu (Gap)</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      {#each gapPresets as preset}
        <button
          type="button"
          on:click={() => onConfigChange('navGap', preset.value)}
          class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
            navGap === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {preset.label.split(' ')[0]}
        </button>
      {/each}
    </div>
  </div>

  <!-- Font Size Presets -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Ukuran Font Menu</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      {#each fontSizePresets as preset}
        <button
          type="button"
          on:click={() => onConfigChange('navFontSize', preset.value)}
          class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
            navFontSize === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {preset.value}
        </button>
      {/each}
    </div>
  </div>

  <!-- Font Weight & Text Transform -->
  <div class="grid grid-cols-2 gap-2">
    <div>
      <span class="block font-medium text-[11px] text-base-content/70 mb-1">Weight</span>
      <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
        {#each fontWeightPresets as preset}
          <button
            type="button"
            on:click={() => onConfigChange('navFontWeight', preset.value)}
            class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              navFontWeight === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            {preset.label}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <span class="block font-medium text-[11px] text-base-content/70 mb-1">Transform</span>
      <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[10px]">
        {#each transformPresets as preset}
          <button
            type="button"
            on:click={() => onConfigChange('navTextTransform', preset.value)}
            class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              navTextTransform === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            {preset.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Colors: Default & Hover -->
  <div class="grid grid-cols-2 gap-2 pt-1">
    <div>
      <label for="nav-default-color" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Default</label>
      <div class="flex items-center gap-1.5">
        <input
          id="nav-default-color"
          type="color"
          value={navColor}
          on:input={(e) => onConfigChange('navColor', e.currentTarget.value)}
          class="w-7 h-7 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={navColor}
          on:input={(e) => onConfigChange('navColor', e.currentTarget.value)}
          class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-[11px] text-base-content font-mono focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <div>
      <label for="nav-hover-color" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Hover</label>
      <div class="flex items-center gap-1.5">
        <input
          id="nav-hover-color"
          type="color"
          value={navHoverColor}
          on:input={(e) => onConfigChange('navHoverColor', e.currentTarget.value)}
          class="w-7 h-7 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={navHoverColor}
          on:input={(e) => onConfigChange('navHoverColor', e.currentTarget.value)}
          class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-[11px] text-base-content font-mono focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  </div>
</div>
