<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import CatalogStylesTab from './inspector/CatalogStylesTab.svelte';
  import HeaderStylesTab from './inspector/HeaderStylesTab.svelte';
  import GeneralStylesTab from './inspector/GeneralStylesTab.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: isCatalog = section?.type === 'product_catalog';
  $: isHeader = section?.type === 'header_announcement';
</script>

<div class="p-4 space-y-5 text-xs text-base-content/80">
  {#if isCatalog}
    <CatalogStylesTab {section} {onUpdate} />
  {:else if isHeader}
    <HeaderStylesTab {section} {onUpdate} />
  {/if}
  <GeneralStylesTab {section} {onUpdate} />
</div>
