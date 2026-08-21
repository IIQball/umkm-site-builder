<script lang="ts">
  import { Store, Phone, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-svelte';

  export let initialStoreName = '';
  export let initialWaNumber = '';
  export let initialGoogleMapsUrl = '';
  export let subdomain = '';

  let storeName = initialStoreName;
  let waNumber = initialWaNumber;
  let googleMapsUrl = initialGoogleMapsUrl;
  
  let formErrors: Record<string, string> = {};
  let submitStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  let submitMessage = '';

  function validate(): boolean {
    formErrors = {};
    let isValid = true;
    
    if (!storeName || storeName.length < 3) {
      formErrors.storeName = 'Nama toko minimal 3 karakter';
      isValid = false;
    } else if (storeName.length > 100) {
      formErrors.storeName = 'Nama toko maksimal 100 karakter';
      isValid = false;
    }

    if (!waNumber || !/^628[0-9]{7,12}$/.test(waNumber)) {
      formErrors.waNumber = 'Nomor WhatsApp tidak valid. Gunakan format 628...';
      isValid = false;
    }

    if (googleMapsUrl) {
      try {
        new URL(googleMapsUrl);
      } catch {
        formErrors.googleMapsUrl = 'URL Google Maps tidak valid';
        isValid = false;
      }
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validate()) return;

    submitStatus = 'submitting';
    submitMessage = '';

    try {
      const res = await fetch('/api/stores/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: storeName,
          waNumber,
          googleMapsUrl
        }),
      });

      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await res.json();

      if (!data.success) {
        submitStatus = 'error';
        submitMessage = data.error || 'Gagal menyimpan pengaturan toko';
        return;
      }

      submitStatus = 'success';
      submitMessage = 'Pengaturan berhasil disimpan';
      
      setTimeout(() => {
        submitStatus = 'idle';
      }, 3000);
      
    } catch {
      submitStatus = 'error';
      submitMessage = 'Terjadi kesalahan. Silakan coba lagi.';
    }
  }
</script>

<div class="bg-card rounded-3xl shadow-xl p-6 max-w-2xl border border-border">
  <h2 class="text-2xl font-bold mb-6">Profil Toko</h2>

  <div class="space-y-6">
    <!-- Readonly Subdomain -->
    <div class="form-control w-full">
      <label class="label" for="subdomain-input">
        <span class="label-text font-medium">Subdomain Toko</span>
      </label>
      <div class="join w-full">
        <input
          id="subdomain-input"
          type="text"
          class="input input-bordered join-item w-full bg-nested"
          value={subdomain}
          readonly
        />
        <span class="join-item flex items-center bg-nested px-3 text-sm font-medium text-muted border-y border-r border-base-300">
          .umkm.site
        </span>
      </div>
      <span class="label-text-alt text-muted mt-1">Subdomain tidak dapat diubah setelah pendaftaran.</span>
    </div>

    <!-- Editable Fields -->
    <div class="form-control w-full">
      <label class="label" for="store-name">
        <span class="label-text font-medium">Nama Toko</span>
        <span class="label-text-alt text-error">*</span>
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Store size={18} class="text-base-content/40" />
        </div>
        <input
          id="store-name"
          type="text"
          bind:value={storeName}
          placeholder="Contoh: Kopi Budi Nusantara"
          class="input input-bordered w-full pl-10"
          class:input-error={!!formErrors.storeName}
        />
      </div>
      {#if formErrors.storeName}
        <span class="label-text-alt text-error mt-1">{formErrors.storeName}</span>
      {/if}
    </div>

    <div class="form-control w-full">
      <label class="label" for="wa-number">
        <span class="label-text font-medium">Nomor WhatsApp</span>
        <span class="label-text-alt text-error">*</span>
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone size={18} class="text-base-content/40" />
        </div>
        <input
          id="wa-number"
          type="tel"
          bind:value={waNumber}
          placeholder="Contoh: 6281234567890"
          class="input input-bordered w-full pl-10"
          class:input-error={!!formErrors.waNumber}
        />
      </div>
      <span class="label-text-alt text-base-content/50 mt-1">Gunakan format 628... (tanpa + atau 0 di depan)</span>
      {#if formErrors.waNumber}
        <span class="label-text-alt text-error mt-1">{formErrors.waNumber}</span>
      {/if}
    </div>

    <div class="form-control w-full">
      <label class="label" for="maps-url">
        <span class="label-text font-medium">Google Maps URL <span class="text-base-content/40 font-normal">(Opsional)</span></span>
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin size={18} class="text-base-content/40" />
        </div>
        <input
          id="maps-url"
          type="url"
          bind:value={googleMapsUrl}
          placeholder="https://maps.google.com/..."
          class="input input-bordered w-full pl-10"
          class:input-error={!!formErrors.googleMapsUrl}
        />
      </div>
      {#if formErrors.googleMapsUrl}
        <span class="label-text-alt text-error mt-1">{formErrors.googleMapsUrl}</span>
      {/if}
    </div>

    <!-- Alert Messages -->
    {#if submitStatus === 'error'}
      <div class="alert alert-error text-sm">
        <AlertCircle size={16} />
        <span>{submitMessage}</span>
      </div>
    {:else if submitStatus === 'success'}
      <div class="alert alert-success text-sm">
        <CheckCircle size={16} />
        <span>{submitMessage}</span>
      </div>
    {/if}

    <!-- Submit Button -->
    <div class="flex justify-end pt-4">
      <button
        type="button"
        class="btn btn-primary"
        disabled={submitStatus === 'submitting'}
        on:click={handleSubmit}
      >
        {#if submitStatus === 'submitting'}
          <Loader2 size={18} class="animate-spin" />
          Menyimpan...
        {:else}
          Simpan Perubahan
        {/if}
      </button>
    </div>
  </div>
</div>
