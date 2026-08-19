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

<div class="p-4 space-y-5 text-xs text-base-content/80">
  <!-- Container Width & Edge-to-Edge -->
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60">
        <Maximize2 size={13} class="text-blue-500" />
        <span>Container & Full-Width</span>
      </div>

      <button
        type="button"
        on:click={setEdgeToEdge}
        class="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 transition-colors cursor-pointer"
        title="Buat background dan konten melebar penuh ke tepi kanvas"
      >
        Full Bleed
      </button>
    </div>

    <div>
      <label for="style-container-width" class="block font-medium mb-1 text-base-content/80">Mode Lebar Konten</label>
      <div class="grid grid-cols-2 gap-1 bg-base-200/60 p-1 rounded-md border border-base-300 dark:border-slate-700">
        <button
          type="button"
          on:click={() => handleStyleChange('containerWidth', 'boxed')}
          class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            section.styles?.containerWidth === 'boxed' || !section.styles?.containerWidth
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          Boxed (Max 1200px)
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('containerWidth', 'full')}
          class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
            section.styles?.containerWidth === 'full'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          Full Width (100%)
        </button>
      </div>
    </div>
  </div>

  <!-- Layout & Display -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <LayoutGrid size={13} class="text-blue-500" />
      <span>Layout & Display</span>
    </div>

    <div>
      <label for="style-display" class="block font-medium mb-1 text-base-content/80">Display Mode</label>
      <select
        id="style-display"
        value={section.styles?.display || ''}
        on:change={(e) => handleStyleChange('display', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each layoutOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.display === 'flex' || section.styles?.display === 'grid'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-align" class="block font-medium mb-1 text-base-content/80">Align Items</label>
          <select
            id="style-align"
            value={section.styles?.alignItems || ''}
            on:change={(e) => handleStyleChange('alignItems', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each alignOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="style-justify" class="block font-medium mb-1 text-base-content/80">Justify Content</label>
          <select
            id="style-justify"
            value={section.styles?.justifyContent || ''}
            on:change={(e) => handleStyleChange('justifyContent', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each justifyOptions as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div>
        <label for="style-gap" class="block font-medium mb-1 text-base-content/80">Gap Antar Elemen</label>
        <input
          id="style-gap"
          type="text"
          value={section.styles?.gap || ''}
          on:input={(e) => handleStyleChange('gap', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px, 24px, 2rem"
        />
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
            <button
              type="button"
              on:click={() => handleStyleChange('padding', p)}
              class="px-1.5 py-0.5 text-[10px] bg-base-200 hover:bg-base-300 border border-base-300 dark:border-slate-700 rounded text-base-content/80 hover:text-base-content cursor-pointer transition-colors"
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
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="e.g. 48px 24px"
      />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="style-margin-top" class="block font-medium mb-1 text-base-content/80">Margin Atas</label>
        <input
          id="style-margin-top"
          type="text"
          value={section.styles?.marginTop || ''}
          on:input={(e) => handleStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 16px"
        />
      </div>

      <div>
        <label for="style-margin-bottom" class="block font-medium mb-1 text-base-content/80">Margin Bawah</label>
        <input
          id="style-margin-bottom"
          type="text"
          value={section.styles?.marginBottom || ''}
          on:input={(e) => handleStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. 24px"
        />
      </div>
    </div>
  </div>

  <!-- Animation & Transitions -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sparkles size={13} class="text-blue-500" />
      <span>Animasi Entrance & Transisi</span>
    </div>

    <div>
      <label for="style-animation" class="block font-medium mb-1 text-base-content/80">Entrance Animation</label>
      <select
        id="style-animation"
        value={section.styles?.animation || 'none'}
        on:change={(e) => handleStyleChange('animation', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each animationOptions as a}
          <option value={a.value}>{a.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.animation && section.styles?.animation !== 'none'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-anim-dur" class="block font-medium mb-1 text-base-content/80">Durasi</label>
          <select
            id="style-anim-dur"
            value={section.styles?.animationDuration || '600ms'}
            on:change={(e) => handleStyleChange('animationDuration', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each durationOptions as d}
              <option value={d.value}>{d.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="style-anim-delay" class="block font-medium mb-1 text-base-content/80">Delay</label>
          <select
            id="style-anim-delay"
            value={section.styles?.animationDelay || '0ms'}
            on:change={(e) => handleStyleChange('animationDelay', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
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
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Type size={13} class="text-blue-500" />
      <span>Typography & Text Align</span>
    </div>

    <div>
      <span class="block font-medium mb-1 text-base-content/80">Text Align</span>
      <div class="grid grid-cols-3 gap-1 bg-base-200/60 p-1 rounded-md border border-base-300 dark:border-slate-700">
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'left')}
          class={`flex items-center justify-center py-1.5 rounded transition-colors cursor-pointer ${
            section.styles?.textAlign === 'left' || !section.styles?.textAlign
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title="Rata Kiri"
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'center')}
          class={`flex items-center justify-center py-1.5 rounded transition-colors cursor-pointer ${
            section.styles?.textAlign === 'center'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title="Rata Tengah"
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          on:click={() => handleStyleChange('textAlign', 'right')}
          class={`flex items-center justify-center py-1.5 rounded transition-colors cursor-pointer ${
            section.styles?.textAlign === 'right'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
          title="Rata Kanan"
        >
          <AlignRight size={14} />
        </button>
      </div>
    </div>

    <div>
      <label for="style-font-family" class="block font-medium mb-1 text-base-content/80">Font Family</label>
      <select
        id="style-font-family"
        value={section.styles?.fontFamily || ''}
        on:change={(e) => handleStyleChange('fontFamily', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each fontOptions as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Colors & Background -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <PaintBucket size={13} class="text-blue-500" />
      <span>Warna Background & Teks</span>
    </div>

    <!-- Background Color -->
    <div>
      <label for="style-bg-color" class="block font-medium mb-1 text-base-content/80">Warna Background</label>
      <div class="flex items-center gap-2">
        <input
          id="style-bg-color"
          type="color"
          value={section.styles?.backgroundColor || '#ffffff'}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 bg-base-100 dark:bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={section.styles?.backgroundColor || ''}
          on:input={(e) => handleStyleChange('backgroundColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #0f172a"
        />
      </div>
    </div>

    <!-- Text Color -->
    <div>
      <label for="style-text-color" class="block font-medium mb-1 text-base-content/80">Warna Teks Utama</label>
      <div class="flex items-center gap-2">
        <input
          id="style-text-color"
          type="color"
          value={section.styles?.color || '#0f172a'}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 bg-base-100 dark:bg-slate-950 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={section.styles?.color || ''}
          on:input={(e) => handleStyleChange('color', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #ffffff"
        />
      </div>
    </div>
  </div>
</div>
