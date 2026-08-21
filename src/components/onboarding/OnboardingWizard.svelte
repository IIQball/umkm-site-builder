<script lang="ts">
  import { CheckCircle, XCircle, Loader2, AlertCircle, Store, MapPin, Phone, ArrowRight, ArrowLeft } from 'lucide-svelte';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
  type Step = 1 | 2 | 3;

  let currentStep: Step = 1;

  // Step 1: Subdomain
  let subdomain = '';
  let subdomainStatus: ValidationStatus = 'idle';
  let subdomainMessage = '';
  let debounceTimer: ReturnType<typeof setTimeout>;

  const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 63;
  const DEBOUNCE_MS = 300;

  // Step 2: Store Info
  let storeName = '';
  let waNumber = '';
  let googleMapsUrl = '';
  let formErrors: Record<string, string> = {};

  // Step 3: Result
  let submitStatus: SubmitStatus = 'idle';
  let submitError = '';

  $: isStep1Valid = subdomainStatus === 'available';
  
  function validateStep2(): boolean {
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

  function validateSubdomainLocally(input: string): string | null {
    if (input.length < MIN_LENGTH) return `Minimal ${MIN_LENGTH} karakter`;
    if (input.length > MAX_LENGTH) return `Maksimal ${MAX_LENGTH} karakter`;
    if (!SUBDOMAIN_PATTERN.test(input)) return 'Hanya huruf kecil, angka, dan tanda hubung';
    if (input.startsWith('-') || input.endsWith('-')) return 'Tidak boleh diawali/diakhiri tanda hubung';
    return null;
  }

  async function checkAvailability(val: string) {
    subdomainStatus = 'checking';
    subdomainMessage = '';

    try {
      const res = await fetch('/api/stores/check-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: val }),
      });

      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await res.json();

      if (!data.ok) {
        subdomainStatus = 'invalid';
        subdomainMessage = data.error?.message ?? 'Validasi gagal';
        return;
      }

      if (data.data.available) {
        subdomainStatus = 'available';
        subdomainMessage = 'Subdomain tersedia';
      } else {
        subdomainStatus = 'taken';
        subdomainMessage = 'Subdomain sudah digunakan';
      }
    } catch {
      subdomainStatus = 'error';
      subdomainMessage = 'Gagal memeriksa ketersediaan';
    }
  }

  function onSubdomainInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    subdomain = raw;
    
    clearTimeout(debounceTimer);

    if (!subdomain) {
      subdomainStatus = 'idle';
      subdomainMessage = '';
      return;
    }

    const localError = validateSubdomainLocally(subdomain);
    if (localError) {
      subdomainStatus = 'invalid';
      subdomainMessage = localError;
      return;
    }

    subdomainStatus = 'typing';
    subdomainMessage = '';
    debounceTimer = setTimeout(() => checkAvailability(subdomain), DEBOUNCE_MS);
  }

  function nextStep() {
    if (currentStep === 1 && isStep1Valid) {
      currentStep = 2;
    } else if (currentStep === 2) {
      if (validateStep2()) {
        submitOnboard();
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep = (currentStep - 1) as Step;
    }
  }

  async function submitOnboard() {
    submitStatus = 'submitting';
    submitError = '';

    try {
      const res = await fetch('/api/stores/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain,
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

      if (!data.ok) {
        submitStatus = 'error';
        submitError = data.error?.message ?? 'Gagal menyimpan profil toko';

        if (data.error?.code === 'DUPLICATE_KEY') {
          currentStep = 1;
          subdomainStatus = 'taken';
          subdomainMessage = 'Subdomain sudah digunakan, silakan pilih yang lain';
        }
        return;
      }

      submitStatus = 'success';
      currentStep = 3;
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch {
      submitStatus = 'error';
      submitError = 'Terjadi kesalahan. Silakan coba lagi.';
    }
  }
</script>

<div class="w-full max-w-2xl mx-auto">
  <!-- Stepper Header -->
  <ul class="steps steps-horizontal w-full mb-8">
    <li class="step {currentStep >= 1 ? 'step-primary' : ''}">Alamat</li>
    <li class="step {currentStep >= 2 ? 'step-primary' : ''}">Profil Toko</li>
    <li class="step {currentStep >= 3 ? 'step-primary' : ''}">Selesai</li>
  </ul>

  <!-- Step Content -->
  <div class="bg-card rounded-3xl shadow-xl p-8 border border-border">
    
    {#if currentStep === 1}
      <!-- STEP 1: SUBDOMAIN -->
      <div class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold mb-2">Pilih Alamat Toko</h2>
          <p class="text-base-content/70 text-sm">
            Tentukan subdomain unik untuk toko online Anda. Ini akan menjadi URL toko Anda.
          </p>
        </div>

        <div class="form-control w-full">
          <label class="label" for="subdomain-input">
            <span class="label-text font-medium">Subdomain Toko</span>
          </label>

          <div class="join w-full">
            <input
              id="subdomain-input"
              type="text"
              class="input input-bordered join-item w-full"
              class:input-success={subdomainStatus === 'available'}
              class:input-error={subdomainStatus === 'taken' || subdomainStatus === 'invalid' || subdomainStatus === 'error'}
              placeholder="nama-toko"
              maxlength={MAX_LENGTH}
              autocomplete="off"
              spellcheck="false"
              value={subdomain}
              on:input={onSubdomainInput}
            />
            <span class="join-item flex items-center bg-nested px-3 text-sm font-medium text-muted">
              .umkm.site
            </span>
          </div>

          <label class="label" for="subdomain-input">
            {#if subdomainStatus === 'checking'}
              <span class="label-text-alt flex items-center gap-1 text-info">
                <Loader2 size={14} class="animate-spin" />
                Memeriksa ketersediaan...
              </span>
            {:else if subdomainStatus === 'available'}
              <span class="label-text-alt flex items-center gap-1 text-success">
                <CheckCircle size={14} />
                {subdomainMessage}
              </span>
            {:else if subdomainStatus === 'taken'}
              <span class="label-text-alt flex items-center gap-1 text-error">
                <XCircle size={14} />
                {subdomainMessage}
              </span>
            {:else if subdomainStatus === 'invalid'}
              <span class="label-text-alt flex items-center gap-1 text-warning">
                <AlertCircle size={14} />
                {subdomainMessage}
              </span>
            {:else if subdomainStatus === 'error'}
              <span class="label-text-alt flex items-center gap-1 text-error">
                <AlertCircle size={14} />
                {subdomainMessage}
              </span>
            {:else if subdomainStatus === 'typing'}
              <span class="label-text-alt text-base-content/40">
                Mengetik...
              </span>
            {:else}
              <span class="label-text-alt text-base-content/40">
                Contoh: kopi-budi, toko-sari
              </span>
            {/if}
          </label>
        </div>

        <div class="mt-4 flex justify-end gap-3">
          <button
            type="button"
            class="btn btn-primary"
            disabled={!isStep1Valid}
            on:click={nextStep}
          >
            Lanjutkan
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

    {:else if currentStep === 2}
      <!-- STEP 2: STORE INFO -->
      <div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold mb-2">Profil Toko</h2>
          <p class="text-base-content/70 text-sm">
            Lengkapi informasi toko Anda untuk memudahkan pelanggan berbelanja.
          </p>
        </div>

        <div class="space-y-4">
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
        </div>

        {#if submitError}
          <div class="alert alert-error text-sm mt-2">
            <AlertCircle size={16} />
            <span>{submitError}</span>
          </div>
        {/if}

        <div class="mt-4 flex justify-between gap-3">
          <button
            type="button"
            class="btn btn-ghost"
            disabled={submitStatus === 'submitting'}
            on:click={prevStep}
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
          
          <button
            type="button"
            class="btn btn-primary"
            disabled={submitStatus === 'submitting'}
            on:click={nextStep}
          >
            {#if submitStatus === 'submitting'}
              <Loader2 size={18} class="animate-spin" />
              Menyimpan...
            {:else}
              Selesai
              <CheckCircle size={18} />
            {/if}
          </button>
        </div>
      </div>

    {:else if currentStep === 3}
      <!-- STEP 3: SUCCESS -->
      <div class="flex flex-col items-center text-center gap-4 py-8 animate-in zoom-in-95 duration-500">
        <div class="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mb-2">
          <CheckCircle size={32} />
        </div>
        
        <h2 class="text-2xl font-bold">Profil Toko Berhasil Dibuat!</h2>
        
        <div class="bg-nested p-4 rounded-xl w-full text-left mb-4 border border-border-light">
          <p class="text-sm text-muted mb-1">Subdomain:</p>
          <p class="font-mono font-medium mb-3 text-main">{subdomain}.umkm.site</p>
          
          <p class="text-sm text-muted mb-1">Nama Toko:</p>
          <p class="font-medium text-main">{storeName}</p>
        </div>
        
        <p class="text-base-content/70 mb-4">
          Anda akan diarahkan ke Dashboard dalam beberapa detik...
        </p>

        <a href="/dashboard" class="btn btn-primary w-full">
          Ke Dashboard Sekarang
        </a>
      </div>
    {/if}
    
  </div>
</div>
