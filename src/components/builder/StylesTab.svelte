<script lang="ts">
  import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    LayoutGrid,
    Sliders,
    Type,
    PaintBucket,
    Sparkles,
    Maximize2,
  } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  const handleStyleChange = (key: string, value: string) => {
    const updatedSection: TemplateSection = {
      ...section,
      styles: {
        ...(section.styles || {}),
        [key]: value || undefined,
      },
    };
    onUpdate(updatedSection);
  };

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

  const animationOptions = [
    { value: 'none', label: 'Tanpa Animasi' },
    { value: 'fadeIn', label: 'Fade In (Halus)' },
    { value: 'slideUp', label: 'Slide Up (Muncul dari Bawah)' },
    { value: 'slideLeft', label: 'Slide In Left (Dari Kanan)' },
    { value: 'slideRight', label: 'Slide In Right (Dari Kiri)' },
    { value: 'zoomIn', label: 'Zoom In (Membesar)' },
  ];

  const durationOptions = [
    { value: '300ms', label: 'Cepat (300ms)' },
    { value: '600ms', label: 'Normal (600ms)' },
    { value: '900ms', label: 'Lambat (900ms)' },
    { value: '1200ms', label: 'Sangat Lambat (1200ms)' },
  ];

  const delayOptions = [
    { value: '0ms', label: 'Tanpa Delay (0ms)' },
    { value: '150ms', label: '150ms' },
    { value: '300ms', label: '300ms' },
    { value: '500ms', label: '500ms' },
  ];

  const fontOptions = [
    { value: '', label: 'Default (Inherit)' },
    { value: 'Inter, sans-serif', label: 'Inter' },
    { value: 'Poppins, sans-serif', label: 'Poppins' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: "'Playfair Display', serif", label: 'Playfair Display' },
    { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  ];

  const setEdgeToEdge = () => {
    const updatedSection: TemplateSection = {
      ...section,
      styles: {
        ...(section.styles || {}),
        containerWidth: 'full',
        padding: '32px 16px',
        margin: '0px',
        marginTop: '0px',
        marginBottom: '0px',
      },
    };
    onUpdate(updatedSection);
  };
</script>

<div class="p-4 space-y-5 text-xs text-slate-300">
  <!-- Container Width & Edge-to-Edge -->
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <Maximize2 size={13} class="text-blue-400" />
        <span>Container & Full-Width</span>
      </div>

      <button
        type="button"
        on:click={setEdgeToEdge}
        class="text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 transition-colors cursor-pointer"
        title="Buat background dan konten melebar penuh ke tepi kanvas"
      >
        Full Bleed
      </button>
    </div>

    <div>
      <label for="style-container-width" class="block font-medium mb-1 text-slate-300">Mode Lebar Konten</label>
      <div class="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-md border border-slate-700">
        <button
          type="button"
          on:click={() => handleStyleChange('containerWidth', 'boxed')}
          class={`py-1.5 rounded text-[11px] font-medium transition-colors ${
            section.styles?.containerWidth === 'boxed' || !section.styles?.containerWidth
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Boxed (Max 1200px)
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('containerWidth', 'full')}
          class={`py-1.5 rounded text-[11px] font-medium transition-colors ${
            section.styles?.containerWidth === 'full'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Full Width (100%)
        </button>
      </div>
    </div>
  </div>

  <!-- Layout & Display -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <LayoutGrid size={13} class="text-blue-400" />
      <span>Layout & Display</span>
    </div>

    <div>
      <label for="style-display" class="block font-medium mb-1 text-slate-300">Display Mode</label>
      <select
        id="style-display"
        value={section.styles?.display || ''}
        on:change={(e) => handleStyleChange('display', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
      >
        {#each layoutOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.display === 'flex' || section.styles?.display === 'grid'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-align" class="block font-medium mb-1 text-slate-300">Align Items</label>
          <select
            id="style-align"
            value={section.styles?.alignItems || ''}
            on:change={(e) => handleStyleChange('alignItems', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {#each alignOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="style-justify" class="block font-medium mb-1 text-slate-300">Justify Content</label>
          <select
            id="style-justify"
            value={section.styles?.justifyContent || ''}
            on:change={(e) => handleStyleChange('justifyContent', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {#each justifyOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div>
        <label for="style-gap" class="block font-medium mb-1 text-slate-300">Gap Antar Elemen</label>
        <input
          id="style-gap"
          type="text"
          value={section.styles?.gap || ''}
          on:input={(e) => handleStyleChange('gap', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px, 24px, 2rem"
        />
      </div>
    {/if}
  </div>

  <!-- Spacing -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Sliders size={13} class="text-blue-400" />
      <span>Spacing (Padding & Margin)</span>
    </div>

    <div>
      <div class="flex items-center justify-between mb-1">
        <label for="style-padding" class="font-medium text-slate-300">Padding</label>
        <div class="flex gap-1">
          {#each quickPaddings as p}
            <button
              type="button"
              on:click={() => handleStyleChange('padding', p)}
              class="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300 cursor-pointer"
            >
              {p.split(' ')[0]}
            </button>
          {/each}
        </div>
      </div>
      <input
        id="style-padding"
        type="text"
        value={section.styles?.padding || ''}
        on:input={(e) => handleStyleChange('padding', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        placeholder="e.g. 48px 24px"
      />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="style-margin-top" class="block font-medium mb-1 text-slate-300">Margin Atas</label>
        <input
          id="style-margin-top"
          type="text"
          value={section.styles?.marginTop || ''}
          on:input={(e) => handleStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px"
        />
      </div>

      <div>
        <label for="style-margin-bottom" class="block font-medium mb-1 text-slate-300">Margin Bawah</label>
        <input
          id="style-margin-bottom"
          type="text"
          value={section.styles?.marginBottom || ''}
          on:input={(e) => handleStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 24px"
        />
      </div>
    </div>
  </div>

  <!-- Animation & Transitions -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Sparkles size={13} class="text-blue-400" />
      <span>Animasi Entrance & Transisi</span>
    </div>

    <div>
      <label for="style-animation" class="block font-medium mb-1 text-slate-300">Entrance Animation</label>
      <select
        id="style-animation"
        value={section.styles?.animation || 'none'}
        on:change={(e) => handleStyleChange('animation', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
      >
        {#each animationOptions as a}
          <option value={a.value}>{a.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.animation && section.styles?.animation !== 'none'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-anim-dur" class="block font-medium mb-1 text-slate-300">Durasi</label>
          <select
            id="style-anim-dur"
            value={section.styles?.animationDuration || '600ms'}
            on:change={(e) => handleStyleChange('animationDuration', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {#each durationOptions as d}
              <option value={d.value}>{d.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="style-anim-delay" class="block font-medium mb-1 text-slate-300">Delay</label>
          <select
            id="style-anim-delay"
            value={section.styles?.animationDelay || '0ms'}
            on:change={(e) => handleStyleChange('animationDelay', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {#each delayOptions as del}
              <option value={del.value}>{del.label}</option>
            {/each}
          </select>
        </div>
      </div>
    {/if}
  </div>

  <!-- Typography -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <Type size={13} class="text-blue-400" />
      <span>Typography & Text Align</span>
    </div>

    <div>
      <span class="block font-medium mb-1 text-slate-300">Text Align</span>
      <div class="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-md border border-slate-700">
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'left')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            section.styles?.textAlign === 'left' || !section.styles?.textAlign
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Kiri"
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'center')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            section.styles?.textAlign === 'center'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Tengah"
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'right')}
          class={`flex items-center justify-center py-1 rounded transition-colors ${
            section.styles?.textAlign === 'right'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rata Kanan"
        >
          <AlignRight size={14} />
        </button>
      </div>
    </div>

    <div>
      <label for="style-font-family" class="block font-medium mb-1 text-slate-300">Font Family</label>
      <select
        id="style-font-family"
        value={section.styles?.fontFamily || ''}
        on:change={(e) => handleStyleChange('fontFamily', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
      >
        {#each fontOptions as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Colors & Background -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
      <PaintBucket size={13} class="text-blue-400" />
      <span>Warna Background & Teks</span>
    </div>

    <!-- Background Color -->
    <div>
      <label for="style-bg-color" class="block font-medium mb-1 text-slate-300">Warna Background</label>
      <div class="flex items-center gap-2">
        <input
          id="style-bg-color"
          type="color"
          value={section.styles?.backgroundColor || '#ffffff'}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={section.styles?.backgroundColor || ''}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #0f172a"
        />
      </div>
    </div>

    <!-- Text Color -->
    <div>
      <label for="style-text-color" class="block font-medium mb-1 text-slate-300">Warna Teks Utama</label>
      <div class="flex items-center gap-2">
        <input
          id="style-text-color"
          type="color"
          value={section.styles?.color || '#0f172a'}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={section.styles?.color || ''}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #ffffff"
        />
      </div>
    </div>
  </div>
</div>
