<script lang="ts">
  import { Sliders } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;
  export let applyStyles: (updates: Record<string, string | undefined>) => void;

  const paddingYOptions = [
    { value: '0px', label: '0px (Default / Ikut Margin)' },
    { value: '16px', label: '16px (Kecil)' },
    { value: '24px', label: '24px (Standar)' },
    { value: '32px', label: '32px (Sedang)' },
    { value: '48px', label: '48px (Lebar)' },
    { value: '64px', label: '64px (Besar)' },
    { value: '80px', label: '80px (Jumbo)' },
    { value: '96px', label: '96px (Maksimal)' },
  ];

  const paddingXOptions = [
    { value: '0px', label: '0px (Default / Ikut Margin)' },
    { value: '8px', label: '8px (Ketat)' },
    { value: '16px', label: '16px (Kecil)' },
    { value: '24px', label: '24px (Standar)' },
    { value: '32px', label: '32px (Sedang)' },
    { value: '40px', label: '40px (Besar)' },
    { value: '48px', label: '48px (Lebar)' },
  ];

  const marginOptions = [
    { value: '0px', label: '0px (Tanpa Margin)' },
    { value: '8px', label: '8px' },
    { value: '16px', label: '16px' },
    { value: '24px', label: '24px' },
    { value: '32px', label: '32px' },
    { value: '48px', label: '48px' },
    { value: '64px', label: '64px' },
  ];
</script>

<!-- Spacing (Padding & Margin Locked on 8pt Grid) -->
<div class="space-y-3">
  <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
    <Sliders size={13} class="text-[var(--theme-primary,#2563eb)]" />
    <span>Jarak & Padding (Kelipatan 8px)</span>
  </div>

  <!-- Padding Vertikal & Horizontal -->
  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="style-pad-top" class="block font-semibold text-[11px] text-base-content/80 mb-1">
        Padding Vertikal
      </label>
      <select
        id="style-pad-top"
        value={section.styles?.paddingTop || '0px'}
        on:change={(e) => {
          const val = e.currentTarget.value;
          applyStyles({
            paddingTop: val,
            paddingBottom: val,
            padding: `${val} ${section.styles?.paddingLeft || '0px'}`,
          });
        }}
        on:input={(e) => {
          const val = e.currentTarget.value;
          applyStyles({
            paddingTop: val,
            paddingBottom: val,
            padding: `${val} ${section.styles?.paddingLeft || '0px'}`,
          });
        }}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each paddingYOptions as py}
          <option value={py.value}>{py.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="style-pad-x" class="block font-semibold text-[11px] text-base-content/80 mb-1">
        Padding Horizontal
      </label>
      <select
        id="style-pad-x"
        value={section.styles?.paddingLeft || '0px'}
        on:change={(e) => {
          const val = e.currentTarget.value;
          applyStyles({
            paddingLeft: val,
            paddingRight: val,
            padding: `${section.styles?.paddingTop || '0px'} ${val}`,
          });
        }}
        on:input={(e) => {
          const val = e.currentTarget.value;
          applyStyles({
            paddingLeft: val,
            paddingRight: val,
            padding: `${section.styles?.paddingTop || '0px'} ${val}`,
          });
        }}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each paddingXOptions as px}
          <option value={px.value}>{px.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Margin Atas / Bawah -->
  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="style-margin-top-select" class="block font-semibold text-[11px] text-base-content/80 mb-1">
        Margin Atas
      </label>
      <select
        id="style-margin-top-select"
        value={section.styles?.marginTop || '0px'}
        on:change={(e) => onStyleChange('marginTop', e.currentTarget.value)}
        on:input={(e) => onStyleChange('marginTop', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each marginOptions as m}
          <option value={m.value}>{m.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="style-margin-bot-select" class="block font-semibold text-[11px] text-base-content/80 mb-1">
        Margin Bawah
      </label>
      <select
        id="style-margin-bot-select"
        value={section.styles?.marginBottom || '0px'}
        on:change={(e) => onStyleChange('marginBottom', e.currentTarget.value)}
        on:input={(e) => onStyleChange('marginBottom', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each marginOptions as m}
          <option value={m.value}>{m.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>
