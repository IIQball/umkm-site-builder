<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import { getEffectiveFooterElementOrder } from '../sections/footer/footerLayout.helpers';
  import FooterNodeForms from '../inspector/node-forms/FooterNodeForms.svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: activePreset =
    (section.layoutPreset as string) ||
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    'multi_column';
  $: elementOrder = getEffectiveFooterElementOrder(
    activePreset,
    section.props?.elementOrder as string[] | undefined
  );
</script>

<div class="space-y-4">
  {#each elementOrder as slot (slot)}
    <div class="p-3 bg-base-200/30 border border-base-200 rounded-xl space-y-3">
      <FooterNodeForms {section} nodeId={slot} onPropChange={handlePropChange} />
    </div>
  {/each}
</div>
