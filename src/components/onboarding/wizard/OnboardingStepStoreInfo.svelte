<script lang="ts">
  import {
    AlertCircle,
    Store,
    MapPin,
    Phone,
    ArrowLeft,
    ArrowRight,
  } from 'lucide-svelte';
  import { Button, Input, SearchableSelect } from '@/components/ui';
  import RegionAddressSelector from './RegionAddressSelector.svelte';
  import StoreBranchesManager from './StoreBranchesManager.svelte';
  import type { StoreBranchItem } from '../onboarding.types';

  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

  export let isEdit: boolean = false;
  export let storeName: string = '';
  export let categoryId: string = '';
  export let categories: Array<{ id: string; name: string }> = [];
  export let waNumber: string = '';
  export let googleMapsUrl: string = '';
  export let address: string = '';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: StoreBranchItem[] = [];
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

    <!-- Kategori Bisnis Dropdown (Searchable Combobox) -->
    <SearchableSelect
      id="business-category"
      label="Kategori Bisnis"
      required
      value={categoryId}
      options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
      placeholder="Pilih kategori bisnis UMKM..."
      searchPlaceholder="Cari kategori UMKM..."
      error={formErrors.categoryId ?? ''}
      fullWidth
      size="md"
      on:change={(e) => {
        categoryId = String(e.detail.value);
      }}
    />

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
        <p class="text-xs text-error flex items-center gap-1 mt-2 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{formErrors.address}</span>
        </p>
      {/if}
    </div>

    <!-- Pilihan 1 atau Beberapa Cabang Toko (Maks 5) -->
    <StoreBranchesManager
      bind:branchMode
      bind:branches
      primaryStoreName={storeName}
      primaryAddress={address}
      primaryMapsUrl={googleMapsUrl}
    />
  </div>

  {#if submitError}
    <div class="p-3.5 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2">
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
      <span>{isEdit ? 'Lanjut ke Pengaturan & Template' : 'Lanjut Pilih Template'}</span>
      <ArrowRight size={16} />
    </Button>
  </div>
</div>
