<script lang="ts">
  import type { ComponentType } from 'svelte';
  import {
    ChevronUp,
    ChevronDown,
    ChevronRight,
    Trash2,
    Plus,
    Layers,
    Megaphone,
    Sparkles,
    CheckCircle,
    ShoppingBag,
    MessageSquare,
    HelpCircle,
    PanelBottom,
    Heading,
    FileText,
    Image,
    MousePointerClick,
    ListFilter,
  } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas/template.schema';
  import type {
    LayerNodeItem,
    FeatureItem,
    ProductItem,
    TestimonialItem,
    FAQItem,
  } from '@/types/builder';
  import { editorStore } from './stores/editorStore';

  export let sections: TemplateSection[] = [];
  export let selectedSectionId: string | null = null;
  export let selectedNodeId: string | null = null;
  export let onSelectNode: (sectionId: string, nodeId: string | null) => void;
  export let onAddSection: (type: TemplateSection['type']) => void;
  export let onDeleteSection: (id: string) => void;
  export let onReorderSection: (id: string, direction: 'up' | 'down') => void;

  const sectionTypeLabels: Record<TemplateSection['type'], string> = {
    header_announcement: 'Header & Announcement',
    hero: 'Hero Banner',
    features: 'Fitur & Keunggulan',
    product_catalog: 'Katalog Produk',
    testimonials: 'Testimoni Pelanggan',
    faq: 'FAQ (Tanya Jawab)',
    footer: 'Footer & Kontak',
  };

  const sectionTypeIcons: Record<TemplateSection['type'], ComponentType> = {
    header_announcement: Megaphone,
    hero: Sparkles,
    features: CheckCircle,
    product_catalog: ShoppingBag,
    testimonials: MessageSquare,
    faq: HelpCircle,
    footer: PanelBottom,
  };

  const sectionTypes: TemplateSection['type'][] = [
    'header_announcement',
    'hero',
    'features',
    'product_catalog',
    'testimonials',
    'faq',
    'footer',
  ];

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

  const getSectionNodes = (section: TemplateSection): LayerNodeItem[] => {
    switch (section.type) {
      case 'header_announcement': {
        const list: LayerNodeItem[] = [];
        if (section.props?.announcementText !== undefined && section.props?.announcementText !== '') {
          list.push({ id: 'announcement', name: 'Announcement Bar', icon: Megaphone });
        }
        const navs = Array.isArray(section.props?.navLinks) ? (section.props.navLinks as string[]) : [];
        navs.forEach((link: string, idx: number) => {
          list.push({ id: `nav_${idx}`, name: `Nav: ${link}`, icon: ListFilter });
        });
        return list;
      }
      case 'hero': {
        const order = Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
          ? (section.props.elementOrder as string[])
          : ['badge', 'title', 'subtitle', 'image', 'cta'];
        const map: Record<string, LayerNodeItem> = {
          badge: { id: 'badge', name: 'Promo Badge', icon: Sparkles },
          title: { id: 'title', name: 'Heading Title', icon: Heading },
          subtitle: { id: 'subtitle', name: 'Subtitle Description', icon: FileText },
          image: { id: 'image', name: 'Banner Image', icon: Image },
          cta: { id: 'cta', name: 'Action Button', icon: MousePointerClick },
        };
        return order.map((k: string) => map[k] || { id: k, name: k, icon: Sparkles });
      }
      case 'features': {
        const list: LayerNodeItem[] = [{ id: 'header', name: 'Section Header', icon: Heading }];
        const items = Array.isArray(section.props?.features) ? (section.props.features as FeatureItem[]) : [];
        items.forEach((item: FeatureItem, idx: number) => {
          list.push({ id: `item_${idx}`, name: item.title || `Fitur #${idx + 1}`, icon: CheckCircle });
        });
        return list;
      }
      case 'product_catalog': {
        const list: LayerNodeItem[] = [{ id: 'header', name: 'Catalog Header', icon: Heading }];
        const items = Array.isArray(section.props?.products) ? (section.props.products as ProductItem[]) : [];
        items.forEach((item: ProductItem, idx: number) => {
          list.push({ id: `item_${idx}`, name: item.name || `Produk #${idx + 1}`, icon: ShoppingBag });
        });
        return list;
      }
      case 'testimonials': {
        const list: LayerNodeItem[] = [{ id: 'header', name: 'Testimonial Header', icon: Heading }];
        const items = Array.isArray(section.props?.testimonials) ? (section.props.testimonials as TestimonialItem[]) : [];
        items.forEach((item: TestimonialItem, idx: number) => {
          list.push({ id: `item_${idx}`, name: item.customerName || `Review #${idx + 1}`, icon: MessageSquare });
        });
        return list;
      }
      case 'faq': {
        const list: LayerNodeItem[] = [{ id: 'header', name: 'FAQ Header', icon: Heading }];
        const items = Array.isArray(section.props?.faqs) ? (section.props.faqs as FAQItem[]) : [];
        items.forEach((item: FAQItem, idx: number) => {
          list.push({ id: `item_${idx}`, name: item.question || `FAQ #${idx + 1}`, icon: HelpCircle });
        });
        return list;
      }
      case 'footer':
        return [
          { id: 'whatsapp', name: 'WhatsApp Contact', icon: MessageSquare },
          { id: 'address', name: 'Store Location', icon: PanelBottom },
          { id: 'info', name: 'Information Links', icon: ListFilter },
          { id: 'copyright', name: 'Copyright Text', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const moveHeroNode = (section: TemplateSection, nodeId: string, direction: 'up' | 'down') => {
    const order = Array.isArray(section.props?.elementOrder) && section.props.elementOrder.length > 0
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

<aside class="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden">
  <!-- Header -->
  <div class="p-3 border-b border-slate-800 flex items-center justify-between">
    <div class="flex items-center gap-2 text-slate-200">
      <Layers size={16} class="text-blue-400" />
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Tree Layers ({sections.length})</span>
    </div>

    <!-- Add Section Button / Dropdown -->
    <div class="relative">
      <button
        type="button"
        on:click={() => (isAddMenuOpen = !isAddMenuOpen)}
        class="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors cursor-pointer"
      >
        <Plus size={14} />
        <span>Tambah</span>
      </button>

      {#if isAddMenuOpen}
        <!-- Backdrop -->
        <button
          type="button"
          class="fixed inset-0 z-40 cursor-default bg-transparent w-full h-full border-none outline-none"
          on:click={() => (isAddMenuOpen = false)}
          aria-label="Close menu"
        />

        <div class="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 overflow-hidden">
          <div class="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            Pilih Tipe Section
          </div>
          {#each sectionTypes as type}
            <button
              type="button"
              on:click={() => handleAdd(type)}
              class="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-blue-600/20 hover:text-blue-300 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <svelte:component this={sectionTypeIcons[type]} size={14} class="text-slate-400" />
              <span>{sectionTypeLabels[type]}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Section & Nested Node Tree List -->
  <div class="flex-1 overflow-y-auto p-2 space-y-1">
    {#if sections.length === 0}
      <div class="p-4 text-center text-xs text-slate-500">
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
                ? 'bg-blue-600/15 border-blue-500/50 text-blue-200 shadow-sm'
                : isSectionSelected
                ? 'bg-slate-800/40 border-slate-700/50 text-slate-200'
                : 'border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
            }`}
          >
            <!-- Left: Toggle Chevron, Icon & Name -->
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                on:click|stopPropagation={() => toggleExpand(section.id)}
                class="p-0.5 text-slate-400 hover:text-slate-200 rounded cursor-pointer transition-transform"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svelte:component this={isExpanded ? ChevronDown : ChevronRight} size={13} />
              </button>

              <svelte:component
                this={sectionTypeIcons[section.type] || Layers}
                size={14}
                class={isSectionSelected ? 'text-blue-400' : 'text-slate-400'}
              />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium truncate">
                  {sectionTypeLabels[section.type] || section.type}
                </p>
              </div>
            </div>

            <!-- Right: Actions (Reorder & Delete) -->
            <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0">
              <button
                type="button"
                on:click|stopPropagation={() => onReorderSection(section.id, 'up')}
                disabled={index === 0}
                class="p-1 hover:bg-slate-700/80 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke Atas"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                on:click|stopPropagation={() => onReorderSection(section.id, 'down')}
                disabled={index === sections.length - 1}
                class="p-1 hover:bg-slate-700/80 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                title="Pindah ke Bawah"
              >
                <ChevronDown size={13} />
              </button>
              <button
                type="button"
                on:click|stopPropagation={() => onDeleteSection(section.id)}
                class="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Hapus Section"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <!-- Nested Child Nodes Tree -->
          {#if isExpanded}
            <div class="ml-5 pl-2.5 border-l border-slate-800/80 space-y-0.5 py-0.5">
              {#each nodes as node, nodeIdx (node.id)}
                {@const isNodeSelected = isSectionSelected && selectedNodeId === node.id}
                <div
                  role="button"
                  tabindex="0"
                  on:click|stopPropagation={() => onSelectNode(section.id, node.id)}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectNode(section.id, node.id)}
                  class={`group/node w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                    isNodeSelected
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    <svelte:component
                      this={node.icon}
                      size={12}
                      class={isNodeSelected ? 'text-white' : 'text-slate-500'}
                    />
                    <span class="truncate text-[11px]">{node.name}</span>
                  </div>

                  <!-- Actions for inner element (Reorder + Delete) -->
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
                      class="p-0.5 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
                      title="Hapus Elemen"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              {/each}

              <!-- Add Element button inside section -->
              <div class="pt-1">
                <button
                  type="button"
                  on:click|stopPropagation={() => {
                    openAddNodeDropdown = openAddNodeDropdown === section.id ? null : section.id;
                  }}
                  class="w-full flex items-center justify-center gap-1 py-1 text-[10px] font-semibold text-slate-400 hover:text-blue-400 bg-slate-800/40 hover:bg-slate-800 rounded border border-dashed border-slate-700/60 transition-colors cursor-pointer"
                >
                  <Plus size={11} />
                  <span>Tambah Elemen</span>
                </button>

                {#if openAddNodeDropdown === section.id}
                  <div class="mt-1 p-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl space-y-0.5 z-40">
                    {#if section.type === 'hero'}
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'badge'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Promo Badge
                      </button>
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'title'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Heading Title
                      </button>
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'subtitle'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Subtitle Description
                      </button>
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'image'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Banner Image
                      </button>
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'cta'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Action Button (CTA)
                      </button>
                    {:else if section.type === 'header_announcement'}
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'nav'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Nav Link Menu
                      </button>
                    {:else if section.type === 'features'}
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'item'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Card Fitur Baru
                      </button>
                    {:else if section.type === 'product_catalog'}
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'item'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Produk Baru
                      </button>
                    {:else if section.type === 'testimonials'}
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'item'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + Review Testimoni
                      </button>
                    {:else if section.type === 'faq'}
                      <button
                        type="button"
                        on:click={() => { editorStore.addNode(section.id, 'item'); openAddNodeDropdown = null; }}
                        class="w-full text-left px-2 py-1 text-[10px] text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 rounded"
                      >
                        + FAQ Accordion
                      </button>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</aside>
