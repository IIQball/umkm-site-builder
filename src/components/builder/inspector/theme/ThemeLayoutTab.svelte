<script lang="ts">
  import type { TemplateTheme } from '@/schemas';

  export let theme: TemplateTheme;
  export let onLayoutChange: (key: string, value: string) => void = () => {};

  $: layout = theme.layout || {};

  const maxWidthOptions = [
    { label: '1024px (Compact)', value: '1024px' },
    { label: '1200px (Standard)', value: '1200px' },
    { label: '1280px (Spacious)', value: '1280px' },
    { label: '100% (Full Width)', value: '100%' },
  ];
</script>

<div class="space-y-4">
  <div>
    <label for="layout-max-width" class="block font-semibold text-base-content/80 mb-1">Max-Width Konten Global</label>
    <select
      id="layout-max-width"
      value={layout.maxWidth || '1200px'}
      on:change={(e) => onLayoutChange('maxWidth', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none"
    >
      {#each maxWidthOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
    </select>
  </div>

  <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-3">
    <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Safe Zone Horizontal Margin</span>
    <div>
      <label for="layout-margin-desktop" class="block text-[11px] font-semibold text-base-content/80 mb-1">Desktop Margin (Safe Zone)</label>
      <input
        id="layout-margin-desktop"
        type="text"
        value={layout.horizontalMarginDesktop || '32px'}
        on:change={(e) => onLayoutChange('horizontalMarginDesktop', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs font-mono"
        placeholder="32px"
      />
    </div>
    <div>
      <label for="layout-margin-tablet" class="block text-[11px] font-semibold text-base-content/80 mb-1">Tablet Margin (Safe Zone)</label>
      <input
        id="layout-margin-tablet"
        type="text"
        value={layout.horizontalMarginTablet || '24px'}
        on:change={(e) => onLayoutChange('horizontalMarginTablet', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs font-mono"
        placeholder="24px"
      />
    </div>
    <div>
      <label for="layout-margin-mobile" class="block text-[11px] font-semibold text-base-content/80 mb-1">Mobile Margin (Safe Zone)</label>
      <input
        id="layout-margin-mobile"
        type="text"
        value={layout.horizontalMarginMobile || '16px'}
        on:change={(e) => onLayoutChange('horizontalMarginMobile', e.currentTarget.value)}
        class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs font-mono"
        placeholder="16px"
      />
    </div>
  </div>
</div>
