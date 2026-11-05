<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { getNodeLabel } from './nodeContent.constants';
  import AnnouncementNodeForm from './header/AnnouncementNodeForm.svelte';
  import LogoNodeForm from './header/LogoNodeForm.svelte';
  import NavLinksNodeForm from './header/NavLinksNodeForm.svelte';
  import HeroNodeForms from './hero/HeroNodeForms.svelte';
  import FeatureHeadingNodeForm from './features/FeatureHeadingNodeForm.svelte';
  import FeatureItemNodeForm from './features/FeatureItemNodeForm.svelte';
  import FeatureImageNodeForm from './features/FeatureImageNodeForm.svelte';
  import FeaturesComparisonContent from './features/FeaturesComparisonContent.svelte';
  import FeaturesRepeaterContent from './features/FeaturesRepeaterContent.svelte';
  import CatalogNodeForms from './catalog/CatalogNodeForms.svelte';
  import TestimonialsNodeForms from './testimonials/TestimonialsNodeForms.svelte';
  import FaqNodeForms from './faq/FaqNodeForms.svelte';
  import MapsNodeForms from './maps/MapsNodeForms.svelte';
  import FooterNodeForms from './footer/FooterNodeForms.svelte';
  import {
    IMAGE_SUPPORTED_FEATURE_PRESETS,
    ITEM_IMAGE_FEATURE_PRESETS,
  } from '../sections/features/features.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'grid_3_cards') as string;
  $: hasFeatureImageSupport = IMAGE_SUPPORTED_FEATURE_PRESETS.includes(activePreset);
  $: hasItemImages = ITEM_IMAGE_FEATURE_PRESETS.includes(activePreset);
  $: isComparison = activePreset === 'before_after_comparison';

  const isFeatureHeadingSlot = (id: string) =>
    ['features_heading', 'header', 'badge', 'title', 'subtitle'].includes(id);

  const isFeatureRepeaterSlot = (id: string) =>
    [
      'feature_cards',
      'feature_rows',
      'ribbon_bar',
      'bento_spotlight',
      'bento_cards',
      'zigzag_items',
      'tab_nav',
      'tab_card',
      'accordion_list',
      'scroll_cards',
      'icon_matrix',
      'features_grid',
    ].includes(id);
</script>

<div class="p-4 space-y-4 text-xs text-base-content/80">
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1 mb-2">
    <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
      <Sparkles size={13} />
      <span>Edit Konten: {getNodeLabel(nodeId, section?.type, activePreset)}</span>
    </div>
    <p class="text-[11px] text-base-content/60">
      Atur konten dan styling token elemen secara presisi pada 8pt grid.
    </p>
  </div>

  {#if nodeId === 'announcement'}
    <AnnouncementNodeForm {section} {onPropChange} />
  {:else if nodeId === 'logo'}
    <LogoNodeForm {section} {onPropChange} />
  {:else if nodeId === 'nav_links'}
    <NavLinksNodeForm {section} {onPropChange} {onSectionUpdate} />
  {:else if section.type === 'features' && isFeatureHeadingSlot(nodeId)}
    <FeatureHeadingNodeForm {section} {nodeId} {onPropChange} />
  {:else if section.type === 'features' && (nodeId === 'features_image' || nodeId === 'image')}
    {#if hasFeatureImageSupport}
      <FeatureImageNodeForm {section} {onPropChange} />
    {:else}
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Preset tata letak ini tidak menggunakan ilustrasi gambar.
      </p>
    {/if}
  {:else if section.type === 'features' && nodeId === 'cta'}
    <div class="space-y-4 text-left">
      <div class="space-y-1">
        <label for="feat-cta-text" class="font-semibold text-xs text-base-content/80">Teks Tombol WhatsApp (CTA)</label>
        <input
          id="feat-cta-text"
          type="text"
          value={(section.props?.ctaText as string) || ''}
          on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
          placeholder="Hubungi Kami Langsung"
        />
      </div>
      <div class="space-y-1">
        <label for="feat-cta-link" class="font-semibold text-xs text-base-content/80">Link / Tujuan CTA</label>
        <input
          id="feat-cta-link"
          type="text"
          value={(section.props?.ctaLink as string) || ''}
          on:input={(e) => onPropChange('ctaLink', e.currentTarget.value)}
          class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs"
          placeholder="# atau https://..."
        />
      </div>
    </div>
  {:else if section.type === 'features' && (nodeId === 'before_card' || nodeId === 'after_card')}
    <FeaturesComparisonContent {section} onUpdate={onSectionUpdate} />
  {:else if section.type === 'features' && isFeatureRepeaterSlot(nodeId)}
    <FeaturesRepeaterContent {section} onUpdate={onSectionUpdate} {hasItemImages} />
  {:else if section.type === 'features' && (nodeId.startsWith('feature_item_') || nodeId.startsWith('item_'))}
    {#if isComparison}
      <FeaturesComparisonContent {section} onUpdate={onSectionUpdate} />
    {:else}
      <FeatureItemNodeForm {section} {nodeId} {onPropChange} />
    {/if}
  {:else if section.type === 'product_catalog'}
    <CatalogNodeForms {section} {nodeId} {onPropChange} />
  {:else if section.type === 'testimonials'}
    <TestimonialsNodeForms {section} {nodeId} {onPropChange} />
  {:else if section.type === 'faq'}
    <FaqNodeForms {section} {nodeId} {onPropChange} />
  {:else if section.type === 'google_maps'}
    <MapsNodeForms {section} {nodeId} {onPropChange} />
  {:else if section.type === 'footer'}
    <FooterNodeForms {section} {nodeId} {onPropChange} />
  {:else if section.type === 'hero'}
    <HeroNodeForms {section} {nodeId} {onPropChange} />
  {:else}
    <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
      Pilih elemen pada kanvas untuk mengedit kontennya.
    </p>
  {/if}
</div>