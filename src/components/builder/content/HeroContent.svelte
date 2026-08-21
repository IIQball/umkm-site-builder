<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: subtitle = (section.props?.subtitle as string) ?? '';
</script>

<div class="space-y-3">
  <div>
    <label for="hero-title" class="block font-semibold text-base-content/80 mb-1">Judul Utama (Title)</label>
    <input
      id="hero-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
      placeholder="Selamat datang di toko kami"
    />
  </div>

  <div>
    <label for="hero-subtitle" class="block font-semibold text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="hero-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="3"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Produk berkualitas dengan harga terjangkau"
    />
  </div>

  <div>
    <label for="hero-image" class="block font-semibold text-base-content/80 mb-1">URL Gambar Banner</label>
    <input
      id="hero-image"
      type="text"
      value={section.props?.imageUrl ?? ''}
      on:input={(e) => handlePropChange('imageUrl', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
      placeholder="https://images.unsplash.com/..."
    />
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="cta-text" class="block font-semibold text-base-content/80 mb-1">Teks Tombol CTA</label>
      <input
        id="cta-text"
        type="text"
        value={section.props?.ctaText ?? ''}
        on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="Lihat Katalog"
      />
    </div>
    <div>
      <label for="cta-link" class="block font-semibold text-base-content/80 mb-1">Link CTA</label>
      <input
        id="cta-link"
        type="text"
        value={section.props?.ctaLink ?? ''}
        on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="#catalog"
      />
    </div>
  </div>

  <div>
    <label for="tag-name" class="block font-semibold text-base-content/80 mb-1">HTML Tag Heading</label>
    <select
      id="tag-name"
      value={section.props?.tagName ?? 'h1'}
      on:change={(e) => handlePropChange('tagName', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-base-content focus:outline-none focus:border-blue-500"
    >
      <option value="h1">H1 (Primary Heading - SEO Optimal)</option>
      <option value="h2">H2 (Secondary Heading)</option>
    </select>
  </div>
</div>
