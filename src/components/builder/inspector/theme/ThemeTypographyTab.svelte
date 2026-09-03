<script lang="ts">
  import type { TemplateTheme } from '@/schemas';

  export let theme: TemplateTheme;
  export let onTypographyChange: (key: string, value: unknown) => void = () => {};
  export let onScaleChange: (tag: string, field: string, value: string) => void = () => {};

  $: typography = theme.typography || {};

  const fontOptions = [
    { label: 'League Spartan (SSOT Default Heading)', value: "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif" },
    { label: 'Poppins (SSOT Default Body)', value: "'Poppins', system-ui, -apple-system, sans-serif" },
    { label: 'Inter', value: 'Inter, system-ui, -apple-system, sans-serif' },
    { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif' },
    { label: 'Outfit', value: 'Outfit, system-ui, -apple-system, sans-serif' },
    { label: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
  ];

  const typographyScales = [
    { tag: 'h1', label: 'H1 (Hero Display)', defaultSize: '42px', defaultWeight: '700' },
    { tag: 'h2', label: 'H2 (Section Heading)', defaultSize: '26px', defaultWeight: '700' },
    { tag: 'h3', label: 'H3 (Card Heading)', defaultSize: '20px', defaultWeight: '600' },
    { tag: 'body', label: 'Body Text', defaultSize: '16px', defaultWeight: '400' },
    { tag: 'caption', label: 'Caption / Badge', defaultSize: '10px', defaultWeight: '700' },
  ];

  const getScaleData = (tag: string): Record<string, string> => {
    const record = typography as Record<string, Record<string, string> | undefined>;
    return record?.[tag] || {};
  };
</script>

<div class="space-y-4">
  <div>
    <label for="typo-heading-font" class="block font-semibold text-base-content/80 mb-1 text-xs">Font Family Heading (Global)</label>
    <select
      id="typo-heading-font"
      value={typography.headingFont || "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif"}
      on:change={(e) => onTypographyChange('headingFont', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-primary"
    >
      {#each fontOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
    </select>
  </div>
  <div>
    <label for="typo-body-font" class="block font-semibold text-base-content/80 mb-1 text-xs">Font Family Body (Global)</label>
    <select
      id="typo-body-font"
      value={typography.bodyFont || "'Poppins', system-ui, -apple-system, sans-serif"}
      on:change={(e) => onTypographyChange('bodyFont', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content text-xs focus:outline-none focus:border-primary"
    >
      {#each fontOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
    </select>
  </div>

  <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-2.5">
    <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Skala Tipografi (Golden Ratio SSOT)</span>
    {#each typographyScales as scale}
      {@const scaleData = getScaleData(scale.tag)}
      <div class="p-2 bg-base-200/40 dark:bg-slate-900/60 rounded-lg border border-base-300 dark:border-slate-800 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-base-content text-[11px]">{scale.label}</span>
          <span class="font-mono text-[10px] text-blue-500">{scaleData.fontSize || scale.defaultSize}</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={scaleData.fontSize || scale.defaultSize}
            on:change={(e) => onScaleChange(scale.tag, 'fontSize', e.currentTarget.value)}
            class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs font-mono"
          />
          <select
            value={scaleData.fontWeight || scale.defaultWeight}
            on:change={(e) => onScaleChange(scale.tag, 'fontWeight', e.currentTarget.value)}
            class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-xs"
          >
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semibold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extrabold (800)</option>
          </select>
        </div>
      </div>
    {/each}
  </div>
</div>
