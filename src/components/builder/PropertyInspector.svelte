<script lang="ts">
  import { Sliders, Type, Layers, ChevronRight, Sparkles, Trash2 } from 'lucide-svelte';
  import ContentTab from './ContentTab.svelte';
  import StylesTab from './StylesTab.svelte';
  import NodeStylesTab from './NodeStylesTab.svelte';
  import type { TemplateSection } from '@/schemas/template.schema';
  import { editorStore, activeNodeId } from './stores/editorStore';

  export let section: TemplateSection | undefined = undefined;
  export let onSectionUpdate: (section: TemplateSection) => void;

  let activeTab: 'content' | 'styles' = 'content';
  let nodeTab: 'content' | 'styles' = 'content';

  const getNodeLabel = (nodeId: string): string => {
    switch (nodeId) {
      case 'badge': return 'Promo Badge';
      case 'title': return 'Heading Title';
      case 'subtitle': return 'Subtitle Description';
      case 'image': return 'Banner Image';
      case 'cta': return 'CTA Button';
      case 'announcement': return 'Announcement Bar';
      case 'nav_links': return 'Navigation Menu';
      case 'header': return 'Section Header';
      case 'items': return 'Card Items';
      case 'whatsapp': return 'WhatsApp Contact';
      case 'address': return 'Store Location';
      case 'info': return 'Information Links';
      case 'copyright': return 'Copyright Text';
      default: return nodeId;
    }
  };

  const handlePropChange = (key: string, value: unknown) => {
    if (!section) return;
    const updated: TemplateSection = {
      ...section,
      props: {
        ...(section.props || {}),
        [key]: value,
      },
    };
    onSectionUpdate(updated);
  };
</script>

<aside class="w-80 flex-shrink-0 bg-base-100 border-l border-base-200 dark:border-slate-800 flex flex-col h-full overflow-hidden text-base-content transition-colors">
  {#if !section}
    <div class="flex flex-col items-center justify-center h-full p-6 text-center text-base-content/40">
      <Layers size={32} class="text-base-content/30 mb-2 stroke-[1.5]" />
      <p class="text-xs font-medium text-base-content/60">Pilih section pada canvas atau panel kiri untuk mengedit konten dan styling.</p>
    </div>
  {:else}
    <!-- Section & Node Breadcrumb Header -->
    <div class="px-4 py-3 border-b border-base-200 dark:border-slate-800 flex flex-col gap-1 bg-base-100">
      <div class="flex items-center gap-1.5 text-xs text-base-content/60">
        <button
          type="button"
          on:click={() => editorStore.selectNode(section.id, null)}
          class={`font-semibold hover:text-base-content transition-colors uppercase tracking-wider ${
            !$activeNodeId ? 'text-blue-600 dark:text-blue-400' : 'text-base-content/60'
          }`}
        >
          {section.type.replace('_', ' ')}
        </button>

        {#if $activeNodeId}
          <ChevronRight size={13} class="text-base-content/40" />
          <span class="text-blue-600 dark:text-blue-400 font-semibold truncate">
            {getNodeLabel($activeNodeId)}
          </span>
        {/if}
      </div>
      <p class="text-[10px] text-base-content/40 font-mono">{section.id}</p>
    </div>

    <!-- Contextual Node Inspector (when a specific sub-element is selected) -->
    {#if $activeNodeId}
      <!-- Node Level Tab Switcher -->
      <div class="grid grid-cols-2 border-b border-base-200 dark:border-slate-800 bg-base-200/50 p-1 gap-1">
        <button
          type="button"
          on:click={() => (nodeTab = 'content')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            nodeTab === 'content'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Type size={13} />
          <span>Konten Node</span>
        </button>
        <button
          type="button"
          on:click={() => (nodeTab = 'styles')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            nodeTab === 'styles'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Sliders size={13} />
          <span>Styles Node</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        {#if nodeTab === 'styles'}
          <NodeStylesTab {section} nodeId={$activeNodeId} onUpdate={onSectionUpdate} />
        {:else}
          <!-- Node Content Form -->
          <div class="p-4 space-y-4 text-xs text-base-content/80">
            <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1 mb-2">
              <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
                <Sparkles size={13} />
                <span>Edit Konten: {getNodeLabel($activeNodeId)}</span>
              </div>
              <p class="text-[11px] text-base-content/60">
                Ubah konten atau pindah ke tab Styles Node untuk mengatur typography dan warna per elemen.
              </p>
            </div>

            {#if $activeNodeId === 'badge'}
              <div class="space-y-2">
                <label for="node-badge-text" class="block font-semibold text-base-content/80">Teks Badge Promo</label>
                <input
                  id="node-badge-text"
                  type="text"
                  value={section.props?.badgeText ?? ''}
                  on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
                  placeholder="Promo Spesial UMKM"
                />
              </div>
            {:else if $activeNodeId === 'title'}
              <div class="space-y-3">
                <div>
                  <label for="node-hero-title" class="block font-semibold text-base-content/80 mb-1">Judul Heading</label>
                  <input
                    id="node-hero-title"
                    type="text"
                    value={section.props?.title ?? ''}
                    on:input={(e) => handlePropChange('title', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
                    placeholder="Selamat datang di toko kami"
                  />
                </div>
                <div>
                  <label for="node-tag-name" class="block font-semibold text-base-content/80 mb-1">HTML Tag Heading</label>
                  <select
                    id="node-tag-name"
                    value={section.props?.tagName ?? 'h1'}
                    on:change={(e) => handlePropChange('tagName', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
                  >
                    <option value="h1">H1 (Primary Heading)</option>
                    <option value="h2">H2 (Secondary Heading)</option>
                    <option value="h3">H3 (Sub Heading)</option>
                    <option value="p">Paragraph (Text Biasa)</option>
                  </select>
                </div>
              </div>
            {:else if $activeNodeId === 'subtitle'}
              <div class="space-y-2">
                <label for="node-hero-subtitle" class="block font-semibold text-base-content/80">Deskripsi Subtitle</label>
                <textarea
                  id="node-hero-subtitle"
                  value={section.props?.subtitle ?? ''}
                  on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
                  rows="4"
                  class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500 resize-y"
                  placeholder="Produk berkualitas dengan harga terjangkau..."
                />
              </div>
            {:else if $activeNodeId === 'image'}
              <div class="space-y-2">
                <label for="node-hero-image" class="block font-semibold text-base-content/80">URL Gambar Banner</label>
                <input
                  id="node-hero-image"
                  type="text"
                  value={section.props?.imageUrl ?? ''}
                  on:input={(e) => handlePropChange('imageUrl', e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            {:else if $activeNodeId === 'cta'}
              <div class="space-y-3">
                <div>
                  <label for="node-cta-text" class="block font-semibold text-base-content/80 mb-1">Teks Tombol CTA</label>
                  <input
                    id="node-cta-text"
                    type="text"
                    value={section.props?.ctaText ?? ''}
                    on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
                    placeholder="Lihat Katalog"
                  />
                </div>
                <div>
                  <label for="node-cta-link" class="block font-semibold text-base-content/80 mb-1">Link Tujuan</label>
                  <input
                    id="node-cta-link"
                    type="text"
                    value={section.props?.ctaLink ?? ''}
                    on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
                    placeholder="#catalog"
                  />
                </div>
              </div>
            {:else if $activeNodeId === 'announcement'}
              <div class="space-y-2">
                <label for="node-announcement-text" class="block font-semibold text-base-content/80">Teks Pengumuman</label>
                <input
                  id="node-announcement-text"
                  type="text"
                  value={section.props?.announcementText ?? ''}
                  on:input={(e) => handlePropChange('announcementText', e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
                  placeholder="Diskon 20% khusus hari ini"
                />
              </div>
            {/if}

            <div class="pt-4 border-t border-base-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                on:click={() => {
                  if ($activeNodeId) {
                    editorStore.deleteNode(section.id, $activeNodeId);
                  }
                }}
                class="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Hapus Elemen Ini</span>
              </button>

              <button
                type="button"
                on:click={() => editorStore.selectNode(section.id, null)}
                class="w-full py-2 bg-base-200 hover:bg-base-300 text-base-content rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Kembali ke Setting Section
              </button>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Standard Full Section Tab Bar -->
      <div class="grid grid-cols-2 border-b border-base-200 dark:border-slate-800 bg-base-200/50 p-1 gap-1">
        <button
          type="button"
          on:click={() => (activeTab = 'content')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Type size={13} />
          <span>Content</span>
        </button>
        <button
          type="button"
          on:click={() => (activeTab = 'styles')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'styles'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Sliders size={13} />
          <span>Styles</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto">
        {#if activeTab === 'content'}
          <ContentTab {section} onUpdate={onSectionUpdate} />
        {:else}
          <StylesTab {section} onUpdate={onSectionUpdate} />
        {/if}
      </div>
    {/if}
  {/if}
</aside>
