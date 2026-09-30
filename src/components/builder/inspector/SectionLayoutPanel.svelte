<script lang="ts">
  import type { TemplateSection } from '@/schemas';
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
  <!-- Spacing (Padding & Margin) -->
  <SectionSpacingControls
    {section}
    {onStyleChange}
    {applyStyles}
  />
</div>
