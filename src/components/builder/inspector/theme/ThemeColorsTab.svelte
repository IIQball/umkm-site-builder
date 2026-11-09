<script lang="ts">
  import type { TemplateTheme } from '@/schemas';
  import { DEFAULT_THEME_COLOR_FIELDS } from '@/components/tokens/colors';
  import { evaluateContrast, recommendAccessibleColor } from '@/lib/utils/contrast';
  import { ShieldCheck, AlertTriangle, Wand2, Check } from 'lucide-svelte';

  export let theme: TemplateTheme;
  export let onColorChange: (key: string, value: string) => void = () => {};
  export let onColorModeChange: (mode: 'auto' | 'light' | 'dark') => void = () => {};

  $: colors = theme.colors || {};
  $: colorMode = (theme.colorMode || 'auto') as 'auto' | 'light' | 'dark';

  const getColorVal = (key: string, defaultVal: string): string => {
    const record = colors as Record<string, string | undefined>;
    return record?.[key] || defaultVal;
  };

  $: bgVal = getColorVal('background', '#ffffff');
  $: primaryVal = getColorVal('primary', '#0369a1');
  $: textPrimaryVal = getColorVal('textPrimary', '#0f172a');
  $: textMutedVal = getColorVal('textMuted', '#64748b');

  // Contrast evaluations against active canvas background
  $: primaryButtonContrast = evaluateContrast('#ffffff', primaryVal, false);
  $: textPrimaryContrast = evaluateContrast(textPrimaryVal, bgVal, false);
  $: textMutedContrast = evaluateContrast(textMutedVal, bgVal, false);

  function getFieldContrast(key: string) {
    if (key === 'primary') {
      return {
        label: 'Tombol Primer (Teks Putih)',
        eval: primaryButtonContrast,
        fix: () => onColorChange('primary', recommendAccessibleColor(primaryVal, '#ffffff', 4.5)),
      };
    }
    if (key === 'textPrimary') {
      return {
        label: 'Kontras Teks vs Background',
        eval: textPrimaryContrast,
        fix: () => onColorChange('textPrimary', recommendAccessibleColor(textPrimaryVal, bgVal, 4.5)),
      };
    }
    if (key === 'textMuted') {
      return {
        label: 'Kontras Teks Muted vs Background',
        eval: textMutedContrast,
        fix: () => onColorChange('textMuted', recommendAccessibleColor(textMutedVal, bgVal, 4.5)),
      };
    }
    return null;
  }
</script>

<div class="space-y-4">
  <!-- Mode Tema Storefront -->
  <div class="p-3 bg-base-200/50 border border-base-300 rounded-lg space-y-1.5">
    <label for="theme-color-mode" class="block font-semibold text-base-content/90 text-xs">
      Mode Tema Storefront
    </label>
    <select
      id="theme-color-mode"
      value={colorMode}
      on:change={(e) => onColorModeChange(e.currentTarget.value as 'auto' | 'light' | 'dark')}
      class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-md text-xs text-base-content focus:outline-none focus:border-primary"
    >
      <option value="auto">Auto (Ikuti Perangkat Pengunjung)</option>
      <option value="light">Selalu Terang (Light Only)</option>
      <option value="dark">Selalu Gelap (Dark Only)</option>
    </select>
    <p class="text-[10px] text-base-content/60 leading-tight">
      {colorMode === 'auto'
        ? 'Otomatis mode terang atau gelap sesuai pengaturan HP/laptop pengunjung.'
        : colorMode === 'dark'
        ? 'Subdomain storefront akan selalu ditampilkan dalam mode gelap.'
        : 'Subdomain storefront akan selalu ditampilkan dalam mode terang.'}
    </p>
  </div>

  <!-- WCAG Contrast Guardrail Summary Banner -->
  <div class="p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 {primaryButtonContrast.passesAA && textPrimaryContrast.passesAA ? 'bg-success/10 border-success/30 text-success' : 'bg-warning/10 border-warning/30 text-warning'}">
    <div class="flex items-center gap-1.5 font-semibold">
      {#if primaryButtonContrast.passesAA && textPrimaryContrast.passesAA}
        <ShieldCheck size={14} class="shrink-0" />
        <span>WCAG 2.1 AA Guardrail: Lolos</span>
      {:else}
        <AlertTriangle size={14} class="shrink-0" />
        <span>WCAG 2.1 AA: Perlu Penyesuaian Kontras</span>
      {/if}
    </div>
    <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-base-100/60 border border-current">
      Btn {primaryButtonContrast.ratio}:1
    </span>
  </div>

  <!-- Color Palette Fields -->
  <div class="space-y-3 pt-1">
    <div class="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
      Palet Warna Brand
    </div>
    {#each DEFAULT_THEME_COLOR_FIELDS as item}
      {@const val = getColorVal(item.key, item.defaultVal)}
      {@const contrastInfo = getFieldContrast(item.key)}
      <div class="space-y-1.5">
        <label for={`color-${item.key}`} class="block font-semibold text-base-content/80 text-xs">
          {item.label}
        </label>
        <div class="flex items-center gap-2">
          <input
            id={`color-${item.key}`}
            type="color"
            value={val}
            on:input={(e) => onColorChange(item.key, e.currentTarget.value)}
            on:change={(e) => onColorChange(item.key, e.currentTarget.value)}
            class="w-8 h-8 rounded border border-base-300 cursor-pointer bg-transparent shrink-0"
          />
          <input
            type="text"
            value={val}
            aria-label={`Nilai Hex untuk ${item.label}`}
            on:input={(e) => onColorChange(item.key, e.currentTarget.value)}
            on:change={(e) => onColorChange(item.key, e.currentTarget.value)}
            class="flex-1 px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-base-content font-mono uppercase text-xs"
          />
        </div>

        <!-- Reactive WCAG Contrast Indicator Badge & Quick Fix -->
        {#if contrastInfo}
          <div class="flex items-center justify-between gap-1.5 text-[10px] px-1">
            <span class="flex items-center gap-1 font-mono {contrastInfo.eval.passesAA ? 'text-success font-semibold' : 'text-warning font-bold'}">
              {#if contrastInfo.eval.passesAA}
                <Check size={12} class="shrink-0" />
                <span>AA ({contrastInfo.eval.ratio}:1)</span>
              {:else}
                <AlertTriangle size={12} class="shrink-0" />
                <span>{contrastInfo.eval.ratio}:1 (&lt; 4.5)</span>
              {/if}
            </span>
            {#if !contrastInfo.eval.passesAA}
              <button
                type="button"
                on:click={contrastInfo.fix}
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-warning/20 text-warning hover:bg-warning/30 transition-colors cursor-pointer"
                title="Sesuaikan hex otomatis agar memenuhi rasio kontras WCAG 4.5:1"
              >
                <Wand2 size={10} />
                <span>Auto-Fix 4.5:1</span>
              </button>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
