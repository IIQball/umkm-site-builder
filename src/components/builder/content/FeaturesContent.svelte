<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import { IMAGE_SUPPORTED_FEATURE_PRESETS } from '../sections/features/features.helpers';
  import FeaturesComparisonContent from './features/FeaturesComparisonContent.svelte';
  import FeaturesRepeaterContent from './features/FeaturesRepeaterContent.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);

  $: layoutPreset = (section.layoutPreset || section.props?.layoutPreset || 'grid_3_cards') as string;
  $: isComparison = layoutPreset === 'before_after_comparison';
  $: hasImageSupport = IMAGE_SUPPORTED_FEATURE_PRESETS.includes(layoutPreset);

  $: badgeText = (section.props?.badgeText as string) ?? '';
  $: title = (section.props?.title as string) ?? '';
  $: subtitle = (section.props?.subtitle as string) ?? '';
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
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Keunggulan Layanan Kami"
    />
  </div>

  <!-- Judul Section -->
  <div>
    <label for="feature-title" class="block font-semibold text-xs text-base-content/80 mb-1">Judul Section (Heading)</label>
    <input
      id="feature-title"
      type="text"
      value={title}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
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
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Penjelasan ringkas keunggulan produk/layanan"
    />
  </div>

  {#if isComparison}
    <FeaturesComparisonContent {section} {onUpdate} />
  {:else}
    <FeaturesRepeaterContent {section} {onUpdate} {hasImageSupport} />
  {/if}
</div>
