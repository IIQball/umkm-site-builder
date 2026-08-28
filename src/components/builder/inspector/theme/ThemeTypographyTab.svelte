<script lang="ts">
  import type { TemplateTheme } from '@/schemas';

  export let theme: TemplateTheme;
  export let onTypographyChange: (key: string, value: unknown) => void = () => {};
  export let onScaleChange: (tag: string, field: string, value: string) => void = () => {};

  $: typography = theme.typography || {};

  const fontOptions = [
    { label: 'Inter (Sans)', value: 'Inter, sans-serif' },
    { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
    { label: 'Outfit', value: 'Outfit, sans-serif' },
    { label: 'Playfair Display (Serif)', value: '"Playfair Display", serif' },
    { label: 'Merriweather (Serif)', value: 'Merriweather, serif' },
    { label: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
  ];

  const typographyScales = [
    { tag: 'h1', label: 'H1 (Heading 1)', defaultSize: '36px', defaultWeight: '700' },
    { tag: 'h2', label: 'H2 (Heading 2)', defaultSize: '28px', defaultWeight: '700' },
    { tag: 'h3', label: 'H3 (Heading 3)', defaultSize: '22px', defaultWeight: '600' },
    { tag: 'body', label: 'Body Text', defaultSize: '15px', defaultWeight: '400' },
    { tag: 'caption', label: 'Caption / Small', defaultSize: '13px', defaultWeight: '400' },
  ];

  const getScaleData = (tag: string): Record<string, string> => {
    const record = typography as Record<string, Record<string, string> | undefined>;
    return record?.[tag] || {};
  };
</script>

<div class="space-y-4">
  <div>
    <label for="typo-heading-font" class="block font-semibold text-base-content/80 mb-1">Font Family Heading</label>
    <select
      id="typo-heading-font"
      value={typography.headingFont || 'Inter, sans-serif'}
      on:change={(e) => onTypographyChange('headingFont', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none"
    >
      {#each fontOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
    </select>
  </div>
  <div>
    <label for="typo-body-font" class="block font-semibold text-base-content/80 mb-1">Font Family Body</label>
    <select
      id="typo-body-font"
      value={typography.bodyFont || 'Inter, sans-serif'}
      on:change={(e) => onTypographyChange('bodyFont', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none"
    >
      {#each fontOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
    </select>
  </div>

  <div class="pt-2 border-t border-base-200 dark:border-slate-800 space-y-2.5">
    <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Skala Tipografi</span>
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
            <option value="400">Normal (400)</option>
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
