<script lang="ts">
  import {
    AlertCircle,
    Store,
    MapPin,
    Phone,
    ArrowLeft,
    ArrowRight,
    Briefcase
  } from 'lucide-svelte';
  import { Button, Input } from '@/components/ui';
  import RegionAddressSelector from './RegionAddressSelector.svelte';

  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

  export let storeName: string = '';
  export let categoryId: string = '';
  export let categories: Array<{ id: string; name: string }> = [];
  export let waNumber: string = '';
  export let googleMapsUrl: string = '';
  export let address: string = '';
  export let regionData = {
    province: 'Jawa Timur',
    city: 'Banyuwangi',
    district: '',
    subDistrict: '',
    hamlet: '',
    street: '',
  };
  export let formErrors: Record<string, string> = {};
  export let submitStatus: SubmitStatus = 'idle';
  export let submitError: string = '';
  export let onPrev: () => void;
  export let onNext: () => void;

  $: isFormIncomplete =
    !storeName.trim() ||
    !categoryId ||
    !waNumber.trim() ||
    !googleMapsUrl.trim() ||
    !regionData.district ||
    !regionData.subDistrict ||
    !regionData.hamlet.trim() ||
    !regionData.street.trim();
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
  <div class="border-b border-light pb-6">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Profil & Lokasi Fisik Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Lengkapi identitas usaha, kontak bisnis, dan alamat fisik toko Anda untuk kemudahan verifikasi dan pelanggan.
    </p>
  </div>

  <div class="space-y-5">
    <!-- Nama Toko -->
    <Input
      id="store-name"
      label="Nama Toko"
      required
      bind:value={storeName}
      placeholder="Contoh: Kopi Osing Banyuwangi"
      error={formErrors.storeName ?? ''}
      fullWidth
    >
      <Store slot="prefix" size={16} class="text-muted" />
    </Input>

    <!-- Kategori Bisnis Dropdown -->
    <div class="form-control w-full">
      <label for="business-category" class="block text-label-caps text-muted mb-1.5">
        Kategori Bisnis <span class="text-error ml-0.5">*</span>
      </label>
      <div class="relative flex items-center w-full">
        <select
          id="business-category"
          bind:value={categoryId}
          class="w-full bg-nested text-main border transition-all duration-150 font-sans text-sm rounded-xl h-10 min-h-[40px] pl-10 pr-10 appearance-none cursor-pointer outline-none focus:bg-card {formErrors.categoryId
            ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
            : 'border-light focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'}"
        >
          <option value="" disabled selected={!categoryId} class="italic text-[var(--color-text-light)]">
            Pilih kategori bisnis UMKM...
          </option>
          {#each categories as cat (cat.id)}
            <option value={cat.id}>{cat.name}</option>
          {/each}
        </select>
        <div class="absolute left-3 flex items-center justify-center pointer-events-none text-muted">
          <Briefcase size={16} />
        </div>
        <div class="absolute right-3.5 pointer-events-none text-muted flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      {#if formErrors.categoryId}
        <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-1.5 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{formErrors.categoryId}</span>
        </p>
      {/if}
    </div>

    <!-- Nomor WhatsApp -->
    <Input
      id="wa-number"
      type="tel"
      label="Nomor WhatsApp"
      required
      bind:value={waNumber}
      placeholder="Contoh: 6281234567890"
      helper="Gunakan format 628... (tanpa + atau 0 di depan)"
      error={formErrors.waNumber ?? ''}
      fullWidth
    >
      <Phone slot="prefix" size={16} class="text-muted" />
    </Input>

    <!-- Google Maps URL (Wajib) -->
    <Input
      id="maps-url"
      type="url"
      label="Link Google Maps Lokasi Toko"
      required
      bind:value={googleMapsUrl}
      placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/..."
      helper="Buka Google Maps, cari lokasi toko Anda, lalu salin tautan 'Bagikan' / 'Share'"
      error={formErrors.googleMapsUrl ?? ''}
      fullWidth
    >
      <MapPin slot="prefix" size={16} class="text-muted" />
    </Input>

    <!-- Wilayah & Alamat Lengkap (Wajib) -->
    <div class="pt-2">
      <RegionAddressSelector
        bind:address
        bind:regionData
        errors={formErrors}
      />
      {#if formErrors.address}
        <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-2 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{formErrors.address}</span>
        </p>
      {/if}
    </div>
  </div>

  {#if submitError}
    <div class="p-3.5 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-xs text-[var(--color-error)] flex items-center gap-2">
      <AlertCircle size={16} class="shrink-0" />
      <span class="font-medium">{submitError}</span>
    </div>
  {/if}

  <div class="mt-4 flex justify-between gap-3 pt-6 border-t border-light">
    <Button
      variant="ghost"
      size="md"
      class="font-bold font-sans"
      disabled={submitStatus === 'submitting'}
      on:click={onPrev}
    >
      <ArrowLeft size={16} />
      Kembali
    </Button>
    
    <Button
      variant="primary"
      size="md"
      class="font-bold font-sans"
      disabled={submitStatus === 'submitting' || isFormIncomplete}
      on:click={onNext}
    >
      Lanjut Pilih Template
      <ArrowRight size={16} />
    </Button>
  </div>
</div>
