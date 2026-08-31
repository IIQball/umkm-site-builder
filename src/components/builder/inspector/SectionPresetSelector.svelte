<script lang="ts">
  import { LayoutGrid, Check } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';

  export let section: TemplateSection;

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

  const handlePresetSelect = (presetId: string) => {
    editorStore.updateSectionLayoutPreset(section.id, presetId);
  };
</script>

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
