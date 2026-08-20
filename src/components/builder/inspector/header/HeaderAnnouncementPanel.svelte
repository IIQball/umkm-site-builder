<script lang="ts">
  import { Megaphone, AlignCenter, AlignLeft } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: align = section.props?.announcementAlign || 'center';
  $: bgColor = section.props?.announcementBgColor || '#2563eb';
  $: textColor = section.props?.announcementTextColor || '#ffffff';
  $: paddingY = section.props?.announcementPaddingY || '8px';

  const paddingPresets = [
    { label: 'Ramping (6px)', value: '6px' },
    { label: 'Normal (8px)', value: '8px' },
    { label: 'Lebar (12px)', value: '12px' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 dark:border-slate-800 pb-2">
    <Megaphone size={14} class="text-blue-500" />
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

  <!-- Colors: Background & Text -->
  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="announcement-bg-color" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Background</label>
      <div class="flex items-center gap-1.5">
        <input
          id="announcement-bg-color"
          type="color"
          value={bgColor}
          on:input={(e) => onConfigChange('announcementBgColor', e.currentTarget.value)}
          class="w-7 h-7 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={bgColor}
          on:input={(e) => onConfigChange('announcementBgColor', e.currentTarget.value)}
          class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-[11px] text-base-content font-mono focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <div>
      <label for="announcement-text-color" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Teks</label>
      <div class="flex items-center gap-1.5">
        <input
          id="announcement-text-color"
          type="color"
          value={textColor}
          on:input={(e) => onConfigChange('announcementTextColor', e.currentTarget.value)}
          class="w-7 h-7 rounded border border-base-300 dark:border-slate-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={textColor}
          on:input={(e) => onConfigChange('announcementTextColor', e.currentTarget.value)}
          class="w-full px-2 py-1 bg-base-100 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded text-[11px] text-base-content font-mono focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  </div>

  <!-- Vertical Padding Presets -->
  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Padding Vertikal Bar</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      {#each paddingPresets as preset}
        <button
          type="button"
          on:click={() => onConfigChange('announcementPaddingY', preset.value)}
          class={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
            paddingY === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {preset.label.split(' ')[0]}
        </button>
      {/each}
    </div>
  </div>
</div>
