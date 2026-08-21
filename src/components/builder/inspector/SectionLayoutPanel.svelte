<script lang="ts">
  import { Maximize2, LayoutGrid, Sliders } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;

  const layoutOptions = [
    { value: '', label: 'Default (Block)' },
    { value: 'flex', label: 'Flexbox' },
    { value: 'grid', label: 'CSS Grid' },
  ];

  const alignOptions = [
    { value: '', label: 'Default' },
    { value: 'flex-start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'flex-end', label: 'End' },
    { value: 'stretch', label: 'Stretch' },
  ];

  const justifyOptions = [
    { value: '', label: 'Default' },
    { value: 'flex-start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'flex-end', label: 'End' },
    { value: 'space-between', label: 'Space Between' },
    { value: 'space-around', label: 'Space Around' },
  ];

  const quickPaddings = ['16px', '32px 16px', '48px 24px', '64px 32px'];

  const setEdgeToEdge = () => {
    onStyleChange('containerWidth', 'full');
    onStyleChange('padding', '32px 16px');
    onStyleChange('margin', '0px');
    onStyleChange('marginTop', '0px');
    onStyleChange('marginBottom', '0px');
  };
</script>

<div class="space-y-5">
  <!-- Container Width -->
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
        <Maximize2 size={13} class="text-blue-500" />
        <span>Container & Full-Width</span>
      </div>
      <button type="button" on:click={setEdgeToEdge}
        class="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 transition-colors cursor-pointer">
        Full Bleed
      </button>
    </div>

    <div>
      <label for="style-container-width" class="block font-medium mb-1 text-base-content/80">Mode Lebar Konten</label>
      <div class="grid grid-cols-2 gap-1 bg-base-200/60 p-1 rounded-md border border-base-300 dark:border-slate-700">
        <button type="button" on:click={() => onStyleChange('containerWidth', 'boxed')}
          class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            section.styles?.containerWidth === 'boxed' || !section.styles?.containerWidth
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}>
          Boxed (Max 1200px)
        </button>
        <button type="button" on:click={() => onStyleChange('containerWidth', 'full')}
          class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            section.styles?.containerWidth === 'full'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}>
          Full Width (100%)
        </button>
      </div>
    </div>
  </div>

  <!-- Layout & Display -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <LayoutGrid size={13} class="text-blue-500" />
      <span>Layout & Section Display</span>
    </div>

    <div>
      <label for="style-display" class="block font-medium mb-1 text-base-content/80">Display Mode</label>
      <select id="style-display" value={section.styles?.display || ''}
        on:change={(e) => onStyleChange('display', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
        {#each layoutOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.display === 'flex' || section.styles?.display === 'grid'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-align" class="block font-medium mb-1 text-base-content/80">Align Items</label>
          <select id="style-align" value={section.styles?.alignItems || ''}
            on:change={(e) => onStyleChange('alignItems', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
            {#each alignOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="style-justify" class="block font-medium mb-1 text-base-content/80">Justify Content</label>
          <select id="style-justify" value={section.styles?.justifyContent || ''}
            on:change={(e) => onStyleChange('justifyContent', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
            {#each justifyOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div>
        <label for="style-gap" class="block font-medium mb-1 text-base-content/80">Gap Antar Elemen Section</label>
        <input id="style-gap" type="text" value={section.styles?.gap || ''}
          on:input={(e) => onStyleChange('gap', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px, 24px" />
      </div>
    {/if}
  </div>

  <!-- Spacing -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sliders size={13} class="text-blue-500" />
      <span>Spacing (Padding & Margin)</span>
    </div>

    <div>
      <div class="flex items-center justify-between mb-1">
        <label for="style-padding" class="font-medium text-base-content/80">Padding</label>
        <div class="flex gap-1">
          {#each quickPaddings as p}
            <button type="button" on:click={() => onStyleChange('padding', p)}
              class="px-1.5 py-0.5 text-[10px] bg-base-200 hover:bg-base-300 border border-base-300 dark:border-slate-700 rounded text-base-content/80 hover:text-base-content cursor-pointer transition-colors">
              {p.split(' ')[0]}
            </button>
          {/each}
        </div>
      </div>
      <input id="style-padding" type="text" value={section.styles?.padding || ''}
        on:input={(e) => onStyleChange('padding', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="e.g. 48px 24px" />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="style-margin-top" class="block font-medium mb-1 text-base-content/80">Margin Atas</label>
        <input id="style-margin-top" type="text" value={section.styles?.marginTop || ''}
          on:input={(e) => onStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px" />
      </div>
      <div>
        <label for="style-margin-bottom" class="block font-medium mb-1 text-base-content/80">Margin Bawah</label>
        <input id="style-margin-bottom" type="text" value={section.styles?.marginBottom || ''}
          on:input={(e) => onStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 24px" />
      </div>
    </div>
  </div>
</div>
