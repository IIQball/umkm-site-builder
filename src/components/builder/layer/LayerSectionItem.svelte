<script lang="ts">
  import { ChevronUp, ChevronDown, ChevronRight, Trash2, Plus, Layers } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import { getSectionNodes, sectionTypeLabels, sectionTypeIcons } from './layerPanel.helpers';
  import { scrollToCanvasElement } from '../canvas/canvasScroll.helpers';
  import AddNodeDropdown from './AddNodeDropdown.svelte';

  export let section: TemplateSection;
  export let index: number;
  export let totalSections: number;
  export let isSectionSelected: boolean;
  export let selectedNodeId: string | null;
  export let isExpanded: boolean;
  export let openAddNodeDropdown: string | null;
  export let onToggleExpand: (id: string) => void;
  export let onSelectNode: (sectionId: string, nodeId: string | null) => void;
  export let onReorderSection: (id: string, direction: 'up' | 'down') => void;
  export let onDeleteSection: (id: string) => void;
  export let onToggleAddNodeDropdown: (id: string) => void;

  $: nodes = getSectionNodes(section);

  const handleSelectSection = () => {
    onSelectNode(section.id, null);
    scrollToCanvasElement(section.id, null);
  };

  const handleSelectNode = (nodeId: string) => {
    onSelectNode(section.id, nodeId);
    scrollToCanvasElement(section.id, nodeId);
  };
</script>

<div class="flex flex-col space-y-0.5">
  <!-- Parent Section Row -->
  <div
    role="button"
    tabindex="0"
    on:click={handleSelectSection}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectSection()}
    class={`group w-full flex items-center justify-between p-2 rounded-lg text-left transition-all border cursor-pointer ${
      isSectionSelected && !selectedNodeId
        ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
        : isSectionSelected
        ? 'bg-nested border-light text-main'
        : 'border-transparent text-secondary hover:bg-nested/60 hover:text-main'
    }`}
  >
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        on:click={(e) => { e.stopPropagation(); onToggleExpand(section.id); }}
        class="!w-5 !h-5 !min-h-0 !p-0 text-muted hover:text-main"
        title={isExpanded ? 'Tutup Detail' : 'Buka Detail'}
      >
        <svelte:component this={isExpanded ? ChevronDown : ChevronRight} size={13} />
      </Button>
      <svelte:component
        this={sectionTypeIcons[section.type] || Layers}
        size={14}
        class={isSectionSelected ? 'text-primary' : 'text-muted'}
      />
      <div class="min-w-0 flex-1">
        <p
          class="text-xs font-semibold leading-snug whitespace-normal break-words"
          title={sectionTypeLabels[section.type] || section.type}
        >
          {sectionTypeLabels[section.type] || section.type}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity ml-1 flex-shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        on:click={(e) => { e.stopPropagation(); onReorderSection(section.id, 'up'); }}
        disabled={index === 0}
        class="!w-5 !h-5 !min-h-0 !p-0 hover:bg-nested text-muted hover:text-main disabled:opacity-20 disabled:hover:bg-transparent"
        title="Geser ke Atas"
      >
        <ChevronUp size={13} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        on:click={(e) => { e.stopPropagation(); onReorderSection(section.id, 'down'); }}
        disabled={index === totalSections - 1}
        class="!w-5 !h-5 !min-h-0 !p-0 hover:bg-nested text-muted hover:text-main disabled:opacity-20 disabled:hover:bg-transparent"
        title="Geser ke Bawah"
      >
        <ChevronDown size={13} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        on:click={(e) => { e.stopPropagation(); onDeleteSection(section.id); }}
        class="!w-5 !h-5 !min-h-0 !p-0 hover:bg-error/10 text-muted hover:text-error"
        title="Hapus Seksi"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  </div>

  <!-- Nested Child Nodes -->
  {#if isExpanded}
    <div class="ml-5 pl-2.5 border-l border-light space-y-0.5 py-0.5">
      {#each nodes as node (node.id)}
        {@const isNodeSelected = isSectionSelected && selectedNodeId === node.id}
        <div
          role="button"
          tabindex="0"
          on:click|stopPropagation={() => handleSelectNode(node.id)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectNode(node.id)}
          class={`group/node w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
            isNodeSelected
              ? 'bg-primary text-white font-semibold shadow-sm'
              : 'text-secondary hover:bg-nested/70 hover:text-main'
          }`}
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <svelte:component
              this={node.icon}
              size={12}
              class={isNodeSelected ? 'text-white' : 'text-muted'}
            />
            <span class="text-xs leading-snug whitespace-normal break-words" title={node.name}>{node.name}</span>
          </div>

          <div class="flex items-center gap-0.5 opacity-0 group-hover/node:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={(e) => { e.stopPropagation(); editorStore.deleteNode(section.id, node.id); }}
              class="!w-5 !h-5 !min-h-0 !p-0 hover:text-error text-muted"
              title="Hapus Elemen"
            >
              <Trash2 size={11} />
            </Button>
          </div>
        </div>
      {/each}

      <!-- Add Element button -->
      <div class="pt-1">
        <Button
          type="button"
          variant="outline"
          size="xs"
          on:click={(e) => { e.stopPropagation(); onToggleAddNodeDropdown(section.id); }}
          class="!w-full !flex !items-center !justify-center gap-1 !py-1 !h-auto !min-h-0 text-xs font-semibold text-muted hover:text-primary bg-nested/50 hover:bg-nested rounded border-dashed border-light"
        >
          <Plus size={11} />
          <span>Tambah Elemen</span>
        </Button>

        {#if openAddNodeDropdown === section.id}
          <AddNodeDropdown {section} onClose={() => onToggleAddNodeDropdown(section.id)} />
        {/if}
      </div>
    </div>
  {/if}
</div>
