<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import CatalogGridPanel from './CatalogGridPanel.svelte';
  import CatalogCardPanel from './CatalogCardPanel.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  const handleCatalogConfigChange = (key: string, value: unknown) => {
    onUpdate({
      ...section,
      styles: { ...(section.styles || {}), [key]: value },
      props: { ...(section.props || {}), [key]: value },
    });
  };
</script>

<div class="space-y-4">
  <CatalogGridPanel {section} onConfigChange={handleCatalogConfigChange} />
  <CatalogCardPanel {section} onConfigChange={handleCatalogConfigChange} />
</div>
