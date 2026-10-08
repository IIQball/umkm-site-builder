# Rules — Component & Hydration Patterns

## 1. Astro → Svelte island data bridge

- Server-fetched data (auth user, config, etc.) is passed to Svelte islands as a **serialized JSON string
  prop** (`userJson: string`).
- The island parses it synchronously at the top of its `<script>` block:
  ```ts
  const user: AuthenticatedUser = JSON.parse(userJson);
  ```
- Never pass raw objects as props across the Astro/Svelte boundary — Astro serializes them differently
  from what client-side Svelte expects and this causes hydration mismatches.
- Prop naming convention: `<entityName>Json` (e.g. `userJson`, `configJson`, `storeJson`).

## 2. Svelte `onMount` for browser-only APIs

- Anything accessing `localStorage`, `window.location`, `document`, or `window.matchMedia` MUST live
  inside `onMount()`. These APIs do not exist during SSR.
- Never call browser-only APIs at module level in a Svelte island — it will throw during server render.
- Import `onMount` from `'svelte'` at the top of the `<script>` block, not mid-script.

  ```ts
  import { onMount } from 'svelte'; // top of <script>
  onMount(() => {
    collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  });
  ```

## 3. `client:load` vs `client:only`

- `client:load` — interactive islands that benefit from SSR HTML (forms, navbars, sidebars, auth-aware
  UI). Hydrates immediately on page load.
- `client:only="svelte"` — canvas-heavy or browser-only components that have no meaningful SSR output
  (BuilderEditor, Canvas, heavy chart components). Skips SSR entirely.
- Never use `client:visible` on auth-gated or critical-path components — they flash briefly as
  unauthenticated before hydrating.

## 4. Svelte store vs prop for cross-component state

- If state is needed by a single island, use local Svelte `let` / `$:` reactivity.
- If state must be shared between two or more Svelte islands on the same page, use a Svelte writable
  store in `src/lib/stores/`.
- Do not share state between islands via URL params or DOM manipulation — use stores.

## 5. `{@const}` placement

- Svelte `{@const ...}` directives must be placed directly inside valid block tags (`{#if}`, `{#each}`,
  `{#await}`, etc.), never inside raw HTML elements like `<div>` or `<span>`.
- Wrong: `<div>{@const x = foo()}</div>`
- Right: `{#each items as item}{@const label = item.name.toUpperCase()}<span>{label}</span>{/each}`

## 6. Standarisasi Penggunaan Komponen Tombol (`Button.svelte`)

- **Wajib Menggunakan `Button.svelte` (`@/components/ui`)**:
  - Seluruh tombol aksi, navigasi, kontrol toolbar, panel inspector, dan modal di dashboard Admin, Designer, dan antarmuka Builder Shell WAJIB mengimpor dan menggunakan komponen `Button`:
    ```svelte
    import { Button } from '@/components/ui';
    ```
  - Gunakan prop yang telah disediakan: `variant` (`'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'dark' | 'orange' | 'tertiary'`), `size` (`'sm' | 'md' | 'lg' | 'xs' | 'icon'`), `loading`, `disabled`.
- **Pengecualian Kritis: Canvas Template Sections**:
  - Komponen varian seksi kanvas yang dirender di dalam storefront/preview kanvas (`src/components/builder/sections/*`) **DILARANG** menggunakan `Button.svelte` SaaS.
  - Komponen tersebut harus menggunakan tag native `<button>` agar dapat mewarisi token tema CSS dinamis tenant (`var(--theme-btn-*)`) secara murni tanpa intervensi DaisyUI platform SaaS.

## 7. Dynamic Hover & CSS Variables pada Komponen Section Builder

- **Dilarang JS Hover Closure**:
  - Dilarang mengandalkan helper function JS di template Svelte (misal `style={getLinkStyle(index)}` yang mengakses variabel `hoveredIdx` di dalam body fungsinya tanpa parameter) untuk kalkulasi warna/gaya hover.
  - Svelte static compiler tidak mendeteksi ketergantungan `hoveredIdx` jika tidak dioper secara eksplisit sebagai argumen, sehingga ekspresi template tidak di-render ulang saat kursor hover.
- **Wajib Scoped CSS + CSS Variables**:
  - Gunakan scoped `<style>`:
    ```svelte
    <style>
      .builder-nav-link:hover {
        color: var(--nav-item-hover-color) !important;
      }
    </style>
    ```
  - Deklarasikan custom properties secara inline pada elemen:
    ```svelte
    style="--nav-item-color: {activeNavColor}; --nav-item-hover-color: {activeNavHoverColor};"
    ```
  - Pendekatan ini menjamin latensi 0ms, native browser performance, 100% konsisten antar preset (desktop, tablet, mobile drawer), dan bekerja instan baik di sidebar preview maupun kanvas.

## 8. Contextual Node Inspector & Dynamic Spacing pada Builder Section

- **Contextual Inspector Form**:
  - Saat sub-elemen kanvas diklik (`$activeNodeId`), panel inspector wajib menampilkan panel khusus elemen tersebut (`*ElementNodePanel`), bukan form generik seperti `NodeStylesTab` yang berisikan kontrol redundan (seperti perataan teks atau skala tipografi golden ratio yang sudah diatur tema global).
  - Konten yang ditampilkan harus mencerminkan field yang sama persis dengan yang ada pada mode edit section lengkap (misal klik lencana $\rightarrow$ form teks lencana & ikon; klik judul $\rightarrow$ input judul & tag semantik).
- **Pembatasan Warna Teks Token**:
  - Pilihan warna teks token (`Warna Teks (Token)`) HANYA diizinkan muncul pada elemen berbasis teks (lencana, judul, subjudul, label tombol aksi).
  - Elemen visual/gambar (image card, logo gambar, avatar) DILARANG menampilkan dropdown warna teks token.
- **Margin Per Elemen (Atas-Bawah 8pt)**:
## 9. Layout Slots & Presets Synchronization pada Builder Sections

- **Strict Preset Elements Enforcement**:
  - Jika suatu preset layout tidak memiliki elemen tertentu secara default (misal preset `banner_inline_bar` pada fitur yang hanya memiliki `ribbon_bar` tanpa lencana, judul, atau subjudul), elemen tersebut DILARANG ditampilkan di:
    1. Sidebar kiri (daftar Lapisan / Node Tree).
    2. Sidebar kanan (Susunan Elemen Seksi / Slot Ordering).
    3. Tab Konten (form input teks/media).
  - Elemen hanya boleh tampil jika desainer/pengguna menambahkannya secara eksplisit melalui tombol "+ Tambah Elemen" di tab Layout.
- **Allowed Slots Whitelisting**:
  - Setiap seksi wajib menyediakan helper `getAllowed*Slots(preset)` yang menentukan elemen apa saja yang valid untuk ditambah pada preset tertentu.
- **Accessible Interactive Elements pada Kanvas**:
  - Dilarang memberikan `role="button"` langsung ke tag non-interaktif semantik seperti `<h2>` atau `<p>` (melanggar aturan a11y Svelte `a11y_no_noninteractive_element_to_interactive_role`).
  - Bungkus elemen teks dengan `<div data-node="..." role="button" tabindex="0">` yang menangani `keydown`, `click`, dan outline seleksi builder.

## 10. Layout-Aware Content & Per-Item Node Styling pada Builder Sections

Untuk setiap section builder yang mendukung banyak layout preset (seperti `product_catalog`, `testimonials`, `features`):

1. **Layout-Aware Content Gating**:
   - Menu dan form input di tab Konten (`*Content.svelte`) HARUS disinkronkan dengan kapabilitas layout preset aktif melalui helper SSOT (`is*Supported(preset)`).
   - Jangan tampilkan input kategori jika preset aktif tidak memiliki filter kategori (misal `grid_standard`, `bento`, `lookbook`).
   - Jangan tampilkan input tombol keranjang jika preset tidak mendukung keranjang belanja / e-commerce checkout.
   - Jangan tampilkan input foto/gambar jika preset bertipe teks murni atau tabel tabular tanpa gambar.
   - Input judul, subjudul, dan lencana hanya dirender jika slot tersebut ada di `elementOrder`.

2. **Per-Item Style Resolution**:
   - Komponen kontainer seksi dan preset harus menerima `nodeStyles: Record<string, Record<string, string>>`.
   - Gunakan helper pemecah style (contoh: `resolveProductNodeStyle(item, index, nodeStyles)`) dengan hirarki spesifisitas bertingkat: `item.id` > `item_slot_${index}` > `generic_slot`.
   - Nilai token warna teks CSS variable (`var(--theme-text-primary, ...)`) harus diterapkan langsung ke style inline elemen teks utama (`style={pStyle.color ? \`color: ${pStyle.color};\`: ''}`).

3. **Dedicated Element Node Panel**:
   - Ketika 1 item spesifik diklik pada kanvas atau dipilih lewat pohon layer, panel styles otomatis beralih ke sub-panel khusus item tersebut (`Produk #X: [Nama]`).
   - Perubahan style (warna token dan margin) pada produk tersebut hanya tersimpan dan berdampak pada item tersebut tanpa mengganggu style item lainnya.

## 11. Pemisahan Tegas Konten Node vs Styles Node (Single Responsibility)

Untuk setiap elemen builder ketika node dipilih di kanvas atau pohon layer:
1. **Tab Konten Node (`nodeTab === 'content'`)**:
   - Khusus menangani data & konten masukan pengguna: teks judul, subjudul, label tombol, link tujuan, upload gambar/ikon, dan urutan daftar item.
   - Menggunakan komponen form konten terdedikasi (`*NodeForms.svelte`).
   - DILARANG memuat kontrol gaya visual (seperti color picker, margin slider, shape, frame gambar).
2. **Tab Styles Node (`nodeTab === 'styles'`)**:
   - Khusus menangani estetika dan format visual: pilihan token warna CSS (`--theme-*`), margin grid 8pt (`marginTop`, `marginBottom`), varian tombol CTA, serta opsi bentuk bingkai gambar (`imageFrame`, `imageShape`).
   - DILARANG menduplikasi input teks atau upload media di dalam tab Styles.

## 12. Gating Kontrol Margin Berbasis Flow Tata Letak (Vertikal vs Horizontal Grid)

1. **Elemen Bertumpuk Vertikal (Atas - Bawah)**:
   - Elemen teks yang berada dalam alur tumpukan vertikal (lencana promo, judul h1/h2, subjudul, tombol CTA, dan gambar terpusat pada layout satu kolom seperti `centered_minimal`) WAJIB menyediakan kontrol Margin Atas & Margin Bawah (skala 8pt).
   - **Kartu Ulasan / Konten Bertumpuk Vertikal**:
     - Jika hanya ada 1 kartu dan posisinya di bawah (aliran vertikal, contoh: `single_spotlight`): margin atas & bawah DIPERBOLEHKAN (`showMargins={true}`).
     - Jika ada >= 2 kartu dan posisinya bertumpuk atas-ke-bawah (aliran vertikal, contoh: `chat_bubble_flow`): margin atas & bawah DIPERBOLEHKAN (`showMargins={true}`).
   - Nilai margin wajib terhubung langsung ke CSS variable atau inline style elemen di kanvas.
2. **Elemen Bersandingan & Multi-Card (Kanan - Kiri / Grid)**:
   - Elemen yang terdiri dari banyak kartu (> 1 kartu) yang penempatannya tidak di atas-bawah (kartu fitur, kartu produk katalog, bento grid items, ulasan grid `masonry_grid`, `side_by_side_3_cards`, `social_post_cards`, `video_review_cards`, `infinite_marquee_scroll`, `carousel_slider`, `logo_client_cloud`) DILARANG menampilkan kontrol Margin Atas & Margin Bawah (`showMargins={false}`).
   - Kartu tunggal yang posisinya berada di kolom samping (sebelah kanan atau kiri seperti kartu skor agregat pada layout split `split_rating_stats`) DILARANG menampilkan kontrol Margin (`showMargins={false}`).
   - Jarak antar kartu pada grid/flexbox dikelola secara terpusat oleh container query / CSS `gap`.
3. **Pembersihan Form Konten & Penerapan Styles Node**:
   - Tab Konten dilarang keras memuat input warna (latar belakang atau teks); seluruh opsi warna wajib berada di tab Styles.
   - Seluruh section utama (Header, Hero, Features, Product Catalog, Testimonials) wajib memiliki dedicated ElementNodePanel dan operan `nodeStyles` ke seluruh varian layout agar perubahan gaya langsung berefek pada kanvas.

## 13. Standar Input Form Drawer & Efek Diskon Katalog

1. **Tata Letak Form Pada Drawer Inspector Sempit**:
   - Dilarang menempatkan lebih dari 1 field teks dan tombol aksi dalam 1 baris flex horizontal di drawer sempit (< 320px).
   - Gunakan layout vertikal bertumpuk: label -> input -> textarea -> tombol aksi `w-full` dengan icon.
2. **Konsistensi Efek Harga Coret (Diskon) Katalog**:
   - Setiap fitur yang menyediakan efek harga coret wajib menginisialisasi nilai default harga sebelum diskon saat toggle diaktifkan.
   - Seluruh varian layout katalog wajib mendukung dan menampilkan efek harga coret secara seragam menggunakan formula reaktif SSOT jika toggle diaktifkan.



