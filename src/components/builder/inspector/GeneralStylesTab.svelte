<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import SectionLayoutPanel from './SectionLayoutPanel.svelte';
  import SectionAppearancePanel from './SectionAppearancePanel.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  const handleStyleChange = (key: string, value: string) => {
    onUpdate({
      ...section,
      styles: { ...(section.styles || {}), [key]: value || undefined },
    });
  };

  const handleStylesChange = (updates: Record<string, string | undefined>) => {
    const nextStyles = { ...(section.styles || {}) };
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === '') {
        delete nextStyles[k];
      } else {
        nextStyles[k] = v;
      }
    }
    onUpdate({
      ...section,
      styles: nextStyles,
    });
  };
</script>

<div class="space-y-5">
  <SectionLayoutPanel {section} onStyleChange={handleStyleChange} onStylesChange={handleStylesChange} />
  <SectionAppearancePanel {section} onStyleChange={handleStyleChange} />
</div>
