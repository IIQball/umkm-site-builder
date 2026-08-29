<script lang="ts">
  import { ChevronUp, ChevronDown, ChevronRight, Trash2, Plus, Layers, PanelLeftClose } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore, canvasStore } from './stores/editorStore';
  import { getSectionNodes, sectionTypeLabels, sectionTypeIcons, sectionTypes } from './layer/layerPanel.helpers';
  import AddNodeDropdown from './layer/AddNodeDropdown.svelte';

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

  const moveHeroNode = (section: TemplateSection, nodeId: string, direction: 'up' | 'down') => {
    const order =
      Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
        ? [...(section.props.elementOrder as string[])]
        : ['badge', 'title', 'subtitle', 'image', 'cta'];
    const idx = order.indexOf(nodeId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const temp = order[idx];
    order[idx] = order[targetIdx];
    order[targetIdx] = temp;
    editorStore.updateSectionProps(section.id, { elementOrder: order });
  };
</script>

<aside class="w-72 flex-shrink-0 bg-card border-r border-light flex flex-col h-full overflow-hidden text-main transition-colors">
  <!-- Header with Title, Add Section & Close Button -->
  <div class="p-3 border-b border-light flex items-center justify-between gap-1.5">
    <div class="flex items-center gap-2 text-main min-w-0 flex-1">
      <Layers size={16} class="text-primary flex-shrink-0" />
      <span class="text-label-caps text-main truncate">Layers ({sections.length})</span>
    </div>

    <div class="flex items-center gap-1 flex-shrink-0">
      <!-- Add Section Dropdown -->
      <div class="relative">
        <button
          type="button"
          on:click={() => (isAddMenuOpen = !isAddMenuOpen)}
          class="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-main bg-nested hover:bg-nested/80 rounded-md border border-light transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Tambah</span>
        </button>

      {#if isAddMenuOpen}
        <button
          type="button"
          class="fixed inset-0 z-40 cursor-default bg-transparent w-full h-full border-none outline-none"
          on:click={() => (isAddMenuOpen = false)}
          aria-label="Close menu"
        />
        <div class="absolute right-0 mt-1 w-56 bg-card border border-light rounded-lg shadow-xl py-1 z-50 overflow-hidden text-main">
          <div class="px-3 py-1.5 text-3xs font-semibold text-muted uppercase tracking-caps border-b border-light">
            Pilih Tipe Section
          </div>
          {#each sectionTypes as type}
            <button
              type="button"
              on:click={() => handleAdd(type)}
              class="w-full px-3 py-2 text-left text-xs text-secondary hover:bg-primary/10 hover:text-primary flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <svelte:component this={sectionTypeIcons[type]} size={14} class="text-muted" />
              <span>{sectionTypeLabels[type]}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Close Left Sidebar Button -->
    <button
      type="button"
      on:click={() => canvasStore.toggleLeftSidebar()}
      class="p-1 rounded-md text-muted hover:text-main hover:bg-nested border border-transparent hover:border-light transition-colors cursor-pointer"
      title="Tutup Sidebar Kiri (Ctrl+\)"
      aria-label="Tutup Sidebar Kiri"
    >
      <PanelLeftClose size={15} />
    </button>
  </div>
</div>

  <!-- Section & Node Tree -->
  <div class="flex-1 overflow-y-auto p-2 space-y-1">
    {#if sections.length === 0}
      <div class="p-4 text-center text-xs text-muted">
        Belum ada section. Klik tombol Tambah di atas.
      </div>
    {:else}
      {#each sections as section, index (section.id)}
        {@const isSectionSelected = selectedSectionId === section.id}
        {@const isExpanded = !!expandedSections[section.id]}
        {@const nodes = getSectionNodes(section)}

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
                on:click|stopPropagation={() => toggleExpand(section.id)}
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
                disabled={index === sections.length - 1}
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
                  on:click|stopPropagation={() => {
                    openAddNodeDropdown = openAddNodeDropdown === section.id ? null : section.id;
                  }}
                  class="w-full flex items-center justify-center gap-1 py-1 text-3xs font-semibold text-muted hover:text-primary bg-nested/50 hover:bg-nested rounded border border-dashed border-light transition-colors cursor-pointer"
                >
                  <Plus size={11} />
                  <span>Tambah Elemen</span>
                </button>

                {#if openAddNodeDropdown === section.id}
                  <AddNodeDropdown {section} onClose={() => (openAddNodeDropdown = null)} />
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</aside>
