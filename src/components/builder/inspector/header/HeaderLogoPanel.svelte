<script lang="ts">
  import { Image as ImageIcon } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: logoType = section.props?.logoType || 'image_text';
  $: logoHeight = Number(section.props?.logoImageHeight) || 40;
  $: logoTextSize = section.props?.logoTextSize || 'lg';
  $: logoTextWeight = section.props?.logoTextWeight || 'bold';
  $: logoTextColor = section.props?.logoTextColor || '#0f172a';

  const textSizeOptions = [
    { label: 'SM (14px)', value: 'sm' },
    { label: 'Base (16px)', value: 'base' },
    { label: 'LG (18px)', value: 'lg' },
    { label: 'XL (20px)', value: 'xl' },
    { label: '2XL (24px)', value: '2xl' },
  ];

  const textWeightOptions = [
    { label: 'Normal (400)', value: 'normal' },
    { label: 'Semibold (600)', value: 'semibold' },
    { label: 'Bold (700)', value: 'bold' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 dark:border-slate-800 pb-2">
    <ImageIcon size={14} class="text-blue-500" />
    <span>Gaya & Ukuran Logo</span>
  </div>

  <!-- Image Sizing Slider (if image_only or image_text) -->
  {#if logoType === 'image_only' || logoType === 'image_text'}
    <div>
      <div class="flex items-center justify-between text-[11px] font-medium text-base-content/70 mb-1">
        <span>Tinggi Gambar Logo</span>
        <span class="font-mono text-blue-600 dark:text-blue-400 font-semibold">{logoHeight}px</span>
      </div>
      <input
        type="range"
        min="24"
        max="80"
        step="2"
        value={logoHeight}
        on:input={(e) => onConfigChange('logoImageHeight', Number(e.currentTarget.value))}
        class="w-full h-1.5 bg-base-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div class="flex justify-between text-[9px] text-base-content/40 mt-1">
        <span>24px (Kecil)</span>
        <span>40px (Default)</span>
        <span>80px (Besar)</span>
      </div>
    </div>
  {/if}

  <!-- Text Sizing Preset (if text_only or image_text) -->
  {#if logoType === 'text_only' || logoType === 'image_text'}
    <div class="space-y-3 pt-1">
      <div>
        <label for="logo-text-size-select" class="block font-medium text-[11px] text-base-content/70 mb-1">Ukuran Font Nama Toko</label>
        <div class="grid grid-cols-5 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[10px]">
          {#each textSizeOptions as opt}
            <button
              type="button"
              on:click={() => onConfigChange('logoTextSize', opt.value)}
              class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                logoTextSize === opt.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
              }`}
            >
              {opt.value.toUpperCase()}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <label for="logo-text-weight-select" class="block font-medium text-[11px] text-base-content/70 mb-1">Ketebalan Font (Weight)</label>
        <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
          {#each textWeightOptions as opt}
            <button
              type="button"
              on:click={() => onConfigChange('logoTextWeight', opt.value)}
              class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                logoTextWeight === opt.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
              }`}
            >
              {opt.label.split(' ')[0]}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <label for="logo-text-color" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Teks Brand</label>
        <div class="flex items-center gap-1.5">
          <input
            id="logo-text-color"
            type="color"
            value={logoTextColor || '#0f172a'}
            on:input={(e) => onConfigChange('logoTextColor', e.currentTarget.value)}
            class="w-7 h-7 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={logoTextColor || '#0f172a'}
            on:input={(e) => onConfigChange('logoTextColor', e.currentTarget.value)}
            class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-[11px] text-base-content font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  {/if}
</div>
