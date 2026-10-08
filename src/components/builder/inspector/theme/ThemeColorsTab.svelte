<script lang="ts">
  import type { TemplateTheme } from '@/schemas';
  import { DEFAULT_THEME_COLOR_FIELDS } from '@/components/tokens/colors';

  export let theme: TemplateTheme;
  export let onColorChange: (key: string, value: string) => void = () => {};
  export let onColorModeChange: (mode: 'auto' | 'light' | 'dark') => void = () => {};

  $: colors = theme.colors || {};
  $: colorMode = (theme.colorMode || 'auto') as 'auto' | 'light' | 'dark';

  const getColorVal = (key: string, defaultVal: string): string => {
    const record = colors as Record<string, string | undefined>;
    return record?.[key] || defaultVal;
  };
</script>

<div class="space-y-4">
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

  <div class="space-y-3 pt-1">
    <div class="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
      Palet Warna Brand
    </div>
  {#each DEFAULT_THEME_COLOR_FIELDS as item}
    {@const val = getColorVal(item.key, item.defaultVal)}
    <div>
      <label for={`color-${item.key}`} class="block font-semibold text-base-content/80 mb-1">{item.label}</label>
      <div class="flex items-center gap-2">
        <input
          id={`color-${item.key}`}
          type="color"
          value={val}
          on:input={(e) => onColorChange(item.key, e.currentTarget.value)}
          on:change={(e) => onColorChange(item.key, e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={val}
          on:input={(e) => onColorChange(item.key, e.currentTarget.value)}
          on:change={(e) => onColorChange(item.key, e.currentTarget.value)}
          class="flex-1 px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-base-content font-mono uppercase text-xs"
        />
      </div>
    </div>
  {/each}
  </div>
</div>
