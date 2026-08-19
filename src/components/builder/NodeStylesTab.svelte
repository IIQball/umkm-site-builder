<script lang="ts">
  import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Sliders, Palette, Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';
  import { fontFamilies, fontSizes, fontWeights, radiusPresets, buttonPaddings, shadowPresets, nodeAnimationOptions, hoverOptions } from './inspector/nodeStyles.constants';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onUpdate: (section: TemplateSection) => void;

  $: nodeStyles = section.props?.nodeStyles?.[nodeId] || {};

  const handleStyleChange = (key: string, value: string) => {
    const currentProps = section.props || {};
    const currentNodeStyles = currentProps.nodeStyles || {};
    const updatedForThisNode = { ...(currentNodeStyles[nodeId] || {}), [key]: value };
    onUpdate({ ...section, props: { ...currentProps, nodeStyles: { ...currentNodeStyles, [nodeId]: updatedForThisNode } } });
  };

  $: isButtonNode = nodeId === 'cta' || nodeId.includes('button') || nodeId.includes('btn');
  const alignButtons = [
    { value: 'left', icon: AlignLeft, title: 'Rata Kiri' },
    { value: 'center', icon: AlignCenter, title: 'Rata Tengah' },
    { value: 'right', icon: AlignRight, title: 'Rata Kanan' },
    { value: 'justify', icon: AlignJustify, title: 'Rata Kiri-Kanan' },
  ];
</script>

<div class="p-4 space-y-5 text-xs text-base-content/80">
  <!-- Typography -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Type size={13} class="text-blue-500" />
      <span>Typography & Text Align</span>
    </div>

    <div>
      <span class="block font-medium mb-1 text-base-content/80">Perataan Teks</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/60 p-1 rounded-md border border-base-300 dark:border-slate-700">
        {#each alignButtons as btn}
          <button
            type="button"
            on:click={() => handleStyleChange('textAlign', btn.value)}
            class={`flex items-center justify-center py-1.5 rounded transition-colors cursor-pointer ${
              nodeStyles.textAlign === btn.value || (btn.value === 'left' && !nodeStyles.textAlign)
                ? 'bg-base-100 text-base-content font-semibold shadow-sm'
                : 'text-base-content/60 hover:text-base-content'
            }`}
            title={btn.title}
          >
            <svelte:component this={btn.icon} size={13} />
          </button>
        {/each}
      </div>
    </div>

    <div>
      <label for="node-font-family" class="block font-medium mb-1 text-base-content/80">Jenis Font</label>
      <select
        id="node-font-family"
        value={nodeStyles.fontFamily || ''}
        on:change={(e) => handleStyleChange('fontFamily', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
      >
        <option value="">Default (Mengikuti Section)</option>
        {#each fontFamilies as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-font-size" class="block font-medium mb-1 text-base-content/80">Ukuran Font</label>
        <select
          id="node-font-size"
          value={nodeStyles.fontSize || ''}
          on:change={(e) => handleStyleChange('fontSize', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          <option value="">Default</option>
          {#each fontSizes as s}
            <option value={s.value}>{s.label}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="node-font-weight" class="block font-medium mb-1 text-base-content/80">Ketebalan Font</label>
        <select
          id="node-font-weight"
          value={nodeStyles.fontWeight || ''}
          on:change={(e) => handleStyleChange('fontWeight', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          <option value="">Default</option>
          {#each fontWeights as w}
            <option value={w.value}>{w.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Colors -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Palette size={13} class="text-blue-500" />
      <span>Warna Elemen</span>
    </div>

    <div>
      <label for="node-text-color" class="block font-medium mb-1 text-base-content/80">Warna Teks</label>
      <div class="flex items-center gap-2">
        <input
          id="node-text-color"
          type="color"
          value={nodeStyles.color || '#0f172a'}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 bg-base-100 dark:bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={nodeStyles.color || ''}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #2563eb"
        />
      </div>
    </div>

    <div>
      <label for="node-bg-color" class="block font-medium mb-1 text-base-content/80">Warna Background</label>
      <div class="flex items-center gap-2">
        <input
          id="node-bg-color"
          type="color"
          value={nodeStyles.backgroundColor || '#ffffff'}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 bg-base-100 dark:bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={nodeStyles.backgroundColor || ''}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #eff6ff atau transparent"
        />
      </div>
    </div>
  </div>

  <!-- Button Customizer -->
  {#if isButtonNode}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
        <Sliders size={13} class="text-blue-500" />
        <span>Kustomisasi Tombol</span>
      </div>

      <div>
        <label for="node-border-radius" class="block font-medium mb-1 text-base-content/80">Kelengkungan Sudut (Radius)</label>
        <select
          id="node-border-radius"
          value={nodeStyles.borderRadius || '12px'}
          on:change={(e) => handleStyleChange('borderRadius', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each radiusPresets as r}
            <option value={r.value}>{r.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <span class="block font-medium mb-1 text-base-content/80">Ukuran Tombol (Padding)</span>
        <div class="grid grid-cols-3 gap-1">
          {#each buttonPaddings as bp}
            <button
              type="button"
              on:click={() => handleStyleChange('padding', bp.value)}
              class={`py-1.5 rounded text-[11px] border transition-colors cursor-pointer ${
                nodeStyles.padding === bp.value
                  ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                  : 'bg-base-200 border-base-300 dark:border-slate-700 text-base-content/80 hover:bg-base-300'
              }`}
            >
              {bp.label}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <label for="node-shadow" class="block font-medium mb-1 text-base-content/80">Button Shadow</label>
        <select
          id="node-shadow"
          value={nodeStyles.boxShadow || ''}
          on:change={(e) => handleStyleChange('boxShadow', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each shadowPresets as sh}
            <option value={sh.value}>{sh.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  <!-- Animation & Hover -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sparkles size={13} class="text-blue-500" />
      <span>Animasi & Efek Interaktif</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-animation" class="block font-medium mb-1 text-base-content/80">Entrance Animasi</label>
        <select
          id="node-animation"
          value={nodeStyles.animation || ''}
          on:change={(e) => handleStyleChange('animation', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each nodeAnimationOptions as anim}
            <option value={anim.value}>{anim.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="node-hover" class="block font-medium mb-1 text-base-content/80">Hover Effect</label>
        <select
          id="node-hover"
          value={nodeStyles.hoverEffect || ''}
          on:change={(e) => handleStyleChange('hoverEffect', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each hoverOptions as hov}
            <option value={hov.value}>{hov.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Margin Per Node -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sliders size={13} class="text-blue-500" />
      <span>Margin Per Elemen</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-margin-top" class="block font-medium mb-1 text-base-content/80">Margin Atas</label>
        <input
          id="node-margin-top"
          type="text"
          value={nodeStyles.marginTop || ''}
          on:input={(e) => handleStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 0px, 16px"
        />
      </div>
      <div>
        <label for="node-margin-bottom" class="block font-medium mb-1 text-base-content/80">Margin Bawah</label>
        <input
          id="node-margin-bottom"
          type="text"
          value={nodeStyles.marginBottom || ''}
          on:input={(e) => handleStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px, 24px"
        />
      </div>
    </div>
  </div>
</div>
