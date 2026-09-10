<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { BANYUWANGI_POPULAR_DISTRICTS, ALL_BANYUWANGI_DISTRICTS, type DistrictOption } from './directoryDistricts';

  export let isOpen = false;

  const dispatch = createEventDispatcher<{
    granted: { lat: number; lng: number; label?: string };
    denied: { message: string };
    dismissed: void;
    skip: void;
    close: void;
  }>();

  let loading = false;
  let errorMessage = '';
  let isInsecureContext = false;
  let selectedDistrictName = '';

  function checkSecurityContext() {
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      isInsecureContext = true;
      errorMessage = 'Koneksi HTTP membatasi GPS browser. Anda dapat memilih kecamatan atau menjelajah tanpa GPS.';
    }
  }

  function handleSkip() {
    try {
      localStorage.setItem('umkm_geo_permission', 'skipped');
    } catch {
      // ignore storage error
    }
    dispatch('skip');
    isOpen = false;
  }

  function handleSelectDistrict(dist: DistrictOption) {
    errorMessage = '';
    const payload = {
      lat: dist.lat,
      lng: dist.lng,
      label: dist.name,
    };
    try {
      localStorage.setItem('umkm_geo_permission', 'granted');
      localStorage.setItem('umkm_user_location', JSON.stringify(payload));
    } catch {
      // ignore
    }
    dispatch('granted', payload);
    isOpen = false;
  }

  function handleDistrictDropdownChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const found = ALL_BANYUWANGI_DISTRICTS.find((d) => d.name === target.value);
    if (found) {
      handleSelectDistrict(found);
    }
  }

  function requestLocation() {
    checkSecurityContext();

    if (!navigator.geolocation) {
      errorMessage = 'Browser Anda tidak mendukung deteksi lokasi geografis. Silakan pilih kecamatan di atas.';
      return;
    }

    loading = true;
    errorMessage = '';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loading = false;
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Lokasi GPS',
        };
        try {
          localStorage.setItem('umkm_geo_permission', 'granted');
          localStorage.setItem('umkm_user_location', JSON.stringify(coords));
        } catch {
          // ignore storage error
        }
        dispatch('granted', coords);
        isOpen = false;
      },
      (error: { code: number; message: string }) => {
        loading = false;
        console.warn(`[Geolocation Error] Code ${error.code}: ${error.message}`, error);

        let msg = 'Gagal mendeteksi lokasi otomatis.';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            msg = 'Izin GPS diblokir browser atau sistem. Silakan pilih kecamatan Anda secara langsung di bawah.';
            break;
          case 2: // POSITION_UNAVAILABLE
            msg = 'Sinyal lokasi perangkat tidak terdeteksi. Silakan pilih kecamatan Anda di bawah.';
            break;
          case 3: // TIMEOUT
            msg = 'Deteksi GPS laptop tidak merespons (laptop tanpa sensor GPS satelit). Silakan pilih kecamatan Anda di bawah:';
            break;
          default:
            msg = error.message || 'Kendala saat membaca sensor GPS.';
            break;
        }

        errorMessage = msg;
        dispatch('denied', { message: msg });
      },
      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 300000,
      }
    );
  }

  function handleDismiss() {
    try {
      localStorage.setItem('umkm_geo_permission', 'dismissed');
    } catch {
      // ignore
    }
    dispatch('dismissed');
    isOpen = false;
  }

  onMount(() => {
    checkSecurityContext();
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      role="button"
      tabindex="0"
      aria-label="Tutup dialog"
      on:click={handleDismiss}
      on:keydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && handleDismiss()}
      class="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    ></div>

    <!-- Modal Card -->
    <div
      class="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-2xl border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="text-center mb-5">
        <div class="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center">
          <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400/20 animate-ping"></span>
          <div class="relative w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-inner">
            <span class="material-symbols-outlined text-[26px]">location_on</span>
          </div>
        </div>
        <h3 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Temukan UMKM Terdekat
        </h3>
        <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          Pilih kecamatan Anda atau aktifkan deteksi GPS untuk mengurutkan UMKM Banyuwangi dari yang paling dekat.
        </p>
      </div>

      {#if errorMessage}
        <div class="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
          <span class="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">info</span>
          <div class="flex-1">
            <p class="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      {/if}

      <!-- Section 1: Quick District Selector -->
      <div class="mb-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-emerald-600 text-[16px]">pin_drop</span>
            Pilih Kecamatan (Instan & Akurat)
          </span>
          <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50">
            Rekomendasi Laptop/PC
          </span>
        </div>

        <!-- Popular Chips -->
        <div class="flex flex-wrap gap-1.5 mb-3">
          {#each BANYUWANGI_POPULAR_DISTRICTS as dist}
            <button
              type="button"
              on:click={() => handleSelectDistrict(dist)}
              class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1 border shadow-xs {dist.name === 'Songgon' ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-emerald-600/20' : 'bg-white dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-zinc-700 dark:text-zinc-200 border-zinc-200/80 dark:border-zinc-700'}"
            >
              <span class="material-symbols-outlined text-[13px]">{dist.name === 'Songgon' ? 'stars' : 'location_on'}</span>
              <span>{dist.name}</span>
            </button>
          {/each}
        </div>

        <!-- Full District Dropdown -->
        <div class="relative">
          <select
            bind:value={selectedDistrictName}
            on:change={handleDistrictDropdownChange}
            class="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="" disabled selected>Pilih kecamatan lain di Banyuwangi (25 Kecamatan)...</option>
            {#each ALL_BANYUWANGI_DISTRICTS as d}
              <option value={d.name}>{d.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Section 2: GPS Detection Option -->
      <div class="space-y-2.5">
        {#if !isInsecureContext}
          <button
            type="button"
            on:click={requestLocation}
            disabled={loading}
            class="w-full py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {#if loading}
              <span class="material-symbols-outlined animate-spin text-[16px] text-emerald-600">progress_activity</span>
              <span>Mencoba Sensor GPS...</span>
            {:else}
              <span class="material-symbols-outlined text-[16px] text-emerald-600">my_location</span>
              <span>Deteksi GPS Perangkat Otomatis</span>
            {/if}
          </button>
        {/if}

        <button
          type="button"
          on:click={handleSkip}
          disabled={loading}
          class="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[15px]">explore</span>
          <span>Jelajahi Semua UMKM (Tanpa Filter Jarak)</span>
        </button>

        <button
          type="button"
          on:click={handleDismiss}
          disabled={loading}
          class="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 text-xs font-medium transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
