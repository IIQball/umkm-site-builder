# PETA STRUKTUR FOLDER & BERKAS PROJEK
Sistem UMKM Site Builder SaaS

Berikut adalah struktur folder lengkap beserta seluruh berkas yang ada di dalam projek ini:

```
umkm-site-builder/
├── .agents/                                    # Konfigurasi & workflow agen AI pintar
│   ├── rules/
│   │   └── language-standards.md               # [18 baris] Standar aturan penulisan bahasa UI frontend
│   └── skills/                                 # Kumpulan skill agen AI cerdas
│       ├── animate/                            # Skill orkestrasi animasi & transisi UI
│       ├── apple-design/                       # Skill desain interaksi & gestur Apple-grade
│       ├── caveman/                            # Skill komunikasi terkompresi efisien token
│       ├── clean-code/                         # Skill penulisan kode bersih standar Robert C. Martin
│       ├── design-taste-frontend/              # Skill anti-slop visual landing page & frontend
│       ├── emil-design-eng/                    # Skill mikro-interaksi & UI polish Emil Kowalski
│       ├── find-animation-opportunities/       # Skill deteksi peluang animasi UI
│       ├── improve-animations/                 # Skill audit & perbaikan kualitas animasi
│       └── ponytail/                           # Skill implementasi minimalis & solusi pragmatis
│
├── docs/                                       # Dokumentasi teknis & ERD data model
│   ├── memory/
│   │   ├── codebase-map.md                     # [89 baris] Ringkasan modul krusial arsitektur SaaS
│   │   ├── css-vars.md                         # [70 baris] Standar gaya & variabel CSS global
│   │   ├── feature-01-project-setup.md         # [102 baris] Rencana inisialisasi Astro dev environment
│   │   ├── feature-01b-database-layer.md       # [147 baris] Rancangan migrasi skema database Drizzle
│   │   ├── feature-h1-xendit-setup.md          # [101 baris] Rancangan integrasi sandbox e-invoice Xendit
│   │   └── ui-inventory.md                     # [77 baris] Inventarisasi komponen visual & state layout
│   ├── planning/
│   │   └── roadmap.md                          # [199 baris] Jadwal tahapan penyelesaian rilis fitur SaaS
│   ├── prd/
│   │   ├── 00-overview.md                      # [84 baris] Latar belakang & batasan produk platform
│   │   ├── personas.md                         # [55 baris] Profil segmen tenant & desainer template
│   │   ├── user-journeys.md                    # [197 baris] Alur pengguna dari registrasi hingga go-live
│   │   ├── user-stories.md                     # [⚠️ mepet 300 baris - 256 baris] Kasus penggunaan fungsionalitas sistem
│   │   └── features/
│   │       └── _template.md                    # [79 baris] Template format dokumen prd fitur baru
│   ├── tech/
│   │   ├── api-spec.md                         # [⚠️ >300 baris - 511 baris] Spesifikasi request/response endpoint HTTP API
│   │   ├── architecture.md                     # [⚠️ >300 baris - 388 baris] Penjelasan struktur Clean Architecture SaaS
│   │   ├── code-standards.md                   # [⚠️ >300 baris - 373 baris] Aturan penulisan kode, penamaan, & clean code
│   │   ├── data-model-erd.md                   # [⚠️ >300 baris - 438 baris] ERD skema relasi antar entitas database
│   │   ├── permissions-matrix.md               # [226 baris] Tabel pembatasan hak akses rute per role
│   │   ├── security.md                         # [200 baris] Protokol enkripsi data, token, & validasi payload
│   │   └── testing-strategy.md                 # [⚠️ >300 baris - 350 baris] Panduan pembagian cakupan test suite (vitest)
│   ├── PROJECT-STATE.md                        # [⚠️ >300 baris - 411 baris] Checkpoint state update live per sesi handoff
│   └── README.md                               # [65 baris] Dokumentasi awal ringkasan pengerjaan sistem
│
├── drizzle/                                    # Berkas migrasi database SQL Drizzle ORM
│   ├── meta/
│   │   ├── _journal.json                       # [34 baris] Jurnal urutan berkas migrasi database
│   │   ├── 0000_snapshot.json                  # [⚠️ >300 baris - 2019 baris] Snapshot metadata migrasi tahap 1
│   │   ├── 0001_snapshot.json                  # [⚠️ >300 baris - 2020 baris] Snapshot metadata migrasi tahap 2
│   │   ├── 0002_snapshot.json                  # [⚠️ >300 baris - 2026 baris] Snapshot metadata migrasi tahap 3
│   │   └── 0003_snapshot.json                  # [⚠️ >300 baris - 2038 baris] Snapshot metadata migrasi tahap 4
│   ├── 0000_fast_gambit.sql                    # [⚠️ mepet 300 baris - 274 baris] Migrasi database tahap 1 (skema awal)
│   ├── 0001_exotic_madame_web.sql              # [1 baris] Migrasi database tahap 2 (tabel platform settings)
│   ├── 0002_overconfident_ted_forrester.sql    # [1 baris] Migrasi database tahap 3 (tabel bank & payout)
│   └── 0003_sloppy_mephisto.sql                # [2 baris] Migrasi database tahap 4 (settlement delay)
│
├── public/                                     # Aset statis (gambar, font, logo)
│
├── src/                                        # Kode sumber utama aplikasi
│   ├── components/
│   │   ├── admin/
│   │   │   ├── category/
│   │   │   │   ├── category.helpers.ts         # [21 baris] Helper slug & icon options kategori
│   │   │   │   ├── CategoryDeleteModal.svelte  # [50 baris] Modal konfirmasi hapus kategori
│   │   │   │   ├── CategoryFormModal.svelte    # [130 baris] Modal form tambah & edit kategori
│   │   │   │   ├── CategoryHeader.svelte       # [60 baris] Header kontrol dan pencarian kategori
│   │   │   │   └── CategoryTable.svelte        # [93 baris] Tabel daftar master kategori template
│   │   │   ├── commission/
│   │   │   │   └── CommissionSimulationCard.svelte# [73 baris] Kartu simulasi perhitungan komisi platform & desainer
│   │   │   ├── review/
│   │   │   │   ├── review.types.ts             # [14 baris] Definisi tipe data review template desainer
│   │   │   │   ├── TemplateReviewModals.svelte # [125 baris] Kumpulan modal persetujuan/penolakan review template
│   │   │   │   └── TemplateReviewTable.svelte  # [145 baris] Tabel daftar review template desainer
│   │   │   ├── whitelist/
│   │   │   │   ├── AdminAddModal.svelte        # [214 baris] Modal tambah whitelist email admin
│   │   │   │   ├── AdminConfirmModal.svelte    # [104 baris] Modal konfirmasi penghapusan whitelist
│   │   │   │   ├── AdminDetailModal.svelte     # [73 baris] Modal detail data whitelist admin
│   │   │   │   ├── AdminWhitelistTable.svelte  # [129 baris] Tabel daftar whitelist admin
│   │   │   │   └── whitelist.types.ts          # [16 baris] Tipe data whitelist admin
│   │   │   ├── AdminUserDetailModal.svelte     # [37 baris] Modal detail data user admin
│   │   │   ├── AdminUserSuspendModal.svelte    # [70 baris] Modal suspend/aktifkan user admin
│   │   │   ├── AdminWhitelistPanel.svelte      # [200 baris] Panel whitelist email Google Auth admin
│   │   │   ├── CommissionSettingsPanel.svelte  # [⚠️ mepet 300 baris - 282 baris] Form fee %, minimum payout, & settlement delay
│   │   │   ├── TemplateCategoryManager.svelte  # [⚠️ mepet 300 baris - 271 baris] Pengelola master kategori template admin
│   │   │   ├── TemplateReviewPanel.svelte      # [⚠️ mepet 300 baris - 264 baris] Panel review & verifikasi template desainer
│   │   │   └── UserManagementPanel.svelte      # [⚠️ >300 baris - 320 baris] Panel manajemen pengguna platform
│   │   ├── auth/
│   │   │   ├── ForgotPasswordForm.svelte       # [96 baris] Form permintaan reset password pengguna
│   │   │   ├── GoogleAuthButton.svelte         # [56 baris] Tombol login Google SSO BetterAuth
│   │   │   ├── LoginForm.svelte                # [168 baris] Form login tenant, designer, dan admin
│   │   │   ├── RegisterForm.svelte             # [⚠️ mepet 300 baris - 277 baris] Form registrasi tenant baru
│   │   │   └── ResetPasswordForm.svelte        # [198 baris] Form setel ulang kata sandi baru
│   │   ├── builder/
│   │   │   ├── canvas/
│   │   │   │   ├── canvasCss.helpers.ts        # [50 baris] Helper kalkulasi variabel CSS & Golden Ratio
│   │   │   │   └── CanvasSpacingHandles.svelte # [61 baris] Drag handles margin & padding section
│   │   │   ├── content/
│   │   │   │   ├── content.helpers.ts          # [51 baris] Helper pengisian konten section builder
│   │   │   │   ├── FaqContent.svelte           # [91 baris] Form inspector konten FAQ section
│   │   │   │   ├── FeaturesContent.svelte      # [99 baris] Form inspector konten features section
│   │   │   │   ├── FooterContent.svelte        # [50 baris] Form inspector konten footer section
│   │   │   │   ├── GoogleMapsContent.svelte    # [82 baris] Form inspector konten Google Maps section
│   │   │   │   ├── HeaderContent.svelte        # [234 baris] Form inspector konten header section
│   │   │   │   ├── HeroContent.svelte          # [223 baris] Form inspector konten hero section
│   │   │   │   ├── ProductCatalogContent.svelte# [151 baris] Form inspector data produk katalog
│   │   │   │   └── TestimonialsContent.svelte  # [104 baris] Form inspector isi ulasan/testimonial
│   │   │   ├── inspector/
│   │   │   │   ├── header/
│   │   │   │   │   ├── HeaderAnnouncementPanel.svelte# [119 baris] Panel teks pengumuman header
│   │   │   │   │   ├── HeaderLogoPanel.svelte  # [99 baris] Panel upload/URL logo toko
│   │   │   │   │   └── HeaderNavPanel.svelte   # [137 baris] Panel menu navigasi menu header
│   │   │   │   ├── node-forms/
│   │   │   │   │   ├── AnnouncementNodeForm.svelte# [73 baris] Form spesifik node pengumuman
│   │   │   │   │   ├── HeroElementNodeForms.svelte# [189 baris] Form elemen visual/teks hero
│   │   │   │   │   ├── HeroImageNodeForm.svelte# [121 baris] Form konfigurasi node gambar hero
│   │   │   │   │   ├── LogoNodeForm.svelte     # [139 baris] Form logo toko pada header
│   │   │   │   │   └── NavLinksNodeForm.svelte # [61 baris] Form menu navigasi
│   │   │   │   ├── theme/
│   │   │   │   │   ├── ThemeButtonsTab.svelte  # [107 baris] Tab kustomisasi tombol tema builder
│   │   │   │   │   ├── ThemeColorsTab.svelte   # [49 baris] Tab kustomisasi palet warna tema builder
│   │   │   │   │   ├── ThemeLayoutTab.svelte   # [67 baris] Tab layout spacing tema builder
│   │   │   │   │   └── ThemeTypographyTab.svelte# [90 baris] Tab kustomisasi font tema builder
│   │   │   │   ├── CatalogCardPanel.svelte     # [107 baris] Panel pengubah style kartu produk
│   │   │   │   ├── CatalogCtaPanel.svelte      # [169 baris] Panel styling tombol CTA katalog
│   │   │   │   ├── CatalogGridPanel.svelte     # [101 baris] Panel layout grid katalog produk
│   │   │   │   ├── catalogStyles.helpers.ts    # [42 baris] Fungsi helper styling css katalog
│   │   │   │   ├── CatalogStylesTab.svelte     # [22 baris] Tab pengeditan gaya katalog produk
│   │   │   │   ├── GeneralStylesTab.svelte     # [36 baris] Tab layout jarak & padding section
│   │   │   │   ├── GlobalThemeInspector.svelte # [136 baris] Panel warna dasar tema template builder
│   │   │   │   ├── HeaderStylesTab.svelte      # [23 baris] Tab konfigurasi gaya navigasi header
│   │   │   │   ├── imageUpload.helpers.ts      # [91 baris] Helper validasi/upload gambar
│   │   │   │   ├── NodeButtonStyles.svelte     # [64 baris] Panel kustomisasi styling tombol node
│   │   │   │   ├── nodeContent.constants.ts    # [53 baris] Konstanta isi konten default node
│   │   │   │   ├── NodeContentForm.svelte      # [36 baris] Form input konten dinamis tiap block
│   │   │   │   ├── nodeStyles.constants.ts     # [62 baris] Konstanta default style CSS node block
│   │   │   │   ├── SectionAppearancePanel.svelte# [190 baris] Panel background & border-radius section
│   │   │   │   ├── SectionLayoutPanel.svelte   # [36 baris] Panel layout flex/grid section
│   │   │   │   ├── SectionPresetSelector.svelte# [152 baris] Panel pemilihan preset section siap pakai
│   │   │   │   ├── SectionSlotReorder.svelte   # [73 baris] Panel drag-and-drop slots section
│   │   │   │   ├── SectionSpacingControls.svelte# [234 baris] Kontrol padding & margin interaktif
│   │   │   │   └── StyleSelector.svelte        # [85 baris] Dropdown pemilih varian style visual
│   │   │   ├── layer/
│   │   │   │   ├── AddNodeDropdown.svelte      # [45 baris] Tombol nambah block section baru
│   │   │   │   ├── layerPanel.helpers.ts       # [115 baris] Helper manipulasi susunan layer
│   │   │   │   └── LayerSectionItem.svelte     # [180 baris] Komponen item baris layer section
│   │   │   ├── registry/
│   │   │   │   ├── index.ts                    # [235 baris] Registri sentral modularisasi modul section builder
│   │   │   │   └── registry.types.ts           # [17 baris] Definisi tipe registry map section
│   │   │   ├── sections/
│   │   │   │   ├── catalog/
│   │   │   │   │   ├── CatalogBentoSpotlight.svelte# [89 baris] Layout bento spotlight katalog
│   │   │   │   │   ├── CatalogCarouselMasonry.svelte# [88 baris] Layout carousel & masonry katalog
│   │   │   │   │   ├── CatalogCheckoutModal.svelte# [211 baris] Modal checkout cepat katalog
│   │   │   │   │   ├── CatalogGridStandard.svelte# [68 baris] Layout grid katalog standar
│   │   │   │   │   ├── CatalogListCompact.svelte# [39 baris] Layout list compact horizontal
│   │   │   │   │   ├── CatalogPriceTable.svelte# [45 baris] Layout daftar harga tabular
│   │   │   │   │   ├── CatalogSidebarFilter.svelte# [87 baris] Layout katalog dengan sidebar kategori
│   │   │   │   │   ├── ProductCatalogCard.svelte# [213 baris] Komponen visual kartu katalog produk
│   │   │   │   │   └── ProductCatalogQuickView.svelte# [156 baris] Detail popup cepat ulasan produk
│   │   │   │   ├── faq/
│   │   │   │   │   ├── FaqBoxedCardsGrid.svelte# [35 baris] Preset FAQ kotak kartu grid
│   │   │   │   │   ├── FaqCategorizedTabs.svelte# [61 baris] Preset FAQ dengan tab kategori
│   │   │   │   │   ├── FaqChatStyle.svelte     # [29 baris] Preset FAQ gaya balon obrolan
│   │   │   │   │   ├── FaqSearchFiltered.svelte# [66 baris] Preset FAQ dengan filter pencarian
│   │   │   │   │   └── FaqSplitSidebar.svelte  # [64 baris] Preset FAQ layout split sidebar
│   │   │   │   ├── features/
│   │   │   │   │   ├── FeaturesBentoGrid.svelte# [53 baris] Preset fitur layout bento grid
│   │   │   │   │   ├── FeaturesComparison.svelte# [41 baris] Preset fitur tabel komparasi keunggulan
│   │   │   │   │   ├── FeaturesInteractiveTabs.svelte# [46 baris] Preset fitur tab interaktif
│   │   │   │   │   └── FeaturesVerticalAccordion.svelte# [45 baris] Preset fitur akordeon vertikal
│   │   │   │   ├── footer/
│   │   │   │   │   ├── FooterNewsletter.svelte # [39 baris] Preset footer langganan newsletter
│   │   │   │   │   └── FooterSocialShowcase.svelte# [27 baris] Preset footer showcase media sosial
│   │   │   │   ├── header/
│   │   │   │   │   ├── AnnouncementBar.svelte  # [74 baris] Baris pengumuman di atas navigasi
│   │   │   │   │   ├── HeaderCommandSearch.svelte# [43 baris] Preset header pencarian cepat command palette
│   │   │   │   │   ├── HeaderLogo.svelte       # [85 baris] Elemen visual logo website toko
│   │   │   │   │   ├── HeaderMegaMenu.svelte   # [75 baris] Preset header mega menu navigasi
│   │   │   │   │   ├── HeaderNav.svelte        # [206 baris] Elemen menu navigasi toko
│   │   │   │   │   └── HeaderPillIsland.svelte # [41 baris] Preset header floating pill island
│   │   │   │   ├── hero/
│   │   │   │   │   ├── HeroCenteredMinimal.svelte# [77 baris] Template hero minimalis tengah
│   │   │   │   │   ├── HeroElementToolbar.svelte# [102 baris] Floating toolbar elemen teks/gambar hero
│   │   │   │   │   ├── HeroEmailCapture.svelte # [42 baris] Preset hero penangkap email prospek
│   │   │   │   │   ├── HeroFloatingCards.svelte# [49 baris] Preset hero kartu mengambang 3D
│   │   │   │   │   ├── HeroFullBanner.svelte   # [66 baris] Template hero latar belakang penuh
│   │   │   │   │   ├── HeroSplitLayout.svelte  # [153 baris] Template hero 50/50 visual terpisah
│   │   │   │   │   └── HeroTerminalCode.svelte # [56 baris] Preset hero gaya terminal developer
│   │   │   │   ├── maps/
│   │   │   │   │   ├── MapsDirectionsGuide.svelte# [35 baris] Preset maps panduan rute & navigasi
│   │   │   │   │   └── MapsMultiBranch.svelte  # [32 baris] Preset maps banyak cabang toko UMKM
│   │   │   │   ├── testimonials/
│   │   │   │   │   ├── TestimonialsMarquee.svelte# [30 baris] Preset testimoni berjalan otomatis
│   │   │   │   │   ├── TestimonialsSocialCards.svelte# [34 baris] Preset testimoni kartu media sosial
│   │   │   │   │   ├── TestimonialsSpotlightCarousel.svelte# [93 baris] Preset testimoni spotlight & slider
│   │   │   │   │   └── TestimonialsVideoCards.svelte# [34 baris] Preset testimoni kartu video ulasan
│   │   │   │   ├── FAQ.svelte                  # [212 baris] Komponen visual Frequently Asked Questions
│   │   │   │   ├── Features.svelte             # [⚠️ mepet 300 baris - 275 baris] Komponen visual daftar keunggulan/layanan
│   │   │   │   ├── Footer.svelte               # [165 baris] Footer publik website toko tenant
│   │   │   │   ├── GoogleMaps.svelte           # [156 baris] Komponen visual embed lokasi Google Maps
│   │   │   │   ├── HeaderAnnouncement.svelte   # [165 baris] Komponen visual announcement bar
│   │   │   │   ├── Hero.svelte                 # [240 baris] Banner hero publik website toko tenant
│   │   │   │   ├── productCatalog.helpers.ts   # [55 baris] Helper load data produk toko
│   │   │   │   ├── ProductCatalog.svelte       # [242 baris] Komponen visual daftar katalog produk
│   │   │   │   ├── SectionRenderer.svelte      # [166 baris] Renderer block layout editor no-code
│   │   │   │   └── Testimonials.svelte         # [165 baris] Komponen visual ulasan/testimoni pelanggan
│   │   │   ├── stores/
│   │   │   │   ├── canvasStore.ts              # [117 baris] Svelte store state kanvas & grid guides
│   │   │   │   ├── documentStore.actions.ts    # [193 baris] Action mutator dokumen & riwayat undo/redo
│   │   │   │   ├── documentStore.ts            # [⚠️ mepet 300 baris - 298 baris] Svelte store template dokumen, preset, & tokens
│   │   │   │   ├── editorStore.mutations.ts    # [193 baris] Operasi mutasi state no-code (save, update)
│   │   │   │   ├── editorStore.ts              # [32 baris] Svelte writable store state builder editor
│   │   │   │   └── editorStore.types.ts        # [76 baris] Tipe TypeScript state editor builder
│   │   │   ├── template-form/
│   │   │   │   ├── TemplateBasicDetails.svelte # [84 baris] Input nama, kategori, & thumbnail draf
│   │   │   │   ├── TemplateCardPreview.svelte  # [104 baris] Mockup kartu preview live draf template
│   │   │   │   └── TemplatePricingSimulator.svelte# [100 baris] Simulator split harga & fee komisi
│   │   │   ├── topbar/
│   │   │   │   └── TopBarViewportControls.svelte# [90 baris] Kontrol viewport breakpoint & zoom editor
│   │   │   ├── BuilderEditor.svelte            # [219 baris] Halaman utama editor visual no-code builder
│   │   │   ├── Canvas.svelte                   # [⚠️ mepet 300 baris - 253 baris] Lembar kerja visual kanvas editor builder
│   │   │   ├── ContentTab.svelte               # [16 baris] Tab pengisian teks & gambar konten node
│   │   │   ├── LayerPanel.svelte               # [120 baris] Panel pohon layer hirarki section template
│   │   │   ├── LayoutGridOverlay.svelte        # [57 baris] Overlay panduan kolom Figma 12/8/4 & pixel grid
│   │   │   ├── NewTemplateForm.svelte          # [239 baris] Form pembuatan template draft desainer
│   │   │   ├── NodeStylesTab.svelte            # [246 baris] Tab kustomisasi spesifik style per node
│   │   │   ├── PropertyInspector.svelte        # [201 baris] Panel samping inspection properti node & tema
│   │   │   ├── ReadOnlyPreview.svelte          # [246 baris] Pratinjau baca-saja live template
│   │   │   ├── StylesTab.svelte                # [18 baris] Tab helper navigasi styles
│   │   │   ├── SubmitReviewModal.svelte        # [220 baris] Modal pengajuan review template ke admin
│   │   │   └── TopBar.svelte                   # [152 baris] Bar atas editor (undo, redo, zoom, breakpoint)
│   │   ├── checkout/
│   │   │   ├── CheckoutItemDetails.svelte      # [129 baris] Rincian item produk template checkout
│   │   │   ├── CheckoutPaymentBreakdown.svelte # [135 baris] Rincian perhitungan total tagihan & admin fee
│   │   │   ├── CheckoutSummaryCard.svelte      # [114 baris] Ringkasan detail tagihan checkout invoice
│   │   │   ├── PaymentModal.svelte             # [65 baris] Modal pembayaran invoice Xendit
│   │   │   └── TransactionStatus.svelte        # [81 baris] Status tagihan invoice (polling & status badge)
│   │   ├── common/
│   │   │   ├── Navbar.astro                    # [23 baris] Navigasi utama header base layout
│   │   │   ├── PublicNavbar.svelte             # [⚠️ >300 baris - 424 baris] Navbar publik interaktif
│   │   │   └── ThemeToggle.astro               # [37 baris] Tombol pengubah dark mode / light mode
│   │   ├── dashboard/
│   │   │   ├── category/
│   │   │   │   ├── TenantCategoryDeleteModal.svelte# [41 baris] Modal konfirmasi hapus kategori tenant
│   │   │   │   └── TenantCategoryFormModal.svelte# [52 baris] Modal form tambah & edit kategori tenant
│   │   │   ├── navbar/
│   │   │   │   └── NavbarUserMenu.svelte       # [133 baris] Dropdown profil & opsi logout navbar
│   │   │   ├── orders/
│   │   │   │   └── TenantOrderRow.svelte       # [117 baris] Baris riwayat transaksi pesanan tenant
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.helpers.ts          # [170 baris] Helper navigasi sidebar dashboard
│   │   │   │   ├── SidebarDesktop.svelte       # [195 baris] Sidebar dashboard versi layar desktop
│   │   │   │   ├── SidebarMobile.svelte        # [178 baris] Drawer sidebar dashboard versi mobile
│   │   │   │   └── SidebarUserProfile.svelte   # [89 baris] Mini profil & badge status tenant
│   │   │   ├── CategoryManager.svelte          # [⚠️ mepet 300 baris - 258 baris] Pengelola CRUD kategori produk tenant
│   │   │   ├── ConfirmTemplateModal.svelte     # [82 baris] Modal konfirmasi penerapan template toko
│   │   │   ├── DashboardNavbar.svelte          # [176 baris] Navigasi panel dashboard tenant
│   │   │   ├── OrderHistoryTable.svelte        # [228 baris] Tabel riwayat pesanan/transaksi tenant
│   │   │   ├── Sidebar.svelte                  # [57 baris] Menu navigasi sidebar panel tenant
│   │   │   ├── StoreSettingsForm.svelte        # [213 baris] Konfigurasi WhatsApp, Google Maps, & profil toko
│   │   │   ├── TemplateGallery.svelte          # [243 baris] Galeri pilihan template desain toko
│   │   │   └── TrafficWidget.svelte            # [96 baris] Widget statistik trafik kunjungan storefront
│   │   ├── designer/
│   │   │   ├── orders/
│   │   │   │   └── DesignerOrderRow.svelte     # [100 baris] Baris tabel pesanan template desainer
│   │   │   ├── templates/
│   │   │   │   ├── DesignerRejectionModal.svelte# [46 baris] Modal alasan penolakan template desainer
│   │   │   │   └── DesignerTemplateRow.svelte  # [131 baris] Baris data tabel kelola template desainer
│   │   │   ├── wallet/
│   │   │   │   ├── DesignerWeeklyChart.svelte  # [105 baris] Grafik tren pendapatan mingguan desainer
│   │   │   │   └── wallet.helpers.ts           # [44 baris] Helper kalkulasi saldo & mutasi dompet
│   │   │   ├── DesignerBankCard.svelte         # [174 baris] Kartu info rekening bank terhubung desainer
│   │   │   ├── DesignerBankModal.svelte        # [107 baris] Modal data rekening bank desainer
│   │   │   ├── DesignerBankWithdraw.svelte     # [⚠️ mepet 300 baris - 294 baris] Form rekening bank & modal payout desainer
│   │   │   ├── DesignerMutationTable.svelte    # [214 baris] Tabel daftar mutasi keuangan desainer
│   │   │   ├── DesignerOrdersTable.svelte      # [236 baris] Tabel pesanan masuk dari tenant untuk desainer
│   │   │   ├── DesignerPayoutHistoryTable.svelte# [224 baris] Tabel riwayat payout desainer
│   │   │   ├── DesignerStatCards.svelte        # [94 baris] Ringkasan balance, komisi, & template terjual
│   │   │   ├── DesignerTemplateCard.svelte     # [186 baris] Kartu template buatan desainer (status review)
│   │   │   ├── DesignerTemplateTable.svelte    # [237 baris] Tabel kelola template desainer
│   │   │   ├── DesignerWalletOverview.svelte   # [92 baris] Ringkasan dompet desainer & tombol withdraw
│   │   │   └── DesignerWithdrawModal.svelte    # [174 baris] Modal konfirmasi withdraw desainer
│   │   ├── onboarding/
│   │   │   ├── wizard/
│   │   │   │   ├── OnboardingStepStoreInfo.svelte# [97 baris] Step form nama toko & kontak
│   │   │   │   ├── OnboardingStepSubdomain.svelte# [76 baris] Step form pemilihan subdomain
│   │   │   │   └── OnboardingStepSuccess.svelte# [32 baris] Step sukses inisialisasi onboarding
│   │   │   └── OnboardingWizard.svelte         # [235 baris] Form inisialisasi subdomain & toko baru tenant
│   │   ├── public/
│   │   │   ├── marketplace/
│   │   │   │   ├── marketplace.helpers.ts      # [58 baris] Helper filter & pengurutan pasar template
│   │   │   │   ├── MarketplaceCard.svelte      # [119 baris] Kartu template visual marketplace
│   │   │   │   └── MarketplaceFilterBar.svelte # [124 baris] Toolbar filter kategori & harga
│   │   │   ├── marketplace.types.ts            # [23 baris] Tipe data catalog template marketplace
│   │   │   ├── PublicTemplateMarketplace.svelte# [199 baris] Pasar katalog template interaktif
│   │   │   ├── StoreDirectory.svelte           # [199 baris] Direktori daftar pencarian toko UMKM publik
│   │   │   └── TemplateCardAction.svelte       # [100 baris] Kartu katalog template dengan tombol beli & demo
│   │   ├── shared/
│   │   │   └── ImageUpload.svelte              # [⚠️ >300 baris - 312 baris] Pengunggah gambar terintegrasi Cloudinary API
│   │   ├── storefront/
│   │   │   ├── DynamicSection.svelte           # [41 baris] Komponen rendering section dinamis storefront
│   │   │   ├── Footer.svelte                   # [10 baris] Footer publik website toko tenant
│   │   │   ├── Hero.svelte                     # [18 baris] Banner hero publik website toko tenant
│   │   │   ├── ProductGrid.svelte              # [104 baris] Grid daftar produk di storefront
│   │   │   └── PromoBanner.svelte              # [11 baris] Banner promosi publik website toko tenant
│   │   ├── tenant/
│   │   │   ├── product/
│   │   │   │   ├── ProductBasicFields.svelte   # [58 baris] Form field dasar produk (nama, harga, kategori)
│   │   │   │   ├── productForm.helpers.ts      # [56 baris] Helper serialisasi & validasi form produk
│   │   │   │   └── ProductVariantEditor.svelte # [155 baris] Pengelola grup & opsi varian produk
│   │   │   ├── ProductDeleteModal.svelte       # [78 baris] Dialog konfirmasi penghapusan produk
│   │   │   ├── ProductFormModal.svelte         # [⚠️ mepet 300 baris - 283 baris] Modal tambah/edit data produk toko
│   │   │   ├── ProductTable.svelte             # [⚠️ >300 baris - 335 baris] Tabel daftar produk dagangan tenant
│   │   │   ├── ProductTableRow.svelte          # [101 baris] Baris data produk toko tenant
│   │   │   └── StoreManager.svelte             # [245 baris] Panel monitoring penjualan tenant
│   │   ├── tokens/
│   │   │   ├── animations.ts                   # [41 baris] Token durasi & kurva easing transisi
│   │   │   ├── colors.ts                       # [129 baris] Token warna primer, sekunder, & netral
│   │   │   ├── index.ts                        # [12 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── radius.ts                       # [35 baris] Token concentric border radius
│   │   │   ├── shadows.ts                      # [23 baris] Token elevasi bayangan shadow box
│   │   │   ├── spacing.ts                      # [42 baris] Token grid 8pt layout spacing
│   │   │   └── typography.ts                   # [73 baris] Token scale & font-family Golden Ratio
│   │   └── ui/
│   │       ├── Badge.svelte                    # [57 baris] Komponen badge info status visual
│   │       ├── Button.svelte                   # [123 baris] Komponen tombol interaktif modular
│   │       ├── Card.svelte                     # [72 baris] Komponen pembungkus kartu visual
│   │       ├── index.ts                        # [17 baris] Registri sentral modularisasi modul section builder
│   │       ├── Input.svelte                    # [186 baris] Komponen kolom isian teks input
│   │       ├── Modal.svelte                    # [141 baris] Komponen popup modal dialog
│   │       ├── Pagination.svelte               # [103 baris] Komponen paginasi kontrol halaman data
│   │       ├── Select.svelte                   # [126 baris] Komponen dropdown select pilihan
│   │       ├── StatCard.svelte                 # [118 baris] Komponen card ringkasan statistik modular
│   │       ├── Table.svelte                    # [57 baris] Komponen tabel tabular modular
│   │       ├── Textarea.svelte                 # [106 baris] Komponen kolom input text area
│   │       ├── ToastContainer.svelte           # [123 baris] Kontainer notifikasi toast mengambang
│   │       └── WhatsAppIcon.svelte             # [18 baris] Ikon WhatsApp SVG modular
│   ├── db/
│   │   ├── index.ts                            # [28 baris] Registri sentral modularisasi modul section builder
│   │   ├── schema.ts                           # [⚠️ >300 baris - 440 baris] Skema relasi database & tabel SaaS Drizzle
│   │   └── seed.ts                             # [127 baris] Script seeding data demo database
│   ├── layouts/
│   │   ├── BaseLayout.astro                    # [49 baris] Layout dasar halaman publik web
│   │   ├── DashboardLayout.astro               # [63 baris] Layout terproteksi admin/tenant/designer
│   │   └── StorefrontLayout.astro              # [25 baris] Layout storefront khusus tenant (subdomain)
│   ├── lib/
│   │   ├── auth/
│   │   │   └── .gitkeep                        # [1 baris] Modul pendukung
│   │   ├── config/
│   │   │   └── app.ts                          # [61 baris] Konfigurasi konstanta platform & branding
│   │   ├── db/
│   │   │   └── client.ts                       # [33 baris] Klien database siap pakai
│   │   ├── errors/
│   │   │   └── .gitkeep                        # [1 baris] Modul pendukung
│   │   ├── finance/
│   │   │   ├── index.ts                        # [5 baris] Registri sentral modularisasi modul section builder
│   │   │   └── xendit.ts                       # [192 baris] Integrasi SDK e-invoice & payout Xendit
│   │   ├── routes/
│   │   │   └── .gitkeep                        # [1 baris] Modul pendukung
│   │   ├── routing/
│   │   │   └── subdomain.ts                    # [29 baris] Utilitas parsing & ekstraksi subdomain multitenancy
│   │   ├── stores/
│   │   │   └── schemas.ts                      # [29 baris] Skema validasi state svelte store
│   │   ├── templates/
│   │   │   ├── index.ts                        # [5 baris] Registri sentral modularisasi modul section builder
│   │   │   └── migration.ts                    # [202 baris] Logika pipeline migrasi skema template
│   │   ├── utils/
│   │   │   ├── api-handler.ts                  # [76 baris] Pembungkus standar API route handler
│   │   │   ├── designMath.ts                   # [35 baris] Utilitas rumus radius & Golden Ratio
│   │   │   ├── email.ts                        # [48 baris] Utilitas template pengiriman email notifikasi
│   │   │   ├── format.ts                       # [35 baris] Fungsi formatter mata uang IDR & waktu
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── logger.ts                       # [24 baris] Logger console terstandar
│   │   │   └── validation.ts                   # [20 baris] Utilitas validator skema Zod
│   │   ├── validators/
│   │   │   └── subdomain.ts                    # [28 baris] Utilitas parsing & ekstraksi subdomain multitenancy
│   │   ├── auth-client.ts                      # [9 baris] Klien inisialisasi auth BetterAuth (frontend)
│   │   ├── auth.ts                             # [⚠️ mepet 300 baris - 260 baris] Konfigurasi server BetterAuth & database adapter
│   │   ├── cloudinary.ts                       # [142 baris] Pembantu upload gambar aman ke Cloudinary
│   │   ├── currency.ts                         # [24 baris] Utilitas manipulasi nilai rupiah
│   │   ├── toast.ts                            # [71 baris] State store penampil alert notifikasi melayang
│   │   └── whatsapp.ts                         # [27 baris] Utilitas generator URL chat WhatsApp
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── index.astro                 # [47 baris] Modul pendukung
│   │   │   ├── template-categories/
│   │   │   │   └── index.astro                 # [100 baris] Modul pendukung
│   │   │   ├── templates/
│   │   │   │   └── index.astro                 # [119 baris] Modul pendukung
│   │   │   ├── users/
│   │   │   │   └── index.astro                 # [21 baris] Modul pendukung
│   │   │   └── whitelist/
│   │   │       └── index.astro                 # [21 baris] Modul pendukung
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── media/
│   │   │   │   │   └── cleanup.ts              # [39 baris] Modul pendukung
│   │   │   │   ├── settings/
│   │   │   │   │   └── commission.ts           # [48 baris] Tipe skema bagi hasil komisi
│   │   │   │   ├── template-categories/
│   │   │   │   │   ├── [id].ts                 # [46 baris] Modul pendukung
│   │   │   │   │   └── index.ts                # [36 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── templates/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── review.ts           # [36 baris] Modul pendukung
│   │   │   │   │   └── index.ts                # [21 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── users/
│   │   │   │   │   ├── [userId]/
│   │   │   │   │   │   └── status.ts           # [57 baris] Modul pendukung
│   │   │   │   │   └── index.ts                # [31 baris] Registri sentral modularisasi modul section builder
│   │   │   │   └── whitelist.ts                # [125 baris] Modul pendukung
│   │   │   ├── analytics/
│   │   │   │   └── track.ts                    # [24 baris] Modul pendukung
│   │   │   ├── auth/
│   │   │   │   ├── [...all].ts                 # [22 baris] Modul pendukung
│   │   │   │   ├── check-email.ts              # [30 baris] Modul pendukung
│   │   │   │   ├── error.ts                    # [14 baris] Modul pendukung
│   │   │   │   └── reset-password.ts           # [42 baris] Modul pendukung
│   │   │   ├── builder/
│   │   │   │   └── save.ts                     # [30 baris] Modul pendukung
│   │   │   ├── categories/
│   │   │   │   └── index.ts                    # [125 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── designer/
│   │   │   │   ├── payout/
│   │   │   │   │   └── status.ts               # [43 baris] Modul pendukung
│   │   │   │   ├── templates/
│   │   │   │   │   ├── draft.ts                # [124 baris] Modul pendukung
│   │   │   │   │   └── submit-review.ts        # [28 baris] Modul pendukung
│   │   │   │   ├── bank-account.ts             # [84 baris] Modul pendukung
│   │   │   │   └── payout.ts                   # [145 baris] Modul pendukung
│   │   │   ├── directory/
│   │   │   │   └── search.ts                   # [108 baris] Modul pendukung
│   │   │   ├── media/
│   │   │   │   ├── delete.ts                   # [33 baris] Modul pendukung
│   │   │   │   └── sign.ts                     # [59 baris] Modul pendukung
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── stock.ts                # [47 baris] Modul pendukung
│   │   │   │   │   └── variants.ts             # [147 baris] Modul pendukung
│   │   │   │   ├── [id].ts                     # [107 baris] Modul pendukung
│   │   │   │   └── index.ts                    # [106 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── public/
│   │   │   │   ├── template-categories/
│   │   │   │   │   └── index.ts                # [11 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── templates/
│   │   │   │   │   └── index.ts                # [15 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── transactions/
│   │   │   │   │   └── status/
│   │   │   │   │       └── [invoiceId].ts      # [36 baris] Modul pendukung
│   │   │   │   └── commission.ts               # [20 baris] Tipe skema bagi hasil komisi
│   │   │   ├── storefront/
│   │   │   │   └── catalog.ts                  # [50 baris] Modul pendukung
│   │   │   ├── stores/
│   │   │   │   ├── [storeId]/
│   │   │   │   │   ├── apply-template.ts       # [54 baris] Modul pendukung
│   │   │   │   │   └── products.ts             # [91 baris] Modul pendukung
│   │   │   │   ├── check-subdomain.ts          # [51 baris] Modul pendukung
│   │   │   │   ├── onboard.ts                  # [113 baris] Modul pendukung
│   │   │   │   ├── register-subdomain.ts       # [111 baris] Modul pendukung
│   │   │   │   └── settings.ts                 # [64 baris] Modul pendukung
│   │   │   ├── template-categories/
│   │   │   │   └── index.ts                    # [11 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── templates/
│   │   │   │   └── index.ts                    # [20 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── tenant/
│   │   │   │   ├── templates/
│   │   │   │   │   └── index.ts                # [21 baris] Registri sentral modularisasi modul section builder
│   │   │   │   └── transactions/
│   │   │   │       └── template-purchase.ts    # [42 baris] Modul pendukung
│   │   │   └── webhooks/
│   │   │       └── xendit.ts                   # [98 baris] Integrasi SDK e-invoice & payout Xendit
│   │   ├── auth/
│   │   │   ├── error.astro                     # [61 baris] Modul pendukung
│   │   │   ├── forgot-password.astro           # [25 baris] Modul pendukung
│   │   │   ├── login.astro                     # [172 baris] Modul pendukung
│   │   │   └── reset-password.astro            # [25 baris] Modul pendukung
│   │   ├── builder/
│   │   │   ├── preview/
│   │   │   │   └── [templateId].astro          # [55 baris] Modul pendukung
│   │   │   ├── [templateId].astro              # [28 baris] Modul pendukung
│   │   │   └── new.astro                       # [25 baris] Modul pendukung
│   │   ├── checkout/
│   │   │   └── [invoiceId].astro               # [163 baris] Modul pendukung
│   │   ├── dashboard/
│   │   │   ├── analytics.astro                 # [39 baris] Modul pendukung
│   │   │   ├── categories.astro                # [52 baris] Modul pendukung
│   │   │   ├── index.astro                     # [69 baris] Modul pendukung
│   │   │   ├── orders.astro                    # [114 baris] Modul pendukung
│   │   │   ├── products.astro                  # [68 baris] Modul pendukung
│   │   │   ├── store-settings.astro            # [42 baris] Modul pendukung
│   │   │   ├── store.astro                     # [42 baris] Modul pendukung
│   │   │   └── templates.astro                 # [61 baris] Modul pendukung
│   │   ├── designer/
│   │   │   ├── orders.astro                    # [117 baris] Modul pendukung
│   │   │   ├── templates.astro                 # [128 baris] Modul pendukung
│   │   │   └── wallet.astro                    # [98 baris] Modul pendukung
│   │   ├── onboarding/
│   │   │   └── index.astro                     # [18 baris] Modul pendukung
│   │   ├── storefront/
│   │   │   ├── [subdomain].astro               # [83 baris] Modul pendukung
│   │   │   └── index.astro                     # [45 baris] Modul pendukung
│   │   ├── templates/
│   │   │   └── index.astro                     # [92 baris] Modul pendukung
│   │   ├── 401.astro                           # [11 baris] Modul pendukung
│   │   ├── 403.astro                           # [11 baris] Modul pendukung
│   │   ├── 404.astro                           # [11 baris] Modul pendukung
│   │   ├── index.astro                         # [100 baris] Modul pendukung
│   │   ├── login.astro                         # [5 baris] Modul pendukung
│   │   ├── register.astro                      # [5 baris] Modul pendukung
│   │   ├── test-store.astro                    # [27 baris] Modul pendukung
│   │   └── umkm.astro                          # [28 baris] Modul pendukung
│   ├── schemas/
│   │   ├── admin/
│   │   │   ├── admin.schema.ts                 # [60 baris] Skema Zod komisi & parameter platform settings
│   │   │   └── index.ts                        # [2 baris] Registri sentral modularisasi modul section builder
│   │   ├── designer/
│   │   │   ├── bank-account.schema.ts          # [10 baris] Skema Zod rekening bank desainer
│   │   │   └── payout.schema.ts                # [9 baris] Skema Zod nominal pengajuan payout desainer
│   │   ├── finance/
│   │   │   ├── index.ts                        # [5 baris] Registri sentral modularisasi modul section builder
│   │   │   └── transaction.schema.ts           # [44 baris] Skema Zod verifikasi parameter transaksi
│   │   ├── templates/
│   │   │   ├── index.ts                        # [6 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── template-category.schema.ts     # [28 baris] Skema Zod validasi kategori template
│   │   │   ├── template.defaults.ts            # [240 baris] Default konfigurasi sections & themes template
│   │   │   ├── template.presets.ts             # [126 baris] Skema Zod validasi preset layout section
│   │   │   ├── template.schema.ts              # [148 baris] Skema Zod visual draf & metadata template
│   │   │   └── template.tokens.ts              # [46 baris] Skema Zod token warna & tipografi template
│   │   ├── auth.schema.ts                      # [40 baris] Skema Zod validasi kredensial pengguna
│   │   ├── index.ts                            # [13 baris] Registri sentral modularisasi modul section builder
│   │   ├── media.schema.ts                     # [60 baris] Skema Zod upload data berkas gambar
│   │   └── product-variant.schema.ts           # [31 baris] Skema Zod varian produk
│   ├── services/
│   │   ├── finance/
│   │   │   ├── commission.service.ts           # [132 baris] Logika bagi hasil komisi platform & desainer
│   │   │   ├── index.ts                        # [9 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── payout.service.ts               # [169 baris] Logika transaksi penarikan dana desainer
│   │   │   ├── transaction.helpers.ts          # [103 baris] Helper aktivasi kepemilikan template tenant
│   │   │   ├── transaction.service.ts          # [234 baris] Logika pembuatan invoice & aktivasi toko
│   │   │   ├── wallet.helpers.ts               # [78 baris] Helper kalkulasi saldo & mutasi dompet
│   │   │   └── wallet.service.ts               # [218 baris] Ledger mutasi wallet & hitung saldo matang
│   │   ├── media/
│   │   │   ├── cleanup.helpers.ts              # [165 baris] Helper ekstraksi URL & identifier Cloudinary
│   │   │   ├── cleanup.service.ts              # [157 baris] Logika deteksi & pembersihan orphan media Cloudinary
│   │   │   └── index.ts                        # [2 baris] Registri sentral modularisasi modul section builder
│   │   ├── template-categories/
│   │   │   ├── index.ts                        # [2 baris] Registri sentral modularisasi modul section builder
│   │   │   └── template-category.service.ts    # [119 baris] Logika database CRUD kategori template
│   │   ├── templates/
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── template.admin.service.ts       # [75 baris] Logika review & verifikasi template admin
│   │   │   └── template.service.ts             # [248 baris] Logika database template & status review
│   │   ├── analytics.service.ts                # [55 baris] Logika analytics trafik
│   │   ├── index.ts                            # [12 baris] Registri sentral modularisasi modul section builder
│   │   └── store-template.service.ts           # [192 baris] Logika penerapan & rendering template storefront
│   ├── styles/
│   │   └── global.css                          # [⚠️ >300 baris - 324 baris] Variabel Tailwind, gaya global, & reset CSS
│   ├── types/
│   │   ├── admin/
│   │   │   └── index.ts                        # [29 baris] Registri sentral modularisasi modul section builder
│   │   ├── auth/
│   │   │   └── index.ts                        # [15 baris] Registri sentral modularisasi modul section builder
│   │   ├── common/
│   │   │   ├── api.ts                          # [70 baris] Tipe standard HTTP API responses
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   └── toast.ts                        # [10 baris] State store penampil alert notifikasi melayang
│   │   ├── finance/
│   │   │   ├── commission.ts                   # [19 baris] Tipe skema bagi hasil komisi
│   │   │   ├── index.ts                        # [8 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── transactions.ts                 # [109 baris] Tipe invoice transaksi & log webhook
│   │   │   └── wallet.ts                       # [59 baris] Tipe ledger wallet, mutasi, & detail payout
│   │   ├── media/
│   │   │   └── index.ts                        # [22 baris] Registri sentral modularisasi modul section builder
│   │   ├── templates/
│   │   │   ├── builder.sections.ts             # [161 baris] Tipe data props spesifik per section builder
│   │   │   ├── builder.ts                      # [147 baris] Tipe data visual block editor no-code
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   └── template.ts                     # [49 baris] Tipe data model template & pratinjau
│   │   └── index.ts                            # [13 baris] Registri sentral modularisasi modul section builder
│   ├── env.d.ts                                # [32 baris] Deklarasi global compiler TypeScript Astro
│   └── middleware.ts                           # [83 baris] Middleware otentikasi & pengecekan role
│
├── tests/                                      # Suite pengujian unit & integrasi (Vitest)
│   ├── api/
│   │   ├── analytics/
│   │   │   └── track.test.ts                   # [99 baris] Uji analitik event track
│   │   ├── builder/
│   │   │   └── save.test.ts                    # [60 baris] Uji proteksi penyimpanan draf builder
│   │   ├── categories/
│   │   │   └── index.test.ts                   # [102 baris] Uji API CRUD kategori produk tenant
│   │   ├── designer/
│   │   │   ├── templates/
│   │   │   │   └── submit-review.test.ts       # [210 baris] Uji API pengajuan review template desainer
│   │   │   ├── bank-account.test.ts            # [⚠️ mepet 300 baris - 250 baris] Uji API CRUD rekening desainer
│   │   │   ├── payout-status.test.ts           # [90 baris] Uji API status penarikan dana desainer
│   │   │   └── payout.test.ts                  # [243 baris] Uji API pencairan komisi desainer
│   │   ├── directory/                          
│   │   │   └── search.test.ts                  # [33 baris] Uji API pencarian direktori toko UMKM
│   │   ├── products/
│   │   │   ├── index.test.ts                   # [146 baris] Uji API CRUD produk toko tenant
│   │   │   ├── stock.test.ts                   # [72 baris] Uji API pembaruan stok produk instan
│   │   │   └── variants.test.ts                # [⚠️ mepet 300 baris - 274 baris] Uji API CRUD varian produk
│   │   ├── public/
│   │   │   ├── templates/
│   │   │   │   └── index.test.ts               # [17 baris] Uji API katalog template publik
│   │   │   └── commission.test.ts              # [28 baris] Uji API pembacaan komisi untuk publik
│   │   ├── storefront/
│   │   │   └── catalog.test.ts                 # [59 baris] Uji API catalog storefront tenant
│   │   ├── stores/
│   │   │   └── [storeId]/
│   │   │       ├── apply-template.test.ts      # [151 baris] Uji fungsionalitas penerapan template ke toko
│   │   │       └── products.test.ts            # [138 baris] Uji API katalog produk spesifik toko
│   │   ├── webhooks/
│   │   │   └── xendit.test.ts                  # [153 baris] Uji penanganan webhook e-invoice Xendit
│   │   ├── admin-media-cleanup.test.ts         # [126 baris] Uji API pembersihan aset orphan Cloudinary
│   │   ├── check-subdomain.test.ts             # [64 baris] Uji validasi subdomain input Zod
│   │   ├── media-sign.test.ts                  # [69 baris] Uji Cloudinary signed upload generator
│   │   └── template-categories.test.ts         # [119 baris] Uji API & skema master kategori template
│   ├── builder/
│   │   └── section-registry.test.ts            # [88 baris] Uji modularitas section registry map
│   ├── finance/
│   │   ├── commission-and-masking.test.ts      # [⚠️ mepet 300 baris - 297 baris] Uji engine komisi & masking nominal rupiah
│   │   ├── payout-disbursement.test.ts         # [242 baris] Uji webhook disbursement & saldo payout
│   │   └── price-sync.test.ts                  # [⚠️ >300 baris - 326 baris] Uji sinkronisasi harga template & komisi
│   ├── lib/
│   │   ├── transactions/
│   │   │   └── service.test.ts                 # [⚠️ >300 baris - 402 baris] Uji modul internal transaction service
│   │   ├── auth-google-whitelist.test.ts       # [199 baris] Uji redirect & whitelist email BetterAuth
│   │   ├── auth-helpers.test.ts                # [238 baris] Uji helper otentikasi role user
│   │   ├── templates-migration.test.ts         # [226 baris] Uji pipeline migrasi skema template config
│   │   ├── toast.test.ts                       # [68 baris] Uji state writable toast alert notifications
│   │   └── xendit.test.ts                      # [233 baris] Uji API call tagihan & disbursement Xendit
│   ├── routing/
│   │   └── subdomain.test.ts                   # [82 baris] Uji utilitas parsing subdomain & reserved blacklist
│   ├── schemas/
│   │   ├── auth.test.ts                        # [109 baris] Uji validasi kredensial pengguna Zod
│   │   ├── media.test.ts                       # [106 baris] Uji validasi Zod payload media
│   │   ├── product-variant.test.ts             # [159 baris] Uji validasi Zod payload varian produk
│   │   ├── store-settings.test.ts              # [61 baris] Uji validasi input setting tokomu
│   │   ├── template-tokens-presets.test.ts     # [⚠️ >300 baris - 356 baris] Uji token warna, typo, 8pt preset, & safe-zone
│   │   └── template.test.ts                    # [235 baris] Uji validasi Zod visual data template
│   ├── services/
│   │   ├── analytics.service.test.ts           # [121 baris] Uji logic service analytics
│   │   ├── media-cleanup.test.ts               # [⚠️ mepet 300 baris - 270 baris] Uji garbage collection orphan image Cloudinary
│   │   └── store-template.service.test.ts      # [159 baris] Uji logic service storefront rendering
│   ├── transactions/
│   │   ├── e2e-template-marketplace-flow.test.ts# [182 baris] Uji e2e alur template (review -> beli -> lunas)
│   │   ├── template-purchase-flow.test.ts      # [⚠️ mepet 300 baris - 270 baris] Uji transaksi pembayaran template desainer
│   │   └── wallet-and-fulfillment.test.ts      # [199 baris] Uji trigger pemenuhan invoice & kredit wallet
│   ├── ui/
│   │   └── design-system.test.ts               # [119 baris] Uji validasi token Design System
│   └── utils/
│       ├── api-handler.test.ts                 # [133 baris] Uji wrapper standar error handler HTTP API
│       ├── design-math.test.ts                 # [78 baris] Uji rumus concentric radius, pill, & debounce
│       └── validation.test.ts                  # [34 baris] Uji wrapper validasi Zod & formatted error
│
├── astro.config.mjs                            # [31 baris] Konfigurasi Astro Framework
├── drizzle.config.ts                           # [13 baris] Konfigurasi Drizzle ORM
├── package.json                                # [65 baris] Berkas dependensi npm & bun scripts
├── tailwind.config.mjs                         # [93 baris] Konfigurasi styling token Tailwind CSS
└── vitest.config.ts                            # [27 baris] Konfigurasi testing framework Vitest
```

---

## 🛠️ Dokumentasi Visual Template Builder

Berikut adalah detail spesifikasi arsitektur teknis dari no-code visual template builder yang digunakan untuk merancang, mengedit, dan merender website toko UMKM responsif secara dinamis.

---

### 1. Spesifikasi Modular Section & Layout Presets

Seluruh section terdaftar di **Section Registry Central** (`src/components/builder/registry/index.ts`). Terdapat total **8 Tipe Section** dengan **24 Varian Layout Preset** (masing-masing section memiliki 3 hingga 4 preset layout terisolasi).

Di bawah ini adalah penjelasan detail per section, jumlah layout, serta perilaku dan representasi visual layout tersebut di ketiga ukuran device (**Desktop: 1200px**, **Tablet: 768px**, dan **Mobile: 375px**):

---

#### A. Header & Announcement (`header_announcement`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/HeaderAnnouncement.svelte`  
Komponen pendukung: `AnnouncementBar.svelte`, `HeaderLogo.svelte`, `HeaderNav.svelte`.  
Karakteristik: `isFullBleed = true` (melebar 100% viewport).

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`default_split`** *(Default)* | **2 Baris Terpisah**: Baris 1 memuat Announcement Bar di atas (fullwidth, `py-2`). Baris 2 Navbar setinggi `64px`: Logo di kiri, menu navigasi (`HeaderNav`) di kanan, dan tombol CTA Chat WhatsApp di ujung kanan. | Announcement Bar tetap di atas; Navbar mempertahankan Logo di kiri dan menu navigasi di kanan dengan padding safe zone `24px`. | Announcement Bar tetap aktif di atas; Navbar menyederhanakan tata letak (tombol CTA WhatsApp disembunyikan `hidden sm:flex` agar logo dan menu nav pas dalam 1 baris tanpa wrapping berlebih). |
| **`centered_stacked`** | **2 Baris Terpusat**: Announcement Bar di atas. Navbar bertumpuk vertikal di tengah (`flex-col items-center justify-center gap-4 py-4`): Logo toko berada di baris atas tengah, menu nav links horizontal rapi di baris bawah tengah dengan `gap-6`. | Logo tetap di baris tengah atas, deretan nav links horizontal di tengah bawah dengan safe-margin `24px`. | Logo terpusat di tengah atas, deretan nav links otomatis membungkus (*flex-wrap*) di tengah bawah dengan ukuran padding `16px`. |
| **`compact_inline`** | **1 Baris Ramping Tunggal (`h-14` / 56px)**: Announcement Bar ditiadakan. Logo di sisi kiri, menu navigasi sejajar horizontal di tengah (`flex-1 hidden md:flex`), dan tombol CTA WhatsApp (`MessageCircle` + teks) berada di sisi kanan. | Logo di kiri, menu nav di tengah, tombol CTA di kanan dalam 1 baris ramping 56px. | Menu nav links disembunyikan (`hidden md:flex`), menyisakan Logo di sisi kiri dan tombol CTA Chat WhatsApp ringkas di sisi kanan (`justify-between`), hemat ruang vertikal. |

---

#### B. Hero Banner (`hero`) — 4 Layout Presets
Komponen utama: `src/components/builder/sections/Hero.svelte`  
Komponen pendukung: `HeroSplitLayout.svelte`, `HeroCenteredMinimal.svelte`, `HeroFullBanner.svelte`, `HeroElementToolbar.svelte`.  
Karakteristik: `isFullBleed = true` (background melebar 100%, konten di dalam batas safe-zone).

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`split_left_text`** *(Default)* | **Grid 2 Kolom 50/50 (`md:grid-cols-12`)**: Kolom kiri (span-6) memuat Promo Badge pill, Headline judul H1 (`text-5xl`), Subtitle deskripsi, dan tombol CTA Belanja. Kolom kanan (span-6) memuat Card container gambar showcase produk (rasio `4:3`) berbingkai `rounded-2xl` dengan soft shadow. | Grid 2 kolom 50/50 proporsional. Font judul berskala `text-4xl`, gambar 4:3 proporsional di sisi kanan. | **1 Kolom Bertumpuk Vertikal (`grid-cols-1`)**: Teks judul (`text-3xl`), badge, dan tombol CTA tampil di bagian atas, diikuti gambar showcase produk di bawahnya. |
| **`split_right_text`** | **Grid 2 Kolom Asimetris Terbalik**: Kolom kiri (span-6) memuat gambar showcase produk (rasio `4:3`). Kolom kanan (span-6) memuat Promo Badge, Headline judul H1, Subtitle, dan tombol CTA. | Gambar di sisi kiri, teks headline & CTA di sisi kanan dalam susunan 2 kolom 50/50. | **1 Kolom Bertumpuk Vertikal**: Gambar showcase berada di urutan atas, diikuti headline teks dan tombol CTA di bawahnya. |
| **`centered_minimal`** | **Komposisi Simetris Tengah (Max-Width 3xl-4xl)**: Badge pill di tengah atas, Title H1 (`text-5xl`) terpusat, Subtitle di tengah (max-w-2xl), tombol CTA di tengah, diakhiri Card showcase gambar lanskap (rasio `16:9`) berbingkai tebal `rounded-2xl` shadow besar di bagian bawah. | Seluruh teks dan tombol CTA tetap terpusat di tengah layar. Gambar lanskap 16:9 menyesuaikan lebar tablet. | Teks judul mengecil proporsional (`text-3xl`), tombol CTA penuh/lebar nyaman disentuh, gambar lanskap 16:9 membentang 100% lebar safe-zone mobile. |
| **`full_banner_overlay`** | **Latar Belakang Gambar Penuh (Full-Bleed Cover)**: Gambar latar menutupi seluruh bidang hero dilapisi gelap (*dark overlay* `bg-black/40`). Teks putih kontras tinggi (`drop-shadow-md`) terpusat di tengah (max-w-3xl) dengan tombol CTA kontras tinggi. | Gambar latar full-bleed dengan teks putih terpusat dan mudah dibaca di tablet. | Gambar latar tetap memenuhi tinggi hero section, teks judul rapat dan jelas dengan padding safe-zone `16px`. |

---

#### C. Fitur & Keunggulan (`features`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/Features.svelte`.  
Karakteristik: `isFullBleed = false`, mendukung drag-and-drop kartu langsung di canvas editor.

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`grid_3_cards`** *(Default)* | **Grid 3 Kolom Sejajar (`md:grid-cols-3`, `gap-6`)**: Menampilkan 3 kartu fitur dengan padding `p-6`, concentric radius `rounded-2xl`, icon container 48px ber-radius `rounded-lg`, judul tebal, dan deskripsi benefit. | Grid 3 kolom atau membungkus 2 kolom seimbang dengan ukuran kartu yang fleksibel. | **Grid 1 Kolom Vertikal (`grid-cols-1`)**: Kartu-kartu fitur tersusun vertikal dari atas ke bawah untuk kenyamanan scrolling jari. |
| **`horizontal_list`** | **Layout 2 Kolom Asimetris (`grid-cols-12`)**: Kolom kiri (span-4, `sticky top-8`) berisi Heading judul & Subtitle section. Kolom kanan (span-8) berisi deretan baris kartu horizontal (`p-6 flex items-start gap-4`) dengan icon di kiri dan deskripsi di kanan. | Kolom kiri memuat heading, kolom kanan memuat daftar kartu memanjang ke bawah. | **1 Kolom Bertumpuk**: Heading judul berada di bagian paling atas, diikuti tumpukan kartu horizontal ke bawah. |
| **`banner_inline_bar`** | **Pita/Ribbon Horizontal Ramping (`rounded-2xl bg-surface`)**: Seluruh item keunggulan tersusun mendatar dalam 1 baris kontainer ramping dengan icon 40px, judul tebal, dan deskripsi singkat. | Item fitur berjejer horizontal rapi dengan jarak antar elemen proporsional. | Item fitur membungkus rapat (*wrap*); deskripsi panjang disembunyikan (`hidden sm:block`) menyisakan icon dan judul ringkas agar hemat layar. |

---

#### D. Katalog Produk (`product_catalog`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/ProductCatalog.svelte`  
Komponen pendukung: `ProductCatalogCard.svelte`, `ProductCatalogQuickView.svelte`, `productCatalog.helpers.ts`.  
Karakteristik: `isFullBleed = false`, mendukung tab kategori dinamis, live search, pagination "Muat Lebih Banyak", dan Quick View modal popup.

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`grid_standard`** *(Default)* | **Grid Produk Modular (Default 3 Kolom `lg:grid-cols-3`, dapat disetel 2–5 kolom)**: Kartu produk lengkap dengan foto (aspek rasio *square*, *portrait*, atau *widescreen*), badge diskon, nama produk, harga IDR, tombol Beli WhatsApp, dan tombol Quick View popup. | **Grid 2 atau 3 Kolom (`sm:grid-cols-2` / `sm:grid-cols-3`)** sesuai konfigurasi slider tablet inspector. | **Grid 1 atau 2 Kolom (`grid-cols-1` / `grid-cols-2`)** sesuai konfigurasi slider mobile, tata letak harga dan tombol WhatsApp responsif. |
| **`carousel_scroll`** | **Slider Horizontal Geser Bebas (`overflow-x-auto snap-x no-scrollbar`)**: Produk tersusun horizontal memanjang ke samping, pengguna dapat melakukan klik-drag atau scroll horizontal untuk menjelajahi katalog. | Menampilkan 2–3 kartu sebagian di layar dengan snap scrolling mulus. | Swipe geser produk ke samping secara alami dengan touch gestur ponsel, hemat ruang vertikal halaman. |
| **`list_compact`** | **Daftar Baris Horizontal (`flex flex-col gap-4`)**: Setiap produk ditampilkan dalam format horizontal card memanjang (foto produk di sisi kiri, informasi judul, harga, dan tombol pesan di sisi kanan). | Format baris horizontal dengan gambar proporsional di kiri dan detail di kanan. | Format baris kompak yang otomatis menyesuaikan proporsi tombol dan teks agar tidak terjadi overflow horizontal. |

---

#### E. Testimoni Pelanggan (`testimonials`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/Testimonials.svelte`.  
Karakteristik: `isFullBleed = false`, mendukung drag-and-drop urutan testimoni langsung di canvas editor.

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`masonry_grid`** *(Default)* | **Grid 3 Kolom Tabular (`md:grid-cols-3`, `gap-6`)**: Kartu ulasan berbingkai `rounded-2xl` memuat bintang rating (1–5 bintang warna amber), kutipan ulasan (clamp 4 baris), avatar pembeli, nama, dan status "Pembeli Terverifikasi". | Grid 2–3 kolom proporsional menyesuaikan lebar kontainer tablet 768px. | **Grid 1 Kolom Vertikal (`grid-cols-1`)**: Kartu testimoni menumpuk vertikal dengan teks ulasan yang mudah dibaca. |
| **`single_spotlight`** | **Kartu Ulasan Tunggal Terpusat (Max-W-2xl)**: Menampilkan 1 ulasan terpilih secara elegan dengan bintang rating besar di atas, kutipan font besar *italic* di tengah, identitas pembeli di bawah, dan dot pagination bulat interaktif untuk berpindah ulasan. | Kartu ulasan terpusat di tengah dengan dot navigasi interaktif di bawahnya. | Kartu ulasan mengisi penuh safe-zone mobile dengan teks yang proporsional dan mudah dibaca di smartphone. |
| **`chat_bubble_flow`** | **WhatsApp Chat Bubble Flow (Max-W-2xl)**: Format gelembung pesan chat berlatar surface dengan sudut kiri runcing (`rounded-tl-sm`), avatar WhatsApp hijau (`bg-emerald-100`), label "via WhatsApp", rating bintang, dan isi pesan ulasan pelanggan. | Gelembung pesan chat tersusun vertikal memanjang di tengah layar. | Tampilan menyerupai pesan WhatsApp asli di smartphone, memberikan kesan autentik dan dekat bagi calon pembeli lokal. |

---

#### F. FAQ / Tanya Jawab (`faq`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/FAQ.svelte`.  
Karakteristik: `isFullBleed = false`, mendukung animasi ekspansi akordeon buka-tutup halus.

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`accordion_single_col`** *(Default)* | **Akordeon Terpusat 1 Kolom (Max-W-3xl)**: Daftar pertanyaan yang dapat diklik untuk membuka/menutup jawaban secara bergantian. Dilengkapi ikon ChevronDown yang berotasi 180° dengan transisi halus. | Akordeon terpusat rapi selebar kontainer tablet (768px). | Akordeon memenuhi lebar layar safe-zone mobile (375px), teks pertanyaan dan jawaban membungkus rapi (*break-words*). |
| **`split_faq_sidebar`** | **Layout 2 Kolom Asimetris (`grid-cols-12`)**: Kolom kiri (span-5) memuat Judul FAQ, deskripsi, dan Kartu Bantuan CS ("Butuh Bantuan Lebih?" + tombol kontak WA); Kolom kanan (span-7) memuat tumpukan akordeon tanya jawab interaktif. | 2 kolom proporsional (span-5 dan span-7) dengan kartu bantuan di sisi kiri. | **1 Kolom Bertumpuk**: Judul dan kartu bantuan kontak berada di atas, diikuti daftar akordeon tanya jawab di bawahnya. |
| **`grid_2_col_cards`** | **Grid 2 Kolom Kartu Terbuka (`md:grid-cols-2`, `gap-6`)**: Seluruh pertanyaan dan jawaban langsung terbuka permanen (*open static card*) dalam bentuk kartu-kartu terpisah tanpa memerlukan interaksi klik buka-tutup. | Grid 2 kolom kartu terbuka seimbang. | **Grid 1 Kolom Vertikal**: Seluruh pertanyaan dan jawaban tampil terbuka berurutan ke bawah. |

---

#### G. Google Maps & Lokasi (`google_maps`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/GoogleMaps.svelte`.  
Karakteristik: `isFullBleed = false`, rendering iframe Google Maps live tanpa API key berbayar.

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`fullwidth_map`** *(Default)* | **Iframe Peta Penuh dengan Floating Card**: Iframe maps membentang penuh (tinggi default `400px`) dengan kartu informasi melayang semi-transparan (*glassmorphism* `bg-white/95 backdrop-blur-md`) di sudut kiri bawah memuat judul, alamat, dan tombol "Petunjuk Arah". | Peta membentang penuh dengan floating card proporsional di sisi kiri bawah. | Floating card meluas memenuhi bagian bawah peta (`bottom-6 left-6 right-6`), menyajikan tombol petunjuk arah yang mudah dijangkau jempol. |
| **`split_map_info`** | **Layout 2 Kolom Sejajar (`grid-cols-12 items-stretch`)**: Kolom kiri (span-5) berupa Kartu Info lengkap (Alamat, Jam Operasional Toko, Kontak Layanan, Tombol Buka Arah); Kolom kanan (span-7) berupa frame peta interaktif setinggi `360px+`. | 2 kolom seimbang dengan tinggi frame peta dan kartu informasi yang sama. | **1 Kolom Bertumpuk**: Kartu jam operasional dan alamat berada di atas, diikuti iframe peta Google Maps di bawahnya. |
| **`compact_boxed`** | **Kotak Kartu Lokasi Kompak (Max-W-Xl)**: Kontainer kartu terpusat memuat judul & alamat di atas, jendela pratinjau peta mini setinggi `192px` (`h-48`) di tengah, dan tombol CTA "Buka di Google Maps" di bawah. | Kotak kartu terpusat simetris di tengah layar tablet. | Kotak kartu mengisi lebar mobile safe-zone (375px) secara padat dan efisien. |

---

#### H. Footer & Kontak (`footer`) — 3 Layout Presets
Komponen utama: `src/components/builder/sections/Footer.svelte`.  
Karakteristik: `isFullBleed = false`, memuat profil toko, link WhatsApp, alamat, dan hak cipta.

| Preset Layout | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :--- | :--- | :--- |
| **`multi_column`** *(Default)* | **Grid 3 Kolom Sejajar (`md:grid-cols-3`, `gap-8`)**: Kolom 1 (Profil Toko: Logo & Tagline), Kolom 2 (Kontak Layanan: link nomor WhatsApp & alamat toko), Kolom 3 (Informasi: menu privasi & syarat ketentuan). Diakhiri baris Copyright di bagian bawah. | Grid 3 kolom atau membungkus 2 kolom seimbang. | **1 Kolom Bertumpuk Vertikal**: Kolom Profil Toko, Kontak Layanan, dan Informasi tersusun ke bawah, diakhiri baris Copyright. |
| **`centered_simple`** | **Layout Minimalis Terpusat**: Logo toko dan tagline terpusat di tengah, tombol kontak WhatsApp bulat ber-hover effect di tengah, dan teks hak cipta di bagian bawah. | Simetris terpusat di tengah layar. | Simetris terpusat di tengah layar mobile dengan tombol WhatsApp yang nyaman ditekan. |
| **`cta_focused`** | **Banner Floating WhatsApp di Atas Footer**: Banner WhatsApp melayang menonjol di atas footer (`-mt-16 bg-primary text-white shadow-xl` dengan judul ajakan dan tombol "Chat Sekarang"), diikuti info toko dan alamat di bawahnya. | Banner WhatsApp melayang menyesuaikan lebar kontainer tablet. | Banner WhatsApp membungkus vertikal (judul ajakan di atas, tombol chat di bawah), diikuti profil toko dan copyright. |

---

### 2. Spacing & Padding System (Sistem Layouting)

Sistem builder UMKM Site Builder menerapkan manipulasi layout yang fleksibel dan terstandarisasi dengan karakteristik berikut:
* **Interactive Spacing Drag-Handles**: Saat sebuah section diklik/aktif dalam editor, handles interaktif akan muncul secara absolut di sekeliling section:
  * **Top Margin Handler**: Menyesuaikan `marginTop` section (rentang valid: `0px` hingga `160px`).
  * **Bottom Margin Handler**: Menyesuaikan `marginBottom` section (rentang valid: `0px` hingga `160px`).
  * **Horizontal Padding Handler**: Menyesuaikan padding sisi kiri/kanan section (rentang valid: `8px` hingga `120px`).
* **Transient Drag State & Single-Step History**: Perubahan jarak (margin/padding) saat proses drag berlangsung (`pointermove`) menggunakan lokal state ephemeral (`transientStyles`) untuk rendering visual real-time 60fps tanpa membebani history stack. Tepat saat interaksi drag selesai (`pointerup`), sistem mengeksekusi `commitStyles` yang mencatat tepat 1 snapshot history ke `editorStore`, sehingga aksi `Ctrl+Z` (Undo) langsung mengembalikan nilai jarak ke kondisi awal dalam 1 langkah.

---

### 3. Grid Overlay Guides (`LayoutGridOverlay.svelte`)

Untuk membantu desainer menghasilkan tata letak yang presisi, editor builder dilengkapi dengan **Figma-Style Layout Grid Overlay** yang dapat diaktifkan melalui panel kontrol top bar:
* **Desktop Grid Guide**: 12-kolom panduan grid dengan jarak gutter `24px` dan safe-margin kiri/kanan sebesar `32px` (atau mengikuti token layout horizontal margin desktop).
* **Tablet Grid Guide**: 8-kolom panduan grid dengan safe-margin kiri/kanan sebesar `24px`.
* **Mobile Grid Guide**: 4-kolom panduan grid dengan safe-margin kiri/kanan sebesar `16px`.
* **Pixel Grid Overlay**: Overlay titik-titik (grid dot pattern) berjarak `8px` untuk memandu alignment mikro.

---

### 4. Responsiveness & Preview System (True Viewport Simulation)

Sistem peninjauan viewport (Desktop, Tablet, Mobile) dirancang menggunakan **True Viewport Simulation** via CSS Transform Scale:
* **Fixed Viewport Widths (Kaku & Uncollapsed)**:
  * **Desktop**: `width: 1200px`
  * **Tablet**: `width: 768px`
  * **Mobile**: `width: 375px`
* **Dynamic Scale Calculation (`scaleRatio`)**:
  * Mengukur lebar kontainer workspace tengah yang tersedia (`availableWidth = containerWidth - paddingHorizontal`).
  * Jika `availableWidth < targetWidth`, rasio skala dihitung otomatis: `scaleRatio = availableWidth / targetWidth` (maksimal 1.0).
  * Menyelaraskan ukuran wrapper terluar (`canvas-scale-container`) dengan lebar `targetWidth * scaleRatio` dan tinggi `canvasHeight * scaleRatio` agar scrollbar vertikal browser bergerak presisi tanpa ghost whitespace.
  * Menerapkan style `transform: scale(${scaleRatio}); transform-origin: top left;` pada `#canvas-frame` agar semua media query dan layout CSS desktop (1200px) tetap merender tampilan desktop asli tanpa runtuh menjadi tampilan mobile saat workspace menyempit.
* **Sharp Corners Consistency (Konsistensi Sudut Tajam)**: Seluruh preview (Desktop, Tablet, Mobile) pada editor builder (`Canvas.svelte`) dan penampil baca-saja (`ReadOnlyPreview.svelte`) diatur konsisten menggunakan **sudut tajam** (`rounded-none` / tidak melengkung) pada batas tepian frame kanvasnya untuk representasi visual yang akurat.
* **Theme Synchronization**: Canvas preview mendukung transisi instan Light / Dark mode yang secara dinamis menyuntikkan CSS variables tema (`--theme-bg`, `--theme-text-primary`, dll.) ke dalam cakupan rendering section.

---

### 5. State Management & Operations (Arsitektur Dual-Store)

Siklus data visual editor builder dikelola secara modular menggunakan pemisahan tanggung jawab (*separation of concerns*) antara data persisten template dan state visual antarmuka:

* **A. `documentStore` (State Data Template Persisten)**:
  * **Struktur State (`DocumentState`)**:
    * `template`: Objek data template lengkap (`EditorTemplate`) yang memuat `id`, `name`, `description`, `price`, `status`, dan `config` (berisi daftar `sections` dan objek `theme`).
    * `history`: Stack riwayat perubahan (`past: TemplateConfig[]`, `future: TemplateConfig[]`) dengan batas kapasitas 20 snapshot dan auto-merging debounced (350ms).
    * `isDirty`: Flag penanda jika terdapat perubahan lokal yang belum tersimpan ke database.
    * `isSaving` & `saveSuccess`: Status eksekusi penyimpanan ke API server `/api/builder/save`.
    * `error`: Pesan kesalahan jika terjadi kegagalan request network atau validasi skema.
  * **Operasi Mutasi Section**:
    * `addSection(type)`: Menyisipkan section baru ke urutan terbawah dan menginisialisasi default layout preset.
    * `deleteSection(id)`: Menghapus section dari canvas dan otomatis memilih section terdekat berikutnya.
    * `reorderSection(id, direction)`: Mengubah posisi urutan section ke atas (`up`) atau ke bawah (`down`).
    * `updateSection(section)`: Memperbarui objek data section utuh.
    * `updateSectionProps(id, props)`: Memperbarui konten dinamis props section.
    * `updateSectionStyles(id, styles)`: Memperbarui style spesifik section.
    * `updateSectionLayoutPreset(id, preset)`: Mengubah varian layout preset section seketika.
    * `updateSectionSpacing(id, spacingConfig)`: Memperbarui konfigurasi padding vertikal/horizontal dan gap.
  * **Operasi Mutasi Sub-Node**:
    * `addNode(sectionId, nodeType)`: Menambahkan elemen baru (misal: tombol nav baru, item benefit baru, kartu produk baru).
    * `deleteNode(sectionId, nodeId)`: Menghapus elemen spesifik di dalam section.
    * `updateNodeStyles(sectionId, nodeId, styles)`: Memperbarui CSS style lokal milik sub-node tertentu.
    * `updateNodeStyleToken(sectionId, nodeId, prop, tokenKey)`: Memetakan token warna/font ke node.
    * `updateNodeSpacing(sectionId, nodeId, spacingConfig)`: Memperbarui margin dan padding sub-node.
    * `reorderSectionSlot(sectionId, fromIdx, toIdx)`: Mengubah urutan susunan slot elemen hero (`elementOrder`).
    * `reorderArrayItem(sectionId, arrayKey, fromIdx, toIdx)`: Mengubah urutan array item (fitur, produk, testimoni, FAQ).
  * **Operasi Mutasi Tema & Persistensi**:
    * `updateGlobalTheme(themeUpdates)`: Memperbarui parameter tema global (warna, tipografi, tombol, layout).
    * `updateDesignSystemTheme(section, updates)`: Memperbarui token design system per kategori.
    * `updateTemplateName(name)`: Mengubah judul template draft.
    * `undo()` / `redo()`: Berpindah maju-mundur melintasi snapshot konfigurasi template.
    * `save()`: Mengirim payload konfigurasi template ke server (`POST /api/builder/save`).
    * `submitReview()`: Mengajukan draft template desainer untuk verifikasi admin (`POST /api/designer/templates/submit-review`).

* **B. `canvasStore` (State Antarmuka Visual / Ephemeral)**:
  * **Struktur State (`CanvasState`)**:
    * `selectedSectionId`: ID section yang sedang aktif/dipilih (`string | null`).
    * `selectedNodeId`: ID sub-node spesifik yang sedang aktif/dipilih (`string | null`).
    * `hoveredNodeId`: ID node yang sedang diarahkan oleh kursor mouse.
    * `viewMode`: Mode simulasi viewport aktif (`desktop` | `tablet` | `mobile`).
    * `zoom`: Skala zoom kanvas manual (rentang: 50% hingga 150%).
    * `showColumnGrid`: Visibilitas overlay 12/8/4 kolom grid Figma.
    * `showPixelGrid`: Visibilitas overlay grid titik-titik (dot pattern) 8px.
    * `activeMargin` / `canvasMargin`: Token margin safe-zone aktif (`16px` | `24px` | `32px` | `48px`).
    * `previewTheme`: Tema warna canvas pratinjau (`light` | `dark`).
    * `editorTheme`: Tema warna antarmuka editor builder (`light` | `dark`).
    * `leftSidebarOpen` & `rightSidebarOpen`: Status drawer layer panel dan property inspector.
  * **Karakteristik**: Seluruh mutasi pada `canvasStore` **tidak memicu pencatatan history undo/redo** dan **tidak mengubah status `isDirty`**.

* **C. Derived Stores**:
  * `activeSection`: Menghasilkan objek `TemplateSection` yang sedang aktif berdasarkan `selectedSectionId`.
  * `activeNodeId`: Menyediakan ID sub-node yang sedang dipilih.
  * `canUndo`: Boolean derived dari `$documentStore.history.past.length > 0`.
  * `canRedo`: Boolean derived dari `$documentStore.history.future.length > 0`.

---

### 6. Property Inspector & Image Upload Integration

Panel kanan editor (`PropertyInspector.svelte`) menyajikan antarmuka pengaturan properti kontekstual 3-level yang dinamis:

* **Level 1 — Global Design System Inspector (`GlobalThemeInspector.svelte`)**:
  * *Pemicu*: Tampil saat **tidak ada section yang dipilih** di canvas/layer panel.
  * *Sub-Tabs Navigasi*:
    * **Warna (`ThemeColorsTab.svelte`)**: Kustomisasi warna `primary`, `secondary`, `background`, `surface`, `textPrimary`, dan `textMuted` yang secara reaktif langsung disuntikkan ke CSS Variables canvas (`--theme-primary`, `--theme-bg`, dll.).
    * **Font (`ThemeTypographyTab.svelte`)**: Pemilihan keluarga font Google Fonts (`headingFont`, `bodyFont`) serta konfigurasi skala tipografi berbasis rasio emas (*Golden Ratio*) untuk tag `h1`, `h2`, `h3`, `body`, dan `caption`.
    * **Tombol (`ThemeButtonsTab.svelte`)**: Kustomisasi tinggi tombol (`height`), radius sudut konsentris (`borderRadius`), serta skema warna untuk varian tombol **Primary**, **Secondary**, dan **Outline**.
    * **Layout (`ThemeLayoutTab.svelte`)**: Pengaturan batas lebar kontainer maksimal (`maxWidth`) dan safe-margin horizontal responsif (`horizontalMarginDesktop`, `horizontalMarginTablet`, `horizontalMarginMobile`).

* **Level 2 — Section-Level Inspector**:
  * *Pemicu*: Tampil saat sebuah **parent section dipilih** (`$activeNodeId === null`).
  * *Tabs Navigasi*:
    * **Content Tab (`ContentTab.svelte`)**: Merender form pengisian data konten sesuai tipe section (`HeaderContent`, `HeroContent`, `FeaturesContent`, `ProductCatalogContent`, `TestimonialsContent`, `FaqContent`, `GoogleMapsContent`, `FooterContent`).
    * **Styles Tab (`StylesTab.svelte`)**: Merender panel styling khusus section (`HeaderStylesTab`, `CatalogStylesTab`) serta `GeneralStylesTab` yang mencakup:
      * `SectionLayoutPanel.svelte`: Penyesuaian layout flex/grid, perataan teks, dan lebar kontainer.
      * `SectionAppearancePanel.svelte`: Penyesuaian warna latar belakang (*background token*), radius sudut section, dan margin/padding numerik.

* **Level 3 — Sub-Node Contextual Inspector**:
  * *Pemicu*: Tampil saat **elemen sub-node spesifik dipilih** (misal: klik pada teks judul hero, gambar banner, tombol CTA, atau logo header).
  * *Tabs Navigasi*:
    * **Styles Node (`NodeStylesTab.svelte` / Header Panels)**: Mengatur parameter styling mikro spesifik elemen tersebut (font size, weight, alignment, warna, padding lokal). Untuk header, tersedia panel khusus: `HeaderAnnouncementPanel`, `HeaderLogoPanel`, dan `HeaderNavPanel`.
    * **Konten Node (`NodeContentForm.svelte`)**: Mengatur isian teks, URL tautan, upload gambar, atau label tombol untuk node tersebut secara langsung.

* **Integrasi Cloudinary Uploader (`ImageUpload.svelte` & `src/lib/cloudinary.ts`)**:
  * **Signed Upload Security**: Mengambil signature aman dari backend API `/api/media/sign` sebelum file dikirim langsung dari browser pengguna ke CDN Cloudinary tanpa membebani server backend.
  * **Drag-and-Drop & Progress Feedback**: Area dropzone interaktif dengan indikator visual animasi persentase unggahan.
  * **Automatic Media Cleanup**: Menghapus file gambar usang dari storage Cloudinary melalui endpoint API `/api/media/delete` setiap kali gambar diganti atau dihapus oleh desainer untuk mencegah akumulasi berkas tidak terpakai (*orphan assets*).

---

### 7. Status Implementasi & Roadmap Pengembangan Builder

Berikut adalah rekapitulasi status fitur yang telah aktif serta rekomendasi pengembangan lanjutan untuk UMKM Site Builder:

* **A. Fitur Inti yang Telah Berhasil Diimplementasikan (Active & Implemented)**:
  1. **True Viewport Simulation & Auto-Scaling Canvas**: Fitur penskalaan otomatis kanvas (`transform: scale(scaleRatio)`) di `Canvas.svelte` yang menjaga layout Desktop (1200px), Tablet (768px), dan Mobile (375px) tetap render pixel-perfect tanpa distorsi breakpoint di semua resolusi monitor laptop.
  2. **Interactive Spacing Drag-Handles**: Handle geser absolut untuk Margin Top, Margin Bottom, dan Side Padding dengan status transient 60fps dan single-step history commit.
  3. **Figma-Style Layout Grid Guides**: Panduan 12-kolom Desktop, 8-kolom Tablet, 4-kolom Mobile, serta 8px Dot Pixel Grid overlay di `LayoutGridOverlay.svelte`.
  4. **Modular Section Registry (24 Layout Presets)**: Arsitektur 8 section modular terisolasi dengan 24 varian layout presets di `src/components/builder/registry/index.ts`.
  5. **Dual-Store State Architecture**: Pemisahan `documentStore` (data persisten) dan `canvasStore` (state UI) dengan dukungan undo/redo 20 langkah riwayat.
  6. **Hierarchical Tree & Node Navigation**: Struktur pohon section dan child-nodes pada `LayerPanel.svelte` dengan fitur reorder urutan hero slot dan array items.
  7. **Instant Quick View Modal & Dynamic Multitenant Catalog**: Integrasi katalog produk dinamis tenant dengan filter kategori dan modal pop-up pratinjau cepat di `ProductCatalogQuickView.svelte`.

* **B. Rekomendasi Pengembangan Lanjutan (Future Roadmap Enhancements)**:
  1. **Client-Side Image Cropper & Aspect Ratio Guard**:
     * *Tujuan*: Mengintegrasikan pustaka cropping gambar client-side (seperti `cropperjs`) pada `ImageUpload.svelte` agar desainer dapat memotong gambar sesuai aspek rasio target (1:1 untuk produk, 16:9 untuk banner hero) sebelum proses unggah ke Cloudinary.
  2. **Visual Drop-Indicator Bar pada Layer Panel**:
     * *Tujuan*: Menambahkan garis panduan visual bayangan (*drop-indicator line*) saat melakukan drag-and-drop layer pada `LayerPanel.svelte` sebelum pointer dilepas.
  3. **Pre-built Theme Palette Presets**:
     * *Tujuan*: Menyediakan bundle tema siap pakai 1-klik (seperti *"Classic Clean"*, *"Emerald Organic"*, *"Cyber Tech"*, *"Sunset Warm"*) di `GlobalThemeInspector` untuk mempercepat proses perancangan bagi desainer pemula.
  4. **Keyboard Shortcuts Suite**:
     * *Tujuan*: Menambahkan pintasan keyboard terpadu untuk efisiensi workflow desainer: `Ctrl+Z` (Undo), `Ctrl+Y` (Redo), `Ctrl+S` (Save), `Ctrl+G` (Toggle Grid), `Ctrl+\` (Toggle Layer Panel), `Ctrl+/` (Toggle Inspector), dan `Delete` (Hapus Section/Node).