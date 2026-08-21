# Design System & UI Consistency Rules

## 1. Border Colors & Contrast
- Dilarang keras menulis border dengan warna solid terang/gelap buatan sendiri di dark mode.
- Gunakan kelas border standar (`border`, `border-t`, `border-b`) yang otomatis memetakan warna transparan via fallback selector `*` di `global.css`.
- Untuk kasus khusus, gunakan warna opacity Tailwind (misal: `border-slate-500/10`) daripada warna solid tebal.

## 2. Reusable Metric / Stat Cards
- Seluruh card statistik di dashboard desainer/tenant wajib memanggil komponen [`StatCard.svelte`](file:///e:/POLIWANGI/SEMESTER%207/MAGANG/PROJEK/umkm-site-builder/src/components/designer/StatCard.svelte).
- Jangan menulis ulang pembungkus `rounded-2xl shadow-sm border border-main` secara manual untuk visualisasi data numerik / metrics.
