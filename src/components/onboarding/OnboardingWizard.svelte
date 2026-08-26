<script lang="ts">
  import { Loader2, ArrowRight, ArrowLeft } from 'lucide-svelte';
  import type { ValidationStatus, SubmitStatus } from '@/types/common';
  import OnboardingStepSubdomain from './steps/OnboardingStepSubdomain.svelte';
  import OnboardingStepStoreInfo from './steps/OnboardingStepStoreInfo.svelte';
  import OnboardingStepSuccess from './steps/OnboardingStepSuccess.svelte';

  let currentStep = 1;

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

    return isValid;
  }

  function handleSubdomainInput(value: string) {
    subdomain = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    clearTimeout(debounceTimer);

    if (!subdomain) {
      subdomainStatus = 'idle';
      subdomainMessage = '';
      return;
    }

    if (subdomain.length < MIN_LENGTH) {
      subdomainStatus = 'invalid';
      subdomainMessage = `Subdomain minimal ${MIN_LENGTH} karakter`;
      return;
    }

    if (subdomain.length > MAX_LENGTH) {
      subdomainStatus = 'invalid';
      subdomainMessage = `Subdomain maksimal ${MAX_LENGTH} karakter`;
      return;
    }

    if (!SUBDOMAIN_PATTERN.test(subdomain)) {
      subdomainStatus = 'invalid';
      subdomainMessage = 'Format subdomain tidak valid';
      return;
    }

    subdomainStatus = 'checking';
    subdomainMessage = 'Memeriksa ketersediaan...';

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stores/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`);
        const data = await res.json();

        if (res.ok && data.available) {
          subdomainStatus = 'available';
          subdomainMessage = 'Subdomain tersedia!';
        } else {
          subdomainStatus = 'taken';
          subdomainMessage = data.message || 'Subdomain sudah digunakan';
        }
      } catch {
        subdomainStatus = 'invalid';
        subdomainMessage = 'Gagal memeriksa subdomain';
      }
    }, DEBOUNCE_MS);
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
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
          googleMapsUrl: googleMapsUrl || undefined,
        }),
      });

      if (res.ok) {
        submitStatus = 'success';
        currentStep = 3;
      } else {
        const data = await res.json();
        submitStatus = 'error';
        submitError = data.message || 'Gagal mendaftarkan toko';
      }
    } catch {
      submitStatus = 'error';
      submitError = 'Terjadi kesalahan pada server';
    }
  }
</script>

<div class="w-full max-w-xl mx-auto p-6 md:p-8 rounded-3xl bg-base-100 dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-xl space-y-6">
  <!-- Stepper Indicator -->
  <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-4">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center {currentStep >= 1 ? 'bg-primary text-white' : 'bg-base-200 text-base-content/50'}">
        1
      </span>
      <span class="text-xs font-bold {currentStep >= 1 ? 'text-base-content' : 'text-base-content/40'}">Subdomain</span>
    </div>
    <div class="h-0.5 w-12 bg-base-200 dark:bg-slate-800"></div>
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center {currentStep >= 2 ? 'bg-primary text-white' : 'bg-base-200 text-base-content/50'}">
        2
      </span>
      <span class="text-xs font-bold {currentStep >= 2 ? 'text-base-content' : 'text-base-content/40'}">Profil Toko</span>
    </div>
    <div class="h-0.5 w-12 bg-base-200 dark:bg-slate-800"></div>
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center {currentStep >= 3 ? 'bg-primary text-white' : 'bg-base-200 text-base-content/50'}">
        3
      </span>
      <span class="text-xs font-bold {currentStep >= 3 ? 'text-base-content' : 'text-base-content/40'}">Selesai</span>
    </div>
  </div>

  {#if submitError}
    <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
      {submitError}
    </div>
  {/if}

  <!-- Step Content -->
  {#if currentStep === 1}
    <OnboardingStepSubdomain
      {subdomain}
      {subdomainStatus}
      {subdomainMessage}
      onInputSubdomain={handleSubdomainInput}
    />
    <div class="flex justify-end pt-4">
      <button
        type="button"
        on:click={() => (currentStep = 2)}
        disabled={!isStep1Valid}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary disabled:opacity-40 cursor-pointer shadow-md"
      >
        <span>Lanjut</span>
        <ArrowRight size={14} />
      </button>
    </div>
  {:else if currentStep === 2}
    <OnboardingStepStoreInfo
      bind:storeName
      bind:waNumber
      bind:googleMapsUrl
      {formErrors}
    />
    <div class="flex items-center justify-between pt-4">
      <button
        type="button"
        on:click={() => (currentStep = 1)}
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-base-200 text-base-content cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Kembali</span>
      </button>
      <button
        type="button"
        on:click={handleSubmit}
        disabled={submitStatus === 'submitting'}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary disabled:opacity-40 cursor-pointer shadow-md"
      >
        {#if submitStatus === 'submitting'}
          <Loader2 size={14} class="animate-spin" />
        {/if}
        <span>Selesaikan Setup</span>
        <ArrowRight size={14} />
      </button>
    </div>
  {:else if currentStep === 3}
    <OnboardingStepSuccess {storeName} {subdomain} />
  {/if}
</div>
