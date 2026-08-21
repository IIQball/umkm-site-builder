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
</script>

<div class="space-y-5">
  <SectionLayoutPanel {section} onStyleChange={handleStyleChange} />
  <SectionAppearancePanel {section} onStyleChange={handleStyleChange} />
</div>
