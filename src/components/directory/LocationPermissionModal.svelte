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
      class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    ></div>

    <!-- Modal Card -->
    <div
      class="relative w-full max-w-lg rounded-3xl bg-card p-6 sm:p-7 shadow-2xl border border-border text-main z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="text-center mb-5">
        <div class="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center border border-orange/20 shadow-xs mx-auto mb-3">
          <span class="material-symbols-outlined text-[24px]">location_on</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-main font-heading">
          Temukan UMKM Terdekat
        </h3>
        <p class="text-xs sm:text-sm text-secondary mt-1.5 max-w-sm mx-auto font-sans leading-relaxed">
          Pilih kecamatan Anda atau aktifkan deteksi GPS untuk mengurutkan UMKM Banyuwangi dari yang paling dekat.
        </p>
      </div>

      {#if errorMessage}
        <div class="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
          <span class="material-symbols-outlined text-[18px] text-amber-500 shrink-0 mt-0.5">info</span>
          <div class="flex-1">
            <p class="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      {/if}

      <!-- Section 1: Quick District Selector -->
      <div class="mb-5 p-4 rounded-2xl bg-nested border border-border">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-bold text-main flex items-center gap-1.5">
            <span class="material-symbols-outlined text-orange text-[16px]">pin_drop</span>
            Pilih Kecamatan (Instan & Akurat)
          </span>
          <span class="text-[10px] text-orange font-semibold px-2 py-0.5 rounded-full bg-orange/10 border border-orange/20">
            Rekomendasi
          </span>
        </div>

        <!-- Popular Chips -->
        <div class="flex flex-wrap gap-1.5 mb-3">
          {#each BANYUWANGI_POPULAR_DISTRICTS as dist}
            <button
              type="button"
              on:click={() => handleSelectDistrict(dist)}
              class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1 border shadow-xs cursor-pointer {dist.name === 'Songgon' ? 'bg-orange hover:bg-orange-dark text-white border-orange shadow-orange/20' : 'bg-card hover:bg-nested text-secondary hover:text-main border-border'}"
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
            class="w-full px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs text-main focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-colors"
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
            class="w-full py-2.5 px-4 rounded-xl border border-border bg-card hover:bg-nested text-main text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
          >
            {#if loading}
              <span class="material-symbols-outlined animate-spin text-[16px] text-orange">progress_activity</span>
              <span>Mencoba Sensor GPS...</span>
            {:else}
              <span class="material-symbols-outlined text-[16px] text-orange">my_location</span>
              <span>Deteksi GPS Perangkat Otomatis</span>
            {/if}
          </button>
        {/if}

        <button
          type="button"
          on:click={handleSkip}
          disabled={loading}
          class="w-full py-2.5 px-4 rounded-xl bg-nested hover:bg-card border border-border text-secondary hover:text-main font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span class="material-symbols-outlined text-[15px]">explore</span>
          <span>Jelajahi Semua UMKM (Tanpa Filter Jarak)</span>
        </button>

        <button
          type="button"
          on:click={handleDismiss}
          disabled={loading}
          class="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-nested text-muted hover:text-main text-xs font-medium transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
