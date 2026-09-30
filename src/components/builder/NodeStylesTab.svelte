<script lang="ts">
  import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Type, Sliders, Palette, Sparkles } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import type { NodeStyles } from '@/types';
  import { fontSizes, fontWeights, nodeAnimationOptions, hoverOptions } from './inspector/nodeStyles.constants';
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
  const alignButtons = [
    { value: 'left', icon: AlignLeft, title: 'Rata Kiri' },
    { value: 'center', icon: AlignCenter, title: 'Rata Tengah' },
    { value: 'right', icon: AlignRight, title: 'Rata Kanan' },
    { value: 'justify', icon: AlignJustify, title: 'Rata Kiri-Kanan' },
  ];

  const textTokenOptions = [
    { value: '', label: 'Default (Warisan Tema)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Primary)' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Muted)' },
    { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#ffffff', label: 'Putih Bersih' },
  ];

  const bgTokenOptions = [
    { value: 'transparent', label: 'Transparan' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-primary, var(--color-primary))', label: 'Primary Brand' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#ffffff', label: 'Putih Bersih' },
  ];

  const marginPresets = [
    { label: '0px', value: '0px' },
    { label: '8px', value: '8px' },
    { label: '16px', value: '16px' },
    { label: '24px', value: '24px' },
    { label: '32px', value: '32px' },
    { label: '48px', value: '48px' },
  ];
</script>

<div class="p-4 space-y-5 text-xs text-base-content/80">
  <!-- Typography -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-1.5">
      <Type size={13} class="text-primary" />
      <span>Typography & Text Align</span>
    </div>

    <div>
      <span class="block font-medium mb-1 text-base-content/80">Perataan Teks</span>
      <div class="grid grid-cols-4 gap-1 bg-base-200/60 p-1 rounded-md border border-base-300">
        {#each alignButtons as btn}
          <Button
            type="button"
            size="icon"
            variant={nodeStyles.textAlign === btn.value || (btn.value === 'left' && !nodeStyles.textAlign) ? 'primary' : 'ghost'}
            on:click={() => handleStyleChange('textAlign', btn.value)}
            class={`!w-full !h-auto !min-h-0 !py-1.5 rounded transition-colors ${
              nodeStyles.textAlign === btn.value || (btn.value === 'left' && !nodeStyles.textAlign)
                ? 'bg-base-100 text-base-content font-semibold shadow-sm'
                : 'text-base-content/60 hover:text-base-content'
            }`}
            title={btn.title}
          >
            <svelte:component this={btn.icon} size={13} />
          </Button>
        {/each}
      </div>
    </div>

    <div class="p-2.5 bg-primary/10 border border-primary/20 rounded-md text-[11px] text-primary">
      <span class="font-semibold block mb-0.5">Tipografi Global Active:</span>
      Elemen ini mengikuti font family & skala dari <strong>Global Design System</strong>.
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-font-size" class="block font-medium mb-1 text-base-content/80">Skala Tipografi (Golden Ratio)</label>
        <select
          id="node-font-size"
          value={nodeStyles.fontSize || ''}
          on:change={(e) => handleStyleChange('fontSize', e.currentTarget.value)}
          on:input={(e) => handleStyleChange('fontSize', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        >
          <option value="">Default (Warisan Tema)</option>
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
          on:input={(e) => handleStyleChange('fontWeight', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
        >
          <option value="">Default</option>
          {#each fontWeights as w}
            <option value={w.value}>{w.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Colors (Token Dropdowns) -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 pb-1.5">
      <Palette size={13} class="text-primary" />
      <span>Warna Elemen (Token)</span>
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
        {#each textTokenOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="node-bg-color" class="block font-medium mb-1 text-base-content/80">Warna Background (Token)</label>
      <select
        id="node-bg-color"
        value={nodeStyles.backgroundColor || 'transparent'}
        on:change={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
        on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 border border-base-300 rounded-md text-base-content focus:outline-none focus:border-primary"
      >
        {#each bgTokenOptions as opt}
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
          {#each marginPresets as m}
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
          {#each marginPresets as m}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</div>
