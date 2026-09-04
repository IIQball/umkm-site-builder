<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { getNodeLabel } from './nodeContent.constants';
  import AnnouncementNodeForm from './node-forms/AnnouncementNodeForm.svelte';
  import LogoNodeForm from './node-forms/LogoNodeForm.svelte';
  import NavLinksNodeForm from './node-forms/NavLinksNodeForm.svelte';
  import HeroElementNodeForms from './node-forms/HeroElementNodeForms.svelte';
  import FeatureHeadingNodeForm from './node-forms/FeatureHeadingNodeForm.svelte';
  import FeatureItemNodeForm from './node-forms/FeatureItemNodeForm.svelte';
  import FeatureImageNodeForm from './node-forms/FeatureImageNodeForm.svelte';
  import CatalogNodeForms from './node-forms/CatalogNodeForms.svelte';
  import TestimonialsNodeForms from './node-forms/TestimonialsNodeForms.svelte';
  import FaqNodeForms from './node-forms/FaqNodeForms.svelte';
  import MapsNodeForms from './node-forms/MapsNodeForms.svelte';
  import FooterNodeForms from './node-forms/FooterNodeForms.svelte';
  import { IMAGE_SUPPORTED_FEATURE_PRESETS } from '../sections/features/features.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: activePreset = (section.layoutPreset || section.props?.layoutPreset || section.styles?.layoutPreset || 'grid_3_cards') as string;
  $: hasFeatureImageSupport = IMAGE_SUPPORTED_FEATURE_PRESETS.includes(activePreset);
</script>

<div class="p-4 space-y-4 text-xs text-base-content/80">
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1 mb-2">
    <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
      <Sparkles size={13} />
      <span>Edit Konten: {getNodeLabel(nodeId)}</span>
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
  {:else if section.type === 'features' && (nodeId === 'features_heading' || nodeId === 'header')}
    <FeatureHeadingNodeForm {section} {onPropChange} />
  {:else if section.type === 'features' && (nodeId.startsWith('feature_item_') || nodeId.startsWith('item_'))}
    <FeatureItemNodeForm {section} {nodeId} {onPropChange} />
  {:else if section.type === 'features' && (nodeId === 'features_image' || nodeId === 'image')}
    {#if hasFeatureImageSupport}
      <FeatureImageNodeForm {section} {onPropChange} />
    {:else}
      <p class="text-xs text-base-content/60 italic p-3 bg-base-200/40 rounded-xl">
        Preset tata letak ini tidak menggunakan ilustrasi gambar.
      </p>
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
  {:else}
    <HeroElementNodeForms {section} {nodeId} {onPropChange} />
  {/if}
</div>