<script lang="ts">
  import { Check, X } from 'lucide-svelte';
</script>

<div class="py-12 flex flex-col gap-8 text-left">
  <div class="text-center max-w-2xl mx-auto">
    <h2 class="text-2xl sm:text-3xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-2">
      Perbandingan Pengalaman Belanja
    </h2>
    <p class="text-sm text-[var(--theme-text-muted,#64748b)]">Lihat perbedaan sebelum & sesudah berbelanja di toko kami</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
    <!-- Without -->
    <div class="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col gap-4">
      <div class="flex items-center gap-2 text-xs font-bold text-rose-600">
        <X size={16} />
        <span>Toko Konvensional Lain</span>
      </div>
      <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-400">
        <li class="flex items-start gap-2">❌ Respon chat lambat dan manual berjam-jam</li>
        <li class="flex items-start gap-2">❌ Ketersediaan stok barang sering tidak pasti</li>
        <li class="flex items-start gap-2">❌ Tidak ada garansi penggantian barang rusak</li>
      </ul>
    </div>

    <!-- With Our Store -->
    <div class="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 shadow-md flex flex-col gap-4">
      <div class="flex items-center gap-2 text-xs font-bold text-emerald-600">
        <Check size={16} />
        <span>Toko Kami (Sistem UMKM Modern)</span>
      </div>
      <ul class="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
        <li class="flex items-start gap-2">✅ Respon instan terintegrasi WhatsApp otomatis</li>
        <li class="flex items-start gap-2">✅ Katalog live update & stok terjamin ready</li>
        <li class="flex items-start gap-2">✅ Jaminan garansi 100% uang kembali & packing aman</li>
      </ul>
    </div>
  </div>
</div>
