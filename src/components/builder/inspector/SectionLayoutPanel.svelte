<script lang="ts">
  import { Maximize2, LayoutGrid, Sliders, Layers, ArrowUp, ArrowDown, Check } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';

  export let section: TemplateSection;
  export let onStyleChange: (key: string, value: string) => void;
  export let onStylesChange: ((updates: Record<string, string | undefined>) => void) | undefined = undefined;

  const applyStyles = (updates: Record<string, string | undefined>) => {
    if (onStylesChange) {
      onStylesChange(updates);
    } else {
      for (const [k, v] of Object.entries(updates)) {
        onStyleChange(k, v || '');
      }
    }
  };

  // Preset definitions mapped per section type
  const presetsBySectionType: Record<string, Array<{ id: string; label: string; desc: string }>> = {
    header_announcement: [
      { id: 'default_split', label: 'Split Default', desc: 'Logo kiri, Nav tengah, Tombol kanan' },
      { id: 'centered_stacked', label: 'Centered Stacked', desc: 'Logo atas, Nav horizontal di tengah' },
      { id: 'compact_inline', label: 'Compact Inline', desc: 'Single-row ringkas 56px' },
    ],
    hero: [
      { id: 'split_left_text', label: 'Split Kiri', desc: 'Teks di kiri, Gambar di kanan' },
      { id: 'split_right_text', label: 'Split Kanan', desc: 'Gambar di kiri, Teks di kanan' },
      { id: 'centered_minimal', label: 'Centered Minimal', desc: 'Teks tengah + showcase gambar' },
      { id: 'full_banner_overlay', label: 'Full Banner Overlay', desc: 'Background foto penuh + teks kontras' },
    ],
    features: [
      { id: 'grid_3_cards', label: 'Grid 3 Kartu', desc: '3 Kolom kartu keunggulan' },
      { id: 'horizontal_list', label: 'Horizontal List', desc: 'Daftar baris ke samping' },
      { id: 'banner_inline_bar', label: 'Banner Ribbon Bar', desc: 'Pita bar horizontal 64px' },
    ],
    product_catalog: [
      { id: 'grid_standard', label: 'Grid Standar', desc: 'Katalog grid responsif' },
      { id: 'carousel_scroll', label: 'Carousel Scroll', desc: 'Snap scroll horizontal' },
      { id: 'list_compact', label: 'List Compact', desc: 'Daftar baris produk ringkas' },
    ],
    testimonials: [
      { id: 'masonry_grid', label: 'Masonry Grid', desc: '3 Kolom kartu ulasan' },
      { id: 'single_spotlight', label: 'Single Spotlight', desc: '1 Testimoni sorotan besar' },
      { id: 'chat_bubble_flow', label: 'Chat Bubble Flow', desc: 'Gaya balon pesan WA' },
    ],
    faq: [
      { id: 'accordion_single_col', label: 'Accordion Tengah', desc: '1 Kolom buka-tutup di tengah' },
      { id: 'split_faq_sidebar', label: 'Split Sidebar', desc: 'Judul/kontak kiri, FAQ kanan' },
      { id: 'grid_2_col_cards', label: 'Grid 2 Kolom', desc: 'Kartu tanya jawab terbuka' },
    ],
    google_maps: [
      { id: 'fullwidth_map', label: 'Fullwidth Floating', desc: 'Peta penuh dengan floating card' },
      { id: 'split_map_info', label: 'Split Info', desc: 'Alamat/jam buka kiri, peta kanan' },
      { id: 'compact_boxed', label: 'Compact Boxed', desc: 'Kartu ringkas dengan preview peta' },
    ],
    footer: [
      { id: 'multi_column', label: 'Multi Kolom', desc: '3-4 Kolom navigasi & profil' },
      { id: 'centered_simple', label: 'Centered Simple', desc: 'Logo tengah & sosial media' },
      { id: 'cta_focused', label: 'CTA Focused Banner', desc: 'Banner WhatsApp floating card di atas' },
    ],
  };

  $: currentPresets = presetsBySectionType[section.type] || [];
  $: activePreset = section.layoutPreset || (section.props?.layoutPreset as string) || (currentPresets[0]?.id ?? '');

  // Slot elements for reordering
  const defaultSlotsBySection: Record<string, string[]> = {
    hero: ['badge', 'title', 'subtitle', 'image', 'cta'],
    header_announcement: ['announcement_bar', 'logo', 'nav_links', 'cta'],
    faq: ['title', 'subtitle', 'faq_list'],
    features: ['title', 'subtitle', 'features_grid'],
  };

  $: elementOrder = (section.props?.elementOrder as string[]) || defaultSlotsBySection[section.type] || [];

  const slotLabels: Record<string, string> = {
    badge: 'Promo Badge',
    title: 'Judul Heading',
    subtitle: 'Deskripsi Subtitle',
    image: 'Gambar / Visual Media',
    cta: 'Tombol CTA',
    announcement_bar: 'Announcement Bar',
    logo: 'Logo & Brand',
    nav_links: 'Menu Navigasi',
    faq_list: 'Daftar Pertanyaan FAQ',
    features_grid: 'Daftar Keunggulan',
  };

  const handlePresetSelect = (presetId: string) => {
    editorStore.updateSectionLayoutPreset(section.id, presetId);
  };

  const handleMoveSlot = (fromIdx: number, direction: -1 | 1) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= elementOrder.length) return;
    editorStore.reorderSectionSlot(section.id, fromIdx, toIdx);
  };

  // Locked 8pt Spacing Options with 0px (Default / Ikut Margin)
  const gapOptions = [
    { value: '', label: 'Default (16px)' },
    { value: '8px', label: '8px (Ketat)' },
    { value: '16px', label: '16px (Normal)' },
    { value: '24px', label: '24px (Renggang)' },
    { value: '32px', label: '32px (Lebar)' },
    { value: '40px', label: '40px (Sangat Lebar)' },
    { value: '48px', label: '48px (Ekstra Lebar)' },
  ];

  const paddingYOptions = [
    { value: '0px', label: '0px (Default / Ikut Margin)' },
    { value: '16px', label: '16px (Kecil)' },
    { value: '24px', label: '24px (Standar)' },
    { value: '32px', label: '32px (Sedang)' },
    { value: '48px', label: '48px (Lebar)' },
    { value: '64px', label: '64px (Besar)' },
    { value: '80px', label: '80px (Jumbo)' },
    { value: '96px', label: '96px (Maksimal)' },
  ];

  const paddingXOptions = [
    { value: '0px', label: '0px (Default / Ikut Margin)' },
    { value: '8px', label: '8px (Ketat)' },
    { value: '16px', label: '16px (Kecil)' },
    { value: '24px', label: '24px (Standar)' },
    { value: '32px', label: '32px (Sedang)' },
    { value: '40px', label: '40px (Besar)' },
    { value: '48px', label: '48px (Lebar)' },
  ];

  const marginOptions = [
    { value: '0px', label: '0px (Tanpa Margin)' },
    { value: '8px', label: '8px' },
    { value: '16px', label: '16px' },
    { value: '24px', label: '24px' },
    { value: '32px', label: '32px' },
    { value: '48px', label: '48px' },
    { value: '64px', label: '64px' },
  ];

  const setEdgeToEdge = () => {
    applyStyles({
      containerWidth: 'full',
      padding: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      margin: '0px',
      marginTop: '0px',
      marginBottom: '0px',
    });
  };
</script>

<div class="space-y-6">
  <!-- 1. Layout Preset Selector -->
  {#if currentPresets.length > 0}
    <div class="space-y-3">
      <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
        <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
          <LayoutGrid size={13} class="text-[var(--theme-primary,#2563eb)]" />
          <span>Preset Tata Letak (8pt Grid)</span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-2">
        {#each currentPresets as preset}
          {@const isSelected = activePreset === preset.id}
          <button
            type="button"
            on:click={() => handlePresetSelect(preset.id)}
            class={`p-2.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
              isSelected
                ? 'bg-blue-500/10 border-[var(--theme-primary,#2563eb)] ring-2 ring-[var(--theme-primary,#2563eb)]/30 shadow-sm'
                : 'bg-base-200/40 hover:bg-base-200 border-base-300 dark:border-slate-800'
            }`}
          >
            <div>
              <div class="font-bold text-xs text-base-content flex items-center gap-1.5">
                <span>{preset.label}</span>
                {#if isSelected}
                  <span class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[var(--theme-primary,#2563eb)] text-white">
                    <Check size={10} />
                  </span>
                {/if}
              </div>
              <p class="text-[11px] text-base-content/60 mt-0.5">{preset.desc}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- 2. Slot Reorder (Up / Down) -->
  {#if elementOrder.length > 1}
    <div class="space-y-3">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
        <Layers size={13} class="text-[var(--theme-primary,#2563eb)]" />
        <span>Urutan Slot Elemen</span>
      </div>

      <div class="space-y-1.5">
        {#each elementOrder as slot, index}
          <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 text-xs">
            <span class="font-medium text-base-content">{slotLabels[slot] || slot}</span>
            <div class="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                on:click={() => handleMoveSlot(index, -1)}
                class="p-1 rounded bg-base-100 hover:bg-base-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Pindah ke Atas"
              >
                <ArrowUp size={12} />
              </button>
              <button
                type="button"
                disabled={index === elementOrder.length - 1}
                on:click={() => handleMoveSlot(index, 1)}
                class="p-1 rounded bg-base-100 hover:bg-base-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Pindah ke Bawah"
              >
                <ArrowDown size={12} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- 3. Container Width -->
  <div class="space-y-3">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-1.5">
      <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70">
        <Maximize2 size={13} class="text-[var(--theme-primary,#2563eb)]" />
        <span>Lebar Kontainer</span>
      </div>
      <button
        type="button"
        on:click={setEdgeToEdge}
        class="text-[10px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 transition-colors cursor-pointer"
      >
        Full Bleed
      </button>
    </div>

    <div class="grid grid-cols-2 gap-1 bg-base-200/60 p-1 rounded-lg border border-base-300 dark:border-slate-700">
      <button
        type="button"
        on:click={() => onStyleChange('containerWidth', 'boxed')}
        class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
          section.styles?.containerWidth === 'boxed' || !section.styles?.containerWidth
            ? 'bg-base-100 text-base-content font-bold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
      >
        Boxed (Max 1200px)
      </button>
      <button
        type="button"
        on:click={() => onStyleChange('containerWidth', 'full')}
        class={`py-1.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
          section.styles?.containerWidth === 'full'
            ? 'bg-base-100 text-base-content font-bold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
      >
        Full Width (100%)
      </button>
    </div>
  </div>

  <!-- 4. Spacing (Padding & Margin Locked on 8pt Grid) -->
  <div class="space-y-3">
    <div class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/70 border-b border-base-200 dark:border-slate-800 pb-1.5">
      <Sliders size={13} class="text-[var(--theme-primary,#2563eb)]" />
      <span>Jarak & Padding (Kelipatan 8px)</span>
    </div>

    <!-- Gap Antar Elemen -->
    <div>
      <label for="style-gap-select" class="block font-semibold text-xs text-base-content/80 mb-1">
        Jarak Antar Elemen (Gap)
      </label>
      <select
        id="style-gap-select"
        value={section.styles?.gap || ''}
        on:change={(e) => onStyleChange('gap', e.currentTarget.value)}
        on:input={(e) => onStyleChange('gap', e.currentTarget.value)}
        class="w-full px-2.5 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
      >
        {#each gapOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    <!-- Padding Vertikal & Horizontal -->
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="style-pad-top" class="block font-semibold text-[11px] text-base-content/80 mb-1">
          Padding Vertikal
        </label>
        <select
          id="style-pad-top"
          value={section.styles?.paddingTop || '0px'}
          on:change={(e) => {
            const val = e.currentTarget.value;
            applyStyles({
              paddingTop: val,
              paddingBottom: val,
              padding: `${val} ${section.styles?.paddingLeft || '0px'}`,
            });
          }}
          on:input={(e) => {
            const val = e.currentTarget.value;
            applyStyles({
              paddingTop: val,
              paddingBottom: val,
              padding: `${val} ${section.styles?.paddingLeft || '0px'}`,
            });
          }}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each paddingYOptions as py}
            <option value={py.value}>{py.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="style-pad-x" class="block font-semibold text-[11px] text-base-content/80 mb-1">
          Padding Horizontal
        </label>
        <select
          id="style-pad-x"
          value={section.styles?.paddingLeft || '0px'}
          on:change={(e) => {
            const val = e.currentTarget.value;
            applyStyles({
              paddingLeft: val,
              paddingRight: val,
              padding: `${section.styles?.paddingTop || '0px'} ${val}`,
            });
          }}
          on:input={(e) => {
            const val = e.currentTarget.value;
            applyStyles({
              paddingLeft: val,
              paddingRight: val,
              padding: `${section.styles?.paddingTop || '0px'} ${val}`,
            });
          }}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each paddingXOptions as px}
            <option value={px.value}>{px.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Margin Atas / Bawah -->
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label for="style-margin-top-select" class="block font-semibold text-[11px] text-base-content/80 mb-1">
          Margin Atas
        </label>
        <select
          id="style-margin-top-select"
          value={section.styles?.marginTop || '0px'}
          on:change={(e) => onStyleChange('marginTop', e.currentTarget.value)}
          on:input={(e) => onStyleChange('marginTop', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each marginOptions as m}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="style-margin-bot-select" class="block font-semibold text-[11px] text-base-content/80 mb-1">
          Margin Bawah
        </label>
        <select
          id="style-margin-bot-select"
          value={section.styles?.marginBottom || '0px'}
          on:change={(e) => onStyleChange('marginBottom', e.currentTarget.value)}
          on:input={(e) => onStyleChange('marginBottom', e.currentTarget.value)}
          class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-xs text-base-content focus:outline-none focus:border-blue-500"
        >
          {#each marginOptions as m}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</div>

