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

<aside class="w-80 flex-shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
  {#if !section}
    <div class="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500">
      <Layers size={32} class="text-slate-600 mb-2 stroke-[1.5]" />
      <p class="text-xs font-medium text-slate-400">Pilih section pada canvas atau panel kiri untuk mengedit konten dan styling.</p>
    </div>
  {:else}
    <!-- Section & Node Breadcrumb Header -->
    <div class="px-4 py-3 border-b border-slate-800 flex flex-col gap-1 bg-slate-900">
      <div class="flex items-center gap-1.5 text-xs text-slate-400">
        <button
          type="button"
          on:click={() => editorStore.selectNode(section.id, null)}
          class={`font-semibold hover:text-slate-100 transition-colors uppercase tracking-wider ${
            !$activeNodeId ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          {section.type.replace('_', ' ')}
        </button>

        {#if $activeNodeId}
          <ChevronRight size={13} class="text-slate-600" />
          <span class="text-blue-400 font-semibold truncate">
            {getNodeLabel($activeNodeId)}
          </span>
        {/if}
      </div>
      <p class="text-[10px] text-slate-500 font-mono">{section.id}</p>
    </div>

    <!-- Contextual Node Inspector (when a specific sub-element is selected) -->
    {#if $activeNodeId}
      <!-- Node Level Tab Switcher -->
      <div class="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40 p-1 gap-1">
        <button
          type="button"
          on:click={() => (nodeTab = 'content')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            nodeTab === 'content'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type size={14} />
          <span>Konten Node</span>
        </button>
        <button
          type="button"
          on:click={() => (nodeTab = 'styles')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            nodeTab === 'styles'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={14} />
          <span>Styles Node</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        {#if nodeTab === 'styles'}
          <NodeStylesTab {section} nodeId={$activeNodeId} onUpdate={onSectionUpdate} />
        {:else}
          <!-- Node Content Form -->
          <div class="p-4 space-y-4 text-xs text-slate-300">
            <div class="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl space-y-1 mb-2">
              <div class="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Sparkles size={14} />
                <span>Edit Konten: {getNodeLabel($activeNodeId)}</span>
              </div>
              <p class="text-[11px] text-slate-400">
                Ubah konten atau pindah ke tab Styles Node untuk mengatur typography & warna per elemen.
              </p>
            </div>

            {#if $activeNodeId === 'badge'}
              <div class="space-y-3">
                <label for="node-badge-text" class="block font-medium text-slate-300">Teks Badge Promo</label>
                <input
                  id="node-badge-text"
                  type="text"
                  value={section.props?.badgeText ?? ''}
                  on:input={(e) => handlePropChange('badgeText', e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="✨ Promo Spesial UMKM"
                />
              </div>
            {:else if $activeNodeId === 'title'}
              <div class="space-y-3">
                <div>
                  <label for="node-hero-title" class="block font-medium text-slate-300 mb-1">Judul Heading</label>
                  <input
                    id="node-hero-title"
                    type="text"
                    value={section.props?.title ?? ''}
                    on:input={(e) => handlePropChange('title', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
                    placeholder="Selamat datang di toko kami"
                  />
                </div>
                <div>
                  <label for="node-tag-name" class="block font-medium text-slate-300 mb-1">HTML Tag Heading</label>
                  <select
                    id="node-tag-name"
                    value={section.props?.tagName ?? 'h1'}
                    on:change={(e) => handlePropChange('tagName', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="h1">H1 (Primary Heading)</option>
                    <option value="h2">H2 (Secondary Heading)</option>
                    <option value="h3">H3 (Sub Heading)</option>
                    <option value="p">Paragraph (Text Biasa)</option>
                  </select>
                </div>
              </div>
            {:else if $activeNodeId === 'subtitle'}
              <div class="space-y-3">
                <label for="node-hero-subtitle" class="block font-medium text-slate-300">Deskripsi Subtitle</label>
                <textarea
                  id="node-hero-subtitle"
                  value={section.props?.subtitle ?? ''}
                  on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
                  rows="4"
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500 resize-y"
                  placeholder="Produk berkualitas dengan harga terjangkau..."
                />
              </div>
            {:else if $activeNodeId === 'image'}
              <div class="space-y-3">
                <label for="node-hero-image" class="block font-medium text-slate-300">URL Gambar Banner</label>
                <input
                  id="node-hero-image"
                  type="text"
                  value={section.props?.imageUrl ?? ''}
                  on:input={(e) => handlePropChange('imageUrl', e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            {:else if $activeNodeId === 'cta'}
              <div class="space-y-3">
                <div>
                  <label for="node-cta-text" class="block font-medium text-slate-300 mb-1">Teks Tombol CTA</label>
                  <input
                    id="node-cta-text"
                    type="text"
                    value={section.props?.ctaText ?? ''}
                    on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
                    placeholder="Lihat Katalog"
                  />
                </div>
                <div>
                  <label for="node-cta-link" class="block font-medium text-slate-300 mb-1">Link Tujuan</label>
                  <input
                    id="node-cta-link"
                    type="text"
                    value={section.props?.ctaLink ?? ''}
                    on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
                    class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
                    placeholder="#catalog"
                  />
                </div>
              </div>
            {:else if $activeNodeId === 'announcement'}
              <div class="space-y-3">
                <label for="node-announcement-text" class="block font-medium text-slate-300">Teks Pengumuman</label>
                <input
                  id="node-announcement-text"
                  type="text"
                  value={section.props?.announcementText ?? ''}
                  on:input={(e) => handlePropChange('announcementText', e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Diskon 20% khusus hari ini"
                />
              </div>
            {/if}

            <div class="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                on:click={() => {
                  if ($activeNodeId) {
                    editorStore.deleteNode(section.id, $activeNodeId);
                  }
                }}
                class="w-full py-2 bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Hapus Elemen Ini</span>
              </button>

              <button
                type="button"
                on:click={() => editorStore.selectNode(section.id, null)}
                class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Kembali ke Setting Section
              </button>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <!-- Standard Full Section Tab Bar -->
      <div class="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40 p-1 gap-1">
        <button
          type="button"
          on:click={() => (activeTab = 'content')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type size={14} />
          <span>Content</span>
        </button>
        <button
          type="button"
          on:click={() => (activeTab = 'styles')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'styles'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={14} />
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
