<script lang="ts">
  import { Car, Bus } from 'lucide-svelte';

  export let address: string = '';
  export let mapEmbedUrl: string = '';
</script>

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
  <div class="md:col-span-5 flex flex-col gap-4">
    <h3 class="text-2xl font-black text-[var(--theme-text-primary,#0f172a)] tracking-tight">Panduan Akses & Rute</h3>
    <p class="text-xs text-[var(--theme-text-muted,#64748b)]">{address}</p>

    <div class="flex flex-col gap-3 mt-2">
      <div class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-start gap-3">
        <Car size={18} class="text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <h5 class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)]">Kendaraan Pribadi</h5>
          <p class="text-[11px] text-[var(--theme-text-muted,#64748b)]">Tersedia area parkir luas dan aman di depan gerai.</p>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-[var(--theme-surface,#f8fafc)] border border-base-200 dark:border-slate-800 flex items-start gap-3">
        <Bus size={18} class="text-emerald-500 mt-0.5 flex-shrink-0" />
        <div>
          <h5 class="text-xs font-bold text-[var(--theme-text-primary,#0f172a)]">Transportasi Umum</h5>
          <p class="text-[11px] text-[var(--theme-text-muted,#64748b)]">Turun di halte terdekat, hanya 3 menit jalan kaki.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="md:col-span-7 rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[320px]">
    <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="100%" style="border:0; min-height: 320px;" loading="lazy" allowfullscreen></iframe>
  </div>
</div>
