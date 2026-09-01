<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import SectionPresetSelector from './SectionPresetSelector.svelte';
  import SectionSlotReorder from './SectionSlotReorder.svelte';
  import SectionSpacingControls from './SectionSpacingControls.svelte';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;
  export let onStylesChange: ((updates: Record<string, string | undefined>) => void) | undefined = undefined;

  const applyStyles = (updates: Record<string, string | undefined>) => {
    if (onStylesChange) {
      onStylesChange(updates);
    } else {
      for (const [k, v] of Object.entries(updates)) {
        onStyleChange(k, v || '');
      }
    }
  };
</script>

<div class="space-y-6">
  <!-- 1. Layout Preset Selector -->
  <SectionPresetSelector {section} />

  <!-- 2. Slot Reorder (Up / Down) -->
  <SectionSlotReorder {section} />

  <!-- 3 & 4. Container Width & Spacing -->
  <SectionSpacingControls
    {section}
    {onStyleChange}
    {applyStyles}
  />
</div>
