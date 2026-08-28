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
│   │   │   ├── PropertyInspector.svelte        # Panel samping inspeksi properti node & tema
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
│   │   │   └── ThemeToggle.astro               # Tombol pengubah dark mode / light mode
│   │   ├── dashboard/
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.helpers.ts          # Helper navigasi sidebar dashboard
│   │   │   │   ├── SidebarDesktop.svelte       # Sidebar dashboard versi layar desktop
│   │   │   │   └── SidebarMobile.svelte        # Drawer sidebar dashboard versi mobile
│   │   │   ├── CategoryManager.svelte          # Pengelola CRUD kategori produk tenant
│   │   │   ├── DashboardNavbar.svelte          # Navigasi panel dashboard tenant
│   │   │   ├── Sidebar.svelte                  # Menu navigasi sidebar panel tenant
│   │   │   ├── StoreSettingsForm.svelte        # Konfigurasi WhatsApp, Google Maps, & profil toko
│   │   │   └── TemplateGallery.svelte          # Galeri pilihan template desain toko
│   │   ├── designer/
│   │   │   ├── DesignerBankModal.svelte        # Modal data rekening bank desainer
│   │   │   ├── DesignerBankWithdraw.svelte     # Form rekening bank & modal payout desainer
│   │   │   ├── DesignerMutationTable.svelte    # Tabel daftar mutasi keuangan desainer
│   │   │   ├── DesignerPayoutHistoryTable.svelte # Tabel riwayat payout desainer
│   │   │   ├── DesignerStatCards.svelte        # Ringkasan balance, komisi, & template terjual
│   │   │   ├── DesignerTemplateCard.svelte     # Kartu template buatan desainer (status review)
│   │   │   ├── DesignerWalletOverview.svelte   # Ringkasan dompet desainer & tombol withdraw
│   │   │   └── DesignerWithdrawModal.svelte    # Modal konfirmasi withdraw desainer
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
│   │   │   ├── ProductGrid.svelte              # Grid daftar produk di storefront
│   │   │   └── PromoBanner.svelte              # Banner promosi publik website toko tenant
│   │   ├── tenant/
│   │   │   ├── ProductDeleteModal.svelte       # Dialog konfirmasi penghapusan produk
│   │   │   ├── ProductFormModal.svelte         # Modal tambah/edit data produk toko
│   │   │   ├── ProductTable.svelte             # Tabel daftar produk dagangan tenant
│   │   │   ├── ProductTableRow.svelte          # Baris data produk toko tenant
│   │   │   └── StoreManager.svelte             # Panel monitoring penjualan tenant
│   │   └── ui/
│   │       ├── StatCard.svelte                 # Komponen card ringkasan statistik modular
│   │       ├── ToastContainer.svelte           # Kontainer notifikasi toast mengambang
│   │       └── WhatsAppIcon.svelte             # Ikon WhatsApp SVG modular
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
│   │   ├── stores/
│   │   │   └── schemas.ts                      # Skema validasi state svelte store
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
│   ├── middleware.ts                           # Middleware otentikasi & pengecekan role
│   │
│   ├── pages/                                  # Rute URL halaman file-based routing Astro
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── index.astro                 # Halaman panel konfigurasi komisi & delay admin
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
│   │   │   │   ├── templates/
│   │   │   │   │   ├── index.ts                # GET daftar template yang membutuhkan review
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── review.ts           # POST menyetujui / menolak template desainer
│   │   │   │   ├── users/
│   │   │   │   │   ├── index.ts                # GET daftar user platform & monitoring
│   │   │   │   │   └── [userId]/
│   │   │   │   │       └── status.ts           # PATCH mengubah status aktif/suspend user
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
│   │   │   │   ├── index.ts                    # GET & POST manajemen produk toko tenant
│   │   │   │   └── [id]/
│   │   │   │       └── variants.ts             # GET & POST/PUT/DELETE varian produk
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
│   │   │   │   ├── check-subdomain.ts          # GET verifikasi status subdomain baru
│   │   │   │   ├── onboard.ts                  # POST aktivasi awal nama subdomain toko
│   │   │   │   ├── register-subdomain.ts       # POST daftarkan rute dns subdomain ke serverless
│   │   │   │   ├── settings.ts                 # GET & POST data visual setting toko tenant
│   │   │   │   └── [storeId]/
│   │   │   │       ├── apply-template.ts       # POST menerapkan template ke toko tenant
│   │   │   │       └── products.ts             # GET daftar produk toko publik & filter kategori
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
│   │   │   ├── store.astro                     # Halaman pratinjau internal toko tenant
│   │   │   └── templates.astro                 # Halaman galeri template desain untuk tenant
│   │   ├── designer/
│   │   │   ├── templates.astro                 # Halaman panel daftar template desainer
│   │   │   └── wallet.astro                    # Halaman pencairan komisi & riwayat desainer
│   │   ├── onboarding/
│   │   │   └── index.astro                     # Halaman asisten setup subdomain tenant baru
│   │   ├── public/
│   │   │   └── templates/
│   │   │       └── index.astro                 # Halaman landing list katalog template publik
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
│   │   ├── templates/
│   │   │   ├── index.ts                        # Ekspor layanan template
│   │   │   ├── template.admin.service.ts       # Logika review & verifikasi template admin
│   │   │   └── template.service.ts             # Logika database template & status review
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
│   │   ├── product-variant.test.ts             # Uji validasi Zod payload varian produk
│   │   ├── store-settings.test.ts              # Uji validasi input setting tokomu
│   │   ├── template-tokens-presets.test.ts     # Uji token warna, typo, 8pt preset, & safe-zone
│   │   └── template.test.ts                    # Uji validasi Zod visual data template
│   ├── services/
│   │   └── media-cleanup.test.ts               # Uji garbage collection orphan image Cloudinary
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

---

## 🛠️ Dokumentasi Visual Template Builder

Berikut adalah detail spesifikasi arsitektur teknis dari no-code visual template builder yang dapat digunakan untuk menganalisis, memperbaiki, atau menambahkan fungsionalitas visual:

### 1. Daftar Template Layout & Section yang Tersedia (`src/components/builder/sections/`)

* **A. Header Sections (`sections/header/`)**
  * `AnnouncementBar.svelte`: Bilah pesan teks pengumuman berjalan/statis di bagian paling atas halaman.
  * `HeaderLogo.svelte`: Area visual untuk memuat dan merender logo toko (mendukung URL gambar atau teks inisial).
  * `HeaderNav.svelte`: Menu tautan navigasi responsif (Desktop satu baris horizontal, Mobile otomatis runtuh).

* **B. Hero Sections (`sections/hero/`)**
  * `HeroCenteredMinimal.svelte`: Banner sambutan dengan teks headline dan subheadline terpusat di tengah dengan CTA minimalis.
  * `HeroFullBanner.svelte`: Layout hero dengan latar belakang gambar penuh (full-bleed) dilapisi overlay gelap untuk keterbacaan teks kontras tinggi.
  * `HeroSplitLayout.svelte`: Komposisi asimetris 50/50 (Teks di satu sisi, aset gambar/media di sisi lain).

* **C. Content & Utility Sections (`sections/`)**
  * `FAQ.svelte`: Daftar pertanyaan yang sering diajukan menggunakan mekanisme akordeon buka-tutup interaktif.
  * `Features.svelte`: Susunan grid modular untuk menampilkan keunggulan layanan, fitur, atau poin penting produk.
  * `GoogleMaps.svelte`: Integrasi rendering iframe lokasi maps fisik toko UMKM.
  * `Testimonials.svelte`: Grid/kartu berisi ulasan ulasan positif atau kutipan kepuasan pembeli/tamu.
  * `Footer.svelte`: Bagian kaki halaman yang memuat hak cipta, alamat fisik toko, dan tautan sosial media.

* **D. Katalog Produk (`sections/catalog/`)**
  * `ProductCatalog.svelte`: Komponen utama untuk memuat, memfilter berdasarkan kategori, dan menampilkan grid produk toko.
  * `ProductCatalogCard.svelte`: Komponen visual kartu satuan produk (harga, gambar, status stok, tombol interaktif).
  * `ProductCatalogQuickView.svelte`: Modal popup interaktif untuk melihat rincian detail produk secara instan tanpa berpindah rute halaman.

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

### 5. State Management & Operations (`editorStore.ts`)

Siklus data visual editor builder dikelola secara terpusat oleh `editorStore` (Svelte Writable Store) dengan arsitektur data sebagai berikut:
* **Struktur State (`EditorState`)**:
  * `template`: Objek data template utuh yang sedang diedit (berisi metadata, list `sections`, dan objek `theme`).
  * `selectedSectionId`: ID unik section yang saat ini dipilih oleh pengguna di canvas atau layer panel.
  * `history`: Stack riwayat perubahan untuk mendukung fitur undo/redo.
  * `viewMode`: Mode peninjauan aktif (`desktop` | `tablet` | `mobile`).
* **Operasi Mutasi State (`editorStore.mutations.ts`)**:
  * `addSection(type, index)`: Menyisipkan section baru ke posisi tertentu.
  * `updateSectionContent(id, content)`: Memperbarui data teks/gambar konten di dalam node section.
  * `updateSectionStyles(id, styles)`: Memperbarui parameter styling (margin, padding, border radius, alignment).
  * `deleteSection(id)`: Menghapus section dari silsilah visual.
  * `reorderSections(fromIndex, toIndex)`: Mengubah posisi urutan section (dipicu oleh interaksi drag-and-drop pada Layer Panel).
  * `undo()` / `redo()`: Berpindah antar snapshot history state.

---

### 6. Inspector & Image Upload Integration

Panel kanan editor (`PropertyInspector.svelte`) menyajikan antarmuka pengaturan spesifik berdasarkan node yang sedang aktif:
* **Tabs Navigasi**:
  * **Content Tab (`ContentTab.svelte`)**: Mengatur input teks, headline, tautan tombol, dan pilihan gambar/media.
  * **Styles Tab (`StylesTab.svelte`)**: Mengatur visual theme global seperti tipografi font header/body, warna primer/sekunder, dan radius global.
  * **NodeStyles Tab (`NodeStylesTab.svelte`)**: Mengatur layout visual tingkat section (alignment, container width, background, margin/padding).
* **Integrasi Cloudinary Uploader (`ImageUpload.svelte`)**:
  * Mendukung unggah gambar drag-and-drop dengan feedback indikator progress bar.
  * Mengambil signed signature secara dinamis dari API endpoint `/api/media/sign` untuk unggah gambar secara langsung dan aman dari client-side ke Cloudinary.
  * Mendukung penghapusan aset gambar lama dari Cloudinary via API `/api/media/delete` saat gambar diganti atau dihapus.

---

### 7. Rekomendasi Perbaikan & Pengembangan Builder

Berikut adalah analisis rekomendasi perbaikan teknis yang dapat diterapkan pada UMKM Site Builder Builder di masa mendatang:
* **Viewport Scaling Transform**:
  * *Masalah*: Di layar beresolusi rendah (seperti laptop 1366x768), sisa ruang workspace tengah setelah dikurangi sidebar kiri (260px) dan kanan (320px) hanya menyisakan sekitar 786px. Mode tablet (768px) atau desktop (1200px) akan terhimpit.
  * *Solusi*: Terapkan CSS `transform: scale(...)` dinamis pada `#canvas-frame` berdasarkan lebar workspace tersisa agar seluruh kanvas terlihat utuh (fit-to-screen) tanpa memotong detail tata letak asli.
* **Shadow Drop Indicator pada Reordering Layer**:
  * *Masalah*: Saat ini reordering section pada `LayerPanel.svelte` bekerja secara instan tanpa indikator drop zone visual yang halus.
  * *Solusi*: Tambahkan baris bayangan (shadow bar / drop-indicator) yang memandu pengguna di mana posisi section akan diletakkan sebelum pointer dilepas.
* **Presets Design System Themes**:
  * *Masalah*: Desainer pemula sering kesulitan mengombinasikan warna/font yang harmonis.
  * *Solusi*: Sediakan opsi palet tema siap pakai (presets) di `GlobalThemeInspector` seperti *"Classic Clean"*, *"Emerald Organic"*, atau *"Cyber Tech"* agar pengguna dapat langsung mengganti tema warna & font terkurasi dengan sekali klik.
* **Image Cropper & Aspect Ratio Lock**:
  * *Masalah*: Gambar yang diunggah pengguna sering merusak proporsi tata letak visual (layout box) karena rasio tinggi-lebar file asli yang tidak seragam.
  * *Solusi*: Integrasikan pustaka cropping gambar berbasis client-side di `ImageUpload.svelte` agar desainer dapat memotong gambar sesuai aspek rasio target (misal: 1:1 untuk katalog, 16:9 untuk banner hero) sebelum dikirim ke server Cloudinary.