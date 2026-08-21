<script lang="ts">
  import { Sparkles, Trash2, Menu, Plus } from 'lucide-svelte';

  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';
  import {
    makeHandleAddArrayItem,
    makeHandleRemoveArrayItem,
  } from '../content/content.helpers';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};
  // local copy for heading selector
  let heading: string = (section.styles?.heading as string) ?? '';
  // local copy for primary color picker
  let primaryColor: string = (section.styles?.primaryColor as string) ?? '#000000';

  $: handleAddArrayItem = makeHandleAddArrayItem(section, onSectionUpdate);
  $: handleRemoveArrayItem = makeHandleRemoveArrayItem(section, onSectionUpdate);

  const handleStyleChange = (updated: Record<string, string>) => {
    onPropChange('styles', updated);
  };

  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
  $: logoType = section.props?.logoType || 'image_text';
  $: navLinks = (section.props?.navLinks as string[]) || [];
  $: subtitle = (section.props?.subtitle as string) ?? '';

  const getNodeLabel = (id: string): string => {
    switch (id) {
      case 'badge': return 'Promo Badge';
      case 'title': return 'Heading Title';
      case 'subtitle': return 'Subtitle Description';
      case 'image': return 'Banner Image';
      case 'cta': return 'CTA Button';
      case 'announcement': return 'Announcement Bar';
      case 'logo': return 'Logo & Brand';
      case 'nav_links': return 'Navigation Menu';
      case 'header': return 'Section Header';
      case 'items': return 'Card Items';
      case 'whatsapp': return 'WhatsApp Contact';
      case 'address': return 'Store Location';
      case 'info': return 'Information Links';
      case 'copyright': return 'Copyright Text';
      default: return id;
    }
  };
</script>

<div class="p-4 space-y-4 text-xs text-base-content/80">
  <div class="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl space-y-1 mb-2">
    <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold">
      <Sparkles size={13} />
      <span>Edit Konten: {getNodeLabel(nodeId)}</span>
    </div>
    <p class="text-[11px] text-base-content/60">
      Ubah konten atau pindah ke tab Styles Node untuk mengatur tampilan elemen ini.
    </p>
  </div>

  {#if nodeId === 'announcement'}
    <div class="space-y-3">
      <div class="flex items-center justify-between p-2 bg-base-200/50 dark:bg-slate-900 rounded-lg">
        <span class="font-semibold text-base-content">Tampilkan Bar</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAnnouncement}
            on:change={(e) => onPropChange('showAnnouncement', e.currentTarget.checked)}
            class="sr-only peer"
          />
          <div class="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div>
        <label for="node-announcement-text" class="block font-semibold text-base-content/80 mb-1">Teks Pengumuman</label>
        <input
          id="node-announcement-text"
          type="text"
          value={section.props?.announcementText ?? ''}
          on:input={(e) => onPropChange('announcementText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Diskon 20% khusus hari ini"
        />
      </div>
    </div>
  {:else if nodeId === 'logo'}
    <div class="space-y-3">
      <div>
        <span class="block font-semibold text-base-content/80 mb-1">Mode Tampilan Logo</span>
        <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
          <button
            type="button"
            on:click={() => onPropChange('logoType', 'image_only')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              logoType === 'image_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Gambar
          </button>
          <button
            type="button"
            on:click={() => onPropChange('logoType', 'text_only')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              logoType === 'text_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Teks
          </button>
          <button
            type="button"
            on:click={() => onPropChange('logoType', 'image_text')}
            class={`py-1 rounded font-medium transition-colors cursor-pointer ${
              logoType === 'image_text' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
            }`}
          >
            Kombinasi
          </button>
        </div>
      </div>

      {#if logoType === 'text_only' || logoType === 'image_text'}
        <div>
          <label for="node-logo-text" class="block font-semibold text-base-content/80 mb-1">Nama Toko / Brand</label>
          <input
            id="node-logo-text"
            type="text"
            value={section.props?.logoText ?? ''}
            on:input={(e) => onPropChange('logoText', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
            placeholder="Nama Brand UMKM"
          />
        </div>
      {/if}

      {#if logoType === 'image_only' || logoType === 'image_text'}
        <div>
          <label for="node-logo-image" class="block font-semibold text-base-content/80 mb-1">URL Gambar Logo</label>
          <input
            id="node-logo-image"
            type="text"
            value={section.props?.logoImageUrl ?? ''}
            on:input={(e) => onPropChange('logoImageUrl', e.currentTarget.value)}
            class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
            placeholder="https://..."
          />
        </div>
      {/if}
    </div>
  {:else if nodeId === 'nav_links' || nodeId.startsWith('nav_')}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 font-semibold text-base-content">
        <Menu size={14} class="text-blue-500" />
        <span>Daftar Menu Navigasi</span>
      </div>
      <div class="space-y-2">
        {#each navLinks as link, index}
          <div class="flex items-center gap-1.5 p-1 bg-base-200/50 dark:bg-slate-950/80 border border-base-300 dark:border-slate-800 rounded-lg">
            <input
              type="text"
              value={link}
              on:input={(e) => {
                const updated = [...navLinks];
                updated[index] = e.currentTarget.value;
                onPropChange('navLinks', updated);
              }}
              class="flex-1 px-2.5 py-1 bg-transparent text-xs text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
              placeholder="Nama Menu"
            />
            <button
              type="button"
              on:click={() => handleRemoveArrayItem('navLinks', index)}
              class="p-1 text-base-content/50 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
              title="Hapus Menu"
            >
              <Trash2 size={13} />
            </button>
          </div>
        {/each}
        <button
          type="button"
          on:click={() => handleAddArrayItem('navLinks', 'Menu Baru')}
          class="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-base-300 dark:border-slate-700 rounded-md text-xs text-base-content/60 hover:text-blue-500 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <Plus size={13} />
          <span>Tambah Menu</span>
        </button>
      </div>
    </div>
  {:else if nodeId === 'badge'}
    <div class="space-y-2">
      <label for="node-badge-text" class="block font-semibold text-base-content/80">Teks Badge Promo</label>
      <input
        id="node-badge-text"
        type="text"
        value={section.props?.badgeText ?? ''}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="Promo Spesial UMKM"
      />
    </div>
  {:else if nodeId === 'title'}
    <div class="space-y-3">
      <div>
        <label for="node-hero-title" class="block font-semibold text-base-content/80 mb-1">Judul Heading</label>
        <input
          id="node-hero-title"
          type="text"
          value={section.props?.title ?? ''}
          on:input={(e) => onPropChange('title', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Selamat datang di toko kami"
        />
      </div>
      <div>
        <label for="node-tag-name" class="block font-semibold text-base-content/80 mb-1">HTML Tag Heading</label>
        <select
          id="node-tag-name"
          value={section.props?.tagName ?? 'h1'}
          on:change={(e) => onPropChange('tagName', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
        >
          <option value="h1">H1 (Primary Heading)</option>
          <option value="h2">H2 (Secondary Heading)</option>
          <option value="h3">H3 (Sub Heading)</option>
          <option value="p">Paragraph (Text Biasa)</option>
        </select>
      </div>
    </div>
  {:else if nodeId === 'subtitle'}
    <div class="space-y-2">
      <label for="node-hero-subtitle" class="block font-semibold text-base-content/80">Deskripsi Subtitle</label>
      <textarea
        id="node-hero-subtitle"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        rows="4"
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500 resize-y"
        placeholder="Produk berkualitas dengan harga terjangkau..."
      />
    </div>
  {:else if nodeId === 'image'}
    <div class="space-y-2">
      <label for="node-hero-image" class="block font-semibold text-base-content/80">URL Gambar Banner</label>
      <input
        id="node-hero-image"
        type="text"
        value={section.props?.imageUrl ?? ''}
        on:input={(e) => onPropChange('imageUrl', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
        placeholder="https://images.unsplash.com/..."
      />
    </div>
  {:else if nodeId === 'cta'}
    <div class="space-y-3">
      <div>
        <label for="node-cta-text" class="block font-semibold text-base-content/80 mb-1">Teks Tombol CTA</label>
        <input
          id="node-cta-text"
          type="text"
          value={section.props?.ctaText ?? ''}
          on:input={(e) => onPropChange('ctaText', e.currentTarget.value)}
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
          on:input={(e) => onPropChange('ctaLink', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="#catalog"
        />
      </div>
    </div>
  {/if}

  <div class="pt-4 border-t border-base-200 dark:border-slate-800 flex flex-col gap-2">
    <button
      type="button"
      on:click={() => {
        if (nodeId) editorStore.deleteNode(section.id, nodeId);
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

  <!-- Styles Section -->
  <div class="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl space-y-2 mb-2">
    <div class="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-semibold">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
      <span>Style Options</span>
    </div>
    <div class="space-y-3">
  <!-- Heading level selector -->
  <div>
    <label for="style-heading-level" class="block text-sm font-medium text-base-content/80 mb-1">Heading Level</label>
    <select id="style-heading-level" bind:value={heading} on:change={() => handleStyleChange({ ...section.styles, heading })} class="w-full px-3 py-2 bg-base-200/50 border border-base-300 rounded-lg text-base-content focus:outline-none">
      <option value="h1">H1 (Primary)</option>
      <option value="h2">H2 (Secondary)</option>
      <option value="h3">H3 (Sub)</option>
      <option value="h4">H4</option>
      <option value="h5">H5</option>
      <option value="h6">H6</option>
    </select>
  </div>
  <!-- Primary color picker -->
  <div>
    <label for="style-primary-color" class="block text-sm font-medium text-base-content/80 mb-1">Primary Color</label>
    <input id="style-primary-color" type="color" bind:value={primaryColor} on:input={(e) => handleStyleChange({ ...section.styles, primaryColor: e.currentTarget.value })} class="w-full h-10 p-1 bg-base-200/50 border border-base-300 rounded-lg" />
  </div>
</div>
  </div>
</div>
