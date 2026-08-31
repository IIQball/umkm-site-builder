<script lang="ts">
  import { Maximize2, Sliders } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import SectionPresetSelector from './SectionPresetSelector.svelte';
  import SectionSlotReorder from './SectionSlotReorder.svelte';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;
  export let onStylesChange: ((updates: Record<string, string | undefined>) => void) | undefined = undefined;

  const applyStyles = (updates: Record<string, string | undefined>) => {
    if (onStylesChange) {
      onStylesChange(updates);
    } else {
      for (const [k, v] of Object.entries(updates)) {
        onStyleChange(k, v || '');
      }
    }
  };

  // Locked 8pt Spacing Options with 0px (Default / Ikut Margin)
  const gapOptions = [
    { value: '', label: 'Default (16px)' },
    { value: '8px', label: '8px (Ketat)' },
    { value: '16px', label: '16px (Normal)' },
    { value: '24px', label: '24px (Renggang)' },
    { value: '32px', label: '32px (Lebar)' },
    { value: '40px', label: '40px (Sangat Lebar)' },
    { value: '48px', label: '48px (Ekstra Lebar)' },
  ];

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

  const setEdgeToEdge = () => {
    applyStyles({
      containerWidth: 'full',
      padding: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      margin: '0px',
      marginTop: '0px',
      marginBottom: '0px',
    });
  };
</script>

<div class="space-y-6">
  <!-- 1. Layout Preset Selector -->
  <SectionPresetSelector {section} />

  <!-- 2. Slot Reorder (Up / Down) -->
  <SectionSlotReorder {section} />

  <!-- 3. Container Width -->
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
        <Maximize2 size={13} class="text-[var(--theme-primary,#2563eb)]" />
        <span>Lebar Kontainer</span>
      </div>
      <button
        type="button"
        on:click={setEdgeToEdge}
        class="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 transition-colors cursor-pointer"
      >
        Full Bleed
      </button>
    </div>

    <div class="grid grid-cols-2 gap-1 bg-base-200/60 p-1 rounded-lg border border-base-300 dark:border-slate-700">
      <button
        type="button"
        on:click={() => onStyleChange('containerWidth', 'boxed')}
        class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
          section.styles?.containerWidth === 'boxed' || !section.styles?.containerWidth
            ? 'bg-base-100 text-base-content font-bold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
      >
        Boxed (Max 1200px)
      </button>
      <button
        type="button"
        on:click={() => onStyleChange('containerWidth', 'full')}
        class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
          section.styles?.containerWidth === 'full'
            ? 'bg-base-100 text-base-content font-bold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
      >
        Full Width (100%)
      </button>
    </div>
  </div>

  <!-- 4. Spacing (Padding & Margin Locked on 8pt Grid) -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sliders size={13} class="text-[var(--theme-primary,#2563eb)]" />
      <span>Jarak & Padding (Kelipatan 8px)</span>
    </div>

    <!-- Gap Antar Elemen -->
    <div>
      <label for="style-gap-select" class="block font-semibold text-xs text-base-content/80 mb-1">
        Jarak Antar Elemen (Gap)
      </label>
      <select
        id="style-gap-select"
        value={section.styles?.gap || ''}
        on:change={(e) => onStyleChange('gap', e.currentTarget.value)}
        on:input={(e) => onStyleChange('gap', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each gapOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
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
</div>
