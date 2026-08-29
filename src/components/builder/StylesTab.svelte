<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import GeneralStylesTab from './inspector/GeneralStylesTab.svelte';
  import { getSectionDefinition } from './registry';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: sectionDef = getSectionDefinition(section?.type);
</script>

<div class="p-4 space-y-5 text-xs text-base-content/80">
  {#if sectionDef?.stylesComponent}
    <svelte:component this={sectionDef.stylesComponent} {section} {onUpdate} />
  {/if}
  <GeneralStylesTab {section} {onUpdate} />
</div>
