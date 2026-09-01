# PETA STRUKTUR FOLDER & BERKAS PROJEK
Sistem UMKM Site Builder SaaS

Berikut adalah struktur folder lengkap beserta seluruh berkas yang ada di dalam projek ini:

```
umkm-site-builder/
├── .agents/                                    # Konfigurasi & workflow agen AI pintar
│   ├── rules/
│   │   └── language-standards.md               # Standar aturan penulisan bahasa UI frontend
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
│   │   ├── codebase-map.md                     # Ringkasan modul krusial arsitektur SaaS
│   │   ├── css-vars.md                         # Standar gaya & variabel CSS global
│   │   ├── feature-01-project-setup.md         # Rencana inisialisasi Astro dev environment
│   │   ├── feature-01b-database-layer.md       # Rancangan migrasi skema database Drizzle
│   │   ├── feature-h1-xendit-setup.md          # Rancangan integrasi sandbox e-invoice Xendit
│   │   └── ui-inventory.md                     # Inventarisasi komponen visual & state layout
│   ├── planning/
│   │   └── roadmap.md                          # Jadwal tahapan penyelesaian rilis fitur SaaS
│   ├── prd/
│   │   ├── 00-overview.md                      # Latar belakang & batasan produk platform
│   │   ├── personas.md                         # Profil segmen tenant & desainer template
│   │   ├── user-journeys.md                    # Alur pengguna dari registrasi hingga go-live
│   │   ├── user-stories.md                     # Kasus penggunaan fungsionalitas sistem
│   │   └── features/
│   │       └── _template.md                    # Template format dokumen prd fitur baru
│   ├── tech/
│   │   ├── api-spec.md                         # Spesifikasi request/response endpoint HTTP API
│   │   ├── architecture.md                     # Penjelasan struktur Clean Architecture SaaS
│   │   ├── code-standards.md                   # Aturan penulisan kode, penamaan, & clean code
│   │   ├── data-model-erd.md                   # ERD skema relasi antar entitas database
│   │   ├── permissions-matrix.md               # Tabel pembatasan hak akses rute per role
│   │   ├── security.md                         # Protokol enkripsi data, token, & validasi payload
│   │   └── testing-strategy.md                 # Panduan pembagian cakupan test suite (vitest)
│   ├── PROJECT-STATE.md                        # Checkpoint state update live per sesi handoff
│   └── README.md                               # Dokumentasi awal ringkasan pengerjaan sistem
│
├── drizzle/                                    # Berkas migrasi database SQL Drizzle ORM
│   ├── meta/
│   │   ├── _journal.json                       # Jurnal urutan berkas migrasi database
│   │   ├── 0000_snapshot.json                  # Snapshot metadata migrasi tahap 1
│   │   ├── 0001_snapshot.json                  # Snapshot metadata migrasi tahap 2
│   │   ├── 0002_snapshot.json                  # Snapshot metadata migrasi tahap 3
│   │   └── 0003_snapshot.json                  # Snapshot metadata migrasi tahap 4
│   ├── 0000_fast_gambit.sql                    # Migrasi database tahap 1 (skema awal)
│   ├── 0001_exotic_madame_web.sql              # Migrasi database tahap 2 (tabel platform settings)
│   ├── 0002_overconfident_ted_forrester.sql    # Migrasi database tahap 3 (tabel bank & payout)
│   └── 0003_sloppy_mephisto.sql                # Migrasi database tahap 4 (settlement delay)
│
├── public/                                     # Aset statis (gambar, font, logo)
│
├── src/                                        # Kode sumber utama aplikasi
│   ├── components/                             # Komponen UI modular berbasis Svelte & Astro
│   │   ├── admin/
│   │   │   ├── whitelist/
│   │   │   │   ├── AdminAddModal.svelte        # Modal tambah whitelist email admin
│   │   │   │   ├── AdminConfirmModal.svelte    # Modal konfirmasi penghapusan whitelist
│   │   │   │   ├── AdminDetailModal.svelte     # Modal detail data whitelist admin
│   │   │   │   ├── AdminWhitelistTable.svelte  # Tabel daftar whitelist admin
│   │   │   │   └── whitelist.types.ts          # Tipe data whitelist admin
│   │   │   ├── AdminUserDetailModal.svelte     # Modal detail data user admin
│   │   │   ├── AdminUserSuspendModal.svelte    # Modal suspend/aktifkan user admin
│   │   │   ├── AdminWhitelistPanel.svelte      # Panel whitelist email Google Auth admin
│   │   │   ├── CommissionSettingsPanel.svelte  # Form fee %, minimum payout, & settlement delay
│   │   │   ├── TemplateCategoryManager.svelte  # Pengelola master kategori template admin
│   │   │   ├── TemplateReviewPanel.svelte      # Panel review & verifikasi template desainer
│   │   │   └── UserManagementPanel.svelte      # Panel manajemen pengguna platform
│   │   ├── auth/
│   │   │   ├── GoogleAuthButton.svelte         # Tombol login Google SSO BetterAuth
│   │   │   ├── LoginForm.svelte                # Form login tenant, designer, dan admin
│   │   │   └── RegisterForm.svelte             # Form registrasi tenant baru
│   │   ├── builder/
│   │   │   ├── content/
│   │   │   │   ├── content.helpers.ts          # Helper pengisian konten section builder
│   │   │   │   ├── FaqContent.svelte           # Form inspector konten FAQ section
│   │   │   │   ├── FeaturesContent.svelte      # Form inspector konten features section
│   │   │   │   ├── FooterContent.svelte        # Form inspector konten footer section
│   │   │   │   ├── GoogleMapsContent.svelte    # Form inspector konten Google Maps section
│   │   │   │   ├── HeaderContent.svelte        # Form inspector konten header section
│   │   │   │   ├── HeroContent.svelte          # Form inspector konten hero section
│   │   │   │   ├── ProductCatalogContent.svelte# Form inspector data produk katalog
│   │   │   │   └── TestimonialsContent.svelte  # Form inspector isi ulasan/testimonial
│   │   │   ├── inspector/
│   │   │   │   ├── header/
│   │   │   │   │   ├── HeaderAnnouncementPanel.svelte # Panel teks pengumuman header
│   │   │   │   │   ├── HeaderLogoPanel.svelte  # Panel upload/URL logo toko
│   │   │   │   │   └── HeaderNavPanel.svelte   # Panel menu navigasi menu header
│   │   │   │   ├── node-forms/
│   │   │   │   │   ├── AnnouncementNodeForm.svelte # Form spesifik node pengumuman
│   │   │   │   │   ├── HeroElementNodeForms.svelte # Form elemen visual/teks hero
│   │   │   │   │   ├── LogoNodeForm.svelte     # Form logo toko pada header
│   │   │   │   │   └── NavLinksNodeForm.svelte # Form menu navigasi
│   │   │   │   ├── theme/
│   │   │   │   │   ├── ThemeButtonsTab.svelte  # Tab kustomisasi tombol tema builder
│   │   │   │   │   ├── ThemeColorsTab.svelte   # Tab kustomisasi palet warna tema builder
│   │   │   │   │   ├── ThemeLayoutTab.svelte   # Tab layout spacing tema builder
│   │   │   │   │   └── ThemeTypographyTab.svelte # Tab kustomisasi font tema builder
│   │   │   │   ├── CatalogCardPanel.svelte     # Panel pengubah style kartu produk
│   │   │   │   ├── CatalogGridPanel.svelte     # Panel layout grid katalog produk
│   │   │   │   ├── catalogStyles.helpers.ts    # Fungsi helper styling css katalog
│   │   │   │   ├── CatalogStylesTab.svelte     # Tab pengeditan gaya katalog produk
│   │   │   │   ├── GeneralStylesTab.svelte     # Tab layout jarak & padding section
│   │   │   │   ├── GlobalThemeInspector.svelte # Panel warna dasar tema template builder
│   │   │   │   ├── HeaderStylesTab.svelte      # Tab konfigurasi gaya navigasi header
│   │   │   │   ├── imageUpload.helpers.ts      # Helper validasi/upload gambar
│   │   │   │   ├── nodeContent.constants.ts    # Konstanta isi konten default node
│   │   │   │   ├── NodeContentForm.svelte      # Form input konten dinamis tiap block
│   │   │   │   ├── nodeStyles.constants.ts     # Konstanta default style CSS node block
│   │   │   │   ├── SectionAppearancePanel.svelte # Panel background & border-radius section
│   │   │   │   ├── SectionLayoutPanel.svelte    # Panel layout flex/grid section
│   │   │   │   ├── SectionPresetSelector.svelte# Panel pemilihan preset section siap pakai
│   │   │   │   ├── SectionSlotReorder.svelte   # Panel drag-and-drop slots section
│   │   │   │   └── StyleSelector.svelte        # Dropdown pemilih varian style visual
│   │   │   ├── layer/
│   │   │   │   ├── AddNodeDropdown.svelte      # Tombol nambah block section baru
│   │   │   │   └── layerPanel.helpers.ts       # Helper manipulasi susunan layer
│   │   │   ├── registry/
│   │   │   │   ├── index.ts                    # Registri sentral modularisasi modul section builder
│   │   │   │   └── registry.types.ts           # Definisi tipe registry map section
│   │   │   ├── sections/
│   │   │   │   ├── catalog/
│   │   │   │   │   ├── ProductCatalogCard.svelte # Komponen visual kartu katalog produk
│   │   │   │   │   └── ProductCatalogQuickView.svelte # Detail popup cepat ulasan produk
│   │   │   │   ├── header/
│   │   │   │   │   ├── AnnouncementBar.svelte  # Baris pengumuman di atas navigasi
│   │   │   │   │   ├── HeaderLogo.svelte       # Elemen visual logo website toko
│   │   │   │   │   └── HeaderNav.svelte        # Elemen menu navigasi toko
│   │   │   │   ├── hero/
│   │   │   │   │   ├── HeroCenteredMinimal.svelte # Template hero minimalis tengah
│   │   │   │   │   ├── HeroElementToolbar.svelte # Floating toolbar elemen teks/gambar hero
│   │   │   │   │   ├── HeroFullBanner.svelte   # Template hero latar belakang penuh
│   │   │   │   │   └── HeroSplitLayout.svelte  # Template hero 50/50 visual terpisah
│   │   │   │   ├── FAQ.svelte                  # Komponen visual Frequently Asked Questions
│   │   │   │   ├── Features.svelte             # Komponen visual daftar keunggulan/layanan
│   │   │   │   ├── Footer.svelte               # Komponen visual footer (alamat & sosmed)
│   │   │   │   ├── GoogleMaps.svelte           # Komponen visual embed lokasi Google Maps
│   │   │   │   ├── HeaderAnnouncement.svelte   # Komponen visual announcement bar
│   │   │   │   ├── Hero.svelte                 # Komponen visual banner sambutan utama
│   │   │   │   ├── productCatalog.helpers.ts   # Helper load data produk toko
│   │   │   │   ├── ProductCatalog.svelte       # Komponen visual daftar katalog produk
│   │   │   │   ├── SectionRenderer.svelte      # Renderer block layout editor no-code
│   │   │   │   └── Testimonials.svelte         # Komponen visual ulasan/testimoni pelanggan
│   │   │   ├── stores/
│   │   │   │   ├── canvasStore.ts              # Svelte store state kanvas & grid guides
│   │   │   │   ├── documentStore.ts            # Svelte store status loading & status saving dokumen
│   │   │   │   ├── editorStore.mutations.ts    # Operasi mutasi state no-code (save, update)
│   │   │   │   ├── editorStore.ts              # Svelte writable store state builder editor
│   │   │   │   └── editorStore.types.ts        # Tipe TypeScript state editor builder
│   │   │   ├── BuilderEditor.svelte            # Halaman utama editor visual no-code builder
│   │   │   ├── Canvas.svelte                   # Lembar kerja visual kanvas editor builder
│   │   │   ├── ContentTab.svelte               # Tab pengisian teks & gambar konten node
│   │   │   ├── LayerPanel.svelte               # Panel pohon layer hirarki section template
│   │   │   ├── LayoutGridOverlay.svelte        # Overlay panduan kolom Figma 12/8/4 & pixel grid
│   │   │   ├── NewTemplateForm.svelte          # Form pembuatan template draft desainer
│   │   │   ├── NodeStylesTab.svelte            # Tab kustomisasi spesifik style per node
│   │   │   ├── PropertyInspector.svelte        # Panel samping inspection properti node & tema
│   │   │   ├── ReadOnlyPreview.svelte          # Pratinjau baca-saja live template
│   │   │   ├── StylesTab.svelte                # Tab helper navigasi styles
│   │   │   ├── SubmitReviewModal.svelte        # Modal pengajuan review template ke admin
│   │   │   └── TopBar.svelte                   # Bar atas editor (undo, redo, zoom, breakpoint)
│   │   ├── checkout/
│   │   │   ├── CheckoutSummaryCard.svelte      # Ringkasan detail tagihan checkout invoice
│   │   │   ├── PaymentModal.svelte             # Modal pembayaran invoice Xendit
│   │   │   └── TransactionStatus.svelte        # Status tagihan invoice (polling & status badge)
│   │   ├── common/
│   │   │   ├── Navbar.astro                    # Navigasi utama header base layout
│   │   │   ├── PublicNavbar.svelte             # Navbar publik interaktif
│   │   │   └── ThemeToggle.astro               # Tombol pengubah dark mode / light mode
│   │   ├── dashboard/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.helpers.ts          # Helper navigasi sidebar dashboard
│   │   │   │   ├── SidebarDesktop.svelte       # Sidebar dashboard versi layar desktop
│   │   │   │   └── SidebarMobile.svelte        # Drawer sidebar dashboard versi mobile
│   │   │   ├── CategoryManager.svelte          # Pengelola CRUD kategori produk tenant
│   │   │   ├── ConfirmTemplateModal.svelte     # Modal konfirmasi penerapan template toko
│   │   │   ├── DashboardNavbar.svelte          # Navigasi panel dashboard tenant
│   │   │   ├── OrderHistoryTable.svelte        # Tabel riwayat pesanan/transaksi tenant
│   │   │   ├── Sidebar.svelte                  # Menu navigasi sidebar panel tenant
│   │   │   ├── StoreSettingsForm.svelte        # Konfigurasi WhatsApp, Google Maps, & profil toko
│   │   │   ├── TemplateGallery.svelte          # Galeri pilihan template desain toko
│   │   │   └── TrafficWidget.svelte            # Widget statistik trafik kunjungan storefront
│   │   ├── designer/
│   │   │   ├── DesignerBankModal.svelte        # Modal data rekening bank desainer
│   │   │   ├── DesignerBankWithdraw.svelte     # Form rekening bank & modal payout desainer
│   │   │   ├── DesignerMutationTable.svelte    # Tabel daftar mutasi keuangan desainer
│   │   │   ├── DesignerOrdersTable.svelte      # Tabel pesanan masuk dari tenant untuk desainer
│   │   │   ├── DesignerPayoutHistoryTable.svelte # Tabel riwayat payout desainer
│   │   │   ├── DesignerStatCards.svelte        # Ringkasan balance, komisi, & template terjual
│   │   │   ├── DesignerTemplateCard.svelte     # Kartu template buatan desainer (status review)
│   │   │   ├── DesignerTemplateTable.svelte    # Tabel kelola template desainer
│   │   │   ├── DesignerWalletOverview.svelte   # Ringkasan dompet desainer & tombol withdraw
│   │   │   └── DesignerWithdrawModal.svelte    # Modal konfirmasi withdraw desainer
│   │   ├── onboarding/
│   │   │   └── OnboardingWizard.svelte         # Form inisialisasi subdomain & toko baru tenant
│   │   ├── public/
│   │   │   ├── PublicTemplateMarketplace.svelte# Pasar katalog template interaktif
│   │   │   ├── marketplace.types.ts            # Tipe data catalog template marketplace
│   │   │   └── TemplateCardAction.svelte       # Kartu katalog template dengan tombol beli & demo
│   │   ├── shared/
│   │   │   └── ImageUpload.svelte              # Pengunggah gambar terintegrasi Cloudinary API
│   │   ├── storefront/
│   │   │   ├── DynamicSection.svelte           # Komponen rendering section dinamis storefront
│   │   │   ├── Footer.svelte                   # Footer publik website toko tenant
│   │   │   ├── Hero.svelte                     # Banner hero publik website toko tenant
│   │   │   ├── ProductGrid.svelte              # Grid daftar produk di storefront
│   │   │   └── PromoBanner.svelte              # Banner promosi publik website toko tenant
│   │   ├── tenant/
│   │   │   ├── ProductDeleteModal.svelte       # Dialog konfirmasi penghapusan produk
│   │   │   ├── ProductFormModal.svelte         # Modal tambah/edit data produk toko
│   │   │   ├── ProductTable.svelte             # Tabel daftar produk dagangan tenant
│   │   │   ├── ProductTableRow.svelte          # Baris data produk toko tenant
│   │   │   └── StoreManager.svelte             # Panel monitoring penjualan tenant
│   │   ├── tokens/                             # Token sentral spesifikasi Design System (SSOT)
│   │   │   ├── animations.ts                   # Token durasi & kurva easing transisi
│   │   │   ├── colors.ts                       # Token warna primer, sekunder, & netral
│   │   │   ├── index.ts                        # Barrel ekspor token UI
│   │   │   ├── radius.ts                       # Token concentric border radius
│   │   │   ├── shadows.ts                      # Token elevasi bayangan shadow box
│   │   │   ├── spacing.ts                      # Token grid 8pt layout spacing
│   │   │   └── typography.ts                   # Token scale & font-family Golden Ratio
│   │   └── ui/
│   │       ├── Badge.svelte                    # Komponen badge info status visual
│   │       ├── Button.svelte                   # Komponen tombol interaktif modular
│   │       ├── Card.svelte                     # Komponen pembungkus kartu visual
│   │       ├── Input.svelte                    # Komponen kolom isian teks input
│   │       ├── Modal.svelte                    # Komponen popup modal dialog
│   │       ├── Pagination.svelte               # Komponen paginasi kontrol halaman data
│   │       ├── Select.svelte                   # Komponen dropdown select pilihan
│   │       ├── StatCard.svelte                 # Komponen card ringkasan statistik modular
│   │       ├── Table.svelte                    # Komponen tabel tabular modular
│   │       ├── Textarea.svelte                 # Komponen kolom input text area
│   │       ├── ToastContainer.svelte           # Kontainer notifikasi toast mengambang
│   │       ├── WhatsAppIcon.svelte             # Ikon WhatsApp SVG modular
│   │       └── index.ts                        # Barrel ekspor komponen UI reusable
│   │
│   ├── db/
│   │   ├── index.ts                        # Koneksi database Drizzle & adapter serverless
│   │   ├── schema.ts                       # Skema relasi database & tabel SaaS Drizzle
│   │   └── seed.ts                         # Script seeding data demo database
│   │
│   ├── env.d.ts                            # Deklarasi global compiler TypeScript Astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro                # Layout dasar halaman publik web
│   │   ├── DashboardLayout.astro           # Layout terproteksi admin/tenant/designer
│   │   └── StorefrontLayout.astro          # Layout storefront khusus tenant (subdomain)
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   └── .gitkeep                        # Penahan folder git
│   │   ├── config/
│   │   │   └── app.ts                          # Konfigurasi konstanta platform & branding
│   │   ├── db/
│   │   │   └── client.ts                       # Klien database siap pakai
│   │   ├── errors/
│   │   │   └── .gitkeep                        # Penahan folder git
│   │   ├── finance/
│   │   │   ├── index.ts                        # Ekspor helper finance
│   │   │   └── xendit.ts                       # Integrasi SDK e-invoice & payout Xendit
│   │   ├── routes/
│   │   │   └── .gitkeep                        # Penahan folder git
│   │   ├── routing/
│   │   │   └── subdomain.ts                    # Utilitas parsing & ekstraksi subdomain multitenancy
│   │   ├── stores/
│   │   │   └── schemas.ts                      # Skema validasi state svelte store
│   │   ├── templates/
│   │   │   ├── index.ts                        # Barrel export modul migrasi skema template
│   │   │   └── migration.ts                    # Logika pipeline migrasi skema template
│   │   ├── utils/
│   │   │   ├── api-handler.ts                  # Pembungkus standar API route handler
│   │   │   ├── designMath.ts                   # Utilitas rumus radius & Golden Ratio
│   │   │   ├── format.ts                       # Fungsi formatter mata uang IDR & waktu
│   │   │   ├── index.ts                        # Ekspor modul utilitas
│   │   │   ├── logger.ts                       # Logger console terstandar
│   │   │   └── validation.ts                   # Utilitas validator skema Zod
│   │   ├── validators/
│   │   │   └── subdomain.ts                    # Skema Zod & blacklist validasi reserved subdomain
│   │   ├── auth-client.ts                      # Klien inisialisasi auth BetterAuth (frontend)
│   │   ├── auth.ts                             # Konfigurasi server BetterAuth & database adapter
│   │   ├── cloudinary.ts                       # Pembantu upload gambar aman ke Cloudinary
│   │   ├── currency.ts                         # Utilitas manipulasi nilai rupiah
│   │   ├── toast.ts                            # State store penampil alert notifikasi melayang
│   │   └── whatsapp.ts                         # Utilitas generator URL chat WhatsApp
│   │
│   ├── middleware.ts                           # Middleware otentikasi & pengecekan role
│   │
│   ├── pages/                                  # Rute URL halaman file-based routing Astro
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── index.astro                 # Halaman panel konfigurasi komisi & delay admin
│   │   │   ├── template-categories/
│   │   │   │   └── index.astro                 # Halaman kelola master kategori template admin
│   │   │   ├── templates/
│   │   │   │   └── index.astro                 # Halaman approval pengajuan template desainer
│   │   │   ├── users/
│   │   │   │   └── index.astro                 # Halaman manajemen pengguna platform oleh admin
│   │   │   └── whitelist/
│   │   │       └── index.astro                 # Halaman kelola whitelist akses Google Admin
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── media/
│   │   │   │   │   └── cleanup.ts              # POST pembersihan aset gambar orphan
│   │   │   │   ├── settings/
│   │   │   │   │   └── commission.ts           # GET & PUT parameter komisi & settlement delay
│   │   │   │   ├── template-categories/
│   │   │   │   │   ├── [id].ts                 # PUT & DELETE ubah/hapus kategori template admin
│   │   │   │   │   └── index.ts                # GET & POST kelola kategori template admin
│   │   │   │   ├── templates/
│   │   │   │   │   ├── index.ts                # GET daftar template yang membutuhkan review
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── review.ts           # POST menyetujui / menolak template desainer
│   │   │   │   ├── users/
│   │   │   │   │   ├── index.ts                # GET daftar user platform & monitoring
│   │   │   │   │   └── [userId]/
│   │   │   │   │       └── status.ts           # PATCH mengubah status aktif/suspend user
│   │   │   │   └── whitelist.ts                # GET & POST/PUT/DELETE whitelist email admin
│   │   │   ├── analytics/
│   │   │   │   └── track.ts                    # POST tracking event analitik kunjungan
│   │   │   ├── auth/
│   │   │   │   ├── [...all].ts                 # Rute callback end-point BetterAuth
│   │   │   │   └── error.ts                    # Endpoint informasi error sesi login
│   │   │   ├── builder/
│   │   │   │   └── save.ts                     # POST menyimpan revisi visual template builder
│   │   │   ├── categories/
│   │   │   │   └── index.ts                    # GET & POST/PATCH/DELETE CRUD kategori produk
│   │   │   ├── designer/
│   │   │   │   ├── templates/
│   │   │   │   │   ├── draft.ts                # GET & POST/PATCH/DELETE CRUD draft template
│   │   │   │   │   └── submit-review.ts        # POST pengajuan draf template desainer ke admin
│   │   │   │   ├── bank-account.ts             # GET & POST/PUT data rekening bank desainer
│   │   │   │   ├── payout/
│   │   │   │   │   └── status.ts               # GET riwayat status penarikan dana desainer
│   │   │   │   └── payout.ts                   # GET riwayat & POST pengajuan penarikan dana
│   │   │   ├── media/
│   │   │   │   ├── delete.ts                   # DELETE hapus file media gambar Cloudinary
│   │   │   │   └── sign.ts                     # POST generate Cloudinary upload signature
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── stock.ts                # PATCH perbarui stok produk tenant instan
│   │   │   │   │   └── variants.ts             # GET & POST/PUT/DELETE varian produk
│   │   │   │   ├── [id].ts                     # PUT & DELETE edit/hapus produk toko tenant
│   │   │   │   └── index.ts                    # GET & POST manajemen produk toko tenant
│   │   │   ├── public/
│   │   │   │   ├── templates/
│   │   │   │   │   └── index.ts                # GET katalog template publik siap pakai
│   │   │   │   ├── transactions/
│   │   │   │   │   └── status/
│   │   │   │   │       └── [invoiceId].ts      # GET status invoice transaksi pembayaran
│   │   │   │   └── commission.ts               # GET persentase split komisi untuk publik
│   │   │   ├── storefront/
│   │   │   │   └── catalog.ts                  # GET daftar katalog produk untuk storefront
│   │   │   ├── stores/
│   │   │   │   ├── check-subdomain.ts          # GET verifikasi ketersediaan subdomain toko
│   │   │   │   ├── onboard.ts                  # POST inisialisasi onboarding toko tenant
│   │   │   │   ├── register-subdomain.ts       # POST registrasi subdomain toko tenant
│   │   │   │   ├── settings.ts                 # GET & POST data visual setting toko tenant
│   │   │   │   └── [storeId]/
│   │   │   │       ├── apply-template.ts       # POST menerapkan template ke toko tenant
│   │   │   │       └── products.ts             # GET daftar produk toko publik & filter kategori
│   │   │   ├── template-categories/
│   │   │   │   └── index.ts                    # GET list kategori aktif untuk publik
│   │   │   ├── templates/
│   │   │   │   └── index.ts                    # GET katalog template publik & owned template tenant
│   │   │   ├── tenant/
│   │   │   │   ├── templates/
│   │   │   │   │   └── index.ts                # GET daftar template yang dimiliki tenant
│   │   │   │   └── transactions/
│   │   │   │       └── template-purchase.ts    # POST pembelian template oleh tenant
│   │   │   └── webhooks/
│   │   │       └── xendit.ts                   # POST penangkap callback status e-invoice Xendit
│   │   ├── auth/
│   │   │   ├── error.astro                     # Halaman UI info kesalahan kredensial
│   │   │   └── login.astro                     # Halaman UI login redirect role
│   │   ├── builder/
│   │   │   ├── preview/
│   │   │   │   └── [templateId].astro          # Halaman demo responsif live template
│   │   │   ├── [templateId].astro              # Halaman antarmuka no-code builder editor
│   │   │   └── new.astro                       # Rute inisialisasi draft template baru
│   │   ├── checkout/
│   │   │   └── [invoiceId].astro               # Halaman ringkasan & instruksi bayar invoice
│   │   ├── dashboard/
│   │   │   ├── analytics.astro                 # Halaman visualisasi data analitik tenant
│   │   │   ├── categories.astro                # Halaman manajemen kategori produk toko
│   │   │   ├── index.astro                     # Panel dashboard utama monitoring toko tenant
│   │   │   ├── orders.astro                    # Halaman riwayat transaksi/pesanan tenant
│   │   │   ├── products.astro                  # Halaman CRUD inventaris produk tenant
│   │   │   ├── store-settings.astro            # Halaman setting visual, wa, & nama toko
│   │   │   ├── store.astro                     # Halaman pratinjau internal toko tenant
│   │   │   └── templates.astro                 # Halaman galeri template desain untuk tenant
│   │   ├── designer/
│   │   │   ├── orders.astro                    # Halaman riwayat pesanan masuk desainer
│   │   │   ├── templates.astro                 # Halaman panel daftar template desainer
│   │   │   └── wallet.astro                    # Halaman pencairan komisi & riwayat desainer
│   │   ├── onboarding/
│   │   │   └── index.astro                     # Halaman asisten setup subdomain tenant baru
│   │   ├── storefront/
│   │   │   ├── [subdomain].astro               # Halaman routing dinamis storefront tenant
│   │   │   └── index.astro                     # Halaman rendering live storefront toko tenant
│   │   ├── templates/
│   │   │   └── index.astro                     # Halaman pasar katalog template market
│   │   ├── 401.astro                           # Halaman error 401 Unauthorized
│   │   ├── 403.astro                           # Halaman error 403 Forbidden
│   │   ├── 404.astro                           # Halaman rute URL tidak ditemukan
│   │   ├── index.astro                         # Halaman beranda promosi utama platform
│   │   ├── login.astro                         # Halaman login multi-role
│   │   ├── register.astro                      # Halaman pendaftaran tenant baru
│   │   ├── test-store.astro                    # Halaman uji integrasi storefront toko
│   │   └── umkm.astro                          # Halaman daftar direktori toko UMKM aktif
│   │
│   ├── schemas/                                # Definisi skema Zod (validasi data request)
│   │   ├── admin/
│   │   │   ├── admin.schema.ts                 # Skema Zod komisi & parameter platform settings
│   │   │   └── index.ts                        # Ekspor skema admin
│   │   ├── designer/
│   │   │   ├── bank-account.schema.ts          # Skema Zod rekening bank desainer
│   │   │   └── payout.schema.ts                # Skema Zod nominal pengajuan payout desainer
│   │   ├── finance/
│   │   │   ├── index.ts                        # Ekspor skema finansial
│   │   │   └── transaction.schema.ts           # Skema Zod verifikasi parameter transaksi
│   │   ├── templates/
│   │   │   ├── index.ts                        # Ekspor skema template
│   │   │   ├── template-category.schema.ts     # Skema Zod validasi kategori template
│   │   │   └── template.schema.ts              # Skema Zod visual draf & metadata template
│   │   ├── auth.schema.ts                      # Skema Zod validasi kredensial pengguna
│   │   ├── index.ts                            # Pendaftaran sentral ekspor seluruh skema Zod
│   │   ├── media.schema.ts                     # Skema Zod upload data berkas gambar
│   │   └── product-variant.schema.ts           # Skema Zod varian produk
│   │
│   ├── services/                               # Lapisan domain logika bisnis (Pure Services)
│   │   ├── finance/
│   │   │   ├── commission.service.ts           # Logika bagi hasil komisi platform & desainer
│   │   │   ├── index.ts                        # Ekspor layanan finansial
│   │   │   ├── payout.service.ts               # Logika transaksi penarikan dana desainer
│   │   │   ├── transaction.service.ts          # Logika pembuatan invoice & aktivasi toko
│   │   │   └── wallet.service.ts               # Ledger mutasi wallet & hitung saldo matang
│   │   ├── media/
│   │   │   ├── cleanup.service.ts              # Logika deteksi & pembersihan orphan media Cloudinary
│   │   │   └── index.ts                        # Ekspor layanan media
│   │   ├── template-categories/                # Lapisan bisnis kategori template
│   │   │   ├── index.ts                        # Ekspor layanan kategori template
│   │   │   └── template-category.service.ts    # Logika database CRUD kategori template
│   │   ├── templates/
│   │   │   ├── index.ts                        # Ekspor layanan template
│   │   │   ├── template.admin.service.ts       # Logika review & verifikasi template admin
│   │   │   └── template.service.ts             # Logika database template & status review
│   │   ├── analytics.service.ts                # Logika analytics trafik
│   │   ├── store-template.service.ts           # Logika penerapan & rendering template storefront
│   │   └── index.ts                            # Ekspor sentral layanan bisnis
│   │
│   ├── styles/
│   │   └── global.css                          # Variabel Tailwind, gaya global, & reset CSS
│   │
│   └── types/                                  # Deklarasi tipe TypeScript global
│       ├── admin/
│       │   └── index.ts                        # Tipe data manajemen user & status admin
│       ├── auth/
│       │   └── index.ts                        # Tipe data detail otentikasi user & role
│       ├── common/
│       │   ├── api.ts                          # Tipe standard HTTP API responses
│       │   ├── toast.ts                        # Tipe data notifikasi toast melayang
│       │   └── index.ts                        # Tipe data helper modular
│       ├── finance/
│       │   ├── commission.ts                   # Tipe skema bagi hasil komisi
│       │   ├── index.ts                        # Ekspor tipe finansial
│       │   ├── transactions.ts                 # Tipe invoice transaksi & log webhook
│       │   └── wallet.ts                       # Tipe ledger wallet, mutasi, & detail payout
│       ├── media/
│       │   └── index.ts                        # Ekspor tipe data media/upload
│       ├── templates/
│       │   ├── builder.ts                      # Tipe data visual block editor no-code
│       │   ├── index.ts                        # Ekspor tipe template
│       │   └── template.ts                     # Tipe data model template & pratinjau
│       └── index.ts                            # Ekspor tipe TypeScript global
│
├── tests/                                      # Suite pengujian unit & integrasi (Vitest)
│   ├── api/
│   │   ├── analytics/
│   │   │   └── track.test.ts                   # Uji analitik event track
│   │   ├── builder/
│   │   │   └── save.test.ts                    # Uji proteksi penyimpanan draf builder
│   │   ├── categories/
│   │   │   └── index.test.ts                   # Uji API CRUD kategori produk tenant
│   │   ├── designer/
│   │   │   ├── templates/
│   │   │   │   └── submit-review.test.ts       # Uji API pengajuan review template desainer
│   │   │   ├── bank-account.test.ts            # Uji API CRUD rekening desainer
│   │   │   ├── payout-status.test.ts           # Uji API status penarikan dana desainer
│   │   │   └── payout.test.ts                  # Uji API pencairan komisi desainer
│   │   ├── products/
│   │   │   ├── index.test.ts                   # Uji API CRUD produk toko tenant
│   │   │   ├── stock.test.ts                   # Uji API pembaruan stok produk instan
│   │   │   └── variants.test.ts                # Uji API CRUD varian produk
│   │   ├── public/
│   │   │   ├── templates/
│   │   │   │   └── index.test.ts               # Uji API katalog template publik
│   │   │   └── commission.test.ts              # Uji API pembacaan komisi untuk publik
│   │   ├── storefront/
│   │   │   └── catalog.test.ts                 # Uji API catalog storefront tenant
│   │   ├── stores/
│   │   │   └── [storeId]/
│   │   │       ├── apply-template.test.ts      # Uji fungsionalitas penerapan template ke toko
│   │   │       └── products.test.ts            # Uji API katalog produk spesifik toko
│   │   ├── webhooks/
│   │   │   └── xendit.test.ts                  # Uji penanganan webhook e-invoice Xendit
│   │   ├── admin-media-cleanup.test.ts         # Uji API pembersihan aset orphan Cloudinary
│   │   ├── check-subdomain.test.ts             # Uji validasi subdomain input Zod
│   │   ├── media-sign.test.ts                  # Uji Cloudinary signed upload generator
│   │   └── template-categories.test.ts         # Uji API & skema master kategori template
│   ├── builder/
│   │   └── section-registry.test.ts            # Uji modularitas section registry map
│   ├── finance/
│   │   ├── commission-and-masking.test.ts      # Uji engine komisi & masking nominal rupiah
│   │   ├── payout-disbursement.test.ts         # Uji webhook disbursement & saldo payout
│   │   └── price-sync.test.ts                  # Uji sinkronisasi harga template & komisi
│   ├── lib/
│   │   ├── transactions/
│   │   │   └── service.test.ts                 # Uji modul internal transaction service
│   │   ├── auth-google-whitelist.test.ts       # Uji redirect & whitelist email BetterAuth
│   │   ├── auth-helpers.test.ts                # Uji helper otentikasi role user
│   │   ├── templates-migration.test.ts         # Uji pipeline migrasi skema template config
│   │   ├── toast.test.ts                       # Uji state writable toast alert notifications
│   │   └── xendit.test.ts                      # Uji API call tagihan & disbursement Xendit
│   ├── routing/
│   │   └── subdomain.test.ts                   # Uji utilitas parsing subdomain & reserved blacklist
│   ├── schemas/
│   │   ├── auth.test.ts                        # Uji validasi kredensial pengguna Zod
│   │   ├── media.test.ts                       # Uji validasi Zod payload media
│   │   ├── product-variant.test.ts             # Uji validasi Zod payload varian produk
│   │   ├── store-settings.test.ts              # Uji validasi input setting tokomu
│   │   ├── template-tokens-presets.test.ts     # Uji token warna, typo, 8pt preset, & safe-zone
│   │   └── template.test.ts                    # Uji validasi Zod visual data template
│   ├── services/
│   │   ├── analytics.service.test.ts           # Uji logic service analytics
│   │   ├── media-cleanup.test.ts               # Uji garbage collection orphan image Cloudinary
│   │   └── store-template.service.test.ts      # Uji logic service storefront rendering
│   ├── transactions/
│   │   ├── e2e-template-marketplace-flow.test.ts # Uji e2e alur template (review -> beli -> lunas)
│   │   ├── template-purchase-flow.test.ts      # Uji transaksi pembayaran template desainer
│   │   └── wallet-and-fulfillment.test.ts      # Uji trigger pemenuhan invoice & kredit wallet
│   ├── ui/
│   │   └── design-system.test.ts               # Uji validasi token Design System
│   └── utils/
│       ├── api-handler.test.ts                 # Uji wrapper standar error handler HTTP API
│       ├── design-math.test.ts                 # Uji rumus concentric radius, pill, & debounce
│       └── validation.test.ts                  # Uji wrapper validasi Zod & formatted error
│
├── astro.config.mjs                            # Konfigurasi Astro Framework
├── drizzle.config.ts                           # Konfigurasi Drizzle ORM
├── package.json                                # Berkas dependensi npm & bun scripts
├── tailwind.config.mjs                         # Konfigurasi styling token Tailwind CSS
└── vitest.config.ts                            # Konfigurasi testing framework Vitest
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