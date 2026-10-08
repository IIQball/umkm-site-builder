<script lang="ts">
  import { Megaphone } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onConfigChange: (key: string, value: unknown) => void;

  $: bgColor = (section.props?.announcementBgColor as string) || 'var(--theme-primary, var(--color-primary))';
  $: textColor = (section.props?.announcementTextColor as string) || '#ffffff';
  $: paddingY = (section.props?.announcementPaddingY as string) || '8px';

  const paddingPresets = [
    { label: '8px (Normal)', value: '8px' },
    { label: '16px (Sedang)', value: '16px' },
    { label: '24px (Lebar)', value: '24px' },
  ];

  const bgTokenOptions = [
    { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand (Warna Utama)' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
    { value: 'transparent', label: 'Transparan' },
  ];

  const textTokenOptions = [
    { value: '#ffffff', label: 'Putih Bersih (White)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
    { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  ];
</script>

<div class="space-y-3 p-3 bg-base-200/40 rounded-xl border border-base-200">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content border-b border-base-200 pb-2">
    <Megaphone size={14} class="text-[var(--theme-primary, var(--color-primary))]" />
    <span>Gaya Announcement Bar</span>
  </div>

  <!-- Token-based Colors: Background & Text -->
  <div class="space-y-2">
    <div>
      <label for="announcement-bg-token" class="block font-medium text-[11px] text-base-content/70 mb-1">Warna Background (Token)</label>
      <select
        id="announcement-bg-token"
        value={bgColor}
        on:change={(e) => onConfigChange('announcementBgColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
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
        class="w-full px-2.5 py-1.5 bg-base-100 border border-base-300 rounded-lg text-xs text-base-content focus:outline-none focus:border-primary"
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
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 text-[11px]">
      {#each paddingPresets as preset}
        <Button
          type="button"
          size="xs"
          variant={paddingY === preset.value ? 'primary' : 'ghost'}
          on:click={() => onConfigChange('announcementPaddingY', preset.value)}
          class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
            paddingY === preset.value ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {preset.value}
        </Button>
      {/each}
    </div>
  </div>
</div>

