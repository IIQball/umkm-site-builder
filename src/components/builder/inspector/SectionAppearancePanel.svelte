<script lang="ts">
  import { AlignLeft, AlignCenter, AlignRight, Type, PaintBucket, Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';

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

  const alignButtons = [
    { value: 'left', icon: AlignLeft, title: 'Rata Kiri' },
    { value: 'center', icon: AlignCenter, title: 'Rata Tengah' },
    { value: 'right', icon: AlignRight, title: 'Rata Kanan' },
  ];

  // Token-Based Color Presets
  const textTokenOptions = [
    { value: '', label: 'Default (Mengikuti Tema)' },
    { value: 'var(--theme-text-primary, #0f172a)', label: 'Teks Utama (Text Primary)' },
    { value: 'var(--theme-text-muted, #64748b)', label: 'Teks Redup (Text Muted)' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
    { value: '#ffffff', label: 'Putih Bersih (White)' },
  ];

  const bgTokenOptions = [
    { value: 'transparent', label: 'Transparan' },
    { value: 'var(--theme-bg, #ffffff)', label: 'Background Kanvas (Canvas)' },
    { value: 'var(--theme-surface, #f8fafc)', label: 'Surface / Card Background' },
    { value: 'var(--theme-primary, #2563eb)', label: 'Primary Brand (Warna Utama)' },
    { value: 'var(--theme-secondary, #3b82f6)', label: 'Secondary / Accent' },
  ];
</script>

<div class="space-y-6">
  <!-- 1. Animation -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sparkles size={13} class="text-[var(--theme-primary,#2563eb)]" />
      <span>Animasi Entrance & Transisi</span>
    </div>

    <div>
      <label for="style-animation" class="block font-semibold text-xs text-base-content/80 mb-1">
        Entrance Animation
      </label>
      <select
        id="style-animation"
        value={section.styles?.animation || 'none'}
        on:change={(e) => onStyleChange('animation', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each animationOptions as a}
          <option value={a.value}>{a.label}</option>
        {/each}
      </select>
    </div>

    {#if section.styles?.animation && section.styles?.animation !== 'none'}
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label for="style-anim-dur" class="block font-semibold text-[11px] text-base-content/80 mb-1">
            Durasi
          </label>
          <select
            id="style-anim-dur"
            value={section.styles?.animationDuration || '600ms'}
            on:change={(e) => onStyleChange('animationDuration', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each durationOptions as d}
              <option value={d.value}>{d.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="style-anim-delay" class="block font-semibold text-[11px] text-base-content/80 mb-1">
            Delay
          </label>
          <select
            id="style-anim-delay"
            value={section.styles?.animationDelay || '0ms'}
            on:change={(e) => onStyleChange('animationDelay', e.currentTarget.value)}
            class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
          >
            {#each delayOptions as del}
              <option value={del.value}>{del.label}</option>
            {/each}
          </select>
        </div>
      </div>
    {/if}
  </div>

  <!-- 2. Typography Alignment -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Type size={13} class="text-[var(--theme-primary,#2563eb)]" />
      <span>Typography Alignment</span>
    </div>

    <div>
      <span class="block font-semibold text-xs text-base-content/80 mb-1">Perataan Teks (Text Align)</span>
      <div class="grid grid-cols-3 gap-1 bg-base-200/60 p-1 rounded-lg border border-base-300 dark:border-slate-700">
        {#each alignButtons as btn}
          <button
            type="button"
            on:click={() => onStyleChange('textAlign', btn.value)}
            class={`flex items-center justify-center py-1.5 rounded transition-colors cursor-pointer ${
              section.styles?.textAlign === btn.value || (btn.value === 'left' && !section.styles?.textAlign)
                ? 'bg-base-100 text-base-content font-bold shadow-sm'
                : 'text-base-content/60 hover:text-base-content'
            }`}
            title={btn.title}
          >
            <svelte:component this={btn.icon} size={14} />
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- 3. Token-Based Colors -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <PaintBucket size={13} class="text-[var(--theme-primary,#2563eb)]" />
      <span>Warna Background & Teks (Token Sistem)</span>
    </div>

    <div>
      <label for="style-bg-token" class="block font-semibold text-xs text-base-content/80 mb-1">
        Background Section
      </label>
      <select
        id="style-bg-token"
        value={section.styles?.backgroundColor || 'transparent'}
        on:change={(e) => onStyleChange('backgroundColor', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each bgTokenOptions as bg}
          <option value={bg.value}>{bg.label}</option>
        {/each}
      </select>
    </div>

    <div>
      <label for="style-text-token" class="block font-semibold text-xs text-base-content/80 mb-1">
        Warna Teks Section
      </label>
      <select
        id="style-text-token"
        value={section.styles?.color || ''}
        on:change={(e) => onStyleChange('color', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each textTokenOptions as txt}
          <option value={txt.value}>{txt.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

