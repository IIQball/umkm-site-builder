# PETA STRUKTUR FOLDER & BERKAS PROJEK
Sistem UMKM Site Builder SaaS

Berikut adalah struktur folder lengkap beserta seluruh berkas yang ada di dalam projek ini:

```
umkm-site-builder/
├── .agents/ # Konfigurasi & workflow agen AI pintar
│   ├── rules/ # Standar aturan & panduan pengembangan
│   │   ├── 00-stack.md                         # [155 baris] Definisi teknologi & framework stack SaaS
│   │   ├── 10-process.md                       # [77 baris] SOP & workflow proses pengembangan fitur
│   │   ├── 15-file-size-limits.md              # [20 baris] Batas maksimal 300 baris per file & modularisasi
│   │   ├── 20-code-standards.md                # [91 baris] Standar penulisan clean code & konvensi penamaan
│   │   ├── 30-ui-ux.md                         # [147 baris] Panduan standar desain UI/UX & aksesibilitas
│   │   ├── 31-component-patterns.md            # [51 baris] Pola arsitektur komponen Svelte & Astro
│   │   ├── 40-security.md                      # [98 baris] Protokol keamanan web, otentikasi, & proteksi role
│   │   ├── 50-design-system-rules.md           # [11 baris] Aturan konsistensi token Design System global
│   │   ├── 50-qa-testing.md                    # [110 baris] Standar penulisan test suite unit & integrasi Vitest
│   │   ├── 60-git-strict.md                    # [115 baris] Standar pesan commit Git & version control
│   │   ├── 61-git-light.md                     # [89 baris] Prosedur commit ringan untuk iterasi cepat
│   │   ├── 70-database-selection.md            # [234 baris] Pedoman skema database Postgres & Drizzle ORM
│   │   ├── 71-media-selection.md               # [176 baris] Pedoman manajemen media Cloudinary & signed uploads
│   │   └── language-standards.md               # [18 baris] Standar aturan penulisan bahasa UI frontend
│   ├── skills/ # Kumpulan skill agen AI cerdas
│   │   ├── animate/                            # Skill orkestrasi animasi & transisi UI
│   │   ├── apple-design/                       # Skill desain interaksi & gestur Apple-grade
│   │   ├── caveman/                            # Skill komunikasi terkompresi efisien token
│   │   ├── clean-code/                         # Skill penulisan kode bersih standar Robert C. Martin
│   │   ├── design-taste-frontend/              # Skill anti-slop visual landing page & frontend
│   │   ├── emil-design-eng/                    # Skill mikro-interaksi & UI polish Emil Kowalski
│   │   ├── find-animation-opportunities/       # Skill deteksi peluang animasi UI
│   │   ├── improve-animations/                 # Skill audit & perbaikan kualitas animasi
│   │   ├── ponytail/                           # Skill implementasi minimalis & solusi pragmatis
│   │   └── review-animations/                  # Skill audit & tinjauan performa animasi UI
│   ├── workflows/ # Workflow otomatisasi pengerjaan projek
│   │   ├── 00-kickoff.md                       # [155 baris] Workflow kick-off inisialisasi pengerjaan fitur
│   │   ├── 01-cleanup.md                       # [153 baris] Workflow pembersihan kode usang & file yatim
│   │   ├── 10-feature.md                       # [88 baris] Workflow siklus hidup implementasi fitur baru
│   │   └── 20-review.md                        # [100 baris] Workflow audit review kode sebelum rilis
│   └── README.md                               # [131 baris] Dokumentasi pedoman konfigurasi agen AI
├── docs/ # Dokumentasi teknis & ERD data model
│   ├── memory/ # Catatan memori codebase & arsitektur
│   │   ├── codebase-map.md                     # [89 baris] Ringkasan modul krusial arsitektur SaaS
│   │   ├── css-vars.md                         # [70 baris] Standar gaya & variabel CSS global
│   │   ├── feature-01-project-setup.md         # [102 baris] Rencana inisialisasi Astro dev environment
│   │   ├── feature-01b-database-layer.md       # [147 baris] Rancangan migrasi skema database Drizzle
│   │   ├── feature-h1-xendit-setup.md          # [101 baris] Rancangan integrasi sandbox e-invoice Xendit
│   │   └── ui-inventory.md                     # [77 baris] Inventarisasi komponen visual & state layout
│   ├── planning/ # Rencana roadmap & jadwal rilis fitur
│   │   └── roadmap.md                          # [199 baris] Jadwal tahapan penyelesaian rilis fitur SaaS
│   ├── prd/ # Product Requirements Document platform
│   │   ├── features/ # Spesifikasi kebutuhan fitur sistem
│   │   │   └── _template.md                    # [79 baris] Template format dokumen prd fitur baru
│   │   ├── 00-overview.md                      # [84 baris] Latar belakang & batasan produk platform
│   │   ├── personas.md                         # [55 baris] Profil segmen tenant & desainer template
│   │   ├── user-journeys.md                    # [197 baris] Alur pengguna dari registrasi hingga go-live
│   │   └── user-stories.md                     # [⚠️ mepet 300 baris - 256 baris] Kasus penggunaan fungsionalitas sistem
│   ├── tech/ # Spesifikasi arsitektur teknis & API
│   │   ├── api-spec.md                         # [⚠️ >300 baris - 511 baris] Spesifikasi request/response endpoint HTTP API
│   │   ├── architecture.md                     # [⚠️ >300 baris - 388 baris] Penjelasan struktur Clean Architecture SaaS
│   │   ├── code-standards.md                   # [⚠️ >300 baris - 373 baris] Aturan penulisan kode, penamaan, & clean code
│   │   ├── data-model-erd.md                   # [⚠️ >300 baris - 438 baris] ERD skema relasi antar entitas database
│   │   ├── permissions-matrix.md               # [226 baris] Tabel pembatasan hak akses rute per role
│   │   ├── security.md                         # [200 baris] Protokol enkripsi data, token, & validasi payload
│   │   └── testing-strategy.md                 # [⚠️ >300 baris - 350 baris] Panduan pembagian cakupan test suite (vitest)
│   ├── PROJECT-STATE.md                        # [⚠️ >300 baris - 566 baris] Checkpoint state update live per sesi handoff
│   └── README.md                               # [65 baris] Dokumentasi awal ringkasan pengerjaan sistem
├── drizzle/ # Berkas migrasi database SQL Drizzle ORM
│   ├── meta/ # Metadata snapshot & jurnal migrasi database
│   │   ├── _journal.json                       # [34 baris] Jurnal urutan berkas migrasi database
│   │   ├── 0000_snapshot.json                  # [⚠️ >300 baris - 2019 baris] Snapshot metadata migrasi tahap 1
│   │   ├── 0001_snapshot.json                  # [⚠️ >300 baris - 2020 baris] Snapshot metadata migrasi tahap 2
│   │   ├── 0002_snapshot.json                  # [⚠️ >300 baris - 2026 baris] Snapshot metadata migrasi tahap 3
│   │   └── 0003_snapshot.json                  # [⚠️ >300 baris - 2038 baris] Snapshot metadata migrasi tahap 4
│   ├── 0000_fast_gambit.sql                    # [⚠️ mepet 300 baris - 274 baris] Migrasi database tahap 1 (skema awal)
│   ├── 0001_exotic_madame_web.sql              # [1 baris] Migrasi database tahap 2 (tabel platform settings)
│   ├── 0002_overconfident_ted_forrester.sql    # [1 baris] Migrasi database tahap 3 (tabel bank & payout)
│   └── 0003_sloppy_mephisto.sql                # [2 baris] Migrasi database tahap 4 (settlement delay)
├── public/ # Aset statis (gambar, font, logo)
├── src/ # Kode sumber utama aplikasi
│   ├── components/ # Komponen UI modular Svelte & Astro
│   │   ├── admin/ # Komponen panel administrasi platform
│   │   │   ├── category/ # Pengelola master kategori template
│   │   │   │   ├── category.helpers.ts         # [21 baris] Helper slug & icon options kategori
│   │   │   │   ├── CategoryDeleteModal.svelte  # [50 baris] Modal konfirmasi hapus kategori
│   │   │   │   ├── CategoryFormModal.svelte    # [130 baris] Modal form tambah & edit kategori
│   │   │   │   ├── CategoryHeader.svelte       # [60 baris] Header kontrol dan pencarian kategori
│   │   │   │   └── CategoryTable.svelte        # [93 baris] Tabel daftar master kategori template
│   │   │   ├── commission/ # Komponen pengaturan & simulasi komisi
│   │   │   │   └── CommissionSimulationCard.svelte # [73 baris] Kartu simulasi perhitungan komisi platform & desainer
│   │   │   ├── review/ # Komponen alur review template desainer
│   │   │   │   ├── review.types.ts             # [14 baris] Definisi tipe data review template desainer
│   │   │   │   ├── TemplateReviewModals.svelte # [125 baris] Kumpulan modal persetujuan/penolakan review template
│   │   │   │   └── TemplateReviewTable.svelte  # [145 baris] Tabel daftar review template desainer
│   │   │   ├── whitelist/ # Komponen whitelist email Google Auth admin
│   │   │   │   ├── AdminAddModal.svelte        # [214 baris] Modal tambah whitelist email admin
│   │   │   │   ├── AdminConfirmModal.svelte    # [104 baris] Modal konfirmasi penghapusan whitelist
│   │   │   │   ├── AdminDetailModal.svelte     # [73 baris] Modal detail data whitelist admin
│   │   │   │   ├── AdminWhitelistTable.svelte  # [129 baris] Tabel daftar whitelist admin
│   │   │   │   └── whitelist.types.ts          # [16 baris] Tipe data whitelist admin
│   │   │   ├── AdminMetricsOverview.svelte     # [236 baris] Ringkasan metrik statistik operasional platform admin
│   │   │   ├── AdminUserAddModal.svelte        # [⚠️ mepet 300 baris - 298 baris] Modal form penambahan user/admin baru oleh superadmin
│   │   │   ├── AdminUserDetailModal.svelte     # [49 baris] Modal detail data user admin
│   │   │   ├── AdminUserSuspendModal.svelte    # [95 baris] Modal suspend/aktifkan user admin
│   │   │   ├── AdminWhitelistPanel.svelte      # [200 baris] Panel whitelist email Google Auth admin
│   │   │   ├── CommissionSettingsPanel.svelte  # [⚠️ mepet 300 baris - 282 baris] Form fee %, minimum payout, & settlement delay
│   │   │   ├── TemplateCategoryManager.svelte  # [⚠️ mepet 300 baris - 271 baris] Pengelola master kategori template admin
│   │   │   ├── TemplateReviewPanel.svelte      # [⚠️ mepet 300 baris - 264 baris] Panel review & verifikasi template desainer
│   │   │   └── UserManagementPanel.svelte      # [⚠️ >300 baris - 349 baris] Panel manajemen pengguna platform
│   │   ├── auth/ # Komponen form otentikasi & login pengguna
│   │   │   ├── ForgotPasswordForm.svelte       # [98 baris] Form permintaan reset password pengguna
│   │   │   ├── GoogleAuthButton.svelte         # [59 baris] Tombol login Google SSO BetterAuth
│   │   │   ├── LoginForm.svelte                # [149 baris] Form login tenant, designer, dan admin
│   │   │   ├── RegisterForm.svelte             # [⚠️ >300 baris - 304 baris] Form registrasi tenant baru
│   │   │   └── ResetPasswordForm.svelte        # [164 baris] Form setel ulang kata sandi baru
│   │   ├── builder/ # Komponen visual no-code builder template
│   │   │   ├── canvas/ # Komponen kanvas kerja & helper drag-spacing
│   │   │   │   ├── canvasCss.helpers.ts        # [127 baris] Helper kalkulasi variabel CSS & Golden Ratio
│   │   │   │   ├── canvasScroll.helpers.ts     # [37 baris] Helper auto-scroll halus ke elemen kanvas saat layer diklik
│   │   │   │   ├── CanvasSpacingHandles.svelte # [61 baris] Drag handles margin & padding section
│   │   │   │   └── fontLoader.helpers.ts       # [101 baris] Helper pemuatan font Google Fonts dinamis ke kanvas
│   │   │   ├── content/ # Form inspector konten per section
│   │   │   │   ├── features/ # Form inspector konten keunggulan fitur
│   │   │   │   │   ├── FeaturesComparisonContent.svelte # [144 baris] Form inspector komparasi keunggulan fitur
│   │   │   │   │   └── FeaturesRepeaterContent.svelte # [173 baris] Form repeater item keunggulan fitur
│   │   │   │   ├── content.helpers.ts          # [51 baris] Helper pengisian konten section builder
│   │   │   │   ├── FaqContent.svelte           # [91 baris] Form inspector konten FAQ section
│   │   │   │   ├── FeaturesContent.svelte      # [68 baris] Form inspector konten features section
│   │   │   │   ├── FooterContent.svelte        # [78 baris] Form inspector konten footer section
│   │   │   │   ├── GoogleMapsContent.svelte    # [82 baris] Form inspector konten Google Maps section
│   │   │   │   ├── HeaderContent.svelte        # [⚠️ >300 baris - 434 baris] Form inspector konten header section
│   │   │   │   ├── HeroContent.svelte          # [223 baris] Form inspector konten hero section
│   │   │   │   ├── ProductCatalogContent.svelte # [151 baris] Form inspector data produk katalog
│   │   │   │   └── TestimonialsContent.svelte  # [104 baris] Form inspector isi ulasan/testimonial
│   │   │   ├── inspector/ # Panel properti kustomisasi node & tema
│   │   │   │   ├── header/ # Sub-panel konfigurasi elemen header
│   │   │   │   │   ├── HeaderAnnouncementPanel.svelte # [91 baris] Panel teks pengumuman header
│   │   │   │   │   ├── HeaderLogoPanel.svelte  # [99 baris] Panel upload/URL logo toko
│   │   │   │   │   └── HeaderNavPanel.svelte   # [137 baris] Panel menu navigasi menu header
│   │   │   │   ├── node-forms/ # Form input mikro spesifik sub-node
│   │   │   │   │   ├── AnnouncementNodeForm.svelte # [73 baris] Form spesifik node pengumuman
│   │   │   │   │   ├── CatalogNodeForms.svelte # [⚠️ mepet 300 baris - 289 baris] Form spesifik node katalog produk
│   │   │   │   │   ├── FaqNodeForms.svelte     # [138 baris] Form spesifik node tanya jawab FAQ
│   │   │   │   │   ├── FeatureHeadingNodeForm.svelte # [83 baris] Form spesifik heading section fitur
│   │   │   │   │   ├── FeatureImageNodeForm.svelte # [127 baris] Form upload gambar kartu fitur
│   │   │   │   │   ├── FeatureItemNodeForm.svelte # [⚠️ mepet 300 baris - 250 baris] Form konfigurasi item benefit fitur
│   │   │   │   │   ├── FooterNodeForms.svelte  # [237 baris] Form spesifik kustomisasi elemen sub-node footer
│   │   │   │   │   ├── HeroElementNodeForms.svelte # [217 baris] Form elemen visual/teks hero
│   │   │   │   │   ├── HeroExtraNodeForms.svelte # [93 baris] Form elemen pendukung hero
│   │   │   │   │   ├── HeroImageNodeForm.svelte # [121 baris] Form konfigurasi node gambar hero
│   │   │   │   │   ├── LogoNodeForm.svelte     # [139 baris] Form logo toko pada header
│   │   │   │   │   ├── MapsNodeForms.svelte    # [⚠️ >300 baris - 331 baris] Form spesifik node lokasi & peta Google Maps
│   │   │   │   │   ├── NavLinksNodeForm.svelte # [61 baris] Form menu navigasi
│   │   │   │   │   └── TestimonialsNodeForms.svelte # [⚠️ >300 baris - 316 baris] Form spesifik node testimoni
│   │   │   │   ├── theme/ # Tab kustomisasi token tema global
│   │   │   │   │   ├── ThemeButtonsTab.svelte  # [107 baris] Tab kustomisasi tombol tema builder
│   │   │   │   │   ├── ThemeColorsTab.svelte   # [49 baris] Tab kustomisasi palet warna tema builder
│   │   │   │   │   ├── ThemeLayoutTab.svelte   # [71 baris] Tab layout spacing tema builder
│   │   │   │   │   └── ThemeTypographyTab.svelte # [97 baris] Tab kustomisasi font tema builder
│   │   │   │   ├── CatalogCardPanel.svelte     # [107 baris] Panel pengubah style kartu produk
│   │   │   │   ├── CatalogCtaPanel.svelte      # [169 baris] Panel styling tombol CTA katalog
│   │   │   │   ├── CatalogGridPanel.svelte     # [101 baris] Panel layout grid katalog produk
│   │   │   │   ├── catalogStyles.helpers.ts    # [42 baris] Fungsi helper styling css katalog
│   │   │   │   ├── CatalogStylesTab.svelte     # [22 baris] Tab pengeditan gaya katalog produk
│   │   │   │   ├── GeneralStylesTab.svelte     # [36 baris] Tab layout jarak & padding section
│   │   │   │   ├── GlobalThemeInspector.svelte # [147 baris] Panel warna dasar tema template builder
│   │   │   │   ├── HeaderStylesTab.svelte      # [23 baris] Tab konfigurasi gaya navigasi header
│   │   │   │   ├── imageUpload.helpers.ts      # [91 baris] Helper validasi/upload gambar
│   │   │   │   ├── NodeButtonStyles.svelte     # [64 baris] Panel kustomisasi styling tombol node
│   │   │   │   ├── nodeContent.constants.ts    # [143 baris] Konstanta label & deskripsi sub-node
│   │   │   │   ├── NodeContentForm.svelte      # [70 baris] Form input konten dinamis tiap block
│   │   │   │   ├── nodeStyles.constants.ts     # [62 baris] Konstanta default style CSS node block
│   │   │   │   ├── schematics/ # Helper visual wireframe SVG preset per section
│   │   │   │   │   ├── catalogSchematics.ts    # [172 baris] SVG schematic preset layout katalog produk
│   │   │   │   │   ├── faqSchematics.ts        # [172 baris] SVG schematic preset layout FAQ
│   │   │   │   │   ├── featuresSchematics.ts   # [172 baris] SVG schematic preset layout features
│   │   │   │   │   ├── footerSchematics.ts     # [130 baris] SVG schematic preset layout footer
│   │   │   │   │   ├── headerSchematics.ts     # [144 baris] SVG schematic preset layout header
│   │   │   │   │   ├── heroSchematics.ts       # [215 baris] SVG schematic preset layout hero
│   │   │   │   │   ├── mapsSchematics.ts       # [93 baris] SVG schematic preset layout Google Maps
│   │   │   │   │   └── testimonialsSchematics.ts # [144 baris] SVG schematic preset layout testimonials
│   │   │   ├── SectionAppearancePanel.svelte # [129 baris] Panel background & border-radius section
│   │   │   ├── SectionLayoutPanel.svelte   # [36 baris] Panel layout flex/grid section
│   │   │   ├── layoutPresets.data.ts       # [134 baris] Data master daftar preset layout & label seksi
│   │   │   ├── layoutSchematics.helpers.ts # [33 baris] Dispatcher sentral visual schematic wireframe layout preset
│   │   │   ├── LayoutSelectorModal.svelte  # [177 baris] Modal popup pemilihan layout hampir fullscreen ala Dribbble
│   │   │   ├── SectionPresetSelector.svelte # [87 baris] Panel ringkasan & trigger modal galeri layout
│   │   │   ├── SectionSlotReorder.svelte   # [73 baris] Panel drag-and-drop slots section
│   │   │   ├── SectionSpacingControls.svelte # [150 baris] Kontrol padding & margin interaktif
│   │   │   └── StyleSelector.svelte        # [85 baris] Dropdown pemilih varian style visual
│   │   │   ├── layer/ # Komponen pohon layer section & sub-node
│   │   │   │   ├── AddNodeDropdown.svelte      # [45 baris] Tombol nambah block section baru
│   │   │   │   ├── layerPanel.helpers.ts       # [⚠️ mepet 300 baris - 291 baris] Helper manipulasi susunan layer adaptif
│   │   │   │   └── LayerSectionItem.svelte     # [191 baris] Komponen item baris layer section
│   │   │   ├── registry/ # Registri sentral modularisasi section builder
│   │   │   │   ├── index.ts                    # [⚠️ mepet 300 baris - 257 baris] Registri sentral modularisasi modul section builder
│   │   │   │   └── registry.types.ts           # [17 baris] Definisi tipe registry map section
│   │   │   ├── sections/ # Kumpulan varian preset layout per section
│   │   │   │   ├── catalog/ # Preset layout katalog produk (20 preset)
│   │   │   │   │   ├── catalog.css             # [136 baris] Container queries `@container productcard`
│   │   │   │   │   ├── CatalogAccordion.svelte # [73 baris] Layout katalog akordeon minimalis
│   │   │   │   │   ├── CatalogBentoSpotlight.svelte # [178 baris] Layout bento spotlight katalog
│   │   │   │   │   ├── CatalogBundleTiers.svelte # [129 baris] Layout paket bundling produk bertingkat
│   │   │   │   │   ├── CatalogCarouselMasonry.svelte # [88 baris] Layout masonry & lookbook katalog
│   │   │   │   │   ├── CatalogCarouselScroll.svelte # [140 baris] Layout slider carousel produk horizontal
│   │   │   │   │   ├── CatalogCheckoutModal.svelte # [246 baris] Modal checkout cepat katalog
│   │   │   │   │   ├── CatalogFlashSale.svelte # [147 baris] Layout promo flash sale countdown
│   │   │   │   │   ├── CatalogGridStandard.svelte # [207 baris] Layout grid katalog standar
│   │   │   │   │   ├── CatalogHeader.svelte    # [57 baris] Header judul & deskripsi katalog produk
│   │   │   │   │   ├── CatalogListCompact.svelte # [102 baris] Layout list compact horizontal
│   │   │   │   │   ├── CatalogLookbook.svelte  # [87 baris] Layout lookbook galeri visual majalah
│   │   │   │   │   ├── CatalogMasonry.svelte   # [110 baris] Layout masonry katalog 3 kolom
│   │   │   │   │   ├── CatalogPriceTable.svelte # [78 baris] Layout daftar harga tabular
│   │   │   │   │   ├── CatalogSidebarFilter.svelte # [162 baris] Layout katalog dengan sidebar kategori
│   │   │   │   │   ├── CatalogSingleFocus.svelte # [143 baris] Layout fokus tunggal produk unggulan
│   │   │   │   │   ├── CatalogSpecialCards.svelte # [168 baris] Layout kartu spesial katalog
│   │   │   │   │   ├── ProductCatalogCard.svelte # [213 baris] Komponen visual kartu katalog produk
│   │   │   │   │   ├── ProductCatalogQuickView.svelte # [156 baris] Detail popup cepat ulasan produk
│   │   │   │   │   └── ProductQuickCheckoutModal.svelte # [⚠️ >300 baris - 313 baris] Modal checkout instan WhatsApp langsung dari katalog
│   │   │   │   ├── faq/ # Preset layout FAQ tanya jawab (10 preset)
│   │   │   │   │   ├── faq.css                 # [62 baris] Container queries `@container faqcard`
│   │   │   │   │   ├── faq.helpers.ts          # [79 baris] Helper WhatsApp deep-link & default FAQs
│   │   │   │   │   ├── FaqAccordionSingle.svelte # [68 baris] Preset FAQ akordeon 1 kolom terpusat
│   │   │   │   │   ├── FaqAccordionTwoCol.svelte # [128 baris] Preset FAQ akordeon 2 kolom simetris
│   │   │   │   │   ├── FaqBoxedCardsGrid.svelte # [35 baris] Preset FAQ kotak kartu grid
│   │   │   │   │   ├── FaqCategorizedTabs.svelte # [114 baris] Preset FAQ dengan tab kategori
│   │   │   │   │   ├── FaqChatStyle.svelte     # [58 baris] Preset FAQ gaya balon obrolan
│   │   │   │   │   ├── FaqGridCards.svelte     # [56 baris] Preset FAQ grid 2 kolom kartu terbuka
│   │   │   │   │   ├── FaqHeader.svelte        # [66 baris] Header judul H2 FAQ & sub-node selection
│   │   │   │   │   ├── FaqHelpCenter.svelte    # [57 baris] Preset FAQ gaya Help Center floating cards
│   │   │   │   │   ├── FaqHorizontalCards.svelte # [53 baris] Preset FAQ kartu horizontal slider
│   │   │   │   │   ├── FaqNumberedList.svelte  # [50 baris] Preset FAQ daftar bernomor 01, 02, 03
│   │   │   │   │   ├── FaqSearchFiltered.svelte # [110 baris] Preset FAQ dengan filter pencarian real-time
│   │   │   │   │   └── FaqSplitSidebar.svelte  # [140 baris] Preset FAQ layout split sidebar CS WhatsApp
│   │   │   │   ├── features/ # Preset layout keunggulan fitur (10 preset)
│   │   │   │   │   ├── featureIcons.ts         # [164 baris] Helper pemetaan icon Lucide fitur
│   │   │   │   │   ├── features.css            # [188 baris] Container queries `@container featurecard`
│   │   │   │   │   ├── features.helpers.ts     # [109 baris] Helper fallback mock data & preset features
│   │   │   │   │   ├── FeaturesAlternatingZigzag.svelte # [165 baris] Preset fitur zigzag bergantian
│   │   │   │   │   ├── FeaturesBannerInlineBar.svelte # [82 baris] Preset fitur pita/ribbon mendatar
│   │   │   │   │   ├── FeaturesBentoGrid.svelte # [⚠️ mepet 300 baris - 283 baris] Preset fitur layout bento grid asimetris
│   │   │   │   │   ├── FeaturesComparison.svelte # [129 baris] Preset fitur tabel komparasi keunggulan
│   │   │   │   │   ├── FeaturesDenseMatrix.svelte # [92 baris] Preset fitur matriks ikon padat 4 kolom
│   │   │   │   │   ├── FeaturesGrid3Cards.svelte # [138 baris] Preset fitur grid 3 kartu standar
│   │   │   │   │   ├── FeaturesHeaderTitle.svelte # [56 baris] Komponen judul heading H2 section fitur
│   │   │   │   │   ├── FeaturesHorizontalList.svelte # [147 baris] Preset fitur daftar kartu horizontal
│   │   │   │   │   ├── FeaturesInteractiveTabs.svelte # [196 baris] Preset fitur tab interaktif
│   │   │   │   │   ├── FeaturesStickyScroll.svelte # [151 baris] Preset fitur scroll sticky highlight
│   │   │   │   │   ├── FeaturesVerticalAccordion.svelte # [180 baris] Preset fitur akordeon vertikal
│   │   │   │   │   └── index.ts                # [13 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── footer/ # Preset layout footer & kontak (10 preset)
│   │   │   │   │   ├── footer.css              # [101 baris] Container queries `@container footercard` & gaya footer
│   │   │   │   │   ├── footer.helpers.ts       # [161 baris] Helper navigasi & default data konten section footer
│   │   │   │   │   ├── FooterBoxedCard.svelte  # [91 baris] Preset footer kartu melayang berbingkai
│   │   │   │   │   ├── FooterCenteredSimple.svelte # [75 baris] Preset footer minimalis terpusat
│   │   │   │   │   ├── FooterCtaFocused.svelte # [97 baris] Preset footer banner WhatsApp menonjol
│   │   │   │   │   ├── FooterGiantWordmark.svelte # [94 baris] Preset footer tipografi wordmark raksasa
│   │   │   │   │   ├── FooterLiveStatusBadge.svelte # [72 baris] Preset footer status operasional toko live
│   │   │   │   │   ├── FooterMinimalSingleRow.svelte # [76 baris] Preset footer 1 baris ramping
│   │   │   │   │   ├── FooterMultiColumn.svelte # [132 baris] Preset footer multi-kolom standar
│   │   │   │   │   ├── FooterNewsletter.svelte # [59 baris] Preset footer langganan newsletter
│   │   │   │   │   ├── FooterNewsletterCentric.svelte # [91 baris] Preset footer form newsletter promo
│   │   │   │   │   ├── FooterSocialLinksGrid.svelte # [192 baris] Preset footer showcase tautan akun media sosial
│   │   │   │   │   ├── FooterSocialShowcase.svelte # [40 baris] Preset footer showcase media sosial
│   │   │   │   │   ├── FooterSplitMap.svelte   # [85 baris] Preset footer info toko & peta mini
│   │   │   │   │   └── index.ts                # [12 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── header/ # Preset layout header & announcement (12 preset)
│   │   │   │   │   ├── AnnouncementBar.svelte  # [78 baris] Baris pengumuman di atas navigasi
│   │   │   │   │   ├── HeaderCommandSearch.svelte # [132 baris] Preset header pencarian cepat command palette
│   │   │   │   │   ├── HeaderDeliveryOrder.svelte # [89 baris] Preset header promo kirim instan & opsi kurir
│   │   │   │   │   ├── HeaderLogo.svelte       # [91 baris] Elemen visual logo website toko
│   │   │   │   │   ├── HeaderMegaMenu.svelte   # [126 baris] Preset header mega menu navigasi
│   │   │   │   │   ├── HeaderMobileDrawer.svelte # [176 baris] Drawer menu navigasi seluler dengan true overlay
│   │   │   │   │   ├── HeaderNav.svelte        # [209 baris] Elemen menu navigasi toko
│   │   │   │   │   ├── HeaderPillIsland.svelte # [70 baris] Preset header floating pill island
│   │   │   │   │   ├── HeaderPromoCountdown.svelte # [141 baris] Preset header promo banner countdown flash sale
│   │   │   │   │   └── HeaderStoreBadge.svelte # [82 baris] Preset header sorotan legalitas BPOM & Halal toko
│   │   │   │   ├── hero/ # Preset layout hero banner (22 preset)
│   │   │   │   │   ├── hero.css                # [92 baris] Container queries `@container herocard`
│   │   │   │   │   ├── hero.helpers.ts         # [30 baris] Helper konversi nilai pixel & padding hero
│   │   │   │   │   ├── HeroBadgeTicker.svelte  # [66 baris] Preset hero badge ticker sertifikasi mutu & stempel
│   │   │   │   │   ├── HeroBentoGrid.svelte    # [106 baris] Preset hero bento grid ubin visual & promo
│   │   │   │   │   ├── HeroCenteredMinimal.svelte # [59 baris] Template hero minimalis tengah
│   │   │   │   │   ├── HeroChatSimulation.svelte # [60 baris] Preset hero simulasi chat WhatsApp interaktif
│   │   │   │   │   ├── HeroDualContrast.svelte # [52 baris] Preset hero duo-tone kontras kuota & pendaftaran
│   │   │   │   │   ├── HeroDualProduct.svelte  # [79 baris] Preset hero showcase 2 kartu produk terlaris
│   │   │   │   │   ├── HeroEditorialSerif.svelte # [77 baris] Preset hero editorial mewah tipografi serif
│   │   │   │   │   ├── HeroElementToolbar.svelte # [102 baris] Floating toolbar elemen teks/gambar hero
│   │   │   │   │   ├── HeroEmailCapture.svelte # [59 baris] Preset hero penangkap email prospek
│   │   │   │   │   ├── HeroFloatingCards.svelte # [53 baris] Preset hero kartu mengambang 3D
│   │   │   │   │   ├── HeroFounderStory.svelte # [63 baris] Preset hero kisah profil pendiri & artisan
│   │   │   │   │   ├── HeroFullBanner.svelte   # [100 baris] Template hero latar belakang penuh
│   │   │   │   │   ├── HeroGradientMesh.svelte # [38 baris] Preset hero gradien mesh berkilau dinamis
│   │   │   │   │   ├── HeroHeaderContent.svelte # [115 baris] Heading H1 hero & CTA button cluster
│   │   │   │   │   ├── HeroOversizedTypography.svelte # [94 baris] Preset hero tipografi super besar
│   │   │   │   │   ├── HeroPillCategory.svelte # [77 baris] Preset hero pemilih kategori produk pill filter
│   │   │   │   │   ├── HeroSideBooking.svelte  # [94 baris] Preset hero form booking janji temu samping
│   │   │   │   │   ├── HeroSocialProof.svelte  # [67 baris] Preset hero avatar wall komunitas & ulasan rating
│   │   │   │   │   ├── HeroSplitLayout.svelte  # [114 baris] Template hero 50/50 visual terpisah
│   │   │   │   │   ├── HeroStatCounter.svelte  # [86 baris] Preset hero split kolom dengan 3 baris metrik angka
│   │   │   │   │   ├── HeroStickerPlayful.svelte # [113 baris] Preset hero gaya playful stiker miring dinamis
│   │   │   │   │   └── HeroTerminalCode.svelte # [53 baris] Preset hero gaya terminal developer
│   │   │   │   ├── maps/ # Preset layout Google Maps lokasi (10 preset)
│   │   │   │   │   ├── maps.css                # [85 baris] Container queries `@container mapscard`
│   │   │   │   │   ├── maps.helpers.ts         # [69 baris] Helper sanitasi URL embed & navigasi Google Maps
│   │   │   │   │   ├── MapsCardOverlay.svelte  # [93 baris] Preset maps bilah penutup bawah melayang
│   │   │   │   │   ├── MapsCompactBoxed.svelte # [93 baris] Preset maps kotak kompak terpusat
│   │   │   │   │   ├── MapsDirectionsGuide.svelte # [65 baris] Preset maps panduan rute & navigasi
│   │   │   │   │   ├── MapsFloatingCard.svelte # [102 baris] Preset maps kartu alamat pojok kanan atas
│   │   │   │   │   ├── MapsFullwidth.svelte    # [100 baris] Preset maps peta penuh kartu glassmorphism melayang
│   │   │   │   │   ├── MapsHeader.svelte       # [64 baris] Header judul H2 maps & sub-node selection
│   │   │   │   │   ├── MapsMinimalFramed.svelte # [73 baris] Preset maps bingkai bersih minimalis
│   │   │   │   │   ├── MapsMultiBranch.svelte  # [130 baris] Preset maps multi-cabang outlet dengan tab interaktif
│   │   │   │   │   ├── MapsRouteFinder.svelte  # [64 baris] Preset maps tombol rute langsung lebar penuh
│   │   │   │   │   ├── MapsSplitInfo.svelte    # [129 baris] Preset maps 2 kolom info detail & peta
│   │   │   │   │   ├── MapsStoreHours.svelte   # [85 baris] Preset maps penyorot jam operasional real-time
│   │   │   │   │   └── MapsTwoColumnDirections.svelte # [127 baris] Preset maps instruksi petunjuk arah & parkir
│   │   │   │   ├── testimonials/ # Preset layout testimoni ulasan (10 preset)
│   │   │   │   │   ├── testimonials.css        # [94 baris] Container queries `@container testicard` & marquee keyframes
│   │   │   │   │   ├── testimonials.helpers.ts # [110 baris] Helper kalkulasi rating rata-rata & mock data
│   │   │   │   │   ├── TestimonialsCarouselSlider.svelte # [83 baris] Preset testimoni slider carousel panah
│   │   │   │   │   ├── TestimonialsChatBubble.svelte # [54 baris] Preset testimoni bubble chat WhatsApp
│   │   │   │   │   ├── TestimonialsHeader.svelte # [57 baris] Header judul H2 testimoni & sub-node selection
│   │   │   │   │   ├── TestimonialsLogoCloud.svelte # [45 baris] Preset testimoni logo client cloud
│   │   │   │   │   ├── TestimonialsMarquee.svelte # [54 baris] Preset testimoni running text horizontal 25s
│   │   │   │   │   ├── TestimonialsMasonryGrid.svelte # [81 baris] Preset testimoni masonry grid 3 kolom
│   │   │   │   │   ├── TestimonialsSideBySide.svelte # [88 baris] Preset testimoni 3 kartu berdampingan
│   │   │   │   │   ├── TestimonialsSocialCards.svelte # [91 baris] Preset testimoni kartu postingan media sosial
│   │   │   │   │   ├── TestimonialsSplitStats.svelte # [113 baris] Preset testimoni split rating stats 4.9/5
│   │   │   │   │   ├── TestimonialsSpotlight.svelte # [83 baris] Preset testimoni kutipan tunggal spotlight
│   │   │   │   │   ├── TestimonialsSpotlightCarousel.svelte # [93 baris] Preset testimoni spotlight & slider
│   │   │   │   │   └── TestimonialsVideoCards.svelte # [78 baris] Preset testimoni kartu video ulasan vertikal
│   │   │   │   ├── FAQ.svelte                  # [85 baris] Komponen visual Frequently Asked Questions
│   │   │   │   ├── Features.svelte             # [178 baris] Komponen visual daftar keunggulan/layanan
│   │   │   │   ├── Footer.svelte               # [241 baris] Footer publik website toko tenant
│   │   │   │   ├── GoogleMaps.svelte           # [168 baris] Komponen visual embed lokasi Google Maps
│   │   │   │   ├── HeaderAnnouncement.svelte   # [⚠️ >300 baris - 324 baris] Komponen visual announcement bar
│   │   │   │   ├── Hero.svelte                 # [⚠️ >300 baris - 418 baris] Banner hero publik website toko tenant
│   │   │   │   ├── productCatalog.helpers.ts   # [106 baris] Helper load data produk toko & format rupiah
│   │   │   │   ├── ProductCatalog.svelte       # [197 baris] Komponen visual daftar katalog produk
│   │   │   │   ├── SectionRenderer.svelte      # [168 baris] Renderer block layout editor no-code
│   │   │   │   └── Testimonials.svelte         # [71 baris] Komponen visual ulasan/testimoni pelanggan
│   │   │   ├── stores/ # Store state Svelte manajemen editor builder
│   │   │   │   ├── canvasStore.ts              # [117 baris] Svelte store state kanvas & grid guides
│   │   │   │   ├── documentStore.actions.ts    # [211 baris] Action mutator dokumen & riwayat undo/redo
│   │   │   │   ├── documentStore.ts            # [⚠️ mepet 300 baris - 298 baris] Svelte store template dokumen, preset, & tokens
│   │   │   │   ├── editorStore.mutations.ts    # [193 baris] Operasi mutasi state no-code (save, update)
│   │   │   │   ├── editorStore.ts              # [32 baris] Svelte writable store state builder editor
│   │   │   │   └── editorStore.types.ts        # [76 baris] Tipe TypeScript state editor builder
│   │   │   ├── template-form/ # Komponen wizard draf pembuatan template
│   │   │   │   ├── TemplateBasicDetails.svelte # [84 baris] Input nama, kategori, & thumbnail draf
│   │   │   │   ├── TemplateCardPreview.svelte  # [104 baris] Mockup kartu preview live draf template
│   │   │   │   └── TemplatePricingSimulator.svelte # [100 baris] Simulator split harga & fee komisi
│   │   │   ├── topbar/ # Bar atas kontrol viewport, grid, & zoom
│   │   │   │   └── TopBarViewportControls.svelte # [90 baris] Kontrol viewport breakpoint & zoom editor
│   │   │   ├── BuilderEditor.svelte            # [221 baris] Halaman utama editor visual no-code builder
│   │   │   ├── Canvas.svelte                   # [⚠️ mepet 300 baris - 262 baris] Lembar kerja visual kanvas editor builder
│   │   │   ├── ContentTab.svelte               # [16 baris] Tab pengisian teks & gambar konten node
│   │   │   ├── LayerPanel.svelte               # [120 baris] Panel pohon layer hirarki section template
│   │   │   ├── LayoutGridOverlay.svelte        # [61 baris] Overlay panduan kolom Figma 12/8/4 & pixel grid
│   │   │   ├── NewTemplateForm.svelte          # [239 baris] Form pembuatan template draft desainer
│   │   │   ├── NodeStylesTab.svelte            # [246 baris] Tab kustomisasi spesifik style per node
│   │   │   ├── PropertyInspector.svelte        # [213 baris] Panel samping inspection properti node & tema
│   │   │   ├── ReadOnlyPreview.svelte          # [240 baris] Pratinjau baca-saja live template
│   │   │   ├── StylesTab.svelte                # [18 baris] Tab helper navigasi styles
│   │   │   ├── SubmitReviewModal.svelte        # [220 baris] Modal pengajuan review template ke admin
│   │   │   └── TopBar.svelte                   # [152 baris] Bar atas editor (undo, redo, zoom, breakpoint)
│   │   ├── checkout/ # Komponen halaman pembayaran & checkout e-invoice
│   │   │   ├── CheckoutItemDetails.svelte      # [129 baris] Rincian item produk template checkout
│   │   │   ├── CheckoutPaymentBreakdown.svelte # [135 baris] Rincian perhitungan total tagihan & admin fee
│   │   │   ├── CheckoutSummaryCard.svelte      # [114 baris] Ringkasan detail tagihan checkout invoice
│   │   │   ├── PaymentModal.svelte             # [65 baris] Modal pembayaran invoice Xendit
│   │   │   └── TransactionStatus.svelte        # [81 baris] Status tagihan invoice (polling & status badge)
│   │   ├── common/ # Komponen navigasi & shell layout umum
│   │   │   ├── GlobalZoomControl.svelte        # [89 baris] Kontrol interaktif floating pill zoom-in & zoom-out (25%-200%)
│   │   │   ├── Navbar.astro                    # [23 baris] Navigasi utama header base layout
│   │   │   ├── PublicNavbar.svelte             # [⚠️ >300 baris - 424 baris] Navbar publik interaktif
│   │   │   └── ThemeToggle.astro               # [37 baris] Tombol pengubah dark mode / light mode
│   │   ├── dashboard/ # Komponen dashboard manajemen tenant
│   │   │   ├── category/ # Pengelola master kategori template
│   │   │   │   ├── TenantCategoryDeleteModal.svelte # [41 baris] Modal konfirmasi hapus kategori tenant
│   │   │   │   └── TenantCategoryFormModal.svelte # [52 baris] Modal form tambah & edit kategori tenant
│   │   │   ├── navbar/ # Komponen navigasi dashboard tenant
│   │   │   │   └── NavbarUserMenu.svelte       # [133 baris] Dropdown profil & opsi logout navbar
│   │   │   ├── orders/ # Komponen riwayat pesanan dashboard
│   │   │   │   └── TenantOrderRow.svelte       # [117 baris] Baris riwayat transaksi pesanan tenant
│   │   │   ├── sidebar/ # Komponen navigasi samping dashboard tenant
│   │   │   │   ├── sidebar.helpers.ts          # [170 baris] Helper navigasi sidebar dashboard
│   │   │   │   ├── SidebarDesktop.svelte       # [195 baris] Sidebar dashboard versi layar desktop
│   │   │   │   ├── SidebarMobile.svelte        # [178 baris] Drawer sidebar dashboard versi mobile
│   │   │   │   └── SidebarUserProfile.svelte   # [89 baris] Mini profil & badge status tenant
│   │   │   ├── CategoryManager.svelte          # [⚠️ mepet 300 baris - 258 baris] Pengelola CRUD kategori produk tenant
│   │   │   ├── ConfirmTemplateModal.svelte     # [82 baris] Modal konfirmasi penerapan template toko
│   │   │   ├── DashboardNavbar.svelte          # [176 baris] Navigasi panel dashboard tenant & profil aksi
│   │   │   ├── IncompleteDataWarning.svelte    # [11 baris] Banner peringatan kelengkapan data profil toko
│   │   │   ├── OrderHistoryTable.svelte        # [228 baris] Tabel riwayat pesanan/transaksi tenant
│   │   │   ├── Sidebar.svelte                  # [57 baris] Menu navigasi sidebar panel tenant
│   │   │   ├── StoreSettingsForm.svelte        # [⚠️ mepet 300 baris - 270 baris] Konfigurasi WhatsApp, Google Maps, & profil toko
│   │   │   ├── TemplateGallery.svelte          # [243 baris] Galeri pilihan template desain toko
│   │   │   └── TrafficWidget.svelte            # [97 baris] Widget statistik trafik kunjungan storefront
│   │   ├── designer/ # Komponen dashboard desainer template
│   │   │   ├── orders/ # Komponen riwayat pesanan dashboard
│   │   │   │   └── DesignerOrderRow.svelte     # [100 baris] Baris tabel pesanan template desainer
│   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   ├── DesignerDeleteDraftModal.svelte # [84 baris] Modal validasi hard delete draf template desainer
│   │   │   │   ├── DesignerRejectionModal.svelte # [46 baris] Modal alasan penolakan template desainer
│   │   │   │   └── DesignerTemplateRow.svelte  # [164 baris] Baris data tabel kelola template desainer
│   │   │   ├── wallet/ # Komponen dompet & mutasi saldo desainer
│   │   │   │   ├── DesignerWeeklyChart.svelte  # [123 baris] Grafik tren pendapatan mingguan desainer
│   │   │   │   └── wallet.helpers.ts           # [221 baris] Helper kalkulasi saldo, tren pertumbuhan bulanan, sparkline, & mutasi dompet
│   │   │   ├── bankBranding.helpers.ts         # [127 baris] Helper brand bank resmi, logo SVG vektor, & aksen tema
│   │   │   ├── DesignerBankCard.svelte         # [185 baris] Kartu rekening bank desainer dinamis & logo resmi
│   │   │   ├── DesignerBankModal.svelte        # [107 baris] Modal data rekening bank desainer
│   │   │   ├── DesignerBankWithdraw.svelte     # [⚠️ mepet 300 baris - 287 baris] Grid pendapatan bersih & bank card, modal payout, serta riwayat penarikan dana
│   │   │   ├── DesignerMutationTable.svelte    # [214 baris] Tabel daftar mutasi keuangan desainer
│   │   │   ├── DesignerOrdersTable.svelte      # [236 baris] Tabel pesanan masuk dari tenant untuk desainer
│   │   │   ├── DesignerPayoutHistoryTable.svelte # [224 baris] Tabel riwayat payout desainer
│   │   │   ├── DesignerStatCards.svelte        # [154 baris] Grid 12 kolom statcard dompet, hero card, 3 kartu compact, & sparkline
│   │   │   ├── DesignerTemplateCard.svelte     # [213 baris] Kartu template buatan desainer (status review)
│   │   │   ├── DesignerTemplateTable.svelte    # [⚠️ >300 baris - 410 baris] Tabel kelola template desainer
│   │   │   ├── DesignerWalletOverview.svelte   # [107 baris] Orkestrasi grid dompet desainer 12 kolom, bank card, & riwayat penuh
│   │   │   └── DesignerWithdrawModal.svelte    # [174 baris] Modal konfirmasi withdraw desainer
│   │   ├── onboarding/ # Komponen wizard onboarding toko tenant
│   │   │   ├── wizard/ # Step form wizard pendaftaran toko baru
│   │   │   │   ├── OnboardingStepStoreInfo.svelte # [97 baris] Step form nama toko & kontak
│   │   │   │   ├── OnboardingStepSubdomain.svelte # [101 baris] Step form pemilihan subdomain
│   │   │   │   └── OnboardingStepSuccess.svelte # [32 baris] Step status sukses inisialisasi toko
│   │   │   └── OnboardingWizard.svelte         # [⚠️ >300 baris - 311 baris] Form inisialisasi subdomain & toko baru tenant
│   │   ├── public/ # Aset statis (gambar, font, logo)
│   │   │   ├── marketplace/
│   │   │   │   ├── marketplace.helpers.ts      # [58 baris] Helper filter & pengurutan pasar template
│   │   │   │   ├── MarketplaceCard.svelte      # [119 baris] Kartu template visual marketplace
│   │   │   │   └── MarketplaceFilterBar.svelte # [124 baris] Toolbar filter kategori & harga
│   │   │   ├── marketplace.types.ts            # [23 baris] Tipe data catalog template marketplace
│   │   │   ├── PublicTemplateMarketplace.svelte # [199 baris] Pasar katalog template interaktif
│   │   │   ├── StoreDirectory.svelte           # [⚠️ mepet 300 baris - 250 baris] Direktori daftar pencarian toko UMKM publik
│   │   │   └── TemplateCardAction.svelte       # [100 baris] Kartu katalog template dengan tombol beli & demo
│   │   ├── shared/ # Komponen bersama lintas peran pengguna
│   │   │   └── ImageUpload.svelte              # [⚠️ >300 baris - 312 baris] Pengunggah gambar terintegrasi Cloudinary API
│   │   ├── storefront/ # Komponen rendering toko storefront tenant
│   │   │   ├── DynamicSection.svelte           # [41 baris] Komponen rendering section dinamis storefront
│   │   │   ├── Footer.svelte                   # [10 baris] Footer publik website toko tenant
│   │   │   ├── Hero.svelte                     # [18 baris] Banner hero publik website toko tenant
│   │   │   ├── ProductGrid.svelte              # [⚠️ mepet 300 baris - 295 baris] Grid daftar produk di storefront
│   │   │   ├── PromoBanner.svelte              # [11 baris] Banner promosi publik website toko tenant
│   │   │   └── StoreStatusBanner.svelte        # [30 baris] Banner status operasional toko storefront tenant
│   │   ├── tenant/ # Komponen manajemen operasional tenant
│   │   │   ├── product/ # Komponen input data & varian produk dagangan
│   │   │   │   ├── ProductBasicFields.svelte   # [58 baris] Form field dasar produk (nama, harga, kategori)
│   │   │   │   ├── productForm.helpers.ts      # [56 baris] Helper serialisasi & validasi form produk
│   │   │   │   └── ProductVariantEditor.svelte # [155 baris] Pengelola grup & opsi varian produk
│   │   │   ├── ProductDeleteModal.svelte       # [78 baris] Dialog konfirmasi penghapusan produk
│   │   │   ├── ProductFormModal.svelte         # [⚠️ mepet 300 baris - 283 baris] Modal tambah/edit data produk toko
│   │   │   ├── ProductTable.svelte             # [⚠️ >300 baris - 335 baris] Tabel daftar produk dagangan tenant
│   │   │   ├── ProductTableRow.svelte          # [101 baris] Baris data produk toko tenant
│   │   │   └── StoreManager.svelte             # [248 baris] Panel monitoring penjualan tenant
│   │   ├── tokens/ # Definisi token warna, tipografi, & radius
│   │   │   ├── animations.ts                   # [41 baris] Token durasi & kurva easing transisi
│   │   │   ├── colors.ts                       # [129 baris] Token warna primer, sekunder, & netral
│   │   │   ├── index.ts                        # [12 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── radius.ts                       # [35 baris] Token concentric border radius
│   │   │   ├── shadows.ts                      # [23 baris] Token elevasi bayangan shadow box
│   │   │   ├── spacing.ts                      # [42 baris] Token grid 8pt layout spacing
│   │   │   └── typography.ts                   # [73 baris] Token scale & font-family Golden Ratio
│   │   └── ui/ # Komponen design system dasar modular
│   │       ├── Badge.svelte                    # [57 baris] Komponen badge info status visual
│   │       ├── Button.svelte                   # [123 baris] Komponen tombol interaktif modular
│   │       ├── Card.svelte                     # [72 baris] Komponen pembungkus kartu visual
│   │       ├── index.ts                        # [17 baris] Registri sentral modularisasi modul section builder
│   │       ├── Input.svelte                    # [186 baris] Komponen kolom isian teks input
│   │       ├── Modal.svelte                    # [167 baris] Komponen popup modal dialog
│   │       ├── Pagination.svelte               # [103 baris] Komponen paginasi kontrol halaman data
│   │       ├── RateLimitAlert.svelte           # [33 baris] Alert notifikasi pembatasan laju request (rate limit)
│   │       ├── Select.svelte                   # [126 baris] Komponen dropdown select pilihan
│   │       ├── statCard.helpers.ts             # [113 baris] Helper animasi count-up & kurva sparkline SVG StatCard
│   │       ├── StatCard.svelte                 # [277 baris] Komponen card statistik modular (hero, compact, sparkline & tren)
│   │       ├── Table.svelte                    # [57 baris] Komponen tabel tabular modular
│   │       ├── Textarea.svelte                 # [106 baris] Komponen kolom input text area
│   │       ├── ToastContainer.svelte           # [123 baris] Kontainer notifikasi toast mengambang
│   │       └── WhatsAppIcon.svelte             # [18 baris] Ikon WhatsApp SVG modular
│   ├── db/ # Konfigurasi koneksi & skema database Drizzle
│   │   ├── index.ts                            # [28 baris] Registri sentral modularisasi modul section builder
│   │   ├── schema.ts                           # [⚠️ >300 baris - 440 baris] Skema relasi database & tabel SaaS Drizzle
│   │   └── seed.ts                             # [127 baris] Script seeding data demo database
│   ├── layouts/ # Layout dasar pembungkus halaman Astro
│   │   ├── BaseLayout.astro                    # [55 baris] Layout dasar halaman publik web & kontrol zoom
│   │   ├── DashboardLayout.astro               # [70 baris] Layout terproteksi admin/tenant/designer, centered container, & zoom
│   │   └── StorefrontLayout.astro              # [44 baris] Layout storefront khusus tenant (subdomain) & zoom
│   ├── lib/ # Pustaka fungsi utilitas, auth, & integrasi pihak ke-3
│   │   ├── config/ # Konstanta konfigurasi aplikasi SaaS
│   │   │   └── app.ts                          # [61 baris] Konfigurasi konstanta platform & branding
│   │   ├── db/ # Konfigurasi koneksi & skema database Drizzle
│   │   │   └── client.ts                       # [33 baris] Klien database siap pakai
│   │   ├── finance/ # Integrasi e-invoice & penarikan dana Xendit
│   │   │   ├── index.ts                        # [5 baris] Registri sentral modularisasi modul section builder
│   │   │   └── xendit.ts                       # [192 baris] Integrasi SDK e-invoice & payout Xendit
│   │   ├── routing/ # Utilitas routing & multitenancy subdomain
│   │   │   └── subdomain.ts                    # [29 baris] Utilitas parsing & ekstraksi subdomain multitenancy
│   │   ├── stores/ # Store state Svelte manajemen editor builder
│   │   │   ├── schemas.ts                      # [34 baris] Skema validasi state svelte store
│   │   │   └── zoomStore.ts                    # [90 baris] Svelte store kontrol zoom global (25%-200%)
│   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   ├── index.ts                        # [5 baris] Registri sentral modularisasi modul section builder
│   │   │   └── migration.ts                    # [202 baris] Logika pipeline migrasi skema template
│   │   ├── utils/ # Kumpulan fungsi pembantu (helper utilities)
│   │   │   ├── api-handler.ts                  # [76 baris] Pembungkus standar API route handler
│   │   │   ├── designMath.ts                   # [35 baris] Utilitas rumus radius & Golden Ratio
│   │   │   ├── email.ts                        # [48 baris] Utilitas template pengiriman email notifikasi
│   │   │   ├── format.ts                       # [35 baris] Fungsi formatter mata uang IDR & waktu
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── logger.ts                       # [24 baris] Logger console terstandar
│   │   │   ├── rate-limiter.ts                 # [67 baris] Utilitas pembatas laju request (rate limiter in-memory)
│   │   │   └── validation.ts                   # [20 baris] Utilitas validator skema Zod
│   │   ├── validators/ # Validasi Zod form input & subdomain
│   │   │   └── subdomain.ts                    # [28 baris] Utilitas parsing & ekstraksi subdomain multitenancy
│   │   ├── auth-client.ts                      # [9 baris] Klien inisialisasi auth BetterAuth (frontend)
│   │   ├── auth.ts                             # [⚠️ mepet 300 baris - 262 baris] Konfigurasi server BetterAuth & database adapter
│   │   ├── cloudinary.ts                       # [142 baris] Pembantu upload gambar aman ke Cloudinary
│   │   ├── currency.ts                         # [24 baris] Utilitas manipulasi nilai rupiah
│   │   ├── toast.ts                            # [71 baris] State store penampil alert notifikasi melayang
│   │   └── whatsapp.ts                         # [39 baris] Utilitas generator URL chat WhatsApp
│   ├── pages/ # Rute halaman aplikasi Astro & endpoint API
│   │   ├── admin/ # Komponen panel administrasi platform
│   │   │   ├── settings/ # Halaman konfigurasi platform admin
│   │   │   │   └── index.astro                 # [47 baris] Modul pendukung
│   │   │   ├── template-categories/ # Halaman master kategori template
│   │   │   │   └── index.astro                 # [100 baris] Modul pendukung
│   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   └── index.astro                 # [119 baris] Modul pendukung
│   │   │   ├── users/ # Halaman manajemen data user admin
│   │   │   │   └── index.astro                 # [21 baris] Modul pendukung
│   │   │   ├── whitelist/ # Komponen whitelist email Google Auth admin
│   │   │   │   └── index.astro                 # [21 baris] Modul pendukung
│   │   │   └── index.astro                     # [42 baris] Modul pendukung
│   │   ├── api/ # Endpoint HTTP API backend serverless
│   │   │   ├── admin/ # Komponen panel administrasi platform
│   │   │   │   ├── media/ # Endpoint integrasi manajemen media Cloudinary
│   │   │   │   │   └── cleanup.ts              # [39 baris] Modul pendukung
│   │   │   │   ├── settings/ # Halaman konfigurasi platform admin
│   │   │   │   │   └── commission.ts           # [48 baris] Tipe skema bagi hasil komisi
│   │   │   │   ├── template-categories/ # Halaman master kategori template
│   │   │   │   │   ├── [id].ts                 # [46 baris] Modul pendukung
│   │   │   │   │   └── index.ts                # [36 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── review.ts           # [36 baris] Modul pendukung
│   │   │   │   │   └── index.ts                # [21 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── users/ # Halaman manajemen data user admin
│   │   │   │   │   ├── [userId]/
│   │   │   │   │   │   └── status.ts           # [57 baris] Modul pendukung
│   │   │   │   │   ├── index.ts                # [31 baris] Registri sentral modularisasi modul section builder
│   │   │   │   │   └── register.ts             # [55 baris] Modul pendukung
│   │   │   │   ├── metrics.ts                  # [95 baris] Modul pendukung
│   │   │   │   └── whitelist.ts                # [125 baris] Modul pendukung
│   │   │   ├── analytics/ # Endpoint pelacakan metrik trafik
│   │   │   │   └── track.ts                    # [24 baris] Modul pendukung
│   │   │   ├── auth/ # Komponen form otentikasi & login pengguna
│   │   │   │   ├── [...all].ts                 # [22 baris] Modul pendukung
│   │   │   │   ├── check-email.ts              # [30 baris] Modul pendukung
│   │   │   │   ├── error.ts                    # [14 baris] Modul pendukung
│   │   │   │   └── reset-password.ts           # [42 baris] Modul pendukung
│   │   │   ├── builder/ # Komponen visual no-code builder template
│   │   │   │   └── save.ts                     # [30 baris] Modul pendukung
│   │   │   ├── categories/
│   │   │   │   └── index.ts                    # [125 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── designer/ # Komponen dashboard desainer template
│   │   │   │   ├── payout/
│   │   │   │   │   └── status.ts               # [43 baris] Modul pendukung
│   │   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   │   ├── draft.ts                # [133 baris] Modul pendukung
│   │   │   │   │   └── submit-review.ts        # [28 baris] Modul pendukung
│   │   │   │   ├── bank-account.ts             # [84 baris] Modul pendukung
│   │   │   │   └── payout.ts                   # [145 baris] Modul pendukung
│   │   │   ├── directory/ # Endpoint pencarian direktori toko publik
│   │   │   │   └── search.ts                   # [117 baris] Modul pendukung
│   │   │   ├── media/ # Endpoint integrasi manajemen media Cloudinary
│   │   │   │   ├── delete.ts                   # [33 baris] Modul pendukung
│   │   │   │   └── sign.ts                     # [59 baris] Modul pendukung
│   │   │   ├── products/ # Endpoint CRUD produk toko tenant
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── stock.ts                # [47 baris] Modul pendukung
│   │   │   │   │   └── variants.ts             # [147 baris] Modul pendukung
│   │   │   │   ├── [id].ts                     # [107 baris] Modul pendukung
│   │   │   │   └── index.ts                    # [106 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── public/ # Aset statis (gambar, font, logo)
│   │   │   │   ├── template-categories/ # Halaman master kategori template
│   │   │   │   │   └── index.ts                # [11 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   │   └── index.ts                # [15 baris] Registri sentral modularisasi modul section builder
│   │   │   │   ├── transactions/
│   │   │   │   │   └── status/
│   │   │   │   │       └── [invoiceId].ts      # [36 baris] Modul pendukung
│   │   │   │   └── commission.ts               # [20 baris] Tipe skema bagi hasil komisi
│   │   │   ├── storefront/ # Komponen rendering toko storefront tenant
│   │   │   │   └── catalog.ts                  # [50 baris] Modul pendukung
│   │   │   ├── stores/ # Store state Svelte manajemen editor builder
│   │   │   │   ├── [storeId]/
│   │   │   │   │   ├── apply-template.ts       # [54 baris] Modul pendukung
│   │   │   │   │   └── products.ts             # [91 baris] Modul pendukung
│   │   │   │   ├── check-subdomain.ts          # [51 baris] Modul pendukung
│   │   │   │   ├── onboard.ts                  # [114 baris] Modul pendukung
│   │   │   │   ├── register-subdomain.ts       # [111 baris] Modul pendukung
│   │   │   │   ├── settings.ts                 # [64 baris] Modul pendukung
│   │   │   │   └── status.ts                   # [101 baris] Modul pendukung
│   │   │   ├── template-categories/ # Halaman master kategori template
│   │   │   │   └── index.ts                    # [11 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   └── index.ts                    # [20 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── tenant/ # Komponen manajemen operasional tenant
│   │   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   │   └── index.ts                # [21 baris] Registri sentral modularisasi modul section builder
│   │   │   │   └── transactions/
│   │   │   │       └── template-purchase.ts    # [42 baris] Modul pendukung
│   │   │   └── webhooks/ # Endpoint penerima webhook transaksi Xendit
│   │   │       └── xendit.ts                   # [98 baris] Integrasi SDK e-invoice & payout Xendit
│   │   ├── auth/ # Komponen form otentikasi & login pengguna
│   │   │   ├── error.astro                     # [63 baris] Modul pendukung
│   │   │   ├── forgot-password.astro           # [27 baris] Modul pendukung
│   │   │   ├── login.astro                     # [209 baris] Modul pendukung
│   │   │   └── reset-password.astro            # [27 baris] Modul pendukung
│   │   ├── builder/ # Komponen visual no-code builder template
│   │   │   ├── preview/ # Halaman live preview interaktif template
│   │   │   │   └── [templateId].astro          # [55 baris] Modul pendukung
│   │   │   ├── [templateId].astro              # [28 baris] Modul pendukung
│   │   │   └── new.astro                       # [25 baris] Modul pendukung
│   │   ├── checkout/ # Komponen halaman pembayaran & checkout e-invoice
│   │   │   └── [invoiceId].astro               # [163 baris] Modul pendukung
│   │   ├── dashboard/ # Komponen dashboard manajemen tenant
│   │   │   ├── analytics.astro                 # [122 baris] Modul pendukung
│   │   │   ├── categories.astro                # [118 baris] Modul pendukung
│   │   │   ├── index.astro                     # [91 baris] Modul pendukung
│   │   │   ├── orders.astro                    # [114 baris] Modul pendukung
│   │   │   ├── products.astro                  # [148 baris] Modul pendukung
│   │   │   ├── store-settings.astro            # [81 baris] Modul pendukung
│   │   │   ├── store.astro                     # [90 baris] Modul pendukung
│   │   │   └── templates.astro                 # [112 baris] Modul pendukung
│   │   ├── designer/ # Komponen dashboard desainer template
│   │   │   ├── orders.astro                    # [117 baris] Modul pendukung
│   │   │   ├── templates.astro                 # [128 baris] Modul pendukung
│   │   │   └── wallet.astro                    # [100 baris] Modul pendukung
│   │   ├── onboarding/ # Komponen wizard onboarding toko tenant
│   │   │   └── index.astro                     # [31 baris] Modul pendukung
│   │   ├── storefront/ # Komponen rendering toko storefront tenant
│   │   │   ├── [subdomain].astro               # [136 baris] Modul pendukung
│   │   │   └── index.astro                     # [45 baris] Modul pendukung
│   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   └── index.astro                     # [92 baris] Modul pendukung
│   │   ├── 401.astro                           # [11 baris] Modul pendukung
│   │   ├── 403.astro                           # [11 baris] Modul pendukung
│   │   ├── 404.astro                           # [11 baris] Modul pendukung
│   │   ├── index.astro                         # [100 baris] Modul pendukung
│   │   ├── login.astro                         # [5 baris] Modul pendukung
│   │   ├── register.astro                      # [5 baris] Modul pendukung
│   │   ├── test-store.astro                    # [27 baris] Modul pendukung
│   │   └── umkm.astro                          # [28 baris] Modul pendukung
│   ├── schemas/ # Skema validasi runtime data model Zod
│   │   ├── admin/ # Komponen panel administrasi platform
│   │   │   ├── admin.schema.ts                 # [73 baris] Skema Zod komisi & parameter platform settings
│   │   │   └── index.ts                        # [2 baris] Registri sentral modularisasi modul section builder
│   │   ├── designer/ # Komponen dashboard desainer template
│   │   │   ├── bank-account.schema.ts          # [19 baris] Skema Zod rekening bank desainer
│   │   │   └── payout.schema.ts                # [9 baris] Skema Zod nominal pengajuan payout desainer
│   │   ├── finance/ # Integrasi e-invoice & penarikan dana Xendit
│   │   │   ├── index.ts                        # [5 baris] Registri sentral modularisasi modul section builder
│   │   │   └── transaction.schema.ts           # [44 baris] Skema Zod verifikasi parameter transaksi
│   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   ├── index.ts                        # [6 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── template-category.schema.ts     # [28 baris] Skema Zod validasi kategori template
│   │   │   ├── template.defaults.ts            # [241 baris] Default konfigurasi sections & themes template
│   │   │   ├── template.presets.ts             # [150 baris] Skema Zod validasi preset layout section
│   │   │   ├── template.schema.ts              # [147 baris] Skema Zod visual draf & metadata template
│   │   │   └── template.tokens.ts              # [46 baris] Skema Zod token warna & tipografi template
│   │   ├── auth.schema.ts                      # [40 baris] Skema Zod validasi kredensial pengguna
│   │   ├── index.ts                            # [13 baris] Registri sentral modularisasi modul section builder
│   │   ├── media.schema.ts                     # [60 baris] Skema Zod upload data berkas gambar
│   │   └── product-variant.schema.ts           # [31 baris] Skema Zod varian produk
│   ├── services/ # Lapisan business logic & domain service SaaS
│   │   ├── finance/ # Integrasi e-invoice & penarikan dana Xendit
│   │   │   ├── commission.service.ts           # [132 baris] Logika bagi hasil komisi platform & desainer
│   │   │   ├── index.ts                        # [9 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── payout.service.ts               # [169 baris] Logika transaksi penarikan dana desainer
│   │   │   ├── transaction.helpers.ts          # [103 baris] Helper aktivasi kepemilikan template tenant
│   │   │   ├── transaction.service.ts          # [234 baris] Logika pembuatan invoice & aktivasi toko
│   │   │   ├── wallet.helpers.ts               # [78 baris] Helper kalkulasi saldo & mutasi dompet
│   │   │   └── wallet.service.ts               # [218 baris] Ledger mutasi wallet & hitung saldo matang
│   │   ├── media/ # Endpoint integrasi manajemen media Cloudinary
│   │   │   ├── cleanup.helpers.ts              # [165 baris] Helper ekstraksi URL & identifier Cloudinary
│   │   │   ├── cleanup.service.ts              # [157 baris] Logika deteksi & pembersihan orphan media Cloudinary
│   │   │   └── index.ts                        # [2 baris] Registri sentral modularisasi modul section builder
│   │   ├── template-categories/ # Halaman master kategori template
│   │   │   ├── index.ts                        # [2 baris] Registri sentral modularisasi modul section builder
│   │   │   └── template-category.service.ts    # [119 baris] Logika database CRUD kategori template
│   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── template.admin.service.ts       # [75 baris] Logika review & verifikasi template admin
│   │   │   └── template.service.ts             # [⚠️ mepet 300 baris - 275 baris] Logika database template & status review
│   │   ├── analytics.service.ts                # [55 baris] Logika analytics trafik
│   │   ├── index.ts                            # [12 baris] Registri sentral modularisasi modul section builder
│   │   └── store-template.service.ts           # [192 baris] Logika penerapan & rendering template storefront
│   ├── styles/ # Gaya global CSS, reset, & Tailwind variables
│   │   ├── critical.css                        # [112 baris] Gaya CSS kritis untuk optimasi LCP & first paint
│   │   └── global.css                          # [⚠️ >300 baris - 366 baris] Variabel Tailwind, gaya global, & reset CSS
│   ├── types/ # Definisi tipe TypeScript modul aplikasi
│   │   ├── admin/ # Komponen panel administrasi platform
│   │   │   └── index.ts                        # [29 baris] Registri sentral modularisasi modul section builder
│   │   ├── auth/ # Komponen form otentikasi & login pengguna
│   │   │   └── index.ts                        # [15 baris] Registri sentral modularisasi modul section builder
│   │   ├── common/ # Komponen navigasi & shell layout umum
│   │   │   ├── api.ts                          # [70 baris] Tipe standard HTTP API responses
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   └── toast.ts                        # [10 baris] State store penampil alert notifikasi melayang
│   │   ├── finance/ # Integrasi e-invoice & penarikan dana Xendit
│   │   │   ├── commission.ts                   # [19 baris] Tipe skema bagi hasil komisi
│   │   │   ├── index.ts                        # [8 baris] Registri sentral modularisasi modul section builder
│   │   │   ├── transactions.ts                 # [109 baris] Tipe invoice transaksi & log webhook
│   │   │   └── wallet.ts                       # [61 baris] Tipe ledger wallet, mutasi, & detail payout
│   │   ├── media/ # Endpoint integrasi manajemen media Cloudinary
│   │   │   └── index.ts                        # [22 baris] Registri sentral modularisasi modul section builder
│   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   ├── builder.sections.ts             # [243 baris] Tipe data props spesifik per section builder
│   │   │   ├── builder.ts                      # [147 baris] Tipe data visual block editor no-code
│   │   │   ├── index.ts                        # [7 baris] Registri sentral modularisasi modul section builder
│   │   │   └── template.ts                     # [49 baris] Tipe data model template & pratinjau
│   │   └── index.ts                            # [13 baris] Registri sentral modularisasi modul section builder
│   ├── env.d.ts                                # [32 baris] Deklarasi global compiler TypeScript Astro
│   └── middleware.ts                           # [117 baris] Middleware otentikasi & pengecekan role
├── tests/ # Suite pengujian unit & integrasi (Vitest)
│   ├── api/ # Endpoint HTTP API backend serverless
│   │   ├── admin/ # Komponen panel administrasi platform
│   │   │   ├── metrics.test.ts                 # [121 baris] Uji pengujian unit / integrasi Vitest
│   │   │   └── users-register.test.ts          # [131 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── analytics/ # Endpoint pelacakan metrik trafik
│   │   │   └── track.test.ts                   # [99 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── builder/ # Komponen visual no-code builder template
│   │   │   └── save.test.ts                    # [60 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── categories/
│   │   │   └── index.test.ts                   # [102 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── designer/ # Komponen dashboard desainer template
│   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   ├── draft-delete.test.ts        # [122 baris] Uji pengujian unit / integrasi Vitest
│   │   │   │   └── submit-review.test.ts       # [210 baris] Uji pengujian unit / integrasi Vitest
│   │   │   ├── bank-account.test.ts            # [⚠️ mepet 300 baris - 250 baris] Uji pengujian unit / integrasi Vitest
│   │   │   ├── payout-status.test.ts           # [90 baris] Uji pengujian unit / integrasi Vitest
│   │   │   └── payout.test.ts                  # [243 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── directory/ # Endpoint pencarian direktori toko publik
│   │   │   └── search.test.ts                  # [68 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── products/ # Endpoint CRUD produk toko tenant
│   │   │   ├── index.test.ts                   # [146 baris] Uji pengujian unit / integrasi Vitest
│   │   │   ├── stock.test.ts                   # [72 baris] Uji pengujian unit / integrasi Vitest
│   │   │   └── variants.test.ts                # [⚠️ mepet 300 baris - 274 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── public/ # Aset statis (gambar, font, logo)
│   │   │   ├── templates/ # Komponen manajemen template desainer
│   │   │   │   └── index.test.ts               # [17 baris] Uji pengujian unit / integrasi Vitest
│   │   │   └── commission.test.ts              # [28 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── storefront/ # Komponen rendering toko storefront tenant
│   │   │   └── catalog.test.ts                 # [59 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── stores/ # Store state Svelte manajemen editor builder
│   │   │   └── [storeId]/
│   │   │       ├── apply-template.test.ts      # [151 baris] Uji pengujian unit / integrasi Vitest
│   │   │       └── products.test.ts            # [138 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── webhooks/ # Endpoint penerima webhook transaksi Xendit
│   │   │   └── xendit.test.ts                  # [153 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── admin-media-cleanup.test.ts         # [126 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── check-subdomain.test.ts             # [64 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── media-sign.test.ts                  # [69 baris] Uji pengujian unit / integrasi Vitest
│   │   └── template-categories.test.ts         # [119 baris] Uji pengujian unit / integrasi Vitest
│   ├── builder/ # Komponen visual no-code builder template
│   │   ├── global-design-system.test.ts        # [120 baris] Uji pengujian unit / integrasi Vitest
│   │   └── section-registry.test.ts            # [202 baris] Uji pengujian unit / integrasi Vitest
│   ├── finance/ # Integrasi e-invoice & penarikan dana Xendit
│   │   ├── commission-and-masking.test.ts      # [⚠️ mepet 300 baris - 297 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── payout-disbursement.test.ts         # [242 baris] Uji pengujian unit / integrasi Vitest
│   │   └── price-sync.test.ts                  # [⚠️ >300 baris - 326 baris] Uji pengujian unit / integrasi Vitest
│   ├── lib/ # Pustaka fungsi utilitas, auth, & integrasi pihak ke-3
│   │   ├── transactions/
│   │   │   └── service.test.ts                 # [⚠️ >300 baris - 402 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── auth-google-whitelist.test.ts       # [199 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── auth-helpers.test.ts                # [238 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── templates-migration.test.ts         # [226 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── toast.test.ts                       # [68 baris] Uji pengujian unit / integrasi Vitest
│   │   └── xendit.test.ts                      # [233 baris] Uji pengujian unit / integrasi Vitest
│   ├── products/ # Endpoint CRUD produk toko tenant
│   │   └── catalog.test.ts                     # [100 baris] Uji pengujian unit / integrasi Vitest
│   ├── routing/ # Utilitas routing & multitenancy subdomain
│   │   └── subdomain.test.ts                   # [82 baris] Uji pengujian unit / integrasi Vitest
│   ├── schemas/ # Skema validasi runtime data model Zod
│   │   ├── auth.test.ts                        # [109 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── media.test.ts                       # [106 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── product-variant.test.ts             # [159 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── store-settings.test.ts              # [61 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── template-tokens-presets.test.ts     # [⚠️ >300 baris - 361 baris] Uji pengujian unit / integrasi Vitest
│   │   └── template.test.ts                    # [235 baris] Uji pengujian unit / integrasi Vitest
│   ├── services/ # Lapisan business logic & domain service SaaS
│   │   ├── analytics.service.test.ts           # [121 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── media-cleanup.test.ts               # [⚠️ mepet 300 baris - 270 baris] Uji pengujian unit / integrasi Vitest
│   │   └── store-template.service.test.ts      # [159 baris] Uji pengujian unit / integrasi Vitest
│   ├── storefront/ # Komponen rendering toko storefront tenant
│   │   └── cache-headers.test.ts               # [22 baris] Uji pengujian unit / integrasi Vitest
│   ├── transactions/
│   │   ├── e2e-template-marketplace-flow.test.ts # [182 baris] Uji pengujian unit / integrasi Vitest
│   │   ├── template-purchase-flow.test.ts      # [⚠️ mepet 300 baris - 270 baris] Uji pengujian unit / integrasi Vitest
│   │   └── wallet-and-fulfillment.test.ts      # [199 baris] Uji pengujian unit / integrasi Vitest
│   ├── ui/ # Komponen design system dasar modular
│   │   ├── design-system.test.ts               # [119 baris] Uji pengujian unit / integrasi Vitest
│   │   └── global-enhancements.test.ts         # [121 baris] Uji unit zoom controls, bank branding, & layout schematics
│   └── utils/ # Kumpulan fungsi pembantu (helper utilities)
│       ├── api-handler.test.ts                 # [133 baris] Uji pengujian unit / integrasi Vitest
│       ├── design-math.test.ts                 # [78 baris] Uji pengujian unit / integrasi Vitest
│       └── validation.test.ts                  # [34 baris] Uji pengujian unit / integrasi Vitest
├── .env.example                                # [33 baris] Contoh variabel lingkungan environment aplikasi
├── .eslintrc.cjs                               # [72 baris] Konfigurasi linter ESLint JavaScript & TypeScript
├── .gitattributes                              # [33 baris] Aturan konfigurasi atribut Git & line endings
├── .gitignore                                  # [28 baris] Daftar berkas & folder yang diabaikan Git
├── AGENTS.md                                   # [56 baris] Instruksi & guideline sistem bagi agen AI
├── astro.config.mjs                            # [31 baris] Konfigurasi Astro Framework
├── CLAUDE.md                                   # [23 baris] Panduan & instruksi arsitektur untuk Claude Code
├── drizzle.config.ts                           # [13 baris] Konfigurasi Drizzle ORM
├── GEMINI.md                                   # [⚠️ >300 baris - 1165 baris] Peta struktur folder & dokumentasi komprehensif projek
├── opencode.json                               # [28 baris] Konfigurasi open code environment
├── package.json                                # [65 baris] Berkas dependensi npm & bun scripts
├── postcss.config.mjs                          # [7 baris] Konfigurasi PostCSS & Tailwind
├── PRD.md                                      # [153 baris] Dokumen spesifikasi kebutuhan produk platform (PRD)
├── README.md                                   # [70 baris] Dokumentasi ringkasan projek SaaS UMKM Site Builder
├── SETUP.md                                    # [172 baris] Panduan setup & inisialisasi lingkungan lokal
├── skills-lock.json                            # [48 baris] Lockfile dependency skill AI
├── tailwind.config.mjs                         # [93 baris] Konfigurasi styling token Tailwind CSS
├── tsconfig.json                               # [33 baris] Konfigurasi compiler TypeScript
└── vitest.config.ts                            # [27 baris] Konfigurasi testing framework Vitest
```

---

## 🛠️ Dokumentasi Visual Template Builder

Berikut adalah detail spesifikasi arsitektur teknis dari no-code visual template builder yang digunakan untuk merancang, mengedit, dan merender website toko UMKM responsif secara dinamis.

---

### 1. Spesifikasi Modular Section & Layout Presets

Seluruh section terdaftar di **Section Registry Central** (`src/components/builder/registry/index.ts`). Terdapat total **8 Tipe Section** dengan **104 Varian Layout Preset** (Header 12 preset, Hero 22 preset, Features 10 preset, Product Catalog 20 preset, Testimonials 10 preset, FAQ 10 preset, Google Maps 10 preset, dan Footer 10 preset).

Di bawah ini adalah penjelasan detail per section, jumlah layout, serta perilaku dan representasi visual layout tersebut di ketiga ukuran device (**Desktop: 1200px**, **Tablet: 768px**, dan **Mobile: 375px**):

---

#### A. Header & Announcement (`header_announcement`) — 12 Layout Presets
Komponen utama: `src/components/builder/sections/HeaderAnnouncement.svelte`  
Komponen pendukung: `AnnouncementBar.svelte`, `HeaderLogo.svelte`, `HeaderNav.svelte`, `HeaderPillIsland.svelte`, `HeaderMegaMenu.svelte`, `HeaderCommandSearch.svelte`, `HeaderDeliveryOrder.svelte`, `HeaderStoreBadge.svelte`, `HeaderPromoCountdown.svelte`, `HeaderMobileDrawer.svelte`.  
Karakteristik: `isFullBleed = true` (melebar 100% viewport).

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`default_split`** *(Default)* | ✅ Responsif & Rapi | **2 Baris Terpisah**: Baris 1 memuat Announcement Bar di atas (fullwidth, `py-2`). Baris 2 Navbar setinggi `64px`: Logo di kiri, menu navigasi (`HeaderNav`) di kanan, dan tombol CTA Chat WhatsApp di ujung kanan. | Announcement Bar tetap di atas; Navbar mempertahankan Logo di kiri dan hamburger button di ujung kanan dengan padding safe zone `24px`. | Announcement Bar tetap aktif di atas; Navbar mempertahankan Logo di sisi kiri dan tombol hamburger di ujung kanan (`justify-between`), membuka drawer overlay penuh saat diklik. |
| **`centered_stacked`** | ✅ Responsif & Rapi | **2 Baris Terpusat**: Announcement Bar di atas. Navbar bertumpuk vertikal di tengah (`flex-col items-center justify-center gap-4 py-4`): Logo toko berada di baris atas tengah, menu nav links horizontal rapi di baris bawah tengah dengan `gap-6`. | Runtuh otomatis ke 1 baris simetris: Logo di sisi kiri dan tombol hamburger di sisi paling kanan (`justify-between`). | 1 Baris ramping: Logo di sisi kiri dan tombol hamburger di pojok kanan aman (`justify-between`), menu navigasi lengkap berpindah ke drawer overlay. |
| **`compact_inline`** | ✅ Responsif & Rapi | **1 Baris Ramping Tunggal (`h-14` / 56px)**: Announcement Bar ditiadakan. Logo di sisi kiri, menu navigasi sejajar horizontal di tengah (`flex-1 hidden md:flex`), dan tombol CTA WhatsApp (`MessageCircle` + teks) berada di sisi kanan. | Logo di kiri, menu nav horizontal atau hamburger di kanan dalam 1 baris ramping 56px. | Menu nav links disembunyikan (`hidden md:flex`), menyisakan Logo di sisi kiri dan hamburger di sisi paling kanan (`justify-between`), hemat ruang vertikal. |
| **`floating_pill_island`** | ✅ Responsif & Rapi | Floating island berbentuk kapsul terpisah (`rounded-full shadow-lg bg-surface/90 backdrop-blur`) melayang di atas banner dengan margin top 16px dan batas margin safe-zone layout aktif. | Floating island menyesuaikan lebar kontainer tablet 768px dengan safe-zone padding `24px`, logo di kiri dan hamburger di kanan kapsul. | Kapsul melayang ramping 1 baris; logo di kiri kapsul dan tombol hamburger di kanan kapsul, membuka drawer overlay seluler. |
| **`split_nav_centered_logo`** | ✅ Responsif & Rapi | Logo terpusat simetris di tengah baris header (`flex-shrink-0`), 2 menu navigasi terpisah di sisi kiri (`Produk`, `Tentang`) dan kanan (`Kontak`, tombol WA). | Logo tetap terpusat di tengah, nav links disesuaikan dengan padding safe-zone `24px`, hamburger di kanan. | Logo terpusat atau di kiri (ikon saja pada 375px), burger icon di pojok kanan aman, nav links berpindah ke drawer overlay. |
| **`command_search_bar`** | ✅ Responsif & Rapi | Baris pencarian cepat ala Command Palette (`Ctrl+K`) terintegrasi di tengah header berdampingan dengan logo dan tombol aksi. | Input search menyusut proporsional (`w-48` s/d `w-64`), hamburger di kanan. | Input search berubah menjadi ikon kaca pembesar (`Search`) 44x44px yang ketika diklik membuka search bar inline penuh, berdampingan dengan hamburger menu. |
| **`transparent_glass_header`** | ✅ Responsif & Rapi | Header latar transparan dengan efek *glassmorphism* (`backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/40`). | Efek blur glassmorphism halus melapisi konten di bawahnya di layar tablet 768px, hamburger di pojok kanan. | Header glassmorphism 1 baris kompak dengan safe-zone `24px`, logo di kiri dan burger di kanan. |
| **`mega_menu_dropdown`** | ✅ Responsif & Rapi | Navigasi dengan dropdown Mega Menu multi-kolom rapi saat hover pada kategori katalog produk. | Dropdown mega menu beradaptasi dengan lebar kontainer tablet, hamburger di kanan. | Mega menu dilipat menjadi menu akordeon vertikal interaktif di dalam drawer overlay tanpa menyebabkan scroll di dalam header. |
| **`top_contact_bar`** | ✅ Responsif & Rapi | Baris kontak teratas (`bg-slate-900 text-slate-200 text-xs py-1.5`) memuat jam operasional, alamat toko, & status toko dinamis di atas navbar utama. | Baris kontak terkompresi; alamat toko disembunyikan di tablet (`hidden sm:flex`), menyisakan jam buka & badge status "Toko Buka", burger di kanan navbar. | Baris kontak ringkas 1 baris memuat jam buka & status toko aktif, navbar utama memuat logo & burger menu di pojok kanan. |
| **`delivery_order_cta`** | ✅ Responsif & Rapi | Baris atas promo kirim instan 30 menit & opsi GrabFood/GoFood (`bg-orange-50 text-orange-900`), navbar utama dengan CTA `Pesan Sekarang` berikon sepeda motor (`bg-orange-600`). | Baris atas terkompresi; status opsi kurir disembunyikan di layar kecil, navbar mempertahankan logo & hamburger button 44x44px di pojok kanan. | Baris atas memuat info estimasi kirim, navbar utama memuat logo & tombol hamburger 44x44px di pojok kanan. |
| **`store_badge_highlight`** | ✅ Responsif & Rapi | Badges legalitas resmi toko (`✓ BPOM` bg-emerald-50, `✓ Halal MUI` bg-blue-50) berdampingan langsung di samping logo brand, CTA `Konsultasi Gratis`. | Badges legalitas tetap tampak di samping logo pada layar tablet (`hidden sm:flex`), navbar memuat hamburger button 44x44px di kanan. | Badges legalitas dilipat rapi di dalam drawer overlay seluler, navbar utama memuat logo & tombol hamburger 44x44px. |
| **`promo_countdown_banner`** | ✅ Responsif & Rapi | Banner atas merah gradasi `FLASH SALE` dengan timer hitung mundur digital (`04 Jam 28 Mnt 15 Dtk`), navbar utama dengan CTA `Klaim Kupon` (`bg-rose-600`). | Timer hitung mundur menyesuaikan tampilan ringkas pada layar tablet 768px, hamburger button 44x44px di kanan. | Banner atas memuat teks Flash Sale & timer ringkas, navbar utama memuat logo & tombol hamburger 44x44px di pojok kanan. |

---

#### B. Hero Banner (`hero`) — 22 Layout Presets
Komponen utama: `src/components/builder/sections/Hero.svelte`  
Komponen pendukung: `HeroSplitLayout.svelte`, `HeroCenteredMinimal.svelte`, `HeroFullBanner.svelte`, `HeroElementToolbar.svelte`, `HeroEmailCapture.svelte`, `HeroFloatingCards.svelte`, `HeroTerminalCode.svelte`, `HeroSocialProof.svelte`, `HeroDualProduct.svelte`, `HeroBadgeTicker.svelte`, `HeroPillCategory.svelte`, `HeroBentoGrid.svelte`, `HeroStatCounter.svelte`, `HeroChatSimulation.svelte`, `HeroStickerPlayful.svelte`, `HeroEditorialSerif.svelte`, `HeroSideBooking.svelte`, `HeroDualContrast.svelte`, `HeroFounderStory.svelte`.  
Karakteristik: `isFullBleed = true` (background melebar 100%, konten di dalam batas safe-zone), isolasi container query `@container herocard`.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`split_left_text`** *(Default)* | ✅ Responsif & Rapi | **Grid 2 Kolom 50/50 (`md:grid-cols-12`)**: Kolom kiri (span-6) memuat Promo Badge pill, Headline judul H1 (`text-5xl`), Subtitle deskripsi, dan tombol CTA Belanja. Kolom kanan (span-6) memuat Card container gambar showcase produk (rasio `4:3`) berbingkai `rounded-2xl` dengan soft shadow. | Grid 2 kolom 50/50 proporsional. Font judul berskala `text-4xl`, gambar 4:3 proporsional di sisi kanan. | **1 Kolom Bertumpuk Vertikal (`grid-cols-1`)**: Teks judul (`text-3xl`), badge, dan tombol CTA tampil di bagian atas, diikuti gambar showcase produk di bawahnya. |
| **`split_right_text`** | ✅ Responsif & Rapi | **Grid 2 Kolom Asimetris Terbalik**: Kolom kiri (span-6) memuat gambar showcase produk (rasio `4:3`). Kolom kanan (span-6) memuat Promo Badge, Headline judul H1, Subtitle, dan tombol CTA. | Gambar di sisi kiri, teks headline & CTA di sisi kanan dalam susunan 2 kolom 50/50. | **1 Kolom Bertumpuk Vertikal**: Gambar showcase berada di urutan atas, diikuti headline teks dan tombol CTA di bawahnya. |
| **`centered_minimal`** | ✅ Responsif & Rapi | **Komposisi Simetris Tengah (Max-Width 3xl-4xl)**: Badge pill di tengah atas, Title H1 (`text-5xl`) terpusat, Subtitle di tengah (max-w-2xl), tombol CTA di tengah, diakhiri Card showcase gambar lanskap (rasio `16:9`) berbingkai tebal `rounded-2xl` shadow besar di bagian bawah. | Seluruh teks dan tombol CTA tetap terpusat di tengah layar. Gambar lanskap 16:9 menyesuaikan lebar tablet. | Teks judul mengecil proporsional (`text-3xl`), tombol CTA penuh/lebar nyaman disentuh, gambar lanskap 16:9 membentang 100% lebar safe-zone mobile. |
| **`full_banner_overlay`** | ✅ Responsif & Rapi | **Latar Belakang Gambar Penuh (Full-Bleed Cover)**: Gambar latar menutupi seluruh bidang hero dilapisi gelap (*dark overlay* `bg-black/40`). Teks putih kontras tinggi (`drop-shadow-md`) terpusat di tengah (max-w-3xl) dengan tombol CTA kontras tinggi. | Gambar latar full-bleed dengan teks putih terpusat dan mudah dibaca di tablet. | Gambar latar tetap memenuhi tinggi hero section, teks judul rapat dan jelas dengan padding safe-zone `16px`. |
| **`video_background_loop`** | ✅ Responsif & Rapi | Latar belakang video loop interaktif dengan lapisan overlay gelap (`bg-black/60`) dan teks judul kontras di tengah. | Video terpasang penuh menutupi area hero tablet 768px tanpa distorsi aspek rasio (`object-cover`). | Video beradaptasi penuh dengan fallback gambar poster jika perangkat hemat daya/kuota. |
| **`gradient_mesh_glow`** | ✅ Responsif & Rapi | Tampilan hero modern dengan latar belakang gradien mesh berkilau dinamis (`blur-3xl`) serta kartu form CTA terpusat berbingkai `rounded-2xl backdrop-blur-md`. | Efek gradien glow menyebar halus di latar belakang tablet 768px. | Kartu CTA membentang 100% safe-zone mobile dengan tombol aksi lebar yang mudah ditekan. |
| **`interactive_terminal_code`** | ✅ Responsif & Rapi | Tampilan hero gaya terminal developer/teknologi dengan blok baris perintah, tombol kontrol window, dan tombol salin cepat. | Tampilan terminal terpotong rapi dengan scroll horizontal otomatis jika teks perintah panjang. | Font terminal menyesuaikan skala seluler (`text-xs`), padding internal ramping `16px`. |
| **`floating_cards_showcase`** | ✅ Responsif & Rapi | Headline di tengah diapit 3 kartu promo mengambang 3D dengan animasi hover melayang. | Kartu mengambang berpindah posisi di bawah headline judul. | Kartu-kartu mengambang bertumpuk vertikal rapi di bawah headline tanpa overlapping. |
| **`oversized_bold_typography`** | ✅ Responsif & Rapi | Tipografi judul super besar (`text-8xl font-black tracking-tighter`) yang menonjol di tengah layar desktop. | Skala font judul menyesuaikan ukuran layar tablet (`text-6xl font-black`). | Font judul tebal berskala responsif mobile (`text-4xl`), tidak terjadi teks overflow horizontal. |
| **`inline_email_capture`** | ✅ Responsif & Rapi | Form penangkap email/WhatsApp prospek 1 baris horizontal (`flex gap-2 max-w-lg`) terintegrasi langsung di bawah subtitle. | Form input kontak terpusat di tengah layar tablet. | Form input kontak membungkus vertikal (`flex-col`), tombol submit berukuran lebar penuh. |
| **`social_proof_community`** | ✅ Responsif & Rapi | Headline kiri memuat avatar wall 4 pembeli terverifikasi, rating 5/5, dan 2 tombol CTA. Kanan kartu showcase produk 4:3 berbingkai `rounded-2xl`. | Grid 2 kolom seimbang 50/50 proporsional dengan safe-zone padding `24px`. | 1 Kolom bertumpuk: Teks, avatar stack pembeli, tombol WhatsApp lebar, diikuti foto produk. |
| **`dual_product_showcase`** | ✅ Responsif & Rapi | Kolom kiri memuat headline penawaran & benefit. Kolom kanan memuat 2 kartu produk terlaris berdampingan dengan badge harga dan tombol beli instan. | 2 Kartu produk tersusun seimbang di bawah headline judul. | 1 Kolom bertumpuk: Headline di atas, diikuti 2 kartu produk tersusun berurutan ke bawah. |
| **`badge_ticker_split`** | ✅ Responsif & Rapi | Hero split 2 kolom: Teks kiri memuat badge sertifikasi resmi (Halal MUI, BPOM, P-IRT). Kanan foto produk 4:3 dengan circular badge `100% ASLI` berotasi halus. | Grid 2 kolom proporsional, font judul berskala tablet, badge legalitas tersusun rapi di bawah tombol aksi. | 1 Kolom bertumpuk: Judul, tombol pesan, badge sertifikasi mutu, dan foto produk dengan stempel asli. |
| **`pill_category_selector`** | ✅ Responsif & Rapi | Layout terpusat simetris: Headline di atas dilengkapi filter pill tag kategori produk cepat (Semua Menu, Keripik, Sambal, Kopi, Kue), diikuti banner lanskap 21:9 di bawahnya. | Pill filter tersusun rapi di tengah dengan banner 21:9 proporsional tablet. | Pill kategori dapat digeser horizontal, banner foto membentang 100% lebar safe-zone mobile. |
| **`bento_masonry_hero`** | ✅ Responsif & Rapi | Bento grid modern 12-kolom: Ubin teks utama (span-7), ubin foto (span-5), ubin kupon diskon 25% (span-4), ubin kutipan ulasan bintang 5 (span-4), dan ubin info gratis ongkir (span-4). | Bento grid menyesuaikan menjadi 2 kolom rapi dan proporsional. | Seluruh ubin bento menumpuk vertikal 1 kolom teratur dan dinamis. |
| **`split_stat_counter`** | ✅ Responsif & Rapi | Layout split 2 kolom: Teks kiri dilengkapi 3 baris metrik angka pencapaian (25.000+ Porsi, Rating 4.9/5, 100% Higienis) dengan border pemisah. Kanan foto produk 4:3. | 3 Counter angka tersusun horizontal sejajar di bawah tombol CTA. | Counter angka menyesuaikan tata letak kolom vertikal/horizontal rapat yang mudah dibaca. |
| **`sticky_whatsapp_pill_float`** | ✅ Responsif & Rapi | Layout terpusat: Headline di atas, simulasi percakapan chat WhatsApp interaktif 2 arah di tengah, diakhiri tombol CTA Chat WhatsApp hijau emerald. | Simulasi bubble chat terpusat rapi dengan tombol aksi lebar di bawahnya. | Tampilan bubble chat menyerupai antarmuka WhatsApp ponsel asli dengan tombol CTA chat penuh. |
| **`sticker_badge_playful`** | ✅ Responsif & Rapi | Tema ceria & dinamis: Latar amber hangat, stiker diskon miring dinamis `-rotate-3` dan `-rotate-6`, foto polaroid putih miring `rotate-2`. Sangat memikat untuk produk camilan/kuliner. | Efek rotasi stiker dan polaroid tetap proporsional di tablet 768px. | 1 Kolom bertumpuk: Teks dan badge stiker di atas, foto polaroid di bawah dengan margin aman. |
| **`editorial_luxury_serif`** | ✅ Responsif & Rapi | Tipografi serif editorial berlatar krem hangat (`#faf8f5`), judul miring artistik, dan showcase lanskap 16:8 khusus produk kriya, fesyen, atau artisan premium. | Tipografi serif terpusat elegan dengan banner lanskap selebar tablet. | Font judul berskala nyaman (`text-2xl`), tombol aksi terpusat, foto membentang aman di layar seluler. |
| **`side_card_booking`** | ✅ Responsif & Rapi | Layout split 2 kolom: Kolom kiri memuat headline & fasilitas. Kolom kanan memuat kartu form reservasi janji temu/meja (pilihan layanan & nomor WhatsApp) dengan tombol konfirmasi langsung. | 2 Kolom seimbang (informasi layanan di kiri, kartu form booking di kanan). | 1 Kolom bertumpuk vertikal: Informasi layanan di atas, form booking interaktif di bawahnya. |
| **`dual_contrast_split`** | ✅ Responsif & Rapi | Kartu duo-tone split 50/50 kontras: Sisi kiri berlatar terang (badge, judul kelas/program, tombol daftar), sisi kanan berlatar gelap Slate 950 dengan info kuota batch terbatas dan ambient glow. | Split 50/50 mempertahankan proporsi kontras di layar tablet 768px. | Runtuh vertikal menjadi 2 blok berurutan (blok terang di atas, blok gelap kuota di bawah). |
| **`brand_story_founder`** | ✅ Responsif & Rapi | Layout naratif 2 kolom: Kolom kiri memuat foto profil pendiri/artisan (rasio 4:5) dengan overlay nama & jabatan. Kolom kanan memuat judul kutipan filosofi toko, cerita asal-usul usaha, dan tombol coba menu. | Foto pendiri dan narasi cerita tersusun seimbang 2 kolom. | 1 Kolom bertumpuk: Foto profil pendiri tampil di urutan atas, diikuti narasi cerita dan tombol di bawahnya. |

---

#### C. Fitur & Keunggulan (`features`) — 10 Layout Presets
Komponen utama: `src/components/builder/sections/Features.svelte`.  
Komponen pendukung: `FeaturesBentoGrid.svelte`, `FeaturesComparison.svelte`, `FeaturesInteractiveTabs.svelte`, `FeaturesVerticalAccordion.svelte`.  
Karakteristik: `isFullBleed = false`, mendukung drag-and-drop kartu langsung di canvas editor.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`grid_3_cards`** *(Default)* | ✅ Responsif & Rapi | **Grid 3 Kolom Sejajar (`md:grid-cols-3`, `gap-6`)**: Menampilkan 3 kartu fitur dengan padding `p-6`, concentric radius `rounded-2xl`, icon container 48px ber-radius `rounded-lg`, judul tebal, dan deskripsi benefit. | Grid 3 kolom atau membungkus 2 kolom seimbang dengan ukuran kartu yang fleksibel. | **Grid 1 Kolom Vertikal (`grid-cols-1`)**: Kartu-kartu fitur tersusun vertikal dari atas ke bawah untuk kenyamanan scrolling jari. |
| **`horizontal_list`** | ✅ Responsif & Rapi | **Layout 2 Kolom Asimetris (`grid-cols-12`)**: Kolom kiri (span-4, `sticky top-8`) berisi Heading judul & Subtitle section. Kolom kanan (span-8) berisi deretan baris kartu horizontal (`p-6 flex items-start gap-4`) dengan icon di kiri dan deskripsi di kanan. | Kolom kiri memuat heading, kolom kanan memuat daftar kartu memanjang ke bawah. | **1 Kolom Bertumpuk**: Heading judul berada di bagian paling atas, diikuti tumpukan kartu horizontal ke bawah. |
| **`banner_inline_bar`** | ✅ Responsif & Rapi | **Pita/Ribbon Horizontal Ramping (`rounded-2xl bg-surface`)**: Seluruh item keunggulan tersusun mendatar dalam 1 baris kontainer ramping dengan icon 40px, judul tebal, dan deskripsi singkat. | Item fitur berjejer horizontal rapi dengan jarak antar elemen proporsional. | Item fitur membungkus rapat (*wrap*); deskripsi panjang disembunyikan (`hidden sm:block`) menyisakan icon dan judul ringkas agar hemat layar. |
| **`bento_grid_asymmetric`** | ✅ Responsif & Rapi | Bento grid asimetris 3 kolom dengan kartu utama berukuran ganda (span 2 kolom) dan kartu sekunder (span 1 kolom). | Bento grid menyesuaikan menjadi 2 kolom seimbang dengan tata letak rapi di tablet 768px. | Seluruh kartu bento menumpuk vertikal 1 kolom (`grid-cols-1`) secara teratur. |
| **`alternating_zigzag_rows`** | ✅ Responsif & Rapi | Baris fitur berselang-seling 2 kolom (posisi gambar di kiri-kanan secara bergantian di setiap baris). | Tata letak 2 kolom berselang-seling proporsional di layar tablet. | Zigzag berubah menjadi 1 kolom vertikal konsisten (gambar di atas, teks deskripsi di bawah). |
| **`interactive_tabs`** | ✅ Responsif & Rapi | Tab baris horizontal di atas untuk berpindah antarkategori keunggulan produk/layanan dengan animasi fading. | Tab navigasi horizontal rapi di tengah layar tablet. | Tab baris dapat digeser horizontal (*scrollable snap*) dengan indikator tab aktif yang jelas. |
| **`vertical_accordion_showcase`** | ✅ Responsif & Rapi | Akordeon vertikal 2 kolom: kolom kiri berupa list fitur yang membesar saat aktif, kolom kanan menampilkan gambar ilustrasi fitur. | Akordeon vertikal menyesuaikan proporsi 2 kolom tablet. | Akordeon berubah menjadi 1 kolom vertikal yang dapat dibuka-tutup langsung di seluler. |
| **`sticky_scroll_highlight`** | ✅ Responsif & Rapi | Efek scroll sticky: heading di sisi kiri tetap terkunci (`sticky top-24`) saat daftar kartu fitur disukai di sisi kanan. | Heading sticky menyesuaikan tinggi offset tablet 768px. | Sticky ditiadakan di mobile, heading judul tampil paling atas diikuti tumpukan kartu fitur. |
| **`dense_icon_matrix`** | ✅ Responsif & Rapi | Matriks padat 4 kolom memuat ikon 32px, judul tebal, dan teks singkat untuk menampilkan banyak benefit dalam ruang efisien. | Matriks menyesuaikan menjadi 3 kolom di tablet. | Matriks menyesuaikan menjadi 2 kolom padat dan rapi di layar 375px. |
| **`before_after_comparison`** | ✅ Responsif & Rapi | Tabel komparasi 2 kartu berdampingan ("Sebelum" vs "Sesudah") dengan penyorot warna hijau pada kartu sesudah. | 2 Kartu komparasi sejajar dengan border pemisah yang tegas. | 2 Kartu komparasi menumpuk vertikal (Sebelum di atas, Sesudah di bawah) dengan badge penanda. |

---

#### D. Katalog Produk (`product_catalog`) — 20 Layout Presets
Komponen utama: `src/components/builder/sections/ProductCatalog.svelte`  
Komponen pendukung: `ProductCatalogCard.svelte`, `ProductCatalogQuickView.svelte`, `CatalogGridStandard.svelte`, `CatalogCarouselScroll.svelte`, `CatalogListCompact.svelte`, `CatalogMasonry.svelte`, `CatalogBentoSpotlight.svelte`, `CatalogSidebarFilter.svelte`, `CatalogPriceTable.svelte`, `CatalogLookbook.svelte`, `CatalogFlashSale.svelte`, `CatalogBundleTiers.svelte`, `CatalogSingleFocus.svelte`, `CatalogSpecialCards.svelte`, `CatalogAccordion.svelte`, `CatalogCheckoutModal.svelte`, `productCatalog.helpers.ts`.  
Karakteristik: `isFullBleed = false`, mendukung tab kategori dinamis, live search, pagination "Muat Lebih Banyak", dan Quick View modal popup.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`grid_standard`** *(Default)* | ✅ Responsif & Rapi | **Grid Produk Modular (Default 3 Kolom `lg:grid-cols-3`, dapat disetel 2–5 kolom)**: Kartu produk lengkap dengan foto (aspek rasio *square*, *portrait*, atau *widescreen*), badge diskon, nama produk, harga IDR, tombol Beli WhatsApp, dan tombol Quick View popup. | **Grid 2 atau 3 Kolom (`sm:grid-cols-2` / `sm:grid-cols-3`)** sesuai konfigurasi slider tablet inspector. | **Grid 1 atau 2 Kolom (`grid-cols-1` / `grid-cols-2`)** sesuai konfigurasi slider mobile, tata letak harga dan tombol WhatsApp responsif. |
| **`carousel_scroll`** | ✅ Responsif & Rapi | **Slider Horizontal Geser Bebas (`overflow-x-auto snap-x no-scrollbar`)**: Produk tersusun horizontal memanjang ke samping, pengguna dapat melakukan klik-drag atau scroll horizontal untuk menjelajahi katalog. | Menampilkan 2–3 kartu sebagian di layar dengan snap scrolling mulus. | Swipe geser produk ke samping secara alami dengan touch gestur ponsel, hemat ruang vertikal halaman. |
| **`list_compact`** | ✅ Responsif & Rapi | **Daftar Baris Horizontal (`flex flex-col gap-4`)**: Setiap produk ditampilkan dalam format horizontal card memanjang (foto produk di sisi kiri, informasi judul, harga, dan tombol pesan di sisi kanan). | Format baris horizontal dengan gambar proporsional di kiri dan detail di kanan. | Format baris kompak yang otomatis menyesuaikan proporsi tombol dan teks agar tidak terjadi overflow horizontal. |
| **`masonry_catalog`** | ✅ Responsif & Rapi | Grid masonry 3 kolom dengan variasi tinggi gambar produk otomatis tanpa sisa ruang kosong vertikal. | Grid masonry 2 kolom seimbang di layar tablet. | Grid masonry 1-2 kolom menyesuaikan rasio foto produk seluler. |
| **`bento_product_spotlight`** | ✅ Responsif & Rapi | Layout bento spotlight 3 kolom: 1 Produk Utama berukuran besar (span 2 kolom) diiringi 2 produk sekunder di sisi kanan. | Produk spotlight utama di atas, produk sekunder tersusun 2 kolom di bawah. | Seluruh produk tersusun vertikal 1 kolom dengan produk utama paling atas. |
| **`split_category_sidebar`** | ✅ Responsif & Rapi | Layout 2 kolom: Sidebar filter kategori di kiri (`span-3 sticky top-24`) dan grid produk di kanan (`span-9`). | Sidebar filter melipat menjadi baris dropdown filter horizontal di atas grid produk. | Sidebar filter melipat penuh ke dalam tombol modal filter drawer. |
| **`compact_mini_cards`** | ✅ Responsif & Rapi | Grid 4-5 kolom kartu produk mini berukuran hemat ruang khusus katalog besar/grosir. | Grid 3-4 kolom kartu mini di tablet. | Grid 2 kolom mini padat dengan tombol WA ringkas di seluler. |
| **`price_table_view`** | ✅ Responsif & Rapi | Format tabel harga tabular lengkap dengan kolom nama produk, spesifikasi, harga IDR, dan tombol Beli. | Tabel harga dilengkapi fitur horizontal scroll halus jika kolom melebihi kontainer. | Tabel otomatis bertransformasi menjadi format daftar kartu ringkas di mobile. |
| **`lookbook_gallery`** | ✅ Responsif & Rapi | Galeri visual gaya lookbook majalah 3 kolom dengan caption overlay harga saat gambar di-hover. | Galeri visual 2 kolom dengan caption harga selalu terlihat di tablet. | Galeri visual 1 kolom membentang 100% lebar safe-zone mobile. |
| **`flash_sale_countdown`** | ✅ Responsif & Rapi | Katalog promo flash sale dengan banner timer hitung mundur melayang di atas grid produk promo. | Timer promo terpusat di atas grid produk 2 kolom. | Timer promo ringkas 1 baris dengan badge diskon merah menonjol. |
| **`interactive_filter_tabs`** | ✅ Responsif & Rapi | Bilah tab kategori interaktif di atas grid produk dengan animasi transisi filter instan. | Tab filter horizontal rapat di tablet 768px. | Tab filter dapat digeser horizontal (*scrollable snap*) di mobile. |
| **`quick_buy_whatsapp_direct`** | ✅ Responsif & Rapi | Kartu produk dilengkapi input quantity langsung dan tombol checkout WhatsApp direct tanpa buka modal. | Input kuantitas dan tombol WA tersusun rapi di setiap kartu 2 kolom tablet. | Input kuantitas dan tombol WA memenuhi lebar kartu di seluler. |
| **`bundle_package_tiers`** | ✅ Responsif & Rapi | Grid 3 kartu paket bundling bertingkat (Hemat, Populer, Komplit) dengan penanda tier terlaris. | 3 Tier tersusun rapi dengan kartu populer menonjol di tablet. | 3 Tier bertumpuk vertikal dengan urutan jelas di mobile. |
| **`single_product_deep_focus`** | ✅ Responsif & Rapi | Layout sorotan mendalam 1 produk heroik (galeri foto kiri, rincian varian & beli kanan). | 2 Kolom seimbang (foto di kiri, varian & tombol di kanan). | Foto produk di atas, rincian varian & tombol pesan di bawahnya. |
| **`badge_stock_scarcity`** | ✅ Responsif & Rapi | Kartu produk dilengkapi bilah progress bar kelangkaan stok ("Sisa 3 Pcs!") untuk memicu urgensi beli. | Bar indikator stok proporsional di setiap kartu 2–3 kolom tablet. | Bar indikator stok jelas dan ringkas di seluler. |
| **`seasonal_hampers_gift`** | ✅ Responsif & Rapi | Layout kartu hampers musiman dengan ornamen pita kado, opsi kartu ucapan, dan tombol konsultasi paket. | Kartu hampers tersusun 2 kolom elegan di tablet. | Kartu hampers bertumpuk 1 kolom dengan tombol kustomisasi paket. |
| **`before_after_product_effect`** | ✅ Responsif & Rapi | Kartu perbandingan efek hasil sebelum dan sesudah pemakaian produk dengan slider/split visual. | 2 Kartu efek hasil sejajar dengan label pembeda. | 2 Kartu efek hasil bertumpuk vertikal dengan label Before/After. |
| **`digital_download_catalog`** | ✅ Responsif & Rapi | Format khusus produk digital/jasa/e-book dengan ikon file, format ekstensi, dan tombol unduh/pesan. | Grid 2–3 kolom kartu produk digital di tablet. | Grid 1–2 kolom kartu produk digital di seluler. |
| **`customer_review_paired_card`** | ✅ Responsif & Rapi | Kartu produk yang disandingkan langsung dengan 1 kutipan ulasan bintang 5 pembeli di bawah foto produk. | Kartu berpasangan review tersusun 2 kolom seimbang. | Kartu berpasangan review tersusun 1 kolom rapi. |
| **`minimal_accordion_catalog`** | ✅ Responsif & Rapi | Daftar katalog format akordeon ringkas berbasis teks & baris harga yang dapat dibuka untuk melihat detail. | Akordeon katalog terpusat rapi di tablet. | Akordeon katalog hemat ruang di mobile. |

---

#### E. Testimoni Pelanggan (`testimonials`) — 10 Layout Presets
Komponen utama: `src/components/builder/sections/Testimonials.svelte`.  
Komponen pendukung: `TestimonialsSpotlightCarousel.svelte`, `TestimonialsMarquee.svelte`, `TestimonialsSocialCards.svelte`, `TestimonialsVideoCards.svelte`.  
Karakteristik: `isFullBleed = false`, mendukung drag-and-drop urutan testimoni langsung di canvas editor.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`masonry_grid`** *(Default)* | ✅ Responsif & Rapi | **Grid 3 Kolom Tabular (`md:grid-cols-3`, `gap-6`)**: Kartu ulasan berbingkai `rounded-2xl` memuat bintang rating (1–5 bintang warna amber), kutipan ulasan (clamp 4 baris), avatar pembeli, nama, dan status "Pembeli Terverifikasi". | Grid 2–3 kolom proporsional menyesuaikan lebar kontainer tablet 768px. | **Grid 1 Kolom Vertikal (`grid-cols-1`)**: Kartu testimoni menumpuk vertikal dengan teks ulasan yang mudah dibaca. |
| **`single_spotlight`** | ✅ Responsif & Rapi | **Kartu Ulasan Tunggal Terpusat (Max-W-2xl)**: Menampilkan 1 ulasan terpilih secara elegan dengan bintang rating besar di atas, kutipan font besar *italic* di tengah, identitas pembeli di bawah, dan dot pagination bulat interaktif untuk berpindah ulasan. | Kartu ulasan terpusat di tengah dengan dot navigasi interaktif di bawahnya. | Kartu ulasan mengisi penuh safe-zone mobile dengan teks yang proporsional dan mudah dibaca di smartphone. |
| **`chat_bubble_flow`** | ✅ Responsif & Rapi | **WhatsApp Chat Bubble Flow (Max-W-2xl)**: Format gelembung pesan chat berlatar surface dengan sudut kiri runcing (`rounded-tl-sm`), avatar WhatsApp hijau (`bg-emerald-100`), label "via WhatsApp", rating bintang, dan isi pesan ulasan pelanggan. | Gelembung pesan chat tersusun vertikal memanjang di tengah layar. | Tampilan menyerupai pesan WhatsApp asli di smartphone, memberikan kesan autentik dan dekat bagi calon pembeli lokal. |
| **`infinite_marquee_scroll`** | ✅ Responsif & Rapi | Deretan kartu ulasan berjalan otomatis (*infinite marquee*) secara horizontal dari kanan ke kiri tanpa jeda. | Marquee running text bergerak mulus di layar tablet 768px. | Marquee running text berkecepatan proporsional yang dapat di-pause saat ditahan kursor/jari. |
| **`video_review_cards`** | ✅ Responsif & Rapi | Grid 3 kolom kartu testimoni video ulasan pendek pelanggan (format vertikal 9:16) dengan tombol play overlay. | Video review cards tersusun 2 kolom di tablet. | Video review cards tersusun 1 kolom dengan preview thumbnail dan tombol play besar. |
| **`social_post_cards`** | ✅ Responsif & Rapi | Grid 3 kolom ulasan gaya postingan media sosial (lengkap dengan username, badge verifikasi, foto produk, dan jumlah likes). | Posting sosial tersusun 2 kolom seimbang. | Posting sosial tersusun 1 kolom vertikal rapi. |
| **`side_by_side_3_cards`** | ✅ Responsif & Rapi | 3 Kartu ulasan sejajar dengan efek penyorotan kartu tengah (scale 105% & shadow lebih tebal). | 3 Kartu menyesuaikan proporsi lebar tablet. | 1 Kartu aktif di tengah dengan indikator geser swipe. |
| **`logo_client_cloud`** | ✅ Responsif & Rapi | Grid 5-6 kolom menampilkan logo mitra/klien toko UMKM dengan efek grayscale ke berwarna saat hover. | Grid logo 4 kolom seimbang di tablet. | Grid logo 3 kolom padat di mobile. |
| **`split_rating_stats`** | ✅ Responsif & Rapi | Layout split 2 kolom: Ringkasan statistik rating (4.9/5 & baris distribusi bintang) di kiri, list ulasan di kanan. | Split 2 kolom seimbang (statistik rating di kiri, ulasan di kanan). | Statistik rating tampil paling atas, diikuti tumpukan kartu ulasan di bawahnya. |
| **`carousel_slider`** | ✅ Responsif & Rapi | Slider testimoni dengan tombol navigasi panah di kiri/kanan dan indikator slide di bawah. | Carousel menampilkan 2 kartu ulasan per slide di tablet. | Carousel menampilkan 1 kartu ulasan per slide di mobile. |

---

#### F. FAQ / Tanya Jawab (`faq`) — 10 Layout Presets
Komponen utama: `src/components/builder/sections/FAQ.svelte`.  
Komponen pendukung: `FaqSplitSidebar.svelte`, `FaqBoxedCardsGrid.svelte`, `FaqChatStyle.svelte`, `FaqSearchFiltered.svelte`, `FaqCategorizedTabs.svelte`.  
Karakteristik: `isFullBleed = false`, mendukung animasi ekspansi akordeon buka-tutup halus.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`accordion_single_col`** *(Default)* | ✅ Responsif & Rapi | **Akordeon Terpusat 1 Kolom (Max-W-3xl)**: Daftar pertanyaan yang dapat diklik untuk membuka/menutup jawaban secara bergantian. Dilengkapi ikon ChevronDown yang berotasi 180° dengan transisi halus. | Akordeon terpusat rapi selebar kontainer tablet (768px). | Akordeon memenuhi layar safe-zone mobile (375px), teks pertanyaan dan jawaban membungkus rapi (*break-words*). |
| **`split_faq_sidebar`** | ✅ Responsif & Rapi | **Layout 2 Kolom Asimetris (`grid-cols-12`)**: Kolom kiri (span-5) memuat Judul FAQ, deskripsi, dan Kartu Bantuan CS ("Butuh Bantuan Lebih?" + tombol kontak WA); Kolom kanan (span-7) memuat tumpukan akordeon tanya jawab interaktif. | 2 kolom proporsional (span-5 dan span-7) dengan kartu bantuan di sisi kiri. | **1 Kolom Bertumpuk**: Judul dan kartu bantuan kontak berada di atas, diikuti daftar akordeon tanya jawab di bawahnya. |
| **`grid_2_col_cards`** | ✅ Responsif & Rapi | **Grid 2 Kolom Kartu Terbuka (`md:grid-cols-2`, `gap-6`)**: Seluruh pertanyaan dan jawaban langsung terbuka permanen (*open static card*) dalam bentuk kartu-kartu terpisah tanpa memerlukan interaksi klik buka-tutup. | Grid 2 kolom kartu terbuka seimbang. | **Grid 1 Kolom Vertikal**: Seluruh pertanyaan dan jawaban tampil terbuka berurutan ke bawah. |
| **`accordion_two_col`** | ✅ Responsif & Rapi | Akordeon 2 kolom berdampingan untuk menampung jumlah pertanyaan yang banyak secara simetris. | Akordeon 2 kolom seimbang di layar tablet. | Akordeon otomatis menyatu menjadi 1 kolom vertikal berurutan ke bawah. |
| **`chat_style_faq`** | ✅ Responsif & Rapi | FAQ bergaya percakapan chat bot CS (pertanyaan sebagai gelembung kanan, jawaban sebagai gelembung kiri). | Gelembung percakapan FAQ terpusat di tengah layar. | Gelembung percakapan FAQ hemat ruang dengan padding rapat `12px`. |
| **`search_filtered_faq`** | ✅ Responsif & Rapi | FAQ dilengkapi input bar pencarian di atas untuk menyaring pertanyaan secara langsung (real-time filter). | Input pencarian selebar kontainer tablet di atas akordeon. | Input pencarian sticky di atas list FAQ saat di-scroll. |
| **`categorized_tabs_faq`** | ✅ Responsif & Rapi | FAQ dikelompokkan berdasarkan tab kategori (Pemesanan, Pembayaran, Pengiriman) di atas akordeon. | Tab kategori horizontal rapi di tablet 768px. | Tab kategori dapat digeser horizontal (*scrollable tabs*) di mobile. |
| **`compact_numbered_list`** | ✅ Responsif & Rapi | Daftar FAQ berpenomoran urut (01, 02, 03) dengan gaya minimalis dan garis pemisah halus. | List bernomor 1 kolom selebar tablet. | List bernomor dengan nomor berukuran menonjol di atas teks pertanyaan. |
| **`floating_help_center`** | ✅ Responsif & Rapi | Grid 3 kolom kartu FAQ bergaya Help Center dengan ikon kategori berwarna di setiap kartu. | Kartu help center tersusun 2 kolom. | Kartu help center tersusun 1 kolom vertikal. |
| **`horizontal_faq_cards`** | ✅ Responsif & Rapi | Kartu FAQ horizontal yang dapat digeser ke samping dengan indikator halaman. | Cards slider 2 item per view di tablet. | Cards slider 1 item per view di seluler. |

---

#### G. Google Maps & Lokasi (`google_maps`) — 10 Layout Presets
Komponen utama: `src/components/builder/sections/GoogleMaps.svelte`.  
Komponen pendukung: `MapsHeader.svelte`, `MapsFullwidth.svelte`, `MapsSplitInfo.svelte`, `MapsCompactBoxed.svelte`, `MapsFloatingCard.svelte`, `MapsTwoColumnDirections.svelte`, `MapsStoreHours.svelte`, `MapsRouteFinder.svelte`, `MapsMinimalFramed.svelte`, `MapsMultiBranch.svelte`, `MapsCardOverlay.svelte`, `maps.helpers.ts`, `maps.css`.  
Karakteristik: `isFullBleed = false`, rendering iframe Google Maps live tanpa API key berbayar.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`fullwidth_map`** *(Default)* | ✅ Responsif & Rapi | **Iframe Peta Penuh dengan Floating Card**: Iframe maps membentang penuh (tinggi default `400px`) dengan kartu informasi melayang semi-transparan (*glassmorphism* `bg-white/95 backdrop-blur-md`) di sudut kiri bawah memuat judul, alamat, dan tombol "Petunjuk Arah". | Peta membentang penuh dengan floating card proporsional di sisi kiri bawah. | Floating card meluas memenuhi bagian bawah peta (`bottom-6 left-6 right-6`), menyajikan tombol petunjuk arah yang mudah dijangkau jempol. |
| **`split_map_info`** | ✅ Responsif & Rapi | **Layout 2 Kolom Sejajar (`grid-cols-12 items-stretch`)**: Kolom kiri (span-5) berupa Kartu Info lengkap (Alamat, Jam Operasional Toko, Kontak Layanan, Tombol Buka Arah); Kolom kanan (span-7) berupa frame peta interaktif setinggi `360px+`. | 2 kolom seimbang dengan tinggi frame peta dan kartu informasi yang sama. | **1 Kolom Bertumpuk**: Kartu jam operasional dan alamat berada di atas, diikuti iframe peta Google Maps di bawahnya. |
| **`compact_boxed`** | ✅ Responsif & Rapi | **Kotak Kartu Lokasi Kompak (Max-W-Xl)**: Kontainer kartu terpusat memuat judul & alamat di atas, jendela pratinjau peta mini setinggi `192px` (`h-48`) di tengah, dan tombol CTA "Buka di Google Maps" di bawah. | Kotak kartu terpusat simetris di tengah layar tablet. | Kotak kartu mengisi lebar mobile safe-zone (375px) secara padat dan efisien. |
| **`floating_address_card`** | ✅ Responsif & Rapi | Iframe peta latar belakang penuh dengan kartu alamat melayang semi-transparan di posisi kanan atas. | Floating card melayang di kanan atas dengan padding safe-zone `24px`. | Floating card berpindah ke bawah peta melingkupi lebar mobile 375px. |
| **`two_column_directions`** | ✅ Responsif & Rapi | Layout 2 kolom: Panduan petunjuk rute transportasi (Patokan, Angkutan, Parkir) di kiri dan peta di kanan. | 2 Kolom instruksi rute & peta seimbang di tablet. | Instruksi rute di atas, diikuti iframe peta di bawahnya. |
| **`store_hours_highlight`** | ✅ Responsif & Rapi | Peta dilengkapi penyorot jam buka toko live ("Buka Sekarang - Tutup Jam 21.00") & kontak WA di sisi samping. | Penyorot jam toko di atas iframe peta di tablet. | Badge jam toko terkompresi di atas iframe peta seluler. |
| **`interactive_route_finder`** | ✅ Responsif & Rapi | Kartu lokasi dengan tombol navigasi rute besar yang langsung mengarahkan ke aplikasi Google Maps seluler. | Tombol navigasi rute menonjol di tengah layar tablet. | Tombol navigasi rute lebar penuh di seluler (`w-full py-3`). |
| **`minimal_framed_map`** | ✅ Responsif & Rapi | Frame peta minimalis dengan border halus `rounded-2xl` tanpa kartu dekoratif tambahan. | Frame peta minimalis setinggi `320px` di tablet. | Frame peta membentang 100% lebar layar mobile (`h-64`). |
| **`multi_branch_tabs`** | ✅ Responsif & Rapi | Peta lokasi banyak cabang toko UMKM yang dapat dipilih lokasi pintasnya via tab cabang (misal: Cabang Utama, Cabang Barat). | Tab cabang horizontal di atas iframe peta. | Tab cabang scrollable horizontal di atas iframe peta. |
| **`card_overlay_bottom`** | ✅ Responsif & Rapi | Kartu informasi toko menutupi 30% area bawah peta secara melayang dengan tombol petunjuk arah. | Card overlay melayang di bagian bawah peta tablet. | Card overlay membentang penuh di bawah peta seluler. |

---

#### H. Footer & Kontak (`footer`) — 10 Layout Presets
Komponen utama: `src/components/builder/sections/Footer.svelte`.  
Komponen pendukung: `FooterNewsletter.svelte`, `FooterSocialShowcase.svelte`.  
Karakteristik: `isFullBleed = false`, memuat profil toko, link WhatsApp, alamat, dan hak cipta.

| Preset Layout | Status Responsif | Desktop (1200px) | Tablet (768px) | Mobile (375px) |
| :--- | :---: | :--- | :--- | :--- |
| **`multi_column`** *(Default)* | ✅ Responsif & Rapi | **Grid 3 Kolom Sejajar (`md:grid-cols-3`, `gap-8`)**: Kolom 1 (Profil Toko: Logo & Tagline), Kolom 2 (Kontak Layanan: link nomor WhatsApp & alamat toko), Kolom 3 (Informasi: menu privasi & syarat ketentuan). Diakhiri baris Copyright di bagian bawah. | Grid 3 kolom atau membungkus 2 kolom seimbang. | **1 Kolom Bertumpuk Vertikal**: Kolom Profil Toko, Kontak Layanan, dan Informasi tersusun ke bawah, diakhiri baris Copyright. |
| **`centered_simple`** | ✅ Responsif & Rapi | **Layout Minimalis Terpusat**: Logo toko dan tagline terpusat di tengah, tombol kontak WhatsApp bulat ber-hover effect di tengah, dan teks hak cipta di bagian bawah. | Simetris terpusat di tengah layar. | Simetris terpusat di tengah layar mobile dengan tombol WhatsApp yang nyaman ditekan. |
| **`cta_focused`** | ✅ Responsif & Rapi | **Banner Floating WhatsApp di Atas Footer**: Banner WhatsApp melayang menonjol di atas footer (`-mt-16 bg-primary text-white shadow-xl` dengan judul ajakan dan tombol "Chat Sekarang"), diikuti info toko dan alamat di bawahnya. | Banner WhatsApp melayang menyesuaikan lebar kontainer tablet. | Banner WhatsApp membungkus vertikal (judul ajakan di atas, tombol chat di bawah), diikuti profil toko dan copyright. |
| **`minimal_single_row`** | ✅ Responsif & Rapi | Footer 1 baris ramping (`h-16`) memuat logo di kiri, copyright di tengah, dan ikon sosial media di kanan. | Footer 1 baris terkompresi dengan safe-zone `24px`. | Footer membungkus menjadi 2 baris teratur di layar seluler. |
| **`giant_wordmark`** | ✅ Responsif & Rapi | Footer dengan nama/brand toko berukuran raksasa (*giant typography wordmark*) membentang di batas paling bawah. | Wordmark besar menyesuaikan skala lebar tablet (`text-6xl`). | Wordmark berskala responsif seluler (`text-4xl`), tidak memicu overflow. |
| **`newsletter_centric`** | ✅ Responsif & Rapi | Footer berfokus pada form berlangganan newsletter promo toko di bagian atas sebelum baris navigasi footer. | Form newsletter terpusat di tengah layar tablet. | Form newsletter bertumpuk vertikal dengan input & tombol berlangganan. |
| **`live_status_badge`** | ✅ Responsif & Rapi | Footer dilengkapi badge indikator status operasional toko live ("Toko Online - Siap Melayani Pesanan") dengan lampu hijau berkedip. | Status badge melayang di samping copyright. | Status badge terpusat di atas copyright seluler. |
| **`split_map_footer`** | ✅ Responsif & Rapi | Footer gabungan 2 kolom: Info toko & kontak di kiri, frame peta lokasi mini di kanan. | Peta mini di samping info footer tablet. | Peta mini menumpuk di atas copyright footer seluler. |
| **`social_links_grid`** | ✅ Responsif & Rapi | Showcase khusus tautan akun media sosial toko (WA, IG, FB, TikTok) dengan ikon-ikon interaktif besar. | Grid ikon sosial 4 kolom di tablet. | Grid ikon sosial 2-4 kolom terpusat di mobile. |
| **`boxed_card_footer`** | ✅ Responsif & Rapi | Footer berbentuk kartu melayang berbingkai (`rounded-3xl border shadow-lg`) dengan margin bottom 24px. | Kartu footer melayang menyesuaikan safe-zone tablet. | Kartu footer melayang dengan padding aman `16px` di smartphone. |

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
  4. **Modular Section Registry (104 Layout Presets)**: Arsitektur 8 section modular terisolasi dengan 104 varian layout presets di `src/components/builder/registry/index.ts`.
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