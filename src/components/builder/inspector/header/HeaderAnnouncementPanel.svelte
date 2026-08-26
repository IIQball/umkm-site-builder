<script lang="ts">
  import { Megaphone, AlignCenter, AlignLeft } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: align = section.props?.announcementAlign || 'center';
  $: bgColor = (section.props?.announcementBgColor as string) || 'var(--theme-primary, #2563eb)';
  $: textColor = (section.props?.announcementTextColor as string) || '#ffffff';
  $: paddingY = (section.props?.announcementPaddingY as string) || '8px';

  const paddingPresets = [
    { label: '8px (Normal)', value: '8px' },
    { label: '16px (Sedang)', value: '16px' },
    { label: '24px (Lebar)', value: '24px' },
  ];

  const bgTokenOptions = [
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
    { value: 'transparent', label: 'Transparan' },
  ];

  const textTokenOptions = [
    { value: '#ffffff', label: 'Putih Bersih (White)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 dark:border-slate-800 pb-2">
    <Megaphone size={14} class="text-[var(--theme-primary,#2563eb)]" />
    <span>Gaya Announcement Bar</span>
  </div>

  <!-- Text Alignment -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Posisi Teks</span>
    <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      <button
        type="button"
        on:click={() => onConfigChange('announcementAlign', 'center')}
        class={`flex items-center justify-center gap-1 py-1 rounded font-medium transition-colors cursor-pointer ${
          align === 'center' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        <AlignCenter size={13} />
        <span>Tengah</span>
      </button>
      <button
        type="button"
        on:click={() => onConfigChange('announcementAlign', 'left')}
        class={`flex items-center justify-center gap-1 py-1 rounded font-medium transition-colors cursor-pointer ${
          align === 'left' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        <AlignLeft size={13} />
        <span>Kiri</span>
      </button>
    </div>
  </div>

  <!-- Token-based Colors: Background & Text -->
  <div class="space-y-2">
    <div>
      <label for="announcement-bg-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Background (Token)</label>
      <select
        id="announcement-bg-token"
        value={bgColor}
        on:change={(e) => onConfigChange('announcementBgColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each bgTokenOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="announcement-text-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Teks (Token)</label>
      <select
        id="announcement-text-token"
        value={textColor}
        on:change={(e) => onConfigChange('announcementTextColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each textTokenOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Vertical Padding Presets (8pt scale) -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Padding Vertikal Bar (8pt Grid)</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      {#each paddingPresets as preset}
        <button
          type="button"
          on:click={() => onConfigChange('announcementPaddingY', preset.value)}
          class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
            paddingY === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {preset.value}
        </button>
      {/each}
    </div>
  </div>
</div>

