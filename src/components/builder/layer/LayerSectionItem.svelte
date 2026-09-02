<script lang="ts">
  import { ChevronUp, ChevronDown, ChevronRight, Trash2, Plus, Layers } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import { getSectionNodes, sectionTypeLabels, sectionTypeIcons } from './layerPanel.helpers';
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

  const moveHeroNode = (sec: TemplateSection, nodeId: string, direction: 'up' | 'down') => {
    const order =
      Array.isArray(sec.props?.elementOrder) && sec.props.elementOrder.length > 0
        ? [...(sec.props.elementOrder as string[])]
        : ['badge', 'title', 'subtitle', 'image', 'cta'];
    const idx = order.indexOf(nodeId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const temp = order[idx];
    order[idx] = order[targetIdx];
    order[targetIdx] = temp;
    editorStore.updateSectionProps(sec.id, { elementOrder: order });
  };
</script>

<div class="flex flex-col space-y-0.5">
  <!-- Parent Section Row -->
  <div
    role="button"
    tabindex="0"
    on:click={() => onSelectNode(section.id, null)}
    on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectNode(section.id, null)}
    class={`group w-full flex items-center justify-between p-2 rounded-lg text-left transition-all border cursor-pointer ${
      isSectionSelected && !selectedNodeId
        ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
        : isSectionSelected
        ? 'bg-nested border-light text-main'
        : 'border-transparent text-secondary hover:bg-nested/60 hover:text-main'
    }`}
  >
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <button
        type="button"
        on:click|stopPropagation={() => onToggleExpand(section.id)}
        class="p-0.5 text-muted hover:text-main rounded cursor-pointer transition-transform"
        title={isExpanded ? 'Collapse' : 'Expand'}
      >
        <svelte:component this={isExpanded ? ChevronDown : ChevronRight} size={13} />
      </button>
      <svelte:component
        this={sectionTypeIcons[section.type] || Layers}
        size={14}
        class={isSectionSelected ? 'text-primary' : 'text-muted'}
      />
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold truncate">{sectionTypeLabels[section.type] || section.type}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0">
      <button
        type="button"
        on:click|stopPropagation={() => onReorderSection(section.id, 'up')}
        disabled={index === 0}
        class="p-1 hover:bg-nested rounded text-muted hover:text-main disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
        title="Pindah ke Atas"
      >
        <ChevronUp size={13} />
      </button>
      <button
        type="button"
        on:click|stopPropagation={() => onReorderSection(section.id, 'down')}
        disabled={index === totalSections - 1}
        class="p-1 hover:bg-nested rounded text-muted hover:text-main disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
        title="Pindah ke Bawah"
      >
        <ChevronDown size={13} />
      </button>
      <button
        type="button"
        on:click|stopPropagation={() => onDeleteSection(section.id)}
        class="p-1 hover:bg-error/10 rounded text-muted hover:text-error cursor-pointer"
        title="Hapus Section"
      >
        <Trash2 size={13} />
      </button>
    </div>
  </div>

  <!-- Nested Child Nodes -->
  {#if isExpanded}
    <div class="ml-5 pl-2.5 border-l border-light space-y-0.5 py-0.5">
      {#each nodes as node, nodeIdx (node.id)}
        {@const isNodeSelected = isSectionSelected && selectedNodeId === node.id}
        <div
          role="button"
          tabindex="0"
          on:click|stopPropagation={() => onSelectNode(section.id, node.id)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectNode(section.id, node.id)}
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
            <span class="truncate text-3xs">{node.name}</span>
          </div>

          <div class="flex items-center gap-0.5 opacity-0 group-hover/node:opacity-100 transition-opacity">
            {#if section.type === 'hero'}
              <button
                type="button"
                on:click|stopPropagation={() => moveHeroNode(section, node.id, 'up')}
                disabled={nodeIdx === 0}
                class="p-0.5 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke Atas"
              >
                <ChevronUp size={11} />
              </button>
              <button
                type="button"
                on:click|stopPropagation={() => moveHeroNode(section, node.id, 'down')}
                disabled={nodeIdx === nodes.length - 1}
                class="p-0.5 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke Bawah"
              >
                <ChevronDown size={11} />
              </button>
            {/if}
            <button
              type="button"
              on:click|stopPropagation={() => editorStore.deleteNode(section.id, node.id)}
              class="p-0.5 hover:text-error text-muted transition-colors cursor-pointer"
              title="Hapus Elemen"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      {/each}

      <!-- Add Element button -->
      <div class="pt-1">
        <button
          type="button"
          on:click|stopPropagation={() => onToggleAddNodeDropdown(section.id)}
          class="w-full flex items-center justify-center gap-1 py-1 text-3xs font-semibold text-muted hover:text-primary bg-nested/50 hover:bg-nested rounded border border-dashed border-light transition-colors cursor-pointer"
        >
          <Plus size={11} />
          <span>Tambah Elemen</span>
        </button>

        {#if openAddNodeDropdown === section.id}
          <AddNodeDropdown {section} onClose={() => onToggleAddNodeDropdown(section.id)} />
        {/if}
      </div>
    </div>
  {/if}
</div>
