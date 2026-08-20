<script lang="ts">
  import type { TemplateSection } from '@/schemas/template.schema';
  import HeaderAnnouncementPanel from './header/HeaderAnnouncementPanel.svelte';
  import HeaderLogoPanel from './header/HeaderLogoPanel.svelte';
  import HeaderNavPanel from './header/HeaderNavPanel.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  const handleHeaderConfigChange = (key: string, value: unknown) => {
    onUpdate({
      ...section,
      props: { ...(section.props || {}), [key]: value },
    });
  };
</script>

<div class="space-y-4">
  <HeaderAnnouncementPanel {section} onConfigChange={handleHeaderConfigChange} />
  <HeaderLogoPanel {section} onConfigChange={handleHeaderConfigChange} />
  <HeaderNavPanel {section} onConfigChange={handleHeaderConfigChange} />
</div>
