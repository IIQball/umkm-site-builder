<script lang="ts">
  import { Store, Phone, MapPin } from 'lucide-svelte';

  export let storeName: string;
  export let waNumber: string;
  export let googleMapsUrl: string;
  export let formErrors: Record<string, string>;
</script>

<div class="space-y-4">
  <div class="space-y-1">
    <h3 class="font-bold text-base text-base-content">Lengkapi Informasi Profil Toko</h3>
    <p class="text-xs text-base-content/60">
      Data ini akan ditampilkan kepada calon pembeli di website toko Anda.
    </p>
  </div>

  <div class="space-y-3 text-xs">
    <div>
      <label for="step-store-name" class="block font-semibold text-base-content/80 mb-1">Nama Toko / Usaha</label>
      <div class="relative">
        <Store size={15} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input
          id="step-store-name"
          type="text"
          bind:value={storeName}
          placeholder="Contoh: Kopi Banyuwangi Asli"
          class="w-full pl-10 pr-4 py-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl text-xs text-base-content focus:outline-none focus:border-primary"
        />
      </div>
      {#if formErrors.storeName}
        <p class="text-[11px] text-rose-500 mt-1">{formErrors.storeName}</p>
      {/if}
    </div>

    <div>
      <label for="step-store-wa" class="block font-semibold text-base-content/80 mb-1">Nomor WhatsApp Toko (Awali dengan 62)</label>
      <div class="relative">
        <Phone size={15} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input
          id="step-store-wa"
          type="text"
          bind:value={waNumber}
          placeholder="6281234567890"
          class="w-full pl-10 pr-4 py-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl text-xs text-base-content focus:outline-none focus:border-primary"
        />
      </div>
      {#if formErrors.waNumber}
        <p class="text-[11px] text-rose-500 mt-1">{formErrors.waNumber}</p>
      {/if}
    </div>

    <div>
      <label for="step-store-maps" class="block font-semibold text-base-content/80 mb-1">URL Embed / Link Google Maps (Opsional)</label>
      <div class="relative">
        <MapPin size={15} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input
          id="step-store-maps"
          type="url"
          bind:value={googleMapsUrl}
          placeholder="https://maps.google.com/..."
          class="w-full pl-10 pr-4 py-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl text-xs text-base-content focus:outline-none focus:border-primary"
        />
      </div>
      {#if formErrors.googleMapsUrl}
        <p class="text-[11px] text-rose-500 mt-1">{formErrors.googleMapsUrl}</p>
      {/if}
    </div>
  </div>
</div>
