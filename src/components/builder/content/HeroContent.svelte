<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import HeroImageUploadContent from './hero/HeroImageUploadContent.svelte';
  import HeroCtaLinkSelect from './hero/HeroCtaLinkSelect.svelte';
  import {
    supportsHeroImage,
    supportsHeroCta,
    supportsHeroBadge,
  } from '../sections/hero/heroLayout.helpers';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: preset =
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    section.layoutPreset ||
    'split_left_text';

  $: supportsImage = supportsHeroImage(preset);
  $: supportsCta = supportsHeroCta(preset);
  $: supportsBadge = supportsHeroBadge(preset);

  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
</script>

<div class="space-y-4">
  <!-- Lencana Promo (Badge) - Hanya jika didukung layout -->
  {#if supportsBadge}
    <div>
      <label for="hero-badge" class="block font-semibold text-xs text-base-content/80 mb-1">
        Lencana Promo (Badge)
      </label>
      <input
        id="hero-badge"
        type="text"
        value={section.props?.badgeText ?? ''}
        on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
        class="input input-bordered input-sm w-full"
        placeholder="Promo Spesial UMKM"
      />
    </div>
  {/if}

  <!-- Judul Utama (H1) -->
  <div>
    <label for="hero-title" class="block font-semibold text-xs text-base-content/80 mb-1">
      Judul Utama (H1)
    </label>
    <input
      id="hero-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="input input-bordered input-sm w-full"
      placeholder="Selamat datang di toko kami"
    />
  </div>

  <!-- Subjudul / Deskripsi -->
  <div>
    <label for="hero-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">
      Subjudul / Deskripsi
    </label>
    <textarea
      id="hero-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="textarea textarea-bordered textarea-sm w-full resize-y"
      placeholder="Produk berkualitas dengan harga terjangkau dan pelayanan terpercaya."
    ></textarea>
  </div>

  <!-- Panel Upload Gambar Spanduk / Background - Hanya jika didukung layout -->
  {#if supportsImage}
    <HeroImageUploadContent
      {imageUrl}
      onPropChange={handlePropChange}
    />
  {/if}

  <!-- Tombol Aksi (CTA) - Hanya jika didukung layout -->
  {#if supportsCta}
    <div class="space-y-2.5 pt-1">
      <div>
        <label for="cta-text" class="block font-semibold text-xs text-base-content/80 mb-1">
          Teks Tombol Aksi (CTA)
        </label>
        <input
          id="cta-text"
          type="text"
          value={section.props?.ctaText ?? ''}
          on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
          class="input input-bordered input-sm w-full"
          placeholder="Lihat Katalog"
        />
      </div>
      <div>
        <HeroCtaLinkSelect
          value={(section.props?.ctaLink as string) || '#produk'}
          onChange={(val) => handlePropChange('ctaLink', val)}
        />
      </div>
    </div>
  {/if}

  <!-- Pengaturan Tinggi Section Canvas (8pt Grid) -->
  <div class="pt-3 border-t border-base-300 dark:border-slate-800">
    <span class="block font-semibold text-xs text-base-content/80 mb-1">
      Tinggi Minimum Spanduk (Grid 8pt)
    </span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      {#each [
        { label: '480px', value: '480px' },
        { label: '560px', value: '560px' },
        { label: '640px', value: '640px' },
        { label: 'Otomatis', value: 'auto' },
      ] as h}
        <button
          type="button"
          on:click={() =>
            onUpdate({
              ...section,
              styles: {
                ...(section.styles || {}),
                minHeight: h.value,
              },
            })}
          class={`py-1.5 rounded font-medium transition-colors cursor-pointer text-center ${
            (section.styles?.minHeight || 'auto') === h.value
              ? 'bg-base-100 text-primary font-bold shadow-sm'
              : 'text-base-content/60'
          }`}
        >
          {h.label}
        </button>
      {/each}
    </div>
    <span class="block text-[10.5px] text-base-content/50 mt-1">
      Semua elemen tetap terpusat di tengah secara vertikal saat tinggi ditambah.
    </span>
  </div>
</div>