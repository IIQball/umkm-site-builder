<script lang="ts">
  import { Menu } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: navGap = section.props?.navGap || '16px';
  $: navTypographyToken = (section.props?.navTypographyToken as string) || 'body';
  $: navTextTransform = section.props?.navTextTransform || 'none';
  $: navColor = (section.props?.navColor as string) || 'var(--theme-text-muted, #64748b)';
  $: navHoverColor = (section.props?.navHoverColor as string) || 'var(--theme-primary, #2563eb)';

  const gapPresets = [
    { label: '8px (Ketat)', value: '8px' },
    { label: '16px (Normal)', value: '16px' },
    { label: '24px (Renggang)', value: '24px' },
    { label: '32px (Lebar)', value: '32px' },
  ];

  const typographyTokenOptions = [
    { label: 'Body (16px - Standar)', value: 'body' },
    { label: 'Caption (10px - Kompak)', value: 'caption' },
  ];

  const transformPresets = [
    { label: 'Normal', value: 'none' },
    { label: 'UPPER', value: 'uppercase' },
    { label: 'Capital', value: 'capitalize' },
  ];

  const colorTokenOptions = [
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Muted)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Primary)' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#ffffff', label: 'Putih Bersih' },
  ];

  const hoverColorTokenOptions = [
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama' },
    { value: '#ffffff', label: 'Putih' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 dark:border-slate-800 pb-2">
    <Menu size={14} class="text-[var(--theme-primary,#2563eb)]" />
    <span>Gaya & Tipografi Menu Navigasi</span>
  </div>

  <!-- Gap Spacing (8pt scale) -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Jarak Antar Menu (8pt Grid)</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[10px]">
      {#each gapPresets as preset}
        <button
          type="button"
          on:click={() => onConfigChange('navGap', preset.value)}
          class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
            navGap === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {preset.value}
        </button>
      {/each}
    </div>
  </div>

  <!-- Typography Token (Golden Ratio) -->
  <div>
    <label for="nav-typo-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Skala Tipografi Menu</label>
    <select
      id="nav-typo-token"
      value={navTypographyToken}
      on:change={(e) => onConfigChange('navTypographyToken', e.currentTarget.value)}
      class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
    >
      {#each typographyTokenOptions as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>

  <!-- Text Transform -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Kapitalisasi Teks</span>
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

  <!-- Colors: Default & Hover (Token Dropdowns) -->
  <div class="space-y-2 pt-1">
    <div>
      <label for="nav-default-color-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Default (Token)</label>
      <select
        id="nav-default-color-token"
        value={navColor}
        on:change={(e) => onConfigChange('navColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each colorTokenOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="nav-hover-color-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Hover (Token)</label>
      <select
        id="nav-hover-color-token"
        value={navHoverColor}
        on:change={(e) => onConfigChange('navHoverColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each hoverColorTokenOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

