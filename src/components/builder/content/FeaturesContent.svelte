<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import {
    SHOWCASE_IMAGE_FEATURE_PRESETS,
    ITEM_IMAGE_FEATURE_PRESETS,
  } from '../sections/features/features.helpers';
  import ImageUploadDropzone from '../inspector/ImageUploadDropzone.svelte';
  import FeaturesComparisonContent from './features/FeaturesComparisonContent.svelte';
  import FeaturesRepeaterContent from './features/FeaturesRepeaterContent.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: layoutPreset = (section.layoutPreset || section.props?.layoutPreset || 'grid_3_cards') as string;
  $: isComparison = layoutPreset === 'before_after_comparison';
  $: isStickyScroll = layoutPreset === 'sticky_scroll_highlight';
  $: hasShowcaseImage = SHOWCASE_IMAGE_FEATURE_PRESETS.includes(layoutPreset);
  $: hasItemImages = ITEM_IMAGE_FEATURE_PRESETS.includes(layoutPreset);

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: ctaText = (section.props?.ctaText as string) ?? '';
  $: ctaLink = (section.props?.ctaLink as string) ?? '';
  $: mainImageUrl = (section.props?.mainImageUrl as string) ?? '';
</script>

<div class="space-y-4 text-left">
  <!-- Badge Section -->
  <div>
    <label for="feature-badge" class="block font-semibold text-xs text-base-content/80 mb-1">Badge / Tagline</label>
    <input
      id="feature-badge"
      type="text"
      value={badgeText}
      on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
      class="input input-bordered input-sm w-full"
      placeholder="Keunggulan Layanan Kami"
    />
  </div>

  <!-- Judul Section -->
  <div>
    <label for="feature-title" class="block font-semibold text-xs text-base-content/80 mb-1">Judul Section (Heading Utama)</label>
    <input
      id="feature-title"
      type="text"
      value={title}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="input input-bordered input-sm w-full"
      placeholder="Kenapa Memilih Produk UMKM Kami?"
    />
  </div>

  <!-- Subtitle Section -->
  <div>
    <label for="feature-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="feature-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="textarea textarea-bordered textarea-sm w-full resize-y"
      placeholder="Penjelasan ringkas keunggulan produk/layanan"></textarea>
  </div>

  <!-- CTA Buttons for Sticky Scroll Layout -->
  {#if isStickyScroll}
    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-base-200">
      <div>
        <label for="feature-cta-text" class="block font-semibold text-xs text-base-content/80 mb-1">Teks Tombol CTA</label>
        <input
          id="feature-cta-text"
          type="text"
          value={ctaText}
          on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
          class="input input-bordered input-sm w-full"
          placeholder="Hubungi Kami Langsung"
        />
      </div>
      <div>
        <label for="feature-cta-link" class="block font-semibold text-xs text-base-content/80 mb-1">Link CTA</label>
        <input
          id="feature-cta-link"
          type="text"
          value={ctaLink}
          on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
          class="input input-bordered input-sm w-full"
          placeholder="# atau https://..."
        />
      </div>
    </div>
  {/if}

  <!-- Showcase Image (Only for presets that have a section showcase image) -->
  {#if hasShowcaseImage}
    <div class="pt-2 border-t border-base-200">
      <ImageUploadDropzone
        imageUrl={mainImageUrl}
        onImageChange={(url) => handlePropChange('mainImageUrl', url)}
        label="Gambar Utama / Ilustrasi Showcase"
        placeholderTitle="Tarik & Lepas Gambar ke Sini"
        placeholderSubtitle="pilih berkas gambar manual"
      />
    </div>
  {/if}

  {#if isComparison}
    <FeaturesComparisonContent {section} {onUpdate} />
  {:else}
    <FeaturesRepeaterContent {section} {onUpdate} {hasItemImages} />
  {/if}
</div>
