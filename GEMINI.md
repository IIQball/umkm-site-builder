# PETA STRUKTUR FOLDER & BERKAS PROJEK
Sistem UMKM Site Builder SaaS

Berikut adalah struktur folder lengkap beserta seluruh berkas yang ada di dalam projek ini:

```
umkm-site-builder/
├── .agents/                                    # Konfigurasi & workflow agen AI pintar
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
│   ├── components/                             # Komponen UI modular berbasis Svelte
│   │   ├── admin/
│   │   │   ├── whitelist/
│   │   │   │   ├── AdminAddModal.svelte        # Modal tambah whitelist email admin
│   │   │   │   ├── AdminEditModal.svelte       # Modal edit data whitelist admin
│   │   │   │   └── AdminWhitelistManager.svelte# Panel manajemen whitelist email Google Auth
│   │   │   ├── CommissionSettingsPanel.svelte  # Form fee %, minimum payout, & settlement delay
│   │   │   └── TemplateReviewPanel.svelte      # Panel review & verifikasi template desainer
│   │   ├── auth/
│   │   │   ├── LoginForm.svelte                # Form login tenant, designer, dan admin
│   │   │   ├── RegisterForm.svelte             # Form registrasi tenant baru
│   │   │   └── GoogleAuthButton.svelte         # Tombol login Google SSO BetterAuth
│   │   ├── builder/
│   │   │   ├── content/
│   │   │   │   ├── FAQContent.svelte           # Form inspector FAQ
│   │   │   │   ├── FeaturesContent.svelte      # Form inspector fitur keunggulan
│   │   │   │   ├── FooterContent.svelte        # Form inspector footer
│   │   │   │   ├── GoogleMapsContent.svelte    # Form inspector maps
│   │   │   │   ├── HeaderAnnouncementContent.svelte # Form inspector announcement header
│   │   │   │   ├── HeroContent.svelte          # Form inspector konten hero section
│   │   │   │   ├── ProductCatalogContent.svelte# Form inspector data produk katalog
│   │   │   │   └── TestimonialsContent.svelte  # Form inspector isi ulasan/testimonial
│   │   │   ├── inspector/
│   │   │   │   ├── header/
│   │   │   │   │   ├── HeaderAnnouncementPanel.svelte # Panel teks pengumuman header
│   │   │   │   │   ├── HeaderLogoPanel.svelte  # Panel upload/URL logo toko
│   │   │   │   │   └── HeaderNavPanel.svelte   # Panel menu navigasi menu header
│   │   │   │   ├── nodes/                      # Inspector per tipe node elemen
│   │   │   │   │   ├── NodeBadgeInspector.svelte # Inspector elemen badge
│   │   │   │   │   ├── NodeButtonInspector.svelte# Inspector elemen tombol aksi
│   │   │   │   │   ├── NodeImageInspector.svelte # Inspector elemen gambar
│   │   │   │   │   ├── NodeRatingInspector.svelte# Inspector rating bintang
│   │   │   │   │   ├── NodeSubtitleInspector.svelte# Inspector teks subtitle
│   │   │   │   │   └── NodeTitleInspector.svelte # Inspector teks title / heading
│   │   │   │   ├── theme/
│   │   │   │   │   ├── ColorThemePresets.svelte# Presets palet warna tema
│   │   │   │   │   └── TypographyPresets.svelte# Presets font tipografi
│   │   │   │   ├── CatalogCardPanel.svelte     # Panel pengubah style kartu produk
│   │   │   │   ├── CatalogGridPanel.svelte     # Panel layout grid katalog produk
│   │   │   │   ├── catalogStyles.helpers.ts    # Fungsi helper styling css katalog
│   │   │   │   ├── CatalogStylesTab.svelte     # Tab pengeditan gaya katalog produk
│   │   │   │   ├── GeneralStylesTab.svelte     # Tab layout jarak & padding section
│   │   │   │   ├── GlobalThemeInspector.svelte # Panel warna dasar tema template builder
│   │   │   │   ├── HeaderStylesTab.svelte      # Tab konfigurasi gaya navigasi header
│   │   │   │   ├── NodeContentForm.svelte      # Form input konten dinamis tiap block
│   │   │   │   ├── nodeStyles.constants.ts     # Konstanta default style CSS node block
│   │   │   │   ├── SectionAppearancePanel.svelte # Panel background & border-radius section
│   │   │   │   ├── SectionLayoutPanel.svelte    # Panel layout flex/grid section
│   │   │   │   ├── sectionLayout.constants.ts  # Presets layout section
│   │   │   │   └── StyleSelector.svelte        # Dropdown pemilih varian style visual
│   │   │   ├── layer/
│   │   │   │   ├── AddNodeDropdown.svelte      # Tombol nambah block section baru
│   │   │   │   └── layerPanel.helpers.ts       # Helper manipulasi susunan layer
│   │   │   ├── sections/
│   │   │   │   ├── catalog/                    # Preset section katalog
│   │   │   │   ├── faq/                        # Preset section FAQ
│   │   │   │   ├── features/                   # Preset section keunggulan
│   │   │   │   ├── footer/                     # Preset section footer
│   │   │   │   ├── header/                     # Preset & elemen navigasi header
│   │   │   │   │   ├── AnnouncementBar.svelte  # Baris pengumuman di atas navigasi
│   │   │   │   │   ├── HeaderLogo.svelte       # Elemen visual logo website toko
│   │   │   │   │   └── HeaderNav.svelte        # Elemen menu navigasi toko
│   │   │   │   ├── hero/                       # Preset & elemen hero banner
│   │   │   │   │   ├── HeroBannerPreset.svelte # Preset banner hero
│   │   │   │   │   ├── HeroElementToolbar.svelte # Floating toolbar elemen hero
│   │   │   │   │   ├── HeroFeaturePreset.svelte# Preset hero fitur
│   │   │   │   │   └── HeroSplitPreset.svelte  # Preset hero split visual
│   │   │   │   ├── maps/                       # Preset embed Google Maps
│   │   │   │   ├── testimonials/               # Preset ulasan testimoni
│   │   │   │   ├── FAQ.svelte                  # Komponen visual FAQ
│   │   │   │   ├── Features.svelte             # Komponen visual daftar keunggulan
│   │   │   │   ├── Footer.svelte               # Komponen visual footer toko
│   │   │   │   ├── GoogleMaps.svelte           # Komponen visual embed lokasi Maps
│   │   │   │   ├── HeaderAnnouncement.svelte   # Komponen visual announcement bar
│   │   │   │   ├── Hero.svelte                 # Komponen visual banner sambutan utama
│   │   │   │   ├── productCatalog.helpers.ts   # Helper load data produk toko
│   │   │   │   ├── ProductCatalog.svelte       # Komponen visual daftar katalog produk
│   │   │   │   ├── SectionRenderer.svelte      # Renderer block layout editor no-code
│   │   │   │   └── Testimonials.svelte         # Komponen visual ulasan testimoni
│   │   │   ├── stores/
│   │   │   │   ├── editorStore.mutations.ts    # Operasi mutasi state no-code (save, update)
│   │   │   │   ├── editorStore.ts              # Svelte writable store state builder editor
│   │   │   │   └── editorStore.types.ts        # Tipe TypeScript state editor builder
│   │   │   ├── BuilderEditor.svelte            # Halaman utama editor visual no-code builder
│   │   │   ├── Canvas.svelte                   # Lembar kerja visual kanvas editor builder
│   │   │   ├── ContentTab.svelte               # Tab pengisian teks & gambar konten node
│   │   │   ├── HistoryPanel.svelte             # Panel riwayat undo / redo perubahan
│   │   │   ├── LayerPanel.svelte               # Panel pohon layer hirarki section template
│   │   │   ├── LayoutGridOverlay.svelte        # Overlay panduan kolom Figma 12/8/4 & pixel grid
│   │   │   ├── NewTemplateForm.svelte          # Form pembuatan template draft desainer
│   │   │   ├── NodeStylesTab.svelte            # Tab kustomisasi spesifik style per node
│   │   │   ├── PropertyInspector.svelte        # Panel samping inspeksi properti node & tema
│   │   │   ├── ReadOnlyPreview.svelte          # Pratinjau baca-saja live template
│   │   │   ├── SubmitReviewModal.svelte        # Modal pengajuan review template ke admin
│   │   │   └── TopBar.svelte                   # Bar atas editor (undo, redo, zoom, breakpoint)
│   │   ├── checkout/
│   │   │   ├── PaymentModal.svelte             # Modal pembayaran invoice Xendit
│   │   │   └── TransactionStatus.svelte        # Status tagihan invoice (polling & status badge)
│   │   ├── common/
│   │   │   ├── Navbar.astro                    # Navigasi utama header base layout
│   │   │   └── ThemeToggle.astro               # Tombol pengubah dark mode / light mode
│   │   ├── dashboard/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.helpers.ts          # Helper navigasi sidebar dashboard
│   │   │   │   ├── SidebarDesktop.svelte       # Sidebar dashboard versi layar desktop
│   │   │   │   └── SidebarMobile.svelte        # Drawer sidebar dashboard versi mobile
│   │   │   ├── CategoryManager.svelte          # Pengelola CRUD kategori produk tenant
│   │   │   ├── DashboardNavbar.svelte          # Navigasi panel dashboard tenant
│   │   │   ├── Sidebar.svelte                  # Menu navigasi sidebar panel tenant
│   │   │   └── StoreSettingsForm.svelte        # Konfigurasi WhatsApp, Google Maps, & profil toko
│   │   ├── designer/
│   │   │   ├── bank/
│   │   │   │   ├── BankAccountCardModal.svelte # Modal tambah & edit rekening bank penarikan
│   │   │   │   ├── bank.helpers.ts             # Daftar bank populer & helper badge status payout
│   │   │   │   ├── PayoutHistoryTable.svelte   # Tabel riwayat pengajuan penarikan dana (payout)
│   │   │   │   └── PayoutModal.svelte          # Modal input nominal penarikan saldo
│   │   │   ├── templates/
│   │   │   │   ├── TemplateBulkToolbar.svelte  # Toolbar hapus multi-template desainer
│   │   │   │   ├── TemplateFilterTabs.svelte   # Tab filter status template (Semua, Draft, dll)
│   │   │   │   └── TemplateRejectionModal.svelte# Modal penampil catatan penolakan template
│   │   │   ├── DeleteTemplateModal.svelte      # Dialog konfirmasi hapus template (single & bulk)
│   │   │   ├── DesignerBankWithdraw.svelte     # Panel rekening bank & tarik saldo desainer
│   │   │   ├── DesignerMutationTable.svelte    # Tabel buku besar mutasi keuangan desainer
│   │   │   ├── DesignerStatCards.svelte        # Ringkasan balance, komisi, & template terjual
│   │   │   ├── DesignerTemplateCard.svelte     # Kartu template buatan desainer
│   │   │   ├── DesignerTemplateManager.svelte  # Panel manajemen katalog template desainer
│   │   │   └── DesignerWalletOverview.svelte   # Ringkasan dompet desainer & analytics
│   │   ├── onboarding/
│   │   │   └── OnboardingWizard.svelte         # Form inisialisasi subdomain & toko baru tenant
│   │   ├── public/
│   │   │   └── TemplateCardAction.svelte       # Kartu katalog template dengan tombol beli & demo
│   │   ├── shared/
│   │   │   ├── .gitkeep                        # Penahan folder git
│   │   │   └── ImageUpload.svelte              # Pengunggah gambar terintegrasi Cloudinary API
│   │   ├── storefront/
│   │   │   ├── DynamicSection.svelte           # Komponen rendering section dinamis storefront
│   │   │   ├── Footer.svelte                   # Footer publik website toko tenant
│   │   │   ├── Hero.svelte                     # Banner hero publik website toko tenant
│   │   │   └── PromoBanner.svelte              # Banner promosi publik website toko tenant
│   │   ├── tenant/
│   │   │   ├── ProductDeleteModal.svelte       # Dialog konfirmasi penghapusan produk
│   │   │   ├── ProductFormModal.svelte         # Modal tambah/edit data produk toko
│   │   │   ├── ProductTable.svelte             # Tabel daftar produk dagangan tenant
│   │   │   ├── ProductTableRow.svelte          # Baris data produk toko tenant
│   │   │   └── StoreManager.svelte             # Panel monitoring list toko tenant
│   │   └── ui/
│   │       ├── StatCard.svelte                 # Komponen modular kartu ringkasan statistik
│   │       └── ToastContainer.svelte           # Container penampil alert melayang (toast)
│   │
│   ├── db/                                     # Integrasi Drizzle ORM
│   │   ├── index.ts                            # Inisialisasi koneksi Drizzle Neon Serverless
│   │   ├── schema.ts                           # Skema tabel database (users, stores, wallets)
│   │   └── seed.ts                             # Skrip otomatisasi pengisian data awal (seeding)
│   │
│   ├── layouts/                                # Master layout pembungkus halaman Astro
│   │   ├── BaseLayout.astro                    # Layout dasar HTML publik
│   │   ├── DashboardLayout.astro               # Layout panel dashboard & kontrol internal
│   │   └── StorefrontLayout.astro              # Layout website toko tenant publik
│   │
│   ├── lib/                                    # Kumpulan pustaka pembantu & inisialisasi SDK
│   │   ├── auth/
│   │   │   └── .gitkeep                        # Penahan folder auth
│   │   ├── config/
│   │   │   └── app.ts                          # Konfigurasi nama aplikasi & tautan menu navigasi
│   │   ├── db/
│   │   │   └── client.ts                       # Klien koneksi Drizzle & tipe DbExecutor
│   │   ├── errors/
│   │   │   └── .gitkeep                        # Penahan folder errors
│   │   ├── finance/
│   │   │   ├── index.ts                        # Ekspor modul finansial
│   │   │   └── xendit.ts                       # Klien SDK Xendit untuk e-invoice & disbursement
│   │   ├── routes/
│   │   │   └── .gitkeep                        # Penahan folder routes
│   │   ├── stores/
│   │   │   └── schemas.ts                      # Skema pembantu frontend store
│   │   ├── utils/
│   │   │   ├── api-handler.ts                  # Pembungkus standar API route handler
│   │   │   ├── designMath.ts                   # Utilitas rumus radius & Golden Ratio
│   │   │   ├── format.ts                       # Fungsi formatter mata uang IDR & waktu
│   │   │   ├── index.ts                        # Ekspor modul utilitas
│   │   │   ├── logger.ts                       # Logger console terstandar
│   │   │   └── validation.ts                   # Utilitas validator skema Zod
│   │   ├── auth-client.ts                      # Klien inisialisasi auth BetterAuth (frontend)
│   │   ├── auth.ts                             # Konfigurasi server BetterAuth & database adapter
│   │   ├── cloudinary.ts                       # Pembantu upload gambar aman ke Cloudinary
│   │   ├── currency.ts                         # Utilitas manipulasi nilai rupiah
│   │   ├── toast.ts                            # State store penampil alert notifikasi melayang
│   │   └── whatsapp.ts                         # Utilitas generator URL chat WhatsApp
│   │
│   ├── pages/                                  # Rute URL halaman file-based routing Astro
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── index.astro                 # Halaman panel konfigurasi komisi & delay admin
│   │   │   ├── templates/
│   │   │   │   └── index.astro                 # Halaman approval pengajuan template desainer
│   │   │   └── whitelist/
│   │   │       └── index.astro                 # Halaman kelola whitelist akses Google Admin
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── settings/
│   │   │   │   │   └── commission.ts           # GET & PUT parameter komisi & settlement delay
│   │   │   │   ├── templates/
│   │   │   │   │   ├── index.ts                # GET daftar template yang membutuhkan review
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── review.ts           # POST menyetujui / menolak template desainer
│   │   │   │   └── whitelist.ts                # GET & POST/PUT/DELETE whitelist email admin
│   │   │   ├── auth/
│   │   │   │   ├── [...all].ts                 # Rute callback end-point BetterAuth
│   │   │   │   └── error.ts                    # Endpoint informasi error sesi login
│   │   │   ├── builder/
│   │   │   │   └── save.ts                     # POST menyimpan revisi visual template builder
│   │   │   ├── categories/
│   │   │   │   └── index.ts                    # GET & POST/PATCH/DELETE CRUD kategori produk
│   │   │   ├── designer/
│   │   │   │   ├── templates/
│   │   │   │   │   ├── batch-delete.ts         # POST batch hapus beberapa draft template
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
│   │   │   │   ├── [id].ts                     # PUT & DELETE edit/hapus produk toko tenant
│   │   │   │   └── index.ts                    # GET & POST manajemen produk toko tenant
│   │   │   ├── public/
│   │   │   │   ├── templates/
│   │   │   │   │   └── index.ts                # GET katalog template publik siap pakai
│   │   │   │   ├── transactions/
│   │   │   │   │   └── status/
│   │   │   │   │       └── [invoiceId].ts      # GET status invoice transaksi pembayaran
│   │   │   │   └── commission.ts               # GET persentase split komisi untuk publik
│   │   │   ├── stores/
│   │   │   │   ├── [storeId]/
│   │   │   │   │   └── products.ts             # GET daftar produk toko publik & filter kategori
│   │   │   │   ├── check-subdomain.ts          # GET verifikasi status subdomain baru
│   │   │   │   ├── onboard.ts                  # POST aktivasi awal nama subdomain toko
│   │   │   │   ├── register-subdomain.ts       # POST daftarkan rute dns subdomain ke serverless
│   │   │   │   └── settings.ts                 # GET & POST data visual setting toko tenant
│   │   │   ├── tenant/
│   │   │   │   └── transactions/
│   │   │   │       ├── initiate.ts             # POST inisiasi tagihan registrasi toko
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
│   │   │   ├── categories.astro                # Halaman manajemen kategori produk toko
│   │   │   ├── index.astro                     # Panel dashboard utama monitoring toko tenant
│   │   │   ├── products.astro                  # Halaman CRUD inventaris produk tenant
│   │   │   ├── store-settings.astro            # Halaman setting visual, wa, & nama toko
│   │   │   └── store.astro                     # Halaman pratinjau internal toko tenant
│   │   ├── designer/
│   │   │   ├── templates.astro                 # Halaman panel daftar template desainer
│   │   │   └── wallet.astro                    # Halaman pencairan komisi & riwayat desainer
│   │   ├── onboarding/
│   │   │   └── index.astro                     # Halaman asisten setup subdomain tenant baru
│   │   ├── public/
│   │   │   └── templates/
│   │   │       └── index.astro                 # Halaman landing list katalog template publik
│   │   ├── storefront/
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
│   │   │   ├── payout.schema.ts                # Skema Zod nominal pengajuan payout desainer
│   │   │   └── index.ts                        # Ekspor skema desainer
│   │   ├── finance/
│   │   │   ├── index.ts                        # Ekspor skema finansial
│   │   │   └── transaction.schema.ts           # Skema Zod verifikasi parameter transaksi
│   │   ├── templates/
│   │   │   ├── index.ts                        # Ekspor skema template
│   │   │   └── template.schema.ts              # Skema Zod visual draf & metadata template
│   │   ├── auth.schema.ts                      # Skema Zod validasi kredensial pengguna
│   │   ├── index.ts                            # Pendaftaran sentral ekspor seluruh skema Zod
│   │   └── media.schema.ts                     # Skema Zod upload data berkas gambar
│   │
│   ├── services/                               # Lapisan domain logika bisnis (Pure Services)
│   │   ├── finance/
│   │   │   ├── commission.service.ts           # Logika bagi hasil komisi platform & desainer
│   │   │   ├── index.ts                        # Ekspor layanan finansial
│   │   │   ├── payout.service.ts               # Logika transaksi penarikan dana desainer
│   │   │   ├── transaction.service.ts          # Logika pembuatan invoice & aktivasi toko
│   │   │   └── wallet.service.ts               # Ledger mutasi wallet & hitung saldo matang
│   │   ├── templates/
│   │   │   ├── index.ts                        # Ekspor layanan template
│   │   │   ├── template.admin.service.ts       # Logika approval & review template oleh admin
│   │   │   └── template.service.ts             # Logika database template & status review
│   │   └── index.ts                            # Ekspor sentral layanan bisnis
│   │
│   ├── styles/
│   │   └── global.css                          # Variabel Tailwind, gaya global, & reset CSS
│   │
│   └── types/                                  # Deklarasi tipe TypeScript global
│       ├── auth/
│       │   └── index.ts                        # Tipe data detail otentikasi user & role
│       ├── common/
│       │   ├── api.ts                          # Tipe standard HTTP API responses
│       │   ├── toast.ts                        # Tipe data notifikasi toast melayang
│       │   └── index.ts                        # Tipe helper modular
│       ├── finance/
│       │   ├── commission.ts                   # Tipe skema bagi hasil komisi
│       │   ├── index.ts                        # Ekspor tipe finansial
│       │   ├── transactions.ts                 # Tipe invoice transaksi & log webhook
│       │   └── wallet.ts                       # Tipe ledger wallet, mutasi, & detail payout
│       ├── templates/
│       │   ├── builder.ts                      # Tipe data visual block editor no-code
│       │   ├── index.ts                        # Ekspor tipe template
│       │   └── template.ts                     # Tipe data model template & pratinjau
│       └── index.ts                            # Ekspor tipe TypeScript global
│
├── tests/                                      # Suite pengujian unit & integrasi (Vitest)
│   ├── api/
│   │   ├── builder/
│   │   │   └── save.test.ts                    # Uji proteksi penyimpanan revisi builder
│   │   ├── categories/
│   │   │   └── index.test.ts                   # Uji API CRUD kategori produk tenant
│   │   ├── designer/
│   │   │   ├── templates/
│   │   │   │   ├── delete.test.ts              # Uji API penghapusan template (single & batch)
│   │   │   │   └── submit-review.test.ts       # Uji API pengajuan review template desainer
│   │   │   ├── bank-account.test.ts            # Uji API CRUD rekening desainer
│   │   │   ├── payout-status.test.ts           # Uji API status penarikan dana desainer
│   │   │   └── payout.test.ts                  # Uji API pencairan komisi desainer
│   │   ├── products/
│   │   │   └── index.test.ts                   # Uji API CRUD produk toko tenant
│   │   ├── public/
│   │   │   ├── templates/
│   │   │   │   └── index.test.ts               # Uji API katalog template publik
│   │   │   └── commission.test.ts              # Uji API pembacaan komisi untuk publik
│   │   ├── stores/
│   │   │   └── [storeId]/
│   │   │       └── products.test.ts            # Uji API katalog produk spesifik toko
│   │   ├── webhooks/
│   │   │   └── xendit.ts                       # Uji penanganan webhook e-invoice Xendit
│   │   ├── check-subdomain.test.ts             # Uji validasi subdomain input Zod
│   │   └── media-sign.test.ts                  # Uji Cloudinary signed upload generator
│   ├── finance/
│   │   ├── commission-and-masking.test.ts      # Uji engine komisi & masking nominal rupiah
│   │   ├── payout-disbursement.test.ts         # Uji webhook disbursement & saldo payout
│   │   └── price-sync.test.ts                  # Uji sinkronisasi harga template & komisi
│   ├── lib/
│   │   ├── transactions/
│   │   │   └── service.test.ts                 # Uji modul internal transaction service
│   │   ├── auth-google-whitelist.test.ts       # Uji redirect & whitelist email BetterAuth
│   │   ├── auth-helpers.test.ts                # Uji helper otentikasi role user
│   │   ├── toast.test.ts                       # Uji state writable toast alert notifications
│   │   └── xendit.test.ts                      # Uji API call tagihan & disbursement Xendit
│   ├── schemas/
│   │   ├── auth.test.ts                        # Uji validasi kredensial pengguna Zod
│   │   ├── media.test.ts                       # Uji validasi Zod payload media
│   │   ├── store-settings.test.ts              # Uji validasi input setting tokomu
│   │   ├── template-tokens-presets.test.ts     # Uji token warna, typo, 8pt preset, & safe-zone
│   │   └── template.test.ts                    # Uji validasi Zod visual data template
│   ├── transactions/
│   │   ├── e2e-template-marketplace-flow.test.ts # Uji e2e alur template (review -> beli -> lunas)
│   │   ├── template-purchase-flow.test.ts      # Uji transaksi pembayaran template desainer
│   │   └── wallet-and-fulfillment.test.ts      # Uji trigger pemenuhan invoice & kredit wallet
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
