<script lang="ts">
  import { Sparkles } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { getNodeLabel } from './nodeContent.constants';
  import AnnouncementNodeForm from './node-forms/AnnouncementNodeForm.svelte';
  import LogoNodeForm from './node-forms/LogoNodeForm.svelte';
  import NavLinksNodeForm from './node-forms/NavLinksNodeForm.svelte';
  import HeroElementNodeForms from './node-forms/HeroElementNodeForms.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};
</script>

<div class="p-4 space-y-4 text-xs text-base-content/80">
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1 mb-2">
    <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
      <Sparkles size={13} />
      <span>Edit Konten: {getNodeLabel(nodeId)}</span>
    </div>
    <p class="text-[11px] text-base-content/60">
      Atur konten dan styling token elemen secara presisi pada 8pt grid.
    </p>
  </div>

  {#if nodeId === 'announcement'}
    <AnnouncementNodeForm {section} {onPropChange} />
  {:else if nodeId === 'logo'}
    <LogoNodeForm {section} {onPropChange} />
  {:else if nodeId === 'nav_links'}
    <NavLinksNodeForm {section} {onPropChange} {onSectionUpdate} />
  {:else}
    <HeroElementNodeForms {section} {nodeId} {onPropChange} />
  {/if}
</div>