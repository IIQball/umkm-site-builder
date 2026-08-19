<script lang="ts">
  import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Type,
    Sliders,
    Palette,
    Sparkles,
  } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onUpdate: (section: TemplateSection) => void;

  $: nodeStyles = section.props?.nodeStyles?.[nodeId] || {};

  const handleStyleChange = (key: string, value: string) => {
    const currentProps = section.props || {};
    const currentNodeStyles = currentProps.nodeStyles || {};
    const updatedForThisNode = {
      ...(currentNodeStyles[nodeId] || {}),
      [key]: value,
    };

    const updatedSection: TemplateSection = {
      ...section,
      props: {
        ...currentProps,
        nodeStyles: {
          ...currentNodeStyles,
          [nodeId]: updatedForThisNode,
        },
      },
    };

    onUpdate(updatedSection);
  };

  const fontFamilies = [
    { label: 'Default (Inter)', value: 'Inter, sans-serif' },
    { label: 'Poppins (Modern)', value: 'Poppins, sans-serif' },
    { label: 'Roboto (Clean)', value: 'Roboto, sans-serif' },
    { label: 'Playfair Display (Serif/Elegant)', value: "'Playfair Display', serif" },
    { label: 'Montserrat (Bold)', value: 'Montserrat, sans-serif' },
  ];

  const fontSizes = [
    { label: 'Extra Small (12px)', value: '12px' },
    { label: 'Small (14px)', value: '14px' },
    { label: 'Base (16px)', value: '16px' },
    { label: 'Large (18px)', value: '18px' },
    { label: 'XL (20px)', value: '20px' },
    { label: '2XL (24px)', value: '24px' },
    { label: '3XL (30px)', value: '30px' },
    { label: '4XL (36px)', value: '36px' },
    { label: '5XL (48px)', value: '48px' },
  ];

  const fontWeights = [
    { label: 'Normal (400)', value: '400' },
    { label: 'Medium (500)', value: '500' },
    { label: 'Semi Bold (600)', value: '600' },
    { label: 'Bold (700)', value: '700' },
    { label: 'Extra Bold (800)', value: '800' },
  ];

  const radiusPresets = [
    { label: 'Kotak (0px)', value: '0px' },
    { label: 'Sedikit (6px)', value: '6px' },
    { label: 'Sedang (12px)', value: '12px' },
    { label: 'Bulat (24px)', value: '24px' },
    { label: 'Pill (9999px)', value: '9999px' },
  ];

  const buttonPaddings = [
    { label: 'Kompak', value: '8px 16px' },
    { label: 'Normal', value: '12px 24px' },
    { label: 'Besar', value: '16px 32px' },
  ];

  const shadowPresets = [
    { label: 'Tanpa Shadow', value: 'none' },
    { label: 'Soft Shadow', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    { label: 'Glow Blue', value: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' },
    { label: 'Deep Shadow', value: '0 20px 25px -5px rgb(0 0 0 / 0.2)' },
  ];

  const animationOptions = [
    { value: '', label: 'Tanpa Animasi' },
    { value: 'fadeIn', label: 'Fade In (Halus)' },
    { value: 'slideUp', label: 'Slide Up (Muncul dari Bawah)' },
    { value: 'slideLeft', label: 'Slide In Left (Dari Kanan)' },
    { value: 'slideRight', label: 'Slide In Right (Dari Kiri)' },
    { value: 'zoomIn', label: 'Zoom In (Membesar)' },
  ];

  const hoverOptions = [
    { value: '', label: 'None' },
    { value: 'scale', label: 'Scale Up (1.05x)' },
    { value: 'lift', label: 'Lift Up (-4px)' },
    { value: 'glow', label: 'Glow Shadow' },
  ];

  $: isButtonNode = nodeId === 'cta' || nodeId.includes('button') || nodeId.includes('btn');
</script>

<div class="p-4 space-y-5 text-xs text-slate-300">
  <!-- Typography Group -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Type size={13} class="text-blue-400" />
      <span>Typography & Text Align</span>
    </div>

    <!-- Text Align -->
    <div>
      <span class="block font-medium mb-1 text-slate-300">Perataan Teks</span>
      <div class="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-md border border-slate-700">
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'left')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            nodeStyles.textAlign === 'left' || !nodeStyles.textAlign
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Kiri"
        >
          <AlignLeft size={13} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'center')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            nodeStyles.textAlign === 'center'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Tengah"
        >
          <AlignCenter size={13} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'right')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            nodeStyles.textAlign === 'right'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Kanan"
        >
          <AlignRight size={13} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'justify')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            nodeStyles.textAlign === 'justify'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Kiri-Kanan"
        >
          <AlignJustify size={13} />
        </button>
      </div>
    </div>

    <!-- Font Family -->
    <div>
      <label for="node-font-family" class="block font-medium mb-1 text-slate-300">Jenis Font</label>
      <select
        id="node-font-family"
        value={nodeStyles.fontFamily || ''}
        on:change={(e) => handleStyleChange('fontFamily', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
      >
        <option value="">Default (Mengikuti Section)</option>
        {#each fontFamilies as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>

    <!-- Font Size & Weight -->
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-font-size" class="block font-medium mb-1 text-slate-300">Ukuran Font</label>
        <select
          id="node-font-size"
          value={nodeStyles.fontSize || ''}
          on:change={(e) => handleStyleChange('fontSize', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
        >
          <option value="">Default</option>
          {#each fontSizes as s}
            <option value={s.value}>{s.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="node-font-weight" class="block font-medium mb-1 text-slate-300">Ketebalan Font</label>
        <select
          id="node-font-weight"
          value={nodeStyles.fontWeight || ''}
          on:change={(e) => handleStyleChange('fontWeight', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
        >
          <option value="">Default</option>
          {#each fontWeights as w}
            <option value={w.value}>{w.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Colors Group -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Palette size={13} class="text-blue-400" />
      <span>Warna Elemen</span>
    </div>

    <!-- Text Color -->
    <div>
      <label for="node-text-color" class="block font-medium mb-1 text-slate-300">Warna Teks</label>
      <div class="flex items-center gap-2">
        <input
          id="node-text-color"
          type="color"
          value={nodeStyles.color || '#0f172a'}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={nodeStyles.color || ''}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #2563eb"
        />
      </div>
    </div>

    <!-- Background Color (For Badges/Buttons/Cards) -->
    <div>
      <label for="node-bg-color" class="block font-medium mb-1 text-slate-300">Warna Background</label>
      <div class="flex items-center gap-2">
        <input
          id="node-bg-color"
          type="color"
          value={nodeStyles.backgroundColor || '#ffffff'}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={nodeStyles.backgroundColor || ''}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #eff6ff atau transparent"
        />
      </div>
    </div>
  </div>

  <!-- Button & Shape Customizer (Only for buttons or card nodes) -->
  {#if isButtonNode}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
        <Sliders size={13} class="text-blue-400" />
        <span>Kustomisasi Tombol</span>
      </div>

      <!-- Border Radius -->
      <div>
        <label for="node-border-radius" class="block font-medium mb-1 text-slate-300">Kelengkungan Sudut (Radius)</label>
        <select
          id="node-border-radius"
          value={nodeStyles.borderRadius || '12px'}
          on:change={(e) => handleStyleChange('borderRadius', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
        >
          {#each radiusPresets as r}
            <option value={r.value}>{r.label}</option>
          {/each}
        </select>
      </div>

      <!-- Button Padding -->
      <div>
        <span class="block font-medium mb-1 text-slate-300">Ukuran Tombol (Padding)</span>
        <div class="grid grid-cols-3 gap-1">
          {#each buttonPaddings as bp}
            <button
              type="button"
              on:click={() => handleStyleChange('padding', bp.value)}
              class={`py-1.5 rounded text-[11px] border transition-colors ${
                nodeStyles.padding === bp.value
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {bp.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Shadow Presets -->
      <div>
        <label for="node-shadow" class="block font-medium mb-1 text-slate-300">Button Shadow</label>
        <select
          id="node-shadow"
          value={nodeStyles.boxShadow || ''}
          on:change={(e) => handleStyleChange('boxShadow', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
        >
          {#each shadowPresets as sh}
            <option value={sh.value}>{sh.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

  <!-- Animation & Hover Effects -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Sparkles size={13} class="text-blue-400" />
      <span>Animasi & Efek Interaktif</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-animation" class="block font-medium mb-1 text-slate-300">Entrance Animasi</label>
        <select
          id="node-animation"
          value={nodeStyles.animation || ''}
          on:change={(e) => handleStyleChange('animation', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
        >
          {#each animationOptions as anim}
            <option value={anim.value}>{anim.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="node-hover" class="block font-medium mb-1 text-slate-300">Hover Effect</label>
        <select
          id="node-hover"
          value={nodeStyles.hoverEffect || ''}
          on:change={(e) => handleStyleChange('hoverEffect', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
        >
          {#each hoverOptions as hov}
            <option value={hov.value}>{hov.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <!-- Spacing (Margin Top & Bottom per Node) -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Sliders size={13} class="text-blue-400" />
      <span>Margin Per Elemen</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="node-margin-top" class="block font-medium mb-1 text-slate-300">Margin Atas</label>
        <input
          id="node-margin-top"
          type="text"
          value={nodeStyles.marginTop || ''}
          on:input={(e) => handleStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 0px, 16px"
        />
      </div>

      <div>
        <label for="node-margin-bottom" class="block font-medium mb-1 text-slate-300">Margin Bawah</label>
        <input
          id="node-margin-bottom"
          type="text"
          value={nodeStyles.marginBottom || ''}
          on:input={(e) => handleStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px, 24px"
        />
      </div>
    </div>
  </div>
</div>
