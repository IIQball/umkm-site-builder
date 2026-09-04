# UMKM Site Builder

Status: KICKOFF COMPLETE · Next: Phase 1 Foundation Build

<!-- ABOUT:START -->
A no-code SaaS web builder designed for Indonesian micro-enterprises (UMKM). Business owners launch professional websites and product catalogs in under 5 minutes with zero technical skill required. The platform provides a centralized directory where customers discover local stores, and a visual template marketplace where UI designers earn commission by selling reusable designs to UMKM. Payments flow directly to WhatsApp; no backend checkout required.

**Stack:** Cloudflare (host) · Astro (meta-framework) · Svelte (UI) · Vite (build) · Bun (runtime) · Drizzle (ORM) · Neon (database) · Vitest (testing) · Zod (validation) · BetterAuth (auth) · daisyUI (components) · Lucide (icons) · Xendit (payments) · Cloudinary (media).

**Current stage:** Specification complete; architectural decisions locked. All 17 design docs written (personas, journeys, data model, permissions matrix, API spec, security, testing strategy). Ready to start implementation (Phase 1: auth, payments, database setup).
<!-- ABOUT:END -->

---

## PRD — Detailed Specification

For implementation, refer to `docs/` (see table below). This README retains the original problem statement for reference.

---

## 1. What is this
SaaS Web Builder tanpa kode (no-code) khusus untuk UMKM di Indonesia. Sistem ini memungkinkan pemilik usaha kecil untuk memublikasikan situs web/katalog produk mereka sendiri dengan subdomain instan. Platform ini juga menyediakan landing page utama dengan direktori/katalog publik berisi card seluruh toko UMKM yang terdaftar, di mana pengunjung dapat mengeklik card tersebut untuk langsung menuju ke subdomain toko masing-masing. Selain itu, platform ini berfungsi sebagai marketplace bagi desainer antarmuka untuk membuat, mengunggah, dan memonetisasi template web mereka kepada UMKM.

## 2. Problem
Pembuatan website profesional terlalu mahal bagi UMKM, dan platform konvensional seperti WordPress/Shopify terlalu rumit (butuh pemahaman hosting, DNS, atau plugin). Di sisi lain, desainer UI/UX lokal kekurangan platform langsung untuk menjual rancangan template fungsional mereka langsung ke pengguna akhir yang membutuhkan.

## 3. Goals
- UMKM dapat memiliki web publik dan katalog produk interaktif dalam waktu kurang dari 5 menit tanpa perlu keahlian teknis.
- Halaman platform utama menyediakan direktori terpusat bagi publik untuk menjelajahi dan menemukan seluruh toko UMKM terdaftar.
- Desainer mendapatkan penghasilan pasif (komisi) dari setiap template berbayar yang digunakan oleh UMKM.
- Transaksi semulus mungkin: pesanan pembeli pada katalog UMKM langsung diarahkan ke WhatsApp (`wa.me`) dengan pesan yang sudah terformat otomatis.

## 4. Non-goals (explicitly out of scope)
- Tidak ada sistem checkout gateway backend atau sistem keranjang (cart) kompleks di dalam web toko UMKM. Saat pengunjung menekan tombol beli/pesan pada produk, sistem menggunakan client-side redirect ke WhatsApp dengan template pesan kosong yang siap diisi pembeli (Nama, Nomor telepon, Alamat, Barang yang dipesan, Opsi pengantaran, Catatan).
- Tidak ada akses modifikasi source code (HTML/CSS/JS kustom) bagi Tenant. Desainer juga hanya menyusun pre-built sections yang sudah di-hardcode di sistem utama.
- Bukan marketplace terpusat transaksi (seperti Tokopedia). Setiap toko beroperasi secara mandiri di bawah subdomainnya sendiri.

## 5. User personas
### Persona A — Tenant (Pemilik UMKM)
- **Context:** Pelaku usaha kecil, mobilitas tinggi, terbiasa menggunakan HP, tingkat literasi teknologi menengah ke bawah.
- **Needs:** Halaman web instan yang langsung jadi (disiapkan oleh Admin di awal), pengelolaan produk mudah, dan antarmuka builder yang visual.
- **Pain:** Frustrasi dengan kerumitan teknis (hosting, domain, setup awal) dan biaya jasa developer mahal.

### Persona B — Designer
- **Context:** Berpengalaman dalam tata letak (layout) dan desain UI.
- **Needs:** Antarmuka untuk menyusun komponen visual menjadi template utuh, dan dasbor penarikan komisi yang otomatis via API.
- **Pain:** Sulit mencari klien UMKM secara individu.

### Persona C — Admin / Superadmin
- **Context:** Pengelola platform SaaS.
- **Needs:** Dasbor untuk mendaftarkan akun, melihat status pembayaran tagihan tenant, menetapkan profil toko dan subdomain (dengan memfilter blacklist), serta memantau alur finansial.

## 6. User stories
- As a Visitor, I want to browse a directory of all registered UMKM stores on the main platform page, so that I can discover local stores and click through to their subdomains.
- As a Tenant, I want my initial store layout to be set up automatically by the Admin after I pay the activation fee, so that I don't have to build it from scratch.
- As a Buyer (Store Visitor), I want to click a product and be redirected to WhatsApp with a pre-filled message template, so that I can easily send my order details.
- As a Designer, I want to drag and drop pre-built sections to create a template, so that I don't have to write frontend code to sell my designs.
- As an Admin, I want to configure subdomains for paid tenants while preventing the use of blacklisted keywords, so that system routing remains secure.

## 7. User journeys
### Journey — Concierge Registration & Setup
1. Admin mendaftarkan akun (Tenant/Designer) melalui Dasbor Admin hanya dengan memasukkan Email dan Role (tanpa password).
2. Sistem otomatis mengirimkan tautan aktivasi berbatas waktu (maks 24 jam) ke email pengguna.
3. Pengguna mengeklik tautan, mengatur password, dan akun menjadi aktif.
4. KHUSUS TENANT: Tenant login ke Dasbor mereka dan **wajib** membayar tagihan aktivasi satu kali (one-time fee) via antarmuka Xendit API sebelum bisa mengakses fitur lain. 
5. Setelah pembayaran lunas, notifikasi masuk ke Admin.
6. Admin masuk ke Dasbor dan membuatkan profil toko (1 Tenant = 1 Toko limit) dengan memasukkan Nama Toko, Subdomain (memfilter blacklist), Nomor WA, dan menautkan Template Default.
7. Saat toko disimpan oleh Admin, sistem otomatis menyuntikkan JSON Blueprint bawaan ke toko tersebut. Toko langsung aktif dan masuk ke direktori publik.
8. KHUSUS DESIGNER: Setelah akun aktif, Designer langsung mendapat akses ke dasbor untuk mulai membuat dan menjual template tanpa harus membayar tagihan aktivasi.

### Journey — Visitor Store Discovery & Purchase
1. Pengunjung membuka halaman utama platform SaaS.
2. Pengunjung melihat grid/katalog berisi card toko-toko UMKM yang terdaftar, lalu mengeklik salah satu card.
3. Pengunjung di-redirect ke subdomain toko tersebut.
4. Pengunjung mengeklik tombol beli pada sebuah produk.
5. Pengunjung dialihkan ke URL `wa.me` pemilik toko dengan teks template pesanan otomatis.

### Journey — Split-Screen Visual Builder
1. Designer (membuat template) atau Tenant (mengedit toko) masuk ke mode Builder.
2. Layar terbelah: Panel konfigurasi (kiri) dan Live Preview (kanan).
3. Pengguna mengubah posisi komponen, warna, atau teks. Panel Preview merender perubahan seketika (Client-side state).
4. Pengguna menekan "Simpan", konfigurasi dikonversi ke JSONB (lengkap dengan atribut versi) dan dikirim ke database.

## 8. Acceptance criteria
- [ ] Given an Admin finalizing a store setup, when inputting a subdomain, then the system must reject inputs that match a predefined system blacklist (e.g., `www`, `admin`, `api`).
- [ ] Given a new store creation, when initialized, then the system injects a default JSON blueprint (Header, Hero, Features, Catalog, Testimonial, FAQ, Footer) containing a versioning attribute.
- [ ] Given a visitor accessing the main platform page, when viewing the directory section, then a grid of active UMKM store cards is rendered.
- [ ] Given a store card in the directory, when clicked by a visitor, then the browser navigates directly to the store's respective subdomain.
- [ ] Given a tenant registered `kopi-budi`, when visitors access `kopi-budi.domain.com`, then the public layout renders completely within 1 second using Astro SSR.
- [ ] Given a successful payment webhook from Xendit, when received, then the system must verify the transaction ID is unique (idempotent) before updating tenant payment status.
- [ ] Given a buyer clicking a product purchase button, when clicked, then it opens WhatsApp with a pre-filled text template requesting Name, Phone, Address, Product, Delivery Option, and Notes.
- [ ] Given backend logic, when tested with Vitest, then passing unit tests must exist specifically for Zod schema validation (JSONB/Inputs).

## 9. Roles and permissions
| Role | Can | Cannot |
|---|---|---|
| Superadmin | Kelola admin, memantau audit log | Membeli template untuk diri sendiri |
| Admin | Set subdomain awal setelah pembayaran lunas, setujui/tolak template, mengawasi payout otomatis | Mengelola akun Superadmin/Admin lainnya |
| Designer | Buat template visual, kelola dompet, ajukan tarik dana (payout) | Mengakses dasbor manajemen toko |
| Tenant | Edit 1 tokonya sendiri via builder, atur produk, membeli template | Mengubah nama subdomain setelah diatur oleh Admin |

## 10. Data
- **Auth:** `users`, `sessions`, `accounts`, `verifications` (Struktur BetterAuth standar).
- **Security:** `admin_whitelist`, `subdomain_blacklist`.
- **Finance/Designer:** `designers`, `wallets`, `wallet_mutations`, `bank_accounts`, `payout_requests`, `commissions`.
- **Tenant/Stores:** `stores` (1 Tenant = 1 Store limit), `store_categories`, `products`.
- **Templates:** `templates` (master), `user_templates` (kepemilikan). Transaksi via `transactions`. **Catatan Wajib:** Sistem harus menyertakan skrip *Database Seeding* yang menciptakan satu data *record* "System Default Template" pada tabel ini saat rilis awal, sehingga ID-nya dapat digunakan oleh Admin saat setup toko.
- **Configuration:** Disimpan murni sebagai JSONB pada entitas `templates` dan `stores`. WAJIB menyertakan atribut `version` (integer) di dalam struktur JSON untuk keperluan migrasi skema di masa depan (Forward Compatibility).

## 11. Workload shape
- **Read-heavy or write-heavy?** Sangat Read-Heavy (fokus pada render halaman publik toko dan direktori utama).
- **Roughly how many records get written on a busy day?** Ribuan (pembaruan data produk, log pesanan WA, pencatatan log aktivitas).
- **Anything realtime?** Tidak ada WebSocket. Refresh-to-see-changes memadai untuk backend. Live preview murni menggunakan client-side state.
- **Search?** Pencarian berbasis keyword sederhana untuk direktori toko dan katalog produk.
- **Any AI features?** Tidak ada.
- **Flexible per-record data?** Ya, komponen desain disimpan dalam kolom `config` / `customization` (JSONB versi).
- **Will this sit idle for weeks between demos or seasons?** Tidak.
- **How many separate projects will your team run on the same vendor account?** 1 proyek (Multi-tenant architecture).

## 12. Media
- **What actually gets uploaded?** Gambar produk, thumbnail template, logo/banner toko. Format yang diizinkan hanya JPG, JPEG, dan PNG dengan batas ukuran maksimal 5MB per unggahan (client-side validation).
- **Do images need resizing or cropping on the fly?** Ya. Sistem wajib mengonversi seluruh gambar ke format WebP secara otomatis dengan kompresi maksimal menjadi 200KB per gambar untuk menghemat penyimpanan dan bandwidth.
- **Any video?** Tidak ada.
- **Roughly how much gets viewed per month?** Bandwidth menengah ke rendah. Strategi caching di level CDN (Cloudflare) wajib dioptimalkan.
- **How many sizes of the same image does the design need?** Maksimal 2-3 ukuran esensial (Thumbnail, Hero/Card, Original) untuk menekan biaya transformasi.
- **Who uploads?** Admin/Tenant (Produk) dan Designer (Template).
- **Public, private, or both?** Seluruh aset media bersifat Publik.
- **How much storage after a year?** Kurang dari 5GB. Dikelola ketat untuk batas Free Tier Cloudinary (25 credits/bulan).

## 13. Integrations and external services
- **Payment Gateway (Inbound):** Xendit API & Webhooks (untuk aktivasi pendaftaran awal & pembelian template).
- **Payment Gateway (Outbound/Disbursement):** Xendit Payouts API (untuk pencairan dana komisi otomatis ke desainer).
- **Media Storage:** Cloudinary (Server-signed uploads).
- **Database:** Neon PostgreSQL Serverless.
- **Authentication:** BetterAuth (Google OAuth 2.0 & Email Magic Link/Password).

## 14. Constraints
- **Stack Wajib:** Cloudflare, Astro, Svelte, Vite, Bun, Drizzle, daisyUI, Vitest, Zod, BetterAuth.
- **Database Driver:** WAJIB menggunakan **Neon Serverless Driver** (berbasis HTTP/WebSocket) untuk Drizzle ORM agar kompatibel dengan lingkungan Edge Cloudflare Workers (menghindari limitasi TCP).
- **Media:** Cloudinary Free Tier (G7). Wajib mengimplementasikan **Soft & Hard Delete Sinkronisasi**: Jika sebuah record gambar dihapus (atau di-replace) di database, backend wajib memanggil API penghapusan Cloudinary untuk mencegah penumpukan file yatim (orphan files). Jika upload gambar ke Cloudinary berhasil namun transaksi penyimpanan ke database Neon gagal, file di Cloudinary tersebut wajib langsung di-hard delete (rollback).
- **Validasi Ketat (Zero Trust):** Semua input (formulir, password, payload API) dan khususnya struktur JSONB dari visual builder WAJIB divalidasi menggunakan Zod dan mendeteksi atribut versi sebelum menyentuh database Drizzle.
- **Idempotensi Webhook:** Endpoint Xendit Webhook wajib memiliki mekanisme pengecekan duplikasi transaksi untuk mencegah double-spending/double-crediting.
- **Resolusi MVP Subdomain:** Rute subdomain disimulasikan menggunakan deteksi parameter host header di level Astro SSR (middleware). Pengaturan Wildcard DNS standar `*` dilakukan di panel Cloudflare (mencakup Universal SSL).

## 15. Must not be pushed to GitHub
- Variabel lingkungan rahasia (`.env`).
- API Keys & rahasia webhook (Xendit).
- Kredensial Database (Neon URL).
- Kredensial Media (Cloudinary Secret).
- Kredensial OAuth (Google Client ID/Secret, BetterAuth Secret).

## 16. Open questions
- Tidak ada. Seluruh keputusan arsitektur awal, limitasi storage, dan alur operasional onboarding MVP sudah ditetapkan secara definitif.