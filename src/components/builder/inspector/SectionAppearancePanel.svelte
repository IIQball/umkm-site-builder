<script lang="ts">
  import { AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;

  const animationOptions = [
    { value: 'none', label: 'Tanpa Animasi' },
    { value: 'fadeIn', label: 'Fade In (Halus)' },
    { value: 'slideUp', label: 'Slide Up' },
    { value: 'slideLeft', label: 'Slide In Left' },
    { value: 'slideRight', label: 'Slide In Right' },
    { value: 'zoomIn', label: 'Zoom In' },
  ];

  const durationOptions = [
    { value: '300ms', label: 'Cepat (300ms)' },
    { value: '600ms', label: 'Normal (600ms)' },
    { value: '900ms', label: 'Lambat (900ms)' },
    { value: '1200ms', label: 'Sangat Lambat (1200ms)' },
  ];

  const delayOptions = [
    { value: '0ms', label: 'Tanpa Delay' },
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

  const alignButtons = [
    { value: 'left', icon: AlignLeft, title: 'Rata Kiri' },
    { value: 'center', icon: AlignCenter, title: 'Rata Tengah' },
    { value: 'right', icon: AlignRight, title: 'Rata Kanan' },
  ];
</script>

<div class="space-y-5">
  <!-- Animation -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sparkles size={13} class="text-blue-500" />
      <span>Animasi Entrance & Transisi</span>
    </div>

    <div>
      <label for="style-animation" class="block font-medium mb-1 text-base-content/80">Entrance Animation</label>
      <select id="style-animation" value={section.styles?.animation || 'none'}
        on:change={(e) => onStyleChange('animation', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
        {#each animationOptions as a}
          <option value={a.value}>{a.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.animation && section.styles?.animation !== 'none'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-anim-dur" class="block font-medium mb-1 text-base-content/80">Durasi</label>
          <select id="style-anim-dur" value={section.styles?.animationDuration || '600ms'}
            on:change={(e) => onStyleChange('animationDuration', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
            {#each durationOptions as d}
              <option value={d.value}>{d.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="style-anim-delay" class="block font-medium mb-1 text-base-content/80">Delay</label>
          <select id="style-anim-delay" value={section.styles?.animationDelay || '0ms'}
            on:change={(e) => onStyleChange('animationDelay', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
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
        {#each alignButtons as btn}
          <button type="button" on:click={() => onStyleChange('textAlign', btn.value)}
            class={`flex items-center justify-center py-1.5 rounded transition-colors cursor-pointer ${
              section.styles?.textAlign === btn.value || (btn.value === 'left' && !section.styles?.textAlign)
                ? 'bg-base-100 text-base-content font-semibold shadow-sm'
                : 'text-base-content/60 hover:text-base-content'
            }`} title={btn.title}>
            <svelte:component this={btn.icon} size={14} />
          </button>
        {/each}
      </div>
    </div>

    <div>
      <label for="style-font-family" class="block font-medium mb-1 text-base-content/80">Font Family</label>
      <select id="style-font-family" value={section.styles?.fontFamily || ''}
        on:change={(e) => onStyleChange('fontFamily', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500">
        {#each fontOptions as f}
          <option value={f.value}>{f.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Colors -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-base-content/60 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <PaintBucket size={13} class="text-blue-500" />
      <span>Warna Background & Teks Section</span>
    </div>

    <div>
      <label for="style-bg-color" class="block font-medium mb-1 text-base-content/80">Warna Background Section</label>
      <div class="flex items-center gap-2">
        <input id="style-bg-color" type="color" value={section.styles?.backgroundColor || '#ffffff'}
          on:input={(e) => onStyleChange('backgroundColor', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 bg-base-100 dark:bg-slate-950 cursor-pointer p-0.5" />
        <input type="text" value={section.styles?.backgroundColor || ''}
          on:input={(e) => onStyleChange('backgroundColor', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #0f172a" />
      </div>
    </div>

    <div>
      <label for="style-text-color" class="block font-medium mb-1 text-base-content/80">Warna Teks Utama</label>
      <div class="flex items-center gap-2">
        <input id="style-text-color" type="color" value={section.styles?.color || '#0f172a'}
          on:input={(e) => onStyleChange('color', e.currentTarget.value)}
          class="w-8 h-8 rounded border border-base-300 dark:border-slate-700 bg-base-100 dark:bg-slate-950 cursor-pointer p-0.5" />
        <input type="text" value={section.styles?.color || ''}
          on:input={(e) => onStyleChange('color', e.currentTarget.value)}
          class="flex-1 px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
          placeholder="e.g. #ffffff" />
      </div>
    </div>
  </div>
</div>
