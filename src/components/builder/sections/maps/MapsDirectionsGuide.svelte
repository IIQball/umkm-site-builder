<script lang="ts">
  import { Car, Bus } from 'lucide-svelte';

  export let address: string = '';
  export let mapEmbedUrl: string = '';
</script>

<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
  <div class="md:col-span-5 flex flex-col gap-4">
    <h3
      class="font-[var(--theme-font-heading,var(--font-heading,inherit))] text-[var(--color-text-main,var(--theme-text-primary,#0f172a))] tracking-tight"
      style="font-size: var(--theme-text-h3, var(--text-h3-size, 20px)); font-weight: var(--theme-text-h3-weight, var(--text-h3-weight, 700));"
    >
      Panduan Akses & Rute
    </h3>
    <p
      class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))] leading-relaxed"
      style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
    >
      {address}
    </p>

    <div class="flex flex-col gap-3 mt-2">
      <div class="p-4 rounded-xl bg-[var(--color-nested-base,#f8fafc)] border border-[var(--color-border,rgba(0,0,0,0.08))] flex items-start gap-3">
        <Car size={18} class="text-[var(--theme-primary,#2563eb)] mt-0.5 flex-shrink-0" />
        <div>
          <h5
            class="font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--color-text-main,var(--theme-text-primary,#0f172a))]"
            style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
          >
            Kendaraan Pribadi
          </h5>
          <p
            class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))]"
            style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85);"
          >
            Tersedia area parkir luas dan aman di depan gerai.
          </p>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-[var(--color-nested-base,#f8fafc)] border border-[var(--color-border,rgba(0,0,0,0.08))] flex items-start gap-3">
        <Bus size={18} class="text-emerald-500 mt-0.5 flex-shrink-0" />
        <div>
          <h5
            class="font-[var(--theme-font-heading,var(--font-heading,inherit))] font-bold text-[var(--color-text-main,var(--theme-text-primary,#0f172a))]"
            style="font-size: var(--theme-text-body, var(--text-body-size, 14px));"
          >
            Transportasi Umum
          </h5>
          <p
            class="text-[var(--color-text-secondary,var(--theme-text-muted,#64748b))] font-[var(--theme-font-body,var(--font-family,inherit))]"
            style="font-size: calc(var(--theme-text-body, var(--text-body-size, 14px)) * 0.85);"
          >
            Turun di halte terdekat, hanya 3 menit jalan kaki.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="md:col-span-7 rounded-2xl overflow-hidden border border-[var(--color-border,rgba(0,0,0,0.08))] bg-[var(--color-card-base,var(--theme-surface,#ffffff))] shadow-md min-h-[320px]">
    <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="100%" style="border:0; min-height: 320px;" loading="lazy" allowfullscreen></iframe>
  </div>
</div>
