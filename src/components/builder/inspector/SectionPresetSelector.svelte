<script lang="ts">
  import { LayoutGrid, Check } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore } from '../stores/editorStore';

  export let section: TemplateSection;

  const presetsBySectionType: Record<string, Array<{ id: string; label: string; desc: string }>> = {
    header_announcement: [
      { id: 'default_split', label: 'Split Default', desc: 'Bar pengumuman, logo kiri, nav tengah, tombol WA kanan' },
      { id: 'centered_stacked', label: 'Centered Stacked', desc: 'Logo di atas tengah, deretan nav link rapi di bawah' },
      { id: 'compact_inline', label: 'Compact Inline', desc: 'Single-row ramping 56px tanpa bar pengumuman' },
      { id: 'floating_pill_island', label: 'Floating Pill Island', desc: 'Navbar melayang berbentuk kapsul (rounded-full shadow-lg)' },
      { id: 'split_nav_centered_logo', label: 'Split Nav Centered Logo', desc: 'Logo persis di tengah, nav terbagi rata di kiri dan kanan' },
      { id: 'command_search_bar', label: 'Command Search Bar', desc: 'Bar pencarian interaktif gaya ⌘K di tengah navbar' },
      { id: 'transparent_glass_header', label: 'Transparent Glass', desc: 'Latar transparan backdrop blur kaca di atas hero' },
      { id: 'mega_menu_dropdown', label: 'Mega Menu Dropdown', desc: 'Nav link dengan panel dropdown kategori berikon' },
      { id: 'minimal_action_only', label: 'Minimal Action Only', desc: 'Logo kiri, badge status toko & tombol aksi cepat di kanan' },
      { id: 'top_contact_bar', label: 'Top Contact Bar', desc: 'Baris atas memuat jam & alamat, baris bawah menu utama' },
    ],
    hero: [
      { id: 'split_left_text', label: 'Split Teks Kiri', desc: 'Teks di kiri, media di kanan (50/50 split)' },
      { id: 'split_right_text', label: 'Split Teks Kanan', desc: 'Media di kiri, teks di kanan (50/50 split)' },
      { id: 'centered_minimal', label: 'Centered Minimal', desc: 'Judul tengah, CTA tengah, mockup visual 16:9 di bawah' },
      { id: 'full_banner_overlay', label: 'Full Banner Overlay', desc: 'Gambar/video penuh dengan dark backdrop dan teks putih' },
      { id: 'video_background_loop', label: 'Video Background Loop', desc: 'Looping ambient video latar dengan teks kontras tinggi' },
      { id: 'gradient_mesh_glow', label: 'Gradient Mesh Glow', desc: 'Latar mesh netral halus dengan kartu CTA elegan' },
      { id: 'interactive_terminal_code', label: 'Interactive Terminal', desc: 'Teks judul berdampingan mockup terminal beranimasi' },
      { id: 'floating_cards_showcase', label: 'Floating Cards Showcase', desc: 'Headline tengah dikelilingi kartu visual melayang berotasi halus' },
      { id: 'oversized_bold_typography', label: 'Oversized Bold Typography', desc: 'Tipografi display raksasa dengan supporting card minimalis' },
      { id: 'inline_email_capture', label: 'Inline Email Capture', desc: 'Form input email/WA broadcast menyatu di bawah headline' },
    ],
    features: [
      { id: 'grid_3_cards', label: 'Grid 3 Kartu', desc: '3 Kolom kartu berbingkai rapi dengan icon container 48px' },
      { id: 'horizontal_list', label: 'Horizontal List', desc: '2 Kolom asimetris: Judul sticky kiri, baris fitur kanan' },
      { id: 'banner_inline_bar', label: 'Banner Inline Ribbon', desc: 'Pita kontainer horizontal ramping 1 baris (64px)' },
      { id: 'bento_grid_asymmetric', label: 'Bento Grid Asimetris', desc: 'Bento grid dengan ubin beragam ukuran dan fitur sorotan' },
      { id: 'alternating_zigzag_rows', label: 'Alternating Zigzag', desc: 'Baris bergantian kiri-kanan (teks-gambar & gambar-teks)' },
      { id: 'interactive_tabs', label: 'Interactive Tabs', desc: 'Tab pilihan yang mengganti preview fitur saat diklik' },
      { id: 'vertical_accordion_showcase', label: 'Vertical Accordion', desc: 'Akordeon vertikal interaktif yang membuka detail fitur' },
      { id: 'sticky_scroll_highlight', label: 'Sticky Scroll Highlight', desc: 'Visual kiri tetap sticky saat deskripsi fitur kanan di-scroll' },
      { id: 'dense_icon_matrix', label: 'Dense Icon Matrix', desc: 'Matriks ubin ikon kompak untuk menampilkan banyak benefit' },
      { id: 'before_after_comparison', label: 'Before & After Comparison', desc: 'Kartu komparasi visual Tanpa Sistem vs Dengan Sistem UMKM' },
    ],
    product_catalog: [
      { id: 'grid_standard', label: 'Grid Standar Responsif', desc: 'Katalog grid 2/3/4 kolom rapi dengan quick view' },
      { id: 'carousel_scroll', label: 'Carousel Scroll', desc: 'Snap scroll horizontal untuk browsing geser cepat' },
      { id: 'list_compact', label: 'List Compact Rows', desc: 'Daftar baris produk ringkas cocok untuk menu makanan' },
      { id: 'masonry_catalog', label: 'Masonry Catalog', desc: 'Grid ketinggian bervariasi dengan badge promo' },
      { id: 'bento_product_spotlight', label: 'Bento Product Spotlight', desc: '1 Produk unggulan besar dikelilingi produk pendukung' },
      { id: 'split_category_sidebar', label: 'Split Category Sidebar', desc: 'Sidebar filter kategori di kiri, daftar produk di kanan' },
      { id: 'compact_mini_cards', label: 'Compact Mini Cards', desc: 'Kartu mini rapat efisien untuk katalog banyak item' },
      { id: 'price_table_view', label: 'Price Table View', desc: 'Tabel perbandingan harga & spesifikasi produk' },
      { id: 'lookbook_gallery', label: 'Lookbook Gallery', desc: 'Galeri editorial foto besar dengan pin tag harga popover' },
      { id: 'flash_sale_countdown', label: 'Flash Sale Countdown', desc: 'Tema promo terbatas dengan banner timer mundur' },
    ],
    testimonials: [
      { id: 'masonry_grid', label: 'Masonry Grid 3 Kolom', desc: 'Grid 3 kolom kartu ulasan dengan bintang amber & verified badge' },
      { id: 'single_spotlight', label: 'Single Spotlight Quote', desc: '1 Kutipan ulasan besar terpilih dengan pagination dot' },
      { id: 'chat_bubble_flow', label: 'Chat Bubble Flow', desc: 'Gelembung obrolan WhatsApp autentik dengan label hijau' },
      { id: 'infinite_marquee_scroll', label: 'Infinite Marquee Ticker', desc: 'Deretan kartu ulasan yang bergeser horizontal otomatis' },
      { id: 'video_review_cards', label: 'Video Review Cards', desc: 'Grid thumbnail video pelanggan dengan tombol play' },
      { id: 'social_post_cards', label: 'Social Post Feed', desc: 'Format postingan media sosial dengan avatar, handle, & like' },
      { id: 'side_by_side_3_cards', label: 'Side-by-Side 3 Cards', desc: '3 Kartu sejajar dengan foto pelanggan besar & rating tebal' },
      { id: 'logo_client_cloud', label: 'Logo Client Cloud', desc: 'Deretan logo mitra/klien UMKM bersih dengan judul pengantar' },
      { id: 'split_rating_stats', label: 'Split Rating Stats', desc: 'Skor agregat bintang 4.9/5 di kiri, daftar ulasan di kanan' },
      { id: 'carousel_slider', label: 'Carousel Slider Nav', desc: 'Slider interaktif dengan tombol navigasi panah kiri-kanan' },
    ],
    faq: [
      { id: 'accordion_single_col', label: 'Accordion Single Column', desc: 'Akordeon terpusat 1 kolom dengan rotasi chevron halus' },
      { id: 'split_faq_sidebar', label: 'Split FAQ Sidebar', desc: 'Judul & kartu bantuan CS WhatsApp di kiri, akordeon di kanan' },
      { id: 'grid_2_col_cards', label: 'Grid 2 Kolom Terbuka', desc: 'Grid 2 kolom kartu tanya-jawab terbuka permanen' },
      { id: 'accordion_two_col', label: 'Accordion Two Column', desc: 'Akordeon yang terbagi seimbang ke dalam 2 kolom sejajar' },
      { id: 'chat_style_faq', label: 'Chat Style Bubble FAQ', desc: 'Tanya jawab bergaya balon percakapan pesan interaktif' },
      { id: 'search_filtered_faq', label: 'Search Filtered FAQ', desc: 'Kolom pencarian yang memfilter pertanyaan secara instan' },
      { id: 'categorized_tabs_faq', label: 'Categorized Tabs FAQ', desc: 'Tab kategori di atas untuk memilah topik pertanyaan' },
      { id: 'compact_numbered_list', label: 'Compact Numbered List', desc: 'Daftar bernomor urut minimalis (01, 02, 03) collapsible' },
      { id: 'floating_help_center', label: 'Floating Help Center', desc: 'Kartu FAQ terintegrasi link chat CS WhatsApp langsung' },
      { id: 'horizontal_faq_cards', label: 'Horizontal FAQ Cards', desc: 'Kartu tanya jawab horizontal geser yang ringkas' },
    ],
    google_maps: [
      { id: 'fullwidth_map', label: 'Fullwidth Floating Card', desc: 'Peta penuh dengan floating address card di sudut' },
      { id: 'split_map_info', label: 'Split Map Info', desc: 'Alamat, jam operasional, & tombol rute di kiri, peta di kanan' },
      { id: 'compact_boxed', label: 'Compact Boxed Card', desc: 'Kartu ringkas terpusat dengan preview iframe peta' },
      { id: 'floating_address_card', label: 'Floating Address Card', desc: 'Peta terpusat dengan kartu alamat mengambang di atas' },
      { id: 'two_column_directions', label: 'Two Column Directions', desc: 'Panduan rute & transportasi di kiri, peta di kanan' },
      { id: 'store_hours_highlight', label: 'Store Hours Highlight', desc: 'Banner jam kerja operasional mencolok di samping peta' },
      { id: 'interactive_route_finder', label: 'Interactive Route Finder', desc: 'Tombol pintas petunjuk arah dengan perkiraan jarak' },
      { id: 'minimal_framed_map', label: 'Minimal Framed Map', desc: 'Bingkai peta elegan bergaris tepi tipis dengan caption' },
      { id: 'multi_branch_tabs', label: 'Multi Branch Tabs', desc: 'Tab pemilih cabang toko untuk berganti lokasi peta' },
      { id: 'card_overlay_bottom', label: 'Card Overlay Bottom', desc: 'Bar info kaca transparan di bagian bawah frame peta' },
    ],
    footer: [
      { id: 'multi_column', label: 'Multi Column Standard', desc: '3-4 Kolom (Profil Toko, Kontak WA, Menu, Hak Cipta)' },
      { id: 'centered_simple', label: 'Centered Simple', desc: 'Layout minimalis terpusat dengan tombol WA bulat' },
      { id: 'cta_focused', label: 'CTA Focused Banner', desc: 'Banner WhatsApp floating card menonjol di atas info footer' },
      { id: 'minimal_single_row', label: 'Minimal Single Row', desc: '1 Baris ramping: logo di kiri, link tengah, copyright kanan' },
      { id: 'giant_wordmark', label: 'Giant Wordmark Display', desc: 'Nama brand berukuran raksasa sebagai visual utama' },
      { id: 'newsletter_centric', label: 'Newsletter & WA Broadcast', desc: 'Form langganan broadcast WhatsApp di bagian atas footer' },
      { id: 'live_status_badge', label: 'Live Store Status', desc: 'Indikator status operasional toko live buka hari ini' },
      { id: 'split_map_footer', label: 'Split Map Footer', desc: 'Integrasi thumbnail peta lokasi toko di sisi kanan footer' },
      { id: 'social_links_grid', label: 'Social & Marketplace Grid', desc: 'Grid tautan resmi media sosial dan marketplace toko UMKM' },
      { id: 'boxed_card_footer', label: 'Boxed Card Container', desc: 'Footer berbingkai kartu terpisah dari tepi dasar layar' },
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
