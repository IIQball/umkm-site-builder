<script lang="ts">
  import { Plus, Layers, PanelLeftClose } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { Button } from '@/components/ui';
  import { canvasStore } from './stores/editorStore';
  import { sectionTypeLabels, sectionTypeIcons, sectionTypes } from './layer/layerPanel.helpers';
  import LayerSectionItem from './layer/LayerSectionItem.svelte';

  export let sections: TemplateSection[] = [];
  export let selectedSectionId: string | null = null;
  export let selectedNodeId: string | null = null;
  export let onSelectNode: (sectionId: string, nodeId: string | null) => void;
  export let onAddSection: (type: TemplateSection['type']) => void;
  export let onDeleteSection: (id: string) => void;
  export let onReorderSection: (id: string, direction: 'up' | 'down') => void;

  let isAddMenuOpen = false;
  let expandedSections: Record<string, boolean> = {};
  let openAddNodeDropdown: string | null = null;

  $: {
    if (selectedSectionId && expandedSections[selectedSectionId] === undefined) {
      expandedSections[selectedSectionId] = true;
    }
  }

  const toggleExpand = (id: string) => {
    expandedSections[id] = !expandedSections[id];
  };

  const handleAdd = (type: TemplateSection['type']) => {
    onAddSection(type);
    isAddMenuOpen = false;
  };
</script>

<aside class="w-80 flex-shrink-0 bg-card border-r border-light flex flex-col h-full overflow-hidden text-main transition-colors">
  <!-- Header with Title, Add Section & Close Button -->
  <div class="p-3 border-b border-light flex items-center justify-between gap-1.5">
    <div class="flex items-center gap-2 text-main min-w-0 flex-1">
      <Layers size={16} class="text-primary flex-shrink-0" />
      <span class="text-label-caps text-main truncate">Lapisan ({sections.length})</span>
    </div>

    <div class="flex items-center gap-1 flex-shrink-0">
      <!-- Add Section Dropdown -->
      <div class="relative">
        <Button
          type="button"
          size="xs"
          variant="secondary"
          on:click={() => (isAddMenuOpen = !isAddMenuOpen)}
          class="!px-2 !py-1 !h-auto !min-h-0 text-xs font-semibold text-main bg-nested hover:bg-nested/80 rounded-md border border-light"
        >
          <Plus size={13} />
          <span>Tambah</span>
        </Button>

        {#if isAddMenuOpen}
          <button
            type="button"
            class="fixed inset-0 z-40 cursor-default bg-transparent w-full h-full border-none outline-none"
            on:click={() => (isAddMenuOpen = false)}
            aria-label="Tutup menu tambah"></button>
          <div class="absolute right-0 mt-1 w-56 bg-card border border-light rounded-lg shadow-xl py-1 z-50 overflow-hidden text-main">
            <div class="px-3 py-1.5 text-xs font-semibold text-muted uppercase tracking-caps border-b border-light">
              Pilih Komponen Seksi
            </div>
            {#each sectionTypes as type}
              <Button
                type="button"
                variant="ghost"
                size="xs"
                on:click={() => handleAdd(type)}
                class="!w-full !px-3 !py-2 !h-auto !min-h-0 !justify-start text-left text-xs text-secondary hover:bg-primary/10 hover:text-primary gap-2.5 rounded-none"
              >
                <svelte:component this={sectionTypeIcons[type]} size={14} class="text-muted" />
                <span>{sectionTypeLabels[type]}</span>
              </Button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Close Left Sidebar Button -->
      <Button
        type="button"
        size="xs"
        variant="ghost"
        on:click={() => canvasStore.toggleLeftSidebar()}
        class="!p-1 !h-7 !w-7 !min-h-0 !min-w-0 rounded-md text-muted hover:text-main hover:bg-nested"
        title="Tutup Panel Lapisan (Ctrl+\)"
      >
        <PanelLeftClose size={15} />
      </Button>
    </div>
  </div>

  <!-- Section & Node Tree -->
  <div class="flex-1 overflow-y-auto p-2 space-y-1">
    {#if sections.length === 0}
      <div class="p-4 text-center text-xs text-muted">
        Belum ada seksi pada halaman. Klik tombol Tambah di atas.
      </div>
    {:else}
      {#each sections as section, index (section.id)}
        <LayerSectionItem
          {section}
          {index}
          totalSections={sections.length}
          isSectionSelected={selectedSectionId === section.id}
          {selectedNodeId}
          isExpanded={!!expandedSections[section.id]}
          {openAddNodeDropdown}
          onToggleExpand={toggleExpand}
          {onSelectNode}
          {onReorderSection}
          {onDeleteSection}
          onToggleAddNodeDropdown={(id) => (openAddNodeDropdown = openAddNodeDropdown === id ? null : id)}
        />
      {/each}
    {/if}
  </div>
</aside>
