<script lang="ts">
  import { onMount } from 'svelte';
  import { CheckCircle, XCircle, Loader2, AlertCircle, Store, MapPin, Phone, ArrowRight, ArrowLeft } from 'lucide-svelte';
  import OnboardingStepSubdomain from './wizard/OnboardingStepSubdomain.svelte';
  import OnboardingStepStoreInfo from './wizard/OnboardingStepStoreInfo.svelte';
  import { subdomainField } from '@/lib/validators/subdomain';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
  type Step = 1 | 2 | 3;

  let currentStep: Step = 1;
  const STORAGE_KEY = 'onboarding_state';

  // Step 1: Subdomain
  let subdomain = '';
  let subdomainStatus: ValidationStatus = 'idle';
  let subdomainMessage = '';
  let debounceTimer: ReturnType<typeof setTimeout>;

  const DEBOUNCE_MS = 300;

  // Step 2: Store Info
  let storeName = '';
  let waNumber = '';
  let googleMapsUrl = '';
  let formErrors: Record<string, string> = {};

  // Step 3: Result
  let submitStatus: SubmitStatus = 'idle';
  let submitError = '';

  onMount(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        currentStep = state.currentStep || 1;
        subdomain = state.subdomain || '';
        storeName = state.storeName || '';
        waNumber = state.waNumber || '';
        googleMapsUrl = state.googleMapsUrl || '';
        subdomainStatus = state.subdomainStatus || 'idle';
        subdomainMessage = state.subdomainMessage || '';
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  });

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentStep,
      subdomain,
      storeName,
      waNumber,
      googleMapsUrl,
      subdomainStatus,
      subdomainMessage,
    }));
  }

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
    const result = subdomainField.safeParse(input);
    if (!result.success) {
      return result.error.errors[0].message;
    }
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
      saveState();
    } else if (currentStep === 2) {
      if (validateStep2()) {
        submitOnboard();
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep = (currentStep - 1) as Step;
      saveState();
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
          saveState();
        }
        return;
      }

      submitStatus = 'success';
      currentStep = 3;
      localStorage.removeItem(STORAGE_KEY);
      
      setTimeout(() => {
        window.location.href = '/dashboard/store';
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
      <OnboardingStepSubdomain
        bind:subdomain
        {subdomainStatus}
        {subdomainMessage}
        {isStep1Valid}
        onInput={onSubdomainInput}
        onNext={nextStep}
      />
    {:else if currentStep === 2}
      <OnboardingStepStoreInfo
        bind:storeName
        bind:waNumber
        bind:googleMapsUrl
        {formErrors}
        {submitStatus}
        {submitError}
        onPrev={prevStep}
        onNext={nextStep}
      />
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
          Anda akan diarahkan ke Pengaturan Toko dalam beberapa detik...
        </p>

        <a href="/dashboard/store-settings" class="btn btn-primary w-full">
          Ke Pengaturan Toko Sekarang
        </a>
      </div>
    {/if}
  </div>
</div>
