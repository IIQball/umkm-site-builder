<script lang="ts">
  import { onMount } from 'svelte';
  import type { TemplateTheme } from '@/schemas';
  import { SearchableSelect } from '@/components/ui';
  import { FONT_FAMILY_OPTIONS, TYPOGRAPHY_SCALES } from '@/components/tokens/typography';
  import { preloadDesignSystemFonts } from '../../canvas/fontLoader.helpers';

  export let theme: TemplateTheme;
  export let onTypographyChange: (key: string, value: unknown) => void = () => {};
  export let onScaleChange: (tag: string, field: string, value: string) => void = () => {};

  $: typography = theme.typography || {};

  const getScaleData = (tag: string): Record<string, string> => {
    const record = typography as Record<string, Record<string, string> | undefined>;
    return record?.[tag] || {};
  };

  const toNumeric = (val: unknown, fallback: number): number => {
    if (typeof val === 'number') return val;
    if (!val) return fallback;
    const parsed = parseInt(String(val).replace(/[^\d]/g, ''), 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  function handleFontSizeInput(tag: string, rawVal: string) {
    if (!rawVal.trim()) return;
    const num = parseInt(rawVal.replace(/[^\d]/g, ''), 10);
    if (isNaN(num)) return;
    const safeNum = Math.max(1, Math.min(200, num));
    onScaleChange(tag, 'fontSize', `${safeNum}px`);
  }

  function handleFontSizeBlur(tag: string, rawVal: string, fallback: number) {
    const num = parseInt(rawVal.replace(/[^\d]/g, ''), 10);
    const safeNum = isNaN(num) ? fallback : Math.max(8, Math.min(120, num));
    onScaleChange(tag, 'fontSize', `${safeNum}px`);
  }

  const blockNonNumericKey = (e: KeyboardEvent) => {
    if (['e', 'E', '+', '-', '.'].includes(e.key) || (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey)) {
      e.preventDefault();
    }
  };

  onMount(() => {
    preloadDesignSystemFonts();
  });
</script>

<div class="space-y-4">
  <div>
    <SearchableSelect
      id="typo-heading-font"
      label="Font Family Heading (Global)"
      value={typography.headingFont || "'League Spartan', 'Poppins', system-ui, -apple-system, sans-serif"}
      options={[...FONT_FAMILY_OPTIONS]}
      searchable={true}
      clearable={false}
      size="sm"
      searchPlaceholder="Cari font heading..."
      placeholder="Pilih Font Heading..."
      on:change={(e) => onTypographyChange('headingFont', String(e.detail.value))}
    />
  </div>

  <div>
    <SearchableSelect
      id="typo-body-font"
      label="Font Family Body (Global)"
      value={typography.bodyFont || "'Poppins', system-ui, -apple-system, sans-serif"}
      options={[...FONT_FAMILY_OPTIONS]}
      searchable={true}
      clearable={false}
      size="sm"
      searchPlaceholder="Cari font body..."
      placeholder="Pilih Font Body..."
      on:change={(e) => onTypographyChange('bodyFont', String(e.detail.value))}
    />
  </div>

  <div class="pt-2 border-t border-base-200 space-y-2.5">
    <span class="block font-bold text-xs text-base-content uppercase tracking-wider">Skala Tipografi (Golden Ratio SSOT)</span>
    {#each TYPOGRAPHY_SCALES as scale}
      {@const scaleData = getScaleData(scale.tag)}
      {@const fallbackNum = toNumeric(scale.defaultSize, 16)}
      {@const currentSizeNum = toNumeric(scaleData.fontSize, fallbackNum)}
      <div class="p-2 bg-base-200/40 rounded-lg border border-base-300 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-base-content text-[11px]">{scale.label}</span>
          <span class="font-mono text-[10px] text-primary">{currentSizeNum}px</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="relative flex items-center">
            <input
              type="number"
              min="8"
              max="120"
              step="1"
              value={currentSizeNum}
              aria-label={`Ukuran font ${scale.label}`}
              on:keydown={blockNonNumericKey}
              on:input={(e) => handleFontSizeInput(scale.tag, e.currentTarget.value)}
              on:blur={(e) => handleFontSizeBlur(scale.tag, e.currentTarget.value, fallbackNum)}
              class="w-full pl-2.5 pr-7 py-1 bg-base-100 border border-base-300 rounded text-xs font-mono focus:outline-none focus:border-primary"
              placeholder={String(fallbackNum)}
            />
            <span class="absolute right-2 text-xs text-base-content/50 font-mono pointer-events-none select-none">px</span>
          </div>
          <select
            value={scaleData.fontWeight || scale.defaultWeight}
            aria-label={`Ketebalan font ${scale.label}`}
            on:change={(e) => onScaleChange(scale.tag, 'fontWeight', e.currentTarget.value)}
            class="w-full px-2 py-1 bg-base-100 border border-base-300 rounded text-xs"
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
