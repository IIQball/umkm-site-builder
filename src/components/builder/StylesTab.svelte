<script lang="ts">
  import type { TemplateSection } from '@/schemas/template.schema';
  import CatalogStylesTab from './inspector/CatalogStylesTab.svelte';
  import GeneralStylesTab from './inspector/GeneralStylesTab.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: isCatalog = section?.type === 'product_catalog';
</script>

<div class="p-4 space-y-5 text-xs text-base-content/80">
  {#if isCatalog}
    <CatalogStylesTab {section} {onUpdate} />
  {/if}
  <GeneralStylesTab {section} {onUpdate} />
</div>
