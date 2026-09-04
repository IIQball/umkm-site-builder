<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { getSectionDefinition } from './registry';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: sectionDef = getSectionDefinition(section?.type);
</script>

<div class="p-4 space-y-4 text-xs">
  {#if sectionDef?.inspectorComponent}
    <svelte:component this={sectionDef.inspectorComponent} {section} {onUpdate} />
  {/if}
</div>
