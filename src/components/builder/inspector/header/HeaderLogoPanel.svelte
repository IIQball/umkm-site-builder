<script lang="ts">
  import { Image as ImageIcon } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: logoType = section.props?.logoType || 'image_text';
  $: logoHeight = Number(section.props?.logoImageHeight) || 40;
  $: logoTextColor = (section.props?.logoTextColor as string) || 'var(--theme-text-primary, #0f172a)';
  $: logoTypographyToken = (section.props?.logoTypographyToken as string) || 'h3';

  const logoHeightOptions = [
    { label: '24px', value: 24 },
    { label: '32px', value: 32 },
    { label: '40px', value: 40 },
    { label: '48px', value: 48 },
    { label: '56px', value: 56 },
  ];

  const typographyTokenOptions = [
    { label: 'H2 (Heading 2 - 26px)', value: 'h2' },
    { label: 'H3 (Brand Title - 20px)', value: 'h3' },
    { label: 'Body (Standar - 16px)', value: 'body' },
  ];

  const textTokenOptions = [
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
    { value: '#ffffff', label: 'Putih Bersih (White)' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 dark:border-slate-800 pb-2">
    <ImageIcon size={14} class="text-[var(--theme-primary,#2563eb)]" />
    <span>Gaya & Ukuran Logo</span>
  </div>

  <!-- Image Sizing (8pt grid locked: 24, 32, 40, 48, 56) -->
  {#if logoType === 'image_only' || logoType === 'image_text'}
    <div>
      <div class="flex items-center justify-between text-[11px] font-medium text-base-content/70 mb-1">
        <span>Tinggi Gambar Logo (8pt Grid)</span>
        <span class="font-mono text-blue-600 dark:text-blue-400 font-semibold">{logoHeight}px</span>
      </div>
      <div class="grid grid-cols-5 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
        {#each logoHeightOptions as opt}
          <button
            type="button"
            on:click={() => onConfigChange('logoImageHeight', opt.value)}
            class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              logoHeight === opt.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            {opt.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Text Sizing & Tokens (Golden Ratio) -->
  {#if logoType === 'text_only' || logoType === 'image_text'}
    <div class="space-y-2 pt-1">
      <div>
        <label for="logo-typography-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Skala Tipografi Nama Toko</label>
        <select
          id="logo-typography-token"
          value={logoTypographyToken}
          on:change={(e) => onConfigChange('logoTypographyToken', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each typographyTokenOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="logo-text-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Teks Brand (Token)</label>
        <select
          id="logo-text-token"
          value={logoTextColor}
          on:change={(e) => onConfigChange('logoTextColor', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each textTokenOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</div>

