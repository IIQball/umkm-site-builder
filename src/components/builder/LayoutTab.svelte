<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import SectionPresetSelector from './inspector/SectionPresetSelector.svelte';
  import SectionSlotReorder from './inspector/SectionSlotReorder.svelte';

  export let section: TemplateSection;
</script>

<div class="p-4 space-y-6 text-xs text-base-content/80">
  <SectionPresetSelector {section} />
  <SectionSlotReorder {section} />
</div>
