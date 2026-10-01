<script lang="ts">
  import { Sliders, Palette, Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import type { NodeStyles } from '@/types';
  import { nodeAnimationOptions, hoverOptions } from './inspector/nodeStyles.constants';
  import NodeButtonStyles from './inspector/NodeButtonStyles.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onUpdate: (section: TemplateSection) => void;

  $: nodeStyles = ((section.props?.nodeStyles as Record<string, NodeStyles> | undefined)?.[nodeId] || {}) as Record<string, string>;

  const handleStyleChange = (key: string, value: string) => {
    const currentProps = section.props || {};
    const currentNodeStyles = (currentProps.nodeStyles as Record<string, NodeStyles> | undefined) || {};
    const updatedForThisNode = { ...(currentNodeStyles[nodeId] || {}), [key]: value };
    onUpdate({ ...section, props: { ...currentProps, nodeStyles: { ...currentNodeStyles, [nodeId]: updatedForThisNode } } });
  };

  $: isButtonNode = nodeId === 'cta' || nodeId.includes('button') || nodeId.includes('btn');
  import { textColorOptions, marginOptions } from './inspector/NodeStyleControls.svelte';

</script>

<div class="p-4 space-y-5 text-xs text-base-content/80">
  <!-- Colors (Token Dropdown) -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-1.5">
      <Palette size={13} class="text-primary" />
      <span>Warna Teks Elemen (Token)</span>
    </div>

    <div>
      <label for="node-text-color" class="block font-medium mb-1 text-base-content/80">Warna Teks (Token)</label>
      <select
        id="node-text-color"
        value={nodeStyles.color || ''}
        on:change={(e) => handleStyleChange('color', e.currentTarget.value)}
        on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
      >
        {#each textColorOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Button Customizer Sub-Component -->
  {#if isButtonNode}
    <NodeButtonStyles {nodeStyles} onStyleChange={handleStyleChange} />
  {/if}

  <!-- Animation & Hover -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-1.5">
      <Sparkles size={13} class="text-primary" />
      <span>Animasi & Efek Interaktif</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-animation" class="block font-medium mb-1 text-base-content/80">Entrance Animasi</label>
        <select
          id="node-animation"
          value={nodeStyles.animation || ''}
          on:change={(e) => handleStyleChange('animation', e.currentTarget.value)}
          on:input={(e) => handleStyleChange('animation', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
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
          on:input={(e) => handleStyleChange('hoverEffect', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        >
          {#each hoverOptions as hov}
            <option value={hov.value}>{hov.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Margin Per Node (8pt grid locked) -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-1.5">
      <Sliders size={13} class="text-primary" />
      <span>Margin Per Elemen (8pt Grid)</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-margin-top" class="block font-medium mb-1 text-base-content/80">Margin Atas</label>
        <select
          id="node-margin-top"
          value={nodeStyles.marginTop || '0px'}
          on:change={(e) => handleStyleChange('marginTop', e.currentTarget.value)}
          on:input={(e) => handleStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        >
          {#each marginOptions as m}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="node-margin-bottom" class="block font-medium mb-1 text-base-content/80">Margin Bawah</label>
        <select
          id="node-margin-bottom"
          value={nodeStyles.marginBottom || '0px'}
          on:change={(e) => handleStyleChange('marginBottom', e.currentTarget.value)}
          on:input={(e) => handleStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        >
          {#each marginOptions as m}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</div>
