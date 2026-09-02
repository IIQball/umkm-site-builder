<script lang="ts">
  import { onMount } from "svelte";

  export let initialData: {
    id: string;
    name: string;
    subdomain: string;
    waNumber: string;
    googleMapsUrl: string;
  } | null = null;

  let isEditing = false;
  let loading = false;
  let error = "";
  let success = "";

  // Formulir
  let name = "";
  let subdomain = "";
  let waNumber = "";
  let googleMapsUrl = "";

  onMount(() => {
    if (initialData) {
      name = initialData.name;
      subdomain = initialData.subdomain;
      waNumber = initialData.waNumber;
      googleMapsUrl = initialData.googleMapsUrl;
      isEditing = false;
    } else {
      isEditing = true; // Jika data belum ada, paksa dalam mode edit
    }
  });

  const handleSave = async (e: Event) => {
    e.preventDefault();
    error = "";
    success = "";
    loading = true;

    try {
      // Endpoint API (Misalnya kita simpan/buat toko baru, Anda dapat menyesuaikan logic API ini nanti)
      // Ini hanya simulasi penyimpanan data di UI
      await new Promise((r) => setTimeout(r, 1000));
      
      // Jika berhasil, perbarui initialData lokal 
      initialData = {
        id: initialData?.id || "temp-id",
        name,
        subdomain,
        waNumber,
        googleMapsUrl,
      };
      isEditing = false;
      success = "Profil toko berhasil diperbarui.";
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan data toko.";
      error = errorMsg;
    } finally {
      loading = false;
    }
  };
</script>

<div class="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-sm">
  <!-- Header Card -->
  <div class="px-6 py-5 border-b border-base-200 bg-base-50/50 flex items-center justify-between">
    <div>
      <h2 class="text-lg font-semibold text-base-content tracking-tight">Profil Utama</h2>
      <p class="text-sm text-base-content/60 mt-0.5">Identitas toko Anda yang akan dilihat pelanggan.</p>
    </div>
    {#if initialData && !isEditing}
      <button 
        type="button" 
        class="btn btn-sm btn-ghost border border-base-300 shadow-sm cursor-pointer"
        on:click={() => (isEditing = true)}
      >
        Edit Profil
      </button>
    {/if}
  </div>

  <div class="p-6">
    {#if !initialData && isEditing}
      <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-800/50 flex gap-3">
        <span class="material-symbols-outlined mt-0.5 text-[20px]">storefront</span>
        <div>
          <h3 class="font-semibold text-sm">Toko Belum Dibuat</h3>
          <p class="text-xs mt-1 opacity-90">Lengkapi formulir di bawah ini untuk mengaktifkan toko Anda pertama kali.</p>
        </div>
      </div>
    {/if}

    {#if error}
      <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/50 flex gap-3">
        <span class="material-symbols-outlined mt-0.5 text-[20px]">error</span>
        <p class="text-sm">{error}</p>
      </div>
    {/if}

    {#if success}
      <div class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex gap-3">
        <span class="material-symbols-outlined mt-0.5 text-[20px]">check_circle</span>
        <p class="text-sm">{success}</p>
      </div>
    {/if}

    {#if isEditing}
      <form on:submit={handleSave} class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label mb-1" for="name">
              <span class="label-text font-medium text-base-content">Nama Toko</span>
            </label>
            <input
              type="text"
              id="name"
              bind:value={name}
              placeholder="Mis: Kopi Kenangan"
              class="input input-bordered w-full bg-base-100 focus:input-primary transition-colors"
              required
            />
          </div>

           <div class="form-control">
             <label class="label mb-1" for="subdomain">
               <span class="label-text font-medium text-base-content">Subdomain</span>
             </label>
             <div class="relative flex items-center">
               <input
                 type="text"
                 id="subdomain"
                 value={subdomain}
                 placeholder="kopikenangan"
                 class="input input-bordered w-full bg-base-200 pr-[140px] focus:input-primary transition-colors"
                 disabled
               />
               <span class="absolute right-4 text-base-content/50 text-sm select-none pointer-events-none">.mudapedia.com</span>
             </div>
             <div class="label mt-1">
               <span class="label-text-alt text-base-content/50">Tidak dapat diubah setelah pembuatan toko</span>
             </div>
           </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-control">
            <label class="label mb-1" for="waNumber">
              <span class="label-text font-medium text-base-content">Nomor WhatsApp</span>
            </label>
            <input
              type="tel"
              id="waNumber"
              bind:value={waNumber}
              placeholder="Mis: 08123456789"
              class="input input-bordered w-full bg-base-100 focus:input-primary transition-colors"
              required
            />
            <div class="label mt-1">
              <span class="label-text-alt text-base-content/50">Digunakan pembeli untuk menghubungi Anda.</span>
            </div>
          </div>

          <div class="form-control">
            <label class="label mb-1" for="googleMapsUrl">
              <span class="label-text font-medium text-base-content">Tautan Google Maps</span>
              <span class="label-text-alt text-base-content/50">Opsional</span>
            </label>
            <input
              type="url"
              id="googleMapsUrl"
              bind:value={googleMapsUrl}
              placeholder="https://maps.app.goo.gl/..."
              class="input input-bordered w-full bg-base-100 focus:input-primary transition-colors"
            />
          </div>
        </div>

        <div class="pt-4 flex gap-3 items-center justify-end border-t border-base-200 mt-6">
          {#if initialData}
            <button 
              type="button" 
              class="btn btn-ghost text-base-content/70 hover:bg-base-200 cursor-pointer"
              disabled={loading}
              on:click={() => {
                isEditing = false;
                error = "";
                // Revert values
                name = initialData?.name || "";
                subdomain = initialData?.subdomain || "";
                waNumber = initialData?.waNumber || "";
                googleMapsUrl = initialData?.googleMapsUrl || "";
              }}
            >
              Batal
            </button>
          {/if}
          <button 
            type="submit" 
            class="btn bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-zinc-900 border-none shadow-sm shadow-zinc-900/10 active:scale-[0.98] transition-transform cursor-pointer"
            disabled={loading}
          >
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
              Menyimpan...
            {:else}
              Simpan Perubahan
            {/if}
          </button>
        </div>
      </form>
    {:else if initialData}
      <!-- Read-Only View -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div>
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Nama Toko</p>
          <p class="text-base font-medium text-base-content">{initialData.name}</p>
        </div>
        <div>
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Subdomain</p>
          <p class="text-base font-medium text-base-content">
            {initialData.subdomain}<span class="text-base-content/40">.mudapedia.com</span>
          </p>
        </div>
        <div>
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Nomor WhatsApp</p>
          <p class="text-base font-medium text-base-content">{initialData.waNumber}</p>
        </div>
        <div>
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Google Maps</p>
          {#if initialData.googleMapsUrl}
            <a href={initialData.googleMapsUrl} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline inline-flex items-center gap-1">
              Lihat di Maps
              <span class="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          {:else}
            <p class="text-base font-medium text-base-content/40 italic">Belum diatur</p>
          {/if}
        </div>
      </div>
    {:else}
      <div class="py-6 text-center text-base-content/60">
        <p>Belum ada data toko.</p>
      </div>
    {/if}
  </div>
</div>
