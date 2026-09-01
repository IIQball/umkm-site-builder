<script lang="ts">
  import { subdomainField } from '@lib/validators/subdomain';
  import OnboardingStepSubdomain from './wizard/OnboardingStepSubdomain.svelte';
  import OnboardingStepStoreInfo from './wizard/OnboardingStepStoreInfo.svelte';
  import OnboardingStepSuccess from './wizard/OnboardingStepSuccess.svelte';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
  type Step = 1 | 2 | 3;

  let currentStep: Step = 1;

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
      <OnboardingStepSuccess
        {subdomain}
        {storeName}
      />
    {/if}
  </div>
</div>
