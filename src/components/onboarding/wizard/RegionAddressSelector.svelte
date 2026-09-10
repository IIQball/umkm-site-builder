<script lang="ts">
  import { onMount } from 'svelte';
  import {
    MapPin,
    Building2,
    Landmark,
    Map as MapIcon,
    Milestone,
    Home,
    ChevronsUpDown,
    Check,
    AlertCircle,
    AlertTriangle,
    Search,
    Loader2
  } from 'lucide-svelte';

  interface Region {
    id: string;
    name: string;
  }

  export let address = '';
  export let regionData = {
    province: 'Jawa Timur',
    city: 'Banyuwangi',
    district: '',
    subDistrict: '',
    hamlet: '',
    street: '',
  };
  export let errors: Record<string, string> = {};

  let districts: Region[] = [];
  let subDistricts: Region[] = [];
  let isLoadingDistricts = false;
  let isLoadingSubDistricts = false;

  let openDist = false;
  let openSub = false;
  let distSearch = '';
  let subSearch = '';

  function toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onMount(async () => {
    isLoadingDistricts = true;
    try {
      const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/districts/3510.json');
      if (res.ok) {
        const data: Region[] = await res.json();
        districts = data.map((d) => ({ ...d, name: toTitleCase(d.name) }));
      }
    } catch (err) {
      console.error('Gagal memuat daftar kecamatan:', err);
    } finally {
      isLoadingDistricts = false;
    }
  });

  async function onSelectDistrict(d: Region) {
    regionData.district = d.name;
    regionData.subDistrict = '';
    subDistricts = [];
    openDist = false;
    distSearch = '';

    isLoadingSubDistricts = true;
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${d.id}.json`);
      if (res.ok) {
        const data: Region[] = await res.json();
        subDistricts = data.map((s) => ({ ...s, name: toTitleCase(s.name) }));
      }
    } catch (err) {
      console.error('Gagal memuat kelurahan:', err);
    } finally {
      isLoadingSubDistricts = false;
    }
  }

  function onSelectSubDistrict(s: Region) {
    regionData.subDistrict = s.name;
    openSub = false;
    subSearch = '';
  }

  $: filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(distSearch.toLowerCase())
  );

  $: filteredSubDistricts = subDistricts.filter((s) =>
    s.name.toLowerCase().includes(subSearch.toLowerCase())
  );

  $: {
    const parts: string[] = [];
    if (regionData.street?.trim()) parts.push(regionData.street.trim());
    if (regionData.hamlet?.trim()) parts.push(`Dusun ${regionData.hamlet.trim()}`);
    if (regionData.subDistrict?.trim()) parts.push(`Kel./Desa ${regionData.subDistrict.trim()}`);
    if (regionData.district?.trim()) parts.push(`Kec. ${regionData.district.trim()}`);
    parts.push('Kab. Banyuwangi, Jawa Timur');
    address = parts.join(', ');
  }
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 border-b border-light pb-2">
    <MapPin size={15} class="text-primary" />
    <span class="text-label-caps text-muted">Wilayah & Alamat Toko</span>
    <span class="text-2xs text-error font-bold uppercase">*Wajib</span>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Provinsi (Disabled) -->
    <div class="form-control w-full">
      <label for="reg-province" class="block text-label-caps text-muted mb-1.5 flex items-center gap-1.5">
        <MapPin size={12} class="text-primary" /> Provinsi
      </label>
      <button
        id="reg-province"
        type="button"
        disabled
        class="w-full flex items-center justify-between h-10 px-4 bg-nested text-secondary border border-light rounded-xl font-sans text-sm opacity-60 grayscale-[0.3] cursor-not-allowed"
      >
        <span class="flex items-center gap-2 truncate font-medium">
          <MapPin size={14} class="text-primary/70 shrink-0" /> Jawa Timur
        </span>
        <span class="text-3xs font-bold uppercase tracking-caps bg-muted/20 px-2 py-0.5 rounded text-muted">Terkunci</span>
      </button>
    </div>

    <!-- Kabupaten (Disabled) -->
    <div class="form-control w-full">
      <label for="reg-city" class="block text-label-caps text-muted mb-1.5 flex items-center gap-1.5">
        <Building2 size={12} class="text-primary" /> Kabupaten / Kota
      </label>
      <button
        id="reg-city"
        type="button"
        disabled
        class="w-full flex items-center justify-between h-10 px-4 bg-nested text-secondary border border-light rounded-xl font-sans text-sm opacity-60 grayscale-[0.3] cursor-not-allowed"
      >
        <span class="flex items-center gap-2 truncate font-medium">
          <Building2 size={14} class="text-primary/70 shrink-0" /> Banyuwangi
        </span>
        <span class="text-3xs font-bold uppercase tracking-caps bg-muted/20 px-2 py-0.5 rounded text-muted">Terkunci</span>
      </button>
    </div>

    <!-- Kecamatan -->
    <div class="form-control w-full relative">
      <label for="reg-district-btn" class="block text-label-caps text-muted mb-1.5 flex items-center gap-1.5">
        <Landmark size={12} class="text-primary" /> Kecamatan <span class="text-error">*</span>
      </label>
      <button
        id="reg-district-btn"
        type="button"
        on:click={() => { openDist = !openDist; openSub = false; }}
        class="w-full flex items-center justify-between h-10 px-4 bg-nested border rounded-xl font-sans text-sm text-main transition-all duration-150 text-left {errors.district
          ? 'border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
          : 'border-light hover:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/20'}"
      >
        <span class="flex items-center gap-2 truncate {!regionData.district ? 'text-[var(--color-text-light)] italic' : 'font-medium'}">
          <Landmark size={14} class={regionData.district ? 'text-primary shrink-0' : 'text-muted shrink-0'} />
          {regionData.district || 'Pilih kecamatan di Banyuwangi...'}
        </span>
        {#if isLoadingDistricts}
          <Loader2 size={14} class="animate-spin text-muted shrink-0" />
        {:else}
          <ChevronsUpDown size={14} class="text-muted shrink-0 opacity-60" />
        {/if}
      </button>

      {#if openDist}
        <button type="button" class="fixed inset-0 z-40 bg-transparent cursor-default border-none outline-none" on:click={() => (openDist = false)} aria-label="Tutup"></button>
        <div class="absolute z-50 left-0 right-0 top-full mt-1 bg-card border border-light rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
          <div class="p-2 border-b border-light flex items-center gap-2 bg-nested">
            <Search size={14} class="text-muted shrink-0" />
            <input
              type="text"
              bind:value={distSearch}
              placeholder="Cari kecamatan..."
              class="w-full text-xs font-sans bg-transparent border-none outline-none text-main placeholder:italic placeholder:text-[var(--color-text-light)]"
            />
          </div>
          <div class="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
            {#if filteredDistricts.length === 0}
              <p class="py-4 text-center text-xs text-muted italic">Kecamatan tidak ditemukan</p>
            {:else}
              {#each filteredDistricts as d (d.id)}
                <button
                  type="button"
                  on:click={() => onSelectDistrict(d)}
                  class="w-full flex items-center justify-between px-3 py-2 text-xs font-sans font-medium rounded-lg hover:bg-nested transition-colors text-left {regionData.district === d.name ? 'text-primary bg-primary/10 font-bold' : 'text-main'}"
                >
                  <span>{d.name}</span>
                  {#if regionData.district === d.name}
                    <Check size={14} class="text-primary" />
                  {/if}
                </button>
              {/each}
            {/if}
          </div>
        </div>
      {/if}

      {#if errors.district}
        <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-1.5 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{errors.district}</span>
        </p>
      {/if}
    </div>

    <!-- Kelurahan / Desa -->
    <div class="form-control w-full relative">
      <div class="flex items-center justify-between mb-1.5">
        <label for="reg-subdistrict-btn" class="text-label-caps text-muted flex items-center gap-1.5">
          <MapIcon size={12} class="text-primary" /> Kelurahan / Desa <span class="text-error">*</span>
        </label>
        {#if !regionData.district}
          <span class="text-3xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
            <AlertTriangle size={8} /> pilih kecamatan dulu
          </span>
        {/if}
      </div>

      <button
        id="reg-subdistrict-btn"
        type="button"
        disabled={!regionData.district}
        on:click={() => { openSub = !openSub; openDist = false; }}
        class="w-full flex items-center justify-between h-10 px-4 bg-nested border rounded-xl font-sans text-sm text-main transition-all duration-150 text-left {!regionData.district ? 'opacity-50 cursor-not-allowed bg-nested/50' : 'hover:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/20'} {errors.subDistrict ? 'border-[var(--color-error)]' : 'border-light'}"
      >
        <span class="flex items-center gap-2 truncate {!regionData.subDistrict ? 'text-[var(--color-text-light)] italic' : 'font-medium'}">
          <MapIcon size={14} class={regionData.subDistrict ? 'text-primary shrink-0' : 'text-muted shrink-0'} />
          {regionData.subDistrict || 'Pilih kelurahan / desa...'}
        </span>
        {#if isLoadingSubDistricts}
          <Loader2 size={14} class="animate-spin text-muted shrink-0" />
        {:else}
          <ChevronsUpDown size={14} class="text-muted shrink-0 opacity-60" />
        {/if}
      </button>

      {#if openSub && regionData.district}
        <button type="button" class="fixed inset-0 z-40 bg-transparent cursor-default border-none outline-none" on:click={() => (openSub = false)} aria-label="Tutup"></button>
        <div class="absolute z-50 left-0 right-0 top-full mt-1 bg-card border border-light rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
          <div class="p-2 border-b border-light flex items-center gap-2 bg-nested">
            <Search size={14} class="text-muted shrink-0" />
            <input
              type="text"
              bind:value={subSearch}
              placeholder="Cari kelurahan / desa..."
              class="w-full text-xs font-sans bg-transparent border-none outline-none text-main placeholder:italic placeholder:text-[var(--color-text-light)]"
            />
          </div>
          <div class="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
            {#if filteredSubDistricts.length === 0}
              <p class="py-4 text-center text-xs text-muted italic">Kelurahan tidak ditemukan</p>
            {:else}
              {#each filteredSubDistricts as s (s.id)}
                <button
                  type="button"
                  on:click={() => onSelectSubDistrict(s)}
                  class="w-full flex items-center justify-between px-3 py-2 text-xs font-sans font-medium rounded-lg hover:bg-nested transition-colors text-left {regionData.subDistrict === s.name ? 'text-primary bg-primary/10 font-bold' : 'text-main'}"
                >
                  <span>{s.name}</span>
                  {#if regionData.subDistrict === s.name}
                    <Check size={14} class="text-primary" />
                  {/if}
                </button>
              {/each}
            {/if}
          </div>
        </div>
      {/if}

      {#if errors.subDistrict}
        <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-1.5 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{errors.subDistrict}</span>
        </p>
      {/if}
    </div>

    <!-- Dusun / Lingkungan -->
    <div class="form-control w-full">
      <label for="reg-hamlet" class="block text-label-caps text-muted mb-1.5 flex items-center gap-1.5">
        <Milestone size={12} class="text-primary" /> Dusun / Lingkungan <span class="text-error">*</span>
      </label>
      <input
        id="reg-hamlet"
        type="text"
        bind:value={regionData.hamlet}
        placeholder="Contoh: Krajan, Sawahan, Karanganyar..."
        class="w-full h-10 px-4 bg-nested text-main border rounded-xl font-sans text-sm transition-all duration-150 placeholder:italic placeholder:text-[var(--color-text-light)] placeholder:opacity-80 focus:outline-none focus:bg-card focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 {errors.hamlet ? 'border-[var(--color-error)]' : 'border-light'}"
      />
      {#if errors.hamlet}
        <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-1.5 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{errors.hamlet}</span>
        </p>
      {/if}
    </div>

    <!-- Detail Jalan & RT/RW -->
    <div class="form-control w-full">
      <label for="reg-street" class="block text-label-caps text-muted mb-1.5 flex items-center gap-1.5">
        <Home size={12} class="text-primary" /> Detail Jalan & RT/RW <span class="text-error">*</span>
      </label>
      <input
        id="reg-street"
        type="text"
        bind:value={regionData.street}
        placeholder="Contoh: Jl. Gajah Mada No. 12, RT 01 / RW 02"
        class="w-full h-10 px-4 bg-nested text-main border rounded-xl font-sans text-sm transition-all duration-150 placeholder:italic placeholder:text-[var(--color-text-light)] placeholder:opacity-80 focus:outline-none focus:bg-card focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 {errors.street ? 'border-[var(--color-error)]' : 'border-light'}"
      />
      {#if errors.street}
        <p class="text-xs text-[var(--color-error)] flex items-center gap-1 mt-1.5 font-medium animate-fade-in-up">
          <AlertCircle size={14} class="flex-shrink-0" />
          <span>{errors.street}</span>
        </p>
      {/if}
    </div>
  </div>

  {#if address}
    <div class="p-4 bg-nested/70 border border-light rounded-2xl text-xs space-y-1">
      <span class="text-label-caps text-muted block">Ringkasan Alamat Lengkap:</span>
      <p class="text-body-sm font-medium text-main leading-relaxed font-sans">{address}</p>
    </div>
  {/if}
</div>
