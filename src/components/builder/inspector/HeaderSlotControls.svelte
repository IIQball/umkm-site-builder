<script lang="ts">
  import { Layers, Trash2, Plus } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import { getSectionNodes } from '../layer/layerPanel.helpers';
  import { getHeaderSupportedSlots } from '../sections/header/headerLayout.helpers';

  export let section: TemplateSection;
  export let preset: string;

  $: activeNodes = getSectionNodes(section);
  $: supportedSlots = getHeaderSupportedSlots(preset);

  const isTopBarId = (id: string) =>
    ['announcement', 'announcement_bar', 'contact_bar', 'delivery_bar', 'countdown_bar'].includes(id);

  $: missingSlots = supportedSlots.filter((slot) => {
    if (isTopBarId(slot.id)) {
      return !activeNodes.some((n) => isTopBarId(n.id));
    }
    return !activeNodes.some((n) => n.id === slot.id);
  });

  const handleDeleteNode = (nodeId: string) => {
    editorStore.deleteNode(section.id, nodeId);
  };

  const handleAddSlot = (slotId: string) => {
    editorStore.addNode(section.id, slotId);
  };
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between border-b border-base-200 pb-1.5">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
      <Layers size={13} class="text-[var(--theme-primary, var(--color-primary))]" />
      <span>Elemen Section</span>
    </div>
    <span class="badge badge-ghost badge-xs font-mono font-semibold">
      {activeNodes.length} Elemen
    </span>
  </div>

  <div class="space-y-1.5">
    {#each activeNodes as node (node.id)}
      <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 border border-base-300 text-xs">
        <span class="font-medium text-base-content">{node.name}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          on:click={() => handleDeleteNode(node.id)}
          class="!w-6 !h-6 !min-h-0 !p-0 text-base-content/40 hover:text-error hover:bg-error/10"
          title="Hapus Elemen"
          aria-label="Hapus Elemen"
        >
          <Trash2 size={12} />
        </Button>
      </div>
    {/each}

    {#if missingSlots.length > 0}
      <div class="flex flex-wrap gap-1 pt-1">
        {#each missingSlots as slot (slot.id)}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            on:click={() => handleAddSlot(slot.id)}
            class="!h-auto !min-h-0 !py-1 !px-2 border border-dashed border-primary/40 text-primary hover:bg-primary/10 gap-1 font-semibold"
          >
            <Plus size={10} />
            <span>Tambah {slot.name}</span>
          </Button>
        {/each}
      </div>
    {/if}
  </div>
</div>
