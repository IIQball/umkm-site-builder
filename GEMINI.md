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
│   │   │   │   ├── HeroContent.svelte          # Form inspector konten hero section
│   │   │   │   ├── ProductCatalogContent.svelte# Form inspector data produk katalog
│   │   │   │   └── TestimonialsContent.svelte  # Form inspector isi ulasan/testimonial
│   │   │   ├── inspector/
│   │   │   │   ├── header/
│   │   │   │   │   ├── HeaderAnnouncementPanel.svelte # Panel teks pengumuman header
│   │   │   │   │   ├── HeaderLogoPanel.svelte  # Panel upload/URL logo toko
│   │   │   │   │   └── HeaderNavPanel.svelte   # Panel menu navigasi menu header
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
│   │   │   │   └── StyleSelector.svelte        # Dropdown pemilih varian style visual
│   │   │   ├── layer/
│   │   │   │   ├── AddNodeDropdown.svelte      # Tombol nambah block section baru
│   │   │   │   └── layerPanel.helpers.ts       # Helper manipulasi susunan layer
│   │   │   ├── sections/
│   │   │   │   ├── header/
│   │   │   │   │   ├── AnnouncementBar.svelte  # Baris pengumuman di atas navigasi
│   │   │   │   │   ├── HeaderLogo.svelte       # Elemen visual logo website toko
│   │   │   │   │   └── HeaderNav.svelte        # Elemen menu navigasi toko
│   │   │   │   ├── hero/
│   │   │   │   │   └── HeroElementToolbar.svelte # Floating toolbar elemen teks/gambar hero
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
│   │   │   ├── DesignerBankWithdraw.svelte     # Form rekening bank & modal payout desainer
│   │   │   ├── DesignerMutationTable.svelte    # Tabel daftar mutasi keuangan desainer
│   │   │   ├── DesignerStatCards.svelte        # Ringkasan balance, komisi, & template terjual
│   │   │   ├── DesignerTemplateCard.svelte     # Kartu template buatan desainer (status review)
│   │   │   ├── DesignerWalletOverview.svelte   # Ringkasan dompet desainer & tombol withdraw
│   │   │   └── StatCard.svelte                 # Komponen modular card ringkasan statistik
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
│   │   │   └── payout.schema.ts                # Skema Zod nominal pengajuan payout desainer
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

---

## 📝 Analisis Struktur & Rekomendasi Perapihan

Secara umum, struktur projek sudah cukup rapi karena memisahkan logic (`services`), validasi (`schemas`), halaman (`pages`), dan komponen visual (`components`) berdasarkan peran/aktor (Admin, Designer, Tenant, Public).

### 🔍 Folder Kosong & Kegunaannya:
1. **`src/lib/errors/`**:
   - **Tujuan**: Menyimpan kelas error kustom dan handler error terpusat.
   - **Rekomendasi Berkas**:
     - `AppError.ts`: Base class error kustom.
     - `errorFormatter.ts`: Utilitas pemformat error terstandar untuk API Response (`{ success: false, error: { code, message } }`).
2. **`src/lib/routes/`**:
   - **Tujuan**: Lokasi definisi rute URL secara statis agar tidak terjadi hardcode rute di seluruh komponen.
   - **Rekomendasi Berkas**:
     - `paths.ts`: Konstanta semua rute aplikasi (misal `ADMIN_DASHBOARD = '/admin'`, `DESIGNER_WALLET = '/designer/wallet'`).
3. **`src/lib/auth/`**:
   - **Tujuan**: Merapikan berkas otentikasi. Saat ini `auth.ts` dan `auth-client.ts` tercecer di root `src/lib/`.
   - **Rekomendasi Aksi**: Pindahkan `src/lib/auth.ts` dan `src/lib/auth-client.ts` ke dalam `src/lib/auth/`.

### 💡 Struktur Folder Rekomendasi (Usulan Perbaikan Lengkap):

Berikut adalah struktur usulan ideal untuk meningkatkan konsistensi peran, skalabilitas, dan kemudahan maintain aplikasi ke depan (tanpa menyentuh `.agents`, `docs`, dan `drizzle`):

```
umkm-site-builder/
├── public/                                     # Aset statis murni publik (logo, favicon, gambar)
│
├── src/                                        # Kode Sumber Utama
│   ├── components/                             # Komponen UI Svelte modular
│   │   ├── admin/                              # Komponen UI khusus Admin / Superadmin
│   │   ├── designer/                           # Komponen UI khusus Desainer Template
│   │   ├── tenant/                             # [PENYATUAN] Gabungan folder 'tenant' & 'dashboard'
│   │   │   ├── categories/                     # Manajemen Kategori Produk
│   │   │   ├── products/                       # CRUD Produk Toko Tenant
│   │   │   ├── settings/                       # Pengaturan visual & WA website toko
│   │   │   └── onboarding/                     # Setup subdomain tenant toko baru
│   │   ├── auth/                               # Form login & registrasi terpadu
│   │   ├── builder/                            # Editor Visual No-Code (Hero, Catalog, dll)
│   │   ├── checkout/                           # Tampilan modal & status bayar lunas pembeli
│   │   └── ui/                                 # Komponen atomik global reusable (Button, Input, Toast)
│   │
│   ├── db/                                     # Lapisan database ORM Drizzle
│   │   ├── index.ts                            # Inisialisasi client database
│   │   └── schema.ts                           # Skema relasi tabel database
│   │
│   ├── layouts/                                # Master layout pembungkus halaman Astro
│   │   ├── BaseLayout.astro                    # Layout halaman publik
│   │   ├── AdminLayout.astro                   # Layout panel admin
│   │   ├── DesignerLayout.astro                # Layout panel desainer
│   │   └── TenantLayout.astro                  # Layout panel dashboard tenant
│   │
│   ├── lib/                                    # Pustaka pembantu & SDK client
│   │   ├── auth/                               # [PINDAHAN] Modul autentikasi BetterAuth
│   │   │   ├── client.ts                       # Pindahan dari src/lib/auth-client.ts
│   │   │   └── server.ts                       # Pindahan dari src/lib/auth.ts
│   │   ├── errors/                             # [BARU] Custom Error Handling
│   │   │   ├── AppError.ts                     # Kelas error kustom (Unauthorized, Forbidden)
│   │   │   └── errorFormatter.ts               # Handler formatting standard API error response
│   │   ├── routes/                             # [BARU] Route Paths Constants (Anti-Hardcode)
│   │   │   └── paths.ts                        # Konstanta rute aman internal aplikasi
│   │   ├── media/                              # Modul media & file upload
│   │   │   └── cloudinary.ts                   # Klien API integration Cloudinary
│   │   └── utils/                              # Helper pemformatan data global
│   │       ├── currency.ts                     # Format IDR Rupiah utility
│   │       └── format.ts                       # Format tanggal, angka, & waktu
│   │
│   ├── pages/                                  # Astro Pages Router (File-Based)
│   │   ├── admin/                              # Halaman dashboard & approval admin
│   │   ├── designer/                           # Halaman draf template & wallet desainer
│   │   ├── tenant/                             # [KONSISTENSI URL] Halaman dashboard toko tenant
│   │   ├── public/                             # Halaman tamu (landing page, katalog, checkout)
│   │   └── api/                                # API Endpoint (Struktur sudah sangat rapi)
│   │       ├── admin/                          # POST/GET khusus Administrator
│   │       ├── tenant/                         # POST/GET khusus Penyewa Toko (transaksi/setup)
│   │       ├── designer/                       # POST/GET khusus Desainer Template
│   │       ├── public/                         # POST/GET tanpa proteksi role (lunas/katalog)
│   │       └── auth/                           # Handler BetterAuth callback
│   │
│   ├── schemas/                                # Skema Validasi Zod
│   │   ├── admin/                              # Validasi setting komisi platform
│   │   ├── designer/                           # Validasi bank-account & withdraw
│   │   ├── tenant/                             # Validasi form produk & kategori
│   │   └── public/                             # Validasi input umum tamu / auth
│   │
│   ├── services/                               # Lapisan Pure Business Logic (Domain)
│   │   ├── finance/                            # Logika bagi hasil, payout, & webhook lunas
│   │   └── templates/                          # Logika database template & status review
│   │
│   └── types/                                  # TypeScript Type Declarations
│       ├── auth/
│       ├── finance/
│       └── templates/
│
├── tests/                                      # Pengujian Vitest (Struktur Sejajar Src)
│   ├── api/                                    # Tes Fungsionalitas API Route
│   │   ├── admin/
│   │   ├── tenant/
│   │   ├── designer/
│   │   └── public/
│   ├── services/                               # Tes Logic Bisnis (Finance, Template)
│   ├── schemas/                                # Tes Validasi Input Data Zod
│   └── integration/                            # Tes Alur e2e (Marketplace & Purchase)
│
├── astro.config.mjs                            # Konfigurasi integrasi adapter & compiler Astro
├── drizzle.config.ts                           # Konfigurasi sinkronisasi skema db Drizzle
├── package.json                                # Bun/npm scripts & dependensi pihak ketiga
├── tailwind.config.mjs                         # Styling tokens framework Tailwind CSS
└── vitest.config.ts                            # Parameter runner Vitest unit tests
```

---

## 📊 Analisis Perbandingan & Rencana Aksi Perapihan

Berikut adalah tabel perbandingan antara struktur saat ini dengan struktur usulan rekomendasi, beserta rencana aksi konkret untuk merealisasikannya:

### 1. Tabel Perbandingan Struktur & Perubahan Krusial

| Folder Asal (Saat Ini) | Folder Tujuan (Rekomendasi) | Alasan Perubahan / Perbaikan | Status Perapihan |
| :--- | :--- | :--- | :--- |
| `src/components/dashboard/` & `src/components/tenant/` | `src/components/tenant/` | Penyatuan duplikasi folder peran tenant toko (dashboard & tenant terpisah membingungkan). | Perlu Rencana Aksi |
| `src/components/shared/ImageUpload.svelte` | `src/components/ui/ImageUpload.svelte` | Memindahkan UI atomik global ke dalam folder `ui/` terpadu agar `shared/` bisa dihapus. | Perlu Rencana Aksi |
| `src/components/ui/ToastContainer.svelte` | `src/components/ui/` | Folder `ui/` diperluas menjadi perpustakaan komponen atomik kustom (Button, Input, dll). | Perlu Rencana Aksi |
| `src/lib/auth.ts` & `src/lib/auth-client.ts` | `src/lib/auth/server.ts` & `src/lib/auth/client.ts` | Melokalisasi otentikasi BetterAuth agar root `src/lib/` bersih dari berkas-berkas lepasan. | Perlu Rencana Aksi |
| `src/lib/errors/.gitkeep` (Kosong) | `src/lib/errors/AppError.ts` & `errorFormatter.ts` | Membuat kelas penanganan error kustom terpusat agar format API error seragam. | Perlu Rencana Aksi |
| `src/lib/routes/.gitkeep` (Kosong) | `src/lib/routes/paths.ts` | Membuat konstanta rute statis terpusat untuk menghindari hardcoding path URL. | Perlu Rencana Aksi |
| `src/lib/currency.ts` & `src/lib/utils/format.ts` | `src/lib/utils/` | Menggabungkan utilitas format uang rupiah dan formatting umum ke satu tempat terpadu. | Perlu Rencana Aksi |
| `src/pages/dashboard/` & `src/pages/onboarding/` | `src/pages/tenant/` | Konsistensi URL router. Mengganti `/dashboard` menjadi `/tenant` agar selaras dengan role tenant. | Perlu Rencana Aksi |
| `src/pages/builder/` | `src/pages/designer/builder/` (atau tetap) | Memindahkan tool builder ke dalam namespace peran desainer karena hanya desainer yang membuat template. | Perlu Rencana Aksi |
| `tests/...` (Struktur campur) | `tests/...` | Menyeimbangkan dan menyamakan struktur folder file tes agar 100% cocok dengan `src/`. | Perlu Rencana Aksi |

---

### 2. Daftar Rencana Aksi Konkret (Action Items)

Untuk bertransisi dari versi saat ini ke versi terbersih di atas, berikut langkah-langkah kerja yang harus dilakukan:

- [ ] **Langkah 1: Restrukturisasi `src/lib/`**
  - Buat folder `src/lib/auth/`. Pindahkan `auth.ts` ke `auth/server.ts` dan `auth-client.ts` ke `auth/client.ts`. Update semua import referensi auth.
  - Buat berkas `src/lib/errors/AppError.ts` dan `src/lib/errors/errorFormatter.ts`.
  - Buat berkas `src/lib/routes/paths.ts` dan daftarkan rute utama.
  - Pindahkan `src/lib/currency.ts` ke `src/lib/utils/currency.ts`.

- [ ] **Langkah 2: Penyatuan Komponen UI Tenant (`src/components/`)**
  - Pindahkan isi `src/components/dashboard/` (CategoryManager, DashboardNavbar, Sidebar, StoreSettingsForm) ke dalam `src/components/tenant/`.
  - Pindahkan `src/components/shared/ImageUpload.svelte` ke `src/components/ui/ImageUpload.svelte` dan hapus folder `shared/`.
  - Sesuaikan semua path import komponen di halaman dashboard / tenant.

- [ ] **Langkah 3: Konsistensi Rute Halaman Tenant (`src/pages/`)**
  - Ubah folder `src/pages/dashboard/` menjadi `src/pages/tenant/`.
  - Ubah semua rute redirect di login helper, BetterAuth hooks, dan middleware dari `/dashboard` menuju ke `/tenant`.
  - Pindahkan halaman onboarding penyewa ke `/tenant/onboarding.astro`.

- [ ] **Langkah 4: Penyesuaian Berkas Pengujian (`tests/`)**
  - Pindahkan dan sesuaikan letak berkas-berkas di dalam folder `tests/` agar strukturnya sama persis dengan folder `src/` yang baru.
  - Jalankan `bun run type-check` dan `bun run test:unit` untuk memverifikasi fungsionalitas sistem berjalan 100% normal tanpa ada import pecah.
```

---

## 🎨 Analisis Kode CSS Manual & Rencana Standardisasi

Berikut adalah temuan berkas-berkas di fitur **Platform Settings, Transaksi, dan Template** yang masih menuliskan kode CSS manual (seperti ukuran pixel ad-hoc `text-[px]`, font weight inline, dan warna hardcoded seperti `text-indigo-600` / `bg-emerald-50` / `text-slate-900`) beserta solusi standardisasinya menggunakan utility classes terpusat di `global.css`.

### 1. Daftar Temuan Berkas & CSS Manual

#### A. Fitur Platform Settings
- **`src/components/admin/CommissionSettingsPanel.svelte`**
  - *Temuan awal*: Menggunakan `text-[13px]`, `text-[11px]` untuk ukuran teks manual, border accent manual seperti `border-t-indigo-400`, `border-t-emerald-400`, dan warna manual seperti `text-indigo-600` / `bg-emerald-500/10` / `bg-indigo-600`.
  - *Status*: **SUDAH DIPERBAIKI** dengan beralih ke variabel desain global (`text-sm`, `text-xs`), menggunakan `.border-accent-*` global, dan mendelegasikan warna button/alert ke class semantic daisyUI (`btn-primary`, `alert-success`, `alert-error`).

#### B. Fitur Transaksi & Checkout
- **`src/components/checkout/PaymentModal.svelte`**
  - *Temuan*: Menggunakan utility warna manual: `bg-emerald-500/10`, `text-emerald-600`, `bg-amber-500/10`, `text-amber-600`. Ukuran teks ad-hoc `text-[12px]`, `text-[13px]`.
- **`src/components/checkout/TransactionStatus.svelte`**
  - *Temuan*: Menggunakan warna manual `bg-emerald-500/10` dan ukuran teks ad-hoc `text-[12px]`, `text-[14px]`.
- **`src/pages/checkout/[invoiceId].astro`**
  - *Temuan*: Menggunakan teks pixel manual `text-[48px]`, `text-[16px]`, `text-[11px]`, `text-[18px]`, `text-[10px]`, `text-[14px]`. Warna manual seperti `text-rose-500`, `text-emerald-500`, `text-slate-500`.

#### C. Fitur Katalog & Builder Template
- **`src/components/admin/TemplateReviewPanel.svelte`**
  - *Temuan*: Ukuran teks ad-hoc `text-[13px]`, `text-[11px]`, warna manual `bg-indigo-600`, `hover:bg-indigo-700`, `text-indigo-600`, `bg-emerald-500/10`, `text-emerald-600`.
- **`src/components/designer/DesignerTemplateCard.svelte`**
  - *Temuan*: Ukuran teks ad-hoc `text-[11px]`, `text-[13px]`. Warna manual `bg-indigo-600`, `bg-emerald-500/10`.
- **`src/components/ui/StatCard.svelte`**
  - *Temuan*: Ukuran teks ad-hoc `text-[20px]`, `text-[10px]`, `text-[26px]`, `text-[11px]`.
- **`src/pages/templates/index.astro` / `src/pages/public/templates/index.astro`**
  - *Temuan*: Menggunakan warna manual `bg-emerald-500/10`, `text-emerald-600`, `bg-amber-500/10`, `text-amber-600`, `bg-rose-500/10`, `text-rose-600`. Teks pixel manual `text-[10px]`, `text-[16px]`.
- **`src/pages/designer/templates.astro`**
  - *Temuan awal*: Menggunakan button manual `bg-indigo-600 hover:bg-indigo-700 text-[13px]` dan border accent manual `border-t-indigo-400`.
  - *Status*: **SUDAH DIPERBAIKI** dengan beralih ke `.btn-primary` dan `.border-accent-*` global.

---

### 2. Panduan Solusi Standardisasi (Definisi di `global.css`)

Untuk merapikan sisa file-file di atas tanpa menuliskan kode CSS manual berulang kali, ikuti aturan kelas global yang telah didefinisikan di `src/styles/global.css`:

#### A. Border Accent & Stat Card Top Border
Gunakan kelas `.border-accent-*` daripada menulis `border-t-2 border-t-...-400` manual:
```css
/* Sudah didefinisikan di global.css */
.border-accent-primary {
  border-top-width: 2px !important;
  border-top-style: solid !important;
  border-top-color: var(--color-primary) !important;
}
.border-accent-success {
  border-top-width: 2px !important;
  border-top-style: solid !important;
  border-top-color: var(--color-success) !important;
}
.border-accent-warning {
  border-top-width: 2px !important;
  border-top-style: solid !important;
  border-top-color: var(--color-warning) !important;
}
.border-accent-error {
  border-top-width: 2px !important;
  border-top-style: solid !important;
  border-top-color: var(--color-error) !important;
}
.border-accent-muted {
  border-top-width: 2px !important;
  border-top-style: solid !important;
  border-top-color: var(--color-text-light) !important;
}
```

#### B. Semantic Text Colors
Gunakan kelas `.text-primary`, `.text-success`, dll., daripada warna hex/Tailwind hardcoded (`text-indigo-600`, `text-emerald-500`, dll.):
```css
/* Sudah didefinisikan di global.css */
.text-primary { color: var(--color-primary) !important; }
.text-success { color: var(--color-success) !important; }
.text-error { color: var(--color-error) !important; }
.text-warning { color: var(--color-warning) !important; }
.text-info { color: var(--color-info) !important; }
```

#### C. DaisyUI & Global Text Sizes
- **Teks pixel manual `text-[13px]` atau `text-[11px]`** harus diganti dengan kelas standar sistem tipografi Tailwind:
  - `text-[10px]` / `text-[11px]` -> Ganti dengan `text-xs` (atau `.text-xs` yang setara 0.75rem / 12px).
  - `text-[13px]` -> Ganti dengan `text-sm` (atau `.text-sm` yang setara 0.875rem / 14px).
  - `text-[14px]` / `text-[15px]` -> Ganti dengan `text-sm`.
- **Button Utama**: Selalu gunakan `.btn .btn-primary` (atau kelas tombol daisyUI bawaan lainnya seperti `.btn-secondary`, `.btn-ghost`) agar mewarisi warna tema secara konsisten di light/dark mode tanpa menyisipkan utility warna manual.

