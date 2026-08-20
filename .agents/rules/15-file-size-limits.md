# File Size & Modularization Constraints

## Strict Limit: Max 300 Lines Per File
Setiap file kode sumber (`.ts`, `.svelte`, `.astro`, `.js`) di dalam folder `src/` TIDAK BOLEH melebihi 300 baris.

## Decomposition Guidelines
1. **Svelte UI Components**:
   - Pecah form tab, inspector panel, toolbar handle, card item, dan dropdown ke sub-komponen terfokus.
   - Buat komponen utama (orchestrator) tipis, bertindak sebagai pengatur routing sub-komponen via props dan events.
2. **State & Stores**:
   - Pisahkan definisi antarmuka tipe (`*.types.ts`), mutasi/handler data murni (`*.mutations.ts`), dan fungsi utilitas (`*.utils.ts`).
3. **Sections & Helpers**:
   - Ekstrak konstanta statis, daftar opsi/preset, metadata ikon, dan data tiruan (demo/fallback) ke file pendamping terpisah (`*.helpers.ts` / `*.constants.ts`).
4. **Exceptions**:
   - Definisi skema database terpusat (`src/db/schema.ts`) di mana Drizzle ORM membutuhkan inferensi tipe relasi satu kesatuan.

## Verification
- Pastikan menjalankan audit jumlah baris pada `src/` sebelum menyelesaikan task refactoring.
- Wajib memvalidasi dengan `bun run type-check` (0 TypeScript errors) dan `bun test` (100% test suite pass).
