<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import ImageUpload from '@/components/shared/ImageUpload.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';
</script>

<div class="space-y-4">
  <div>
    <label for="hero-title" class="block font-semibold text-xs text-base-content/80 mb-1">Judul Utama (Title)</label>
    <input
      id="hero-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Selamat datang di toko kami"
    />
  </div>

  <div>
    <label for="hero-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="hero-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-xs text-base-content focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Temukan berbagai produk berkualitas dengan penawaran menarik"
    />
  </div>

  <div>
    <label for="hero-badge" class="block font-semibold text-xs text-base-content/80 mb-1">Teks Promo Badge</label>
    <input
      id="hero-badge"
      type="text"
      value={section.props?.badgeText ?? ''}
      on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-xs text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Promo Spesial UMKM"
    />
  </div>

  <!-- Pengaturan Mode & Upload Gambar Visual Hero -->
  <div class="space-y-2 pt-1">
    <div class="flex items-center justify-between">
      <span class="block font-semibold text-xs text-base-content/80">Gambar Banner / Visual Hero</span>
      <span class="text-[10px] text-base-content/50">Maks 1 Gambar Tunggal</span>
    </div>

    <!-- Mode Gambar: Elemen vs Background Penuh -->
    <div class="grid grid-cols-2 gap-1.5 p-1 bg-base-200/60 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-xl mb-1.5">
      <button
        type="button"
        on:click={() => handlePropChange('imageMode', 'element')}
        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer {imageMode === 'element' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-transparent border-transparent text-base-content/70 hover:bg-base-200'}"
      >
        Elemen Visual
      </button>
      <button
        type="button"
        on:click={() => handlePropChange('imageMode', 'background')}
        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer {imageMode === 'background' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-transparent border-transparent text-base-content/70 hover:bg-base-200'}"
      >
        Full Background
      </button>
    </div>

    <ImageUpload
      value={imageUrl}
      maxFiles={1}
      folder="templates"
      onSingleUpload={(url) => handlePropChange('imageUrl', url)}
    />
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="cta-text" class="block font-semibold text-xs text-base-content/80 mb-1">Teks CTA</label>
      <input
        id="cta-text"
        type="text"
        value={section.props?.ctaText ?? ''}
        on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
        placeholder="Lihat Katalog"
      />
    </div>
    <div>
      <label for="cta-link" class="block font-semibold text-xs text-base-content/80 mb-1">Link CTA</label>
      <input
        id="cta-link"
        type="text"
        value={section.props?.ctaLink ?? ''}
        on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
        placeholder="#catalog"
      />
    </div>
  </div>

  <!-- Pengaturan Tinggi Section Canvas (8pt Grid) -->
  <div class="pt-3 border-t border-base-300 dark:border-slate-800">
    <span class="block font-semibold text-xs text-base-content/80 mb-1">Tinggi Minimum Hero (8pt Grid)</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      {#each [
        { label: '480px', value: '480px' },
        { label: '560px', value: '560px' },
        { label: '640px', value: '640px' },
        { label: 'Auto', value: 'auto' },
      ] as h}
        <button
          type="button"
          on:click={() => onUpdate({
            ...section,
            styles: {
              ...(section.styles || {}),
              minHeight: h.value,
            }
          })}
          class={`py-1.5 rounded font-medium transition-colors cursor-pointer text-center ${
            (section.styles?.minHeight || '560px') === h.value ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {h.label}
        </button>
      {/each}
    </div>
  </div>
</div>