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
│   │   │   └── CommissionSettingsPanel.svelte  # Form fee %, minimum payout, & settlement delay
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
│   │   │   ├── NewTemplateForm.svelte          # Form pembuatan template draft desainer
│   │   │   └── SubmitReviewModal.svelte        # Modal pengajuan review template ke admin
│   │   ├── checkout/
│   │   │   ├── PaymentModal.svelte             # Modal pembayaran invoice Xendit
│   │   │   └── TransactionStatus.svelte        # Status tagihan invoice (polling & status badge)
│   │   ├── common/
│   │   │   ├── Navbar.astro                    # Navigasi utama header base layout
│   │   │   └── ThemeToggle.astro               # Tombol pengubah dark mode / light mode
│   │   ├── dashboard/
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
│   │   ├── tenant/
│   │   │   ├── ProductDeleteModal.svelte       # Dialog konfirmasi penghapusan produk
│   │   │   ├── ProductFormModal.svelte         # Modal tambah/edit data produk toko
│   │   │   ├── ProductTable.svelte             # Tabel daftar produk dagangan tenant
│   │   │   ├── ProductTableRow.svelte          # Baris data produk toko tenant
│   │   │   └── StoreManager.svelte             # Panel monitoring list toko tenant
│   │   └── ui/
│   │       └── ToastContainer.svelte           # Container penampil alert melayang (toast)
│   │
│   ├── db/                                     # Integrasi Drizzle ORM
│   │   ├── index.ts                            # Inisialisasi koneksi Drizzle Neon Serverless
│   │   ├── schema.ts                           # Skema tabel database (users, stores, wallets)
│   │   └── seed.ts                             # Skrip otomatisasi pengisian data awal (seeding)
│   │
│   ├── layouts/                                # Master layout pembungkus halaman Astro
│   │   ├── BaseLayout.astro                    # Layout dasar HTML publik
│   │   └── DashboardLayout.astro               # Layout panel dashboard & kontrol internal
│   │
│   ├── lib/                                    # Kumpulan pustaka pembantu & inisialisasi SDK
│   │   ├── config/
│   │   │   └── app.ts                          # Konfigurasi nama aplikasi & tautan menu navigasi
│   │   ├── db/
│   │   │   └── client.ts                       # Klien koneksi Drizzle & tipe DbExecutor
│   │   ├── errors/
│   │   │   └── .gitkeep                        # Penahan folder
│   │   ├── finance/
│   │   │   ├── index.ts                        # Ekspor modul finansial
│   │   │   └── xendit.ts                       # Klien SDK Xendit untuk e-invoice & disbursement
│   │   ├── routes/
│   │   │   └── .gitkeep                        # Penahan folder
│   │   ├── stores/
│   │   │   └── schemas.ts                      # Skema pembantu frontend store
│   │   ├── utils/
│   │   │   └── format.ts                       # Fungsi formatter mata uang IDR & waktu
│   │   ├── auth-client.ts                      # Klien inisialisasi auth BetterAuth (frontend)
│   │   ├── auth.ts                             # Konfigurasi server BetterAuth & database adapter
│   │   ├── cloudinary.ts                       # Pembantu upload gambar aman ke Cloudinary
│   │   ├── currency.ts                         # Utilitas manipulasi nilai rupiah
│   │   └── toast.ts                            # State store penampil alert notifikasi melayang
│   │
│   ├── pages/                                  # Rute URL halaman file-based routing Astro
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── index.astro                 # Halaman panel konfigurasi komisi & delay admin
│   │   │   └── templates/
│   │   │       └── index.astro                 # Halaman approval pengajuan template desainer
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── settings/
│   │   │   │   │   └── commission.ts           # GET & PUT parameter komisi & settlement delay
│   │   │   │   └── templates/
│   │   │   │       ├── index.ts                # GET daftar template yang membutuhkan review
│   │   │   │       └── [id]/
│   │   │   │           └── review.ts           # POST menyetujui / menolak template desainer
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
│   │   │   │   └── payout.ts                   # GET riwayat & POST pengajuan penarikan dana
│   │   │   ├── media/
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
│   │   ├── templates/
│   │   │   └── index.astro                     # Halaman pasar katalog template market
│   │   ├── 401.astro                           # Halaman error 401 Unauthorized
│   │   ├── 403.astro                           # Halaman error 403 Forbidden
│   │   ├── 404.astro                           # Halaman rute URL tidak ditemukan
│   │   ├── index.astro                         # Halaman beranda promosi utama platform
│   │   ├── login.astro                         # Halaman login multi-role
│   │   ├── register.astro                      # Halaman pendaftaran tenant baru
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
│   │   │   └── payout.test.ts                  # Uji API pencairan komisi desainer
│   │   ├── products/
│   │   │   └── index.test.ts                   # Uji API CRUD produk toko tenant
│   │   ├── public/
│   │   │   ├── templates/
│   │   │   │   └── index.test.ts               # Uji API katalog template publik
│   │   │   └── commission.test.ts              # Uji API pembacaan komisi untuk publik
│   │   ├── webhooks/
│   │   │   └── xendit.test.ts                  # Uji penanganan webhook e-invoice Xendit
│   │   ├── check-subdomain.test.ts             # Uji validasi subdomain input Zod
│   │   └── media-sign.test.ts                  # Uji Cloudinary signed upload generator
│   ├── finance/
│   │   ├── commission-and-masking.test.ts      # Uji engine komisi & masking nominal rupiah
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
│   │   └── template.test.ts                    # Uji validasi Zod visual data template
│   └── transactions/
│       ├── e2e-template-marketplace-flow.test.ts # Uji e2e alur template (review -> beli -> lunas)
│       ├── template-purchase-flow.test.ts      # Uji transaksi pembayaran template desainer
│       └── wallet-and-fulfillment.test.ts      # Uji trigger pemenuhan invoice & kredit wallet
│
├── astro.config.mjs                            # Konfigurasi Astro Framework
├── drizzle.config.ts                           # Konfigurasi Drizzle ORM
├── package.json                                # Berkas dependensi npm & bun scripts
├── tailwind.config.mjs                         # Konfigurasi styling token Tailwind CSS
└── vitest.config.ts                            # Konfigurasi testing framework Vitest

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
