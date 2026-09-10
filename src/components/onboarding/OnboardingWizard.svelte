<script lang="ts">
  import { onMount } from 'svelte';
  import { Card } from '@/components/ui';
  import OnboardingStepSubdomain from './wizard/OnboardingStepSubdomain.svelte';
  import OnboardingStepStoreInfo from './wizard/OnboardingStepStoreInfo.svelte';
  import OnboardingStepTemplate from './wizard/OnboardingStepTemplate.svelte';
  import OnboardingStepper from './wizard/OnboardingStepper.svelte';
  import OnboardingSuccessStep from './wizard/OnboardingSuccessStep.svelte';
  import type { TemplateItem, OnboardingStep } from './onboarding.types';
  import { validateSubdomainLocally } from '@/lib/validators/subdomain';

  export let categories: Array<{ id: string; name: string }> = [];
  export let templates: TemplateItem[] = [];

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

  let currentStep: OnboardingStep = 1;
  const STORAGE_KEY = 'onboarding_state';

  // Step 1: Subdomain
  let subdomain = '';
  let subdomainStatus: ValidationStatus = 'idle';
  let subdomainMessage = '';
  let debounceTimer: ReturnType<typeof setTimeout>;

  // Step 2: Store Info & Region
  let storeName = '';
  let categoryId = '';
  let waNumber = '';
  let googleMapsUrl = '';
  let address = '';
  let regionData = {
    province: 'Jawa Timur',
    city: 'Banyuwangi',
    district: '',
    subDistrict: '',
    hamlet: '',
    street: '',
  };
  let formErrors: Record<string, string> = {};

  // Step 3: Template Selection
  let selectedTemplateId = '';

  // Step 4: Result
  let submitStatus: SubmitStatus = 'idle';
  let submitError = '';

  onMount(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        currentStep = (state.currentStep && state.currentStep <= 3) ? state.currentStep : 1;
        subdomain = state.subdomain || '';
        storeName = state.storeName || '';
        categoryId = state.categoryId || '';
        waNumber = state.waNumber || '';
        googleMapsUrl = state.googleMapsUrl || '';
        address = state.address || '';
        selectedTemplateId = state.selectedTemplateId || '';
        if (state.regionData) regionData = state.regionData;
        subdomainStatus = state.subdomainStatus || 'idle';
        subdomainMessage = state.subdomainMessage || '';
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    if (!selectedTemplateId && templates.length > 0) {
      selectedTemplateId = templates[0].id;
    }
  });

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentStep,
      subdomain,
      storeName,
      categoryId,
      waNumber,
      googleMapsUrl,
      address,
      regionData,
      selectedTemplateId,
      subdomainStatus,
      subdomainMessage,
    }));
  }

  $: isStep1Valid = subdomainStatus === 'available';

  function validateStep2(): boolean {
    formErrors = {};
    let isValid = true;

    if (!storeName || storeName.trim().length < 3) {
      formErrors.storeName = 'Nama toko minimal 3 karakter';
      isValid = false;
    }

    if (!categoryId) {
      formErrors.categoryId = 'Kategori bisnis wajib dipilih';
      isValid = false;
    }

    if (!waNumber || !/^628[0-9]{7,12}$/.test(waNumber.trim())) {
      formErrors.waNumber = 'Nomor WhatsApp tidak valid. Gunakan format 628...';
      isValid = false;
    }

    if (!googleMapsUrl || !googleMapsUrl.trim()) {
      formErrors.googleMapsUrl = 'Link Google Maps wajib diisi';
      isValid = false;
    } else {
      try {
        new URL(googleMapsUrl.trim());
      } catch {
        formErrors.googleMapsUrl = 'URL Google Maps tidak valid';
        isValid = false;
      }
    }

    if (!regionData.district) {
      formErrors.district = 'Pilih kecamatan';
      isValid = false;
    }
    if (!regionData.subDistrict) {
      formErrors.subDistrict = 'Pilih kelurahan / desa';
      isValid = false;
    }
    if (!regionData.hamlet?.trim()) {
      formErrors.hamlet = 'Dusun / lingkungan wajib diisi';
      isValid = false;
    }
    if (!regionData.street?.trim()) {
      formErrors.street = 'Detail jalan & RT/RW wajib diisi';
      isValid = false;
    }
    if (!address || address.trim().length < 5) {
      formErrors.address = 'Alamat toko wajib diisi lengkap';
      isValid = false;
    }

    return isValid;
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
    const input = (e.target || e.currentTarget) as HTMLInputElement | null;
    if (!input) return;
    subdomain = input.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    clearTimeout(debounceTimer);
    if (!subdomain) {
      subdomainStatus = 'idle';
      subdomainMessage = '';
      return;
    }
    const localErr = validateSubdomainLocally(subdomain);
    if (localErr) {
      subdomainStatus = 'invalid';
      subdomainMessage = localErr;
      return;
    }
    subdomainStatus = 'typing';
    subdomainMessage = '';
    debounceTimer = setTimeout(() => checkAvailability(subdomain), 300);
  }

  function nextStep() {
    if (currentStep === 1 && isStep1Valid) {
      currentStep = 2;
      saveState();
    } else if (currentStep === 2) {
      if (validateStep2()) {
        currentStep = 3;
        saveState();
      }
    } else if (currentStep === 3) {
      submitOnboard();
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep = (currentStep - 1) as OnboardingStep;
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
          name: storeName.trim(),
          categoryId,
          waNumber: waNumber.trim(),
          googleMapsUrl: googleMapsUrl.trim(),
          address,
          regionData,
          templateId: selectedTemplateId,
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
      currentStep = 4;
      localStorage.removeItem(STORAGE_KEY);
      setTimeout(() => {
        window.location.href = '/dashboard/store-settings';
      }, 2200);
    } catch {
      submitStatus = 'error';
      submitError = 'Terjadi kesalahan sistem. Silakan coba lagi.';
    }
  }
</script>

<div class="w-full transition-all duration-300 mx-auto {currentStep === 3 ? 'max-w-5xl' : 'max-w-2xl'}">
  <!-- Stepper Header Navigation -->
  <OnboardingStepper
    {currentStep}
    onStepClick={(s) => { currentStep = s; }}
  />

  <!-- Step Content Card (Identical variant & padding to dashboard cards) -->
  <Card padding="lg" variant="bordered" class="transition-all duration-300">
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
        bind:categoryId
        {categories}
        bind:waNumber
        bind:googleMapsUrl
        bind:address
        bind:regionData
        {formErrors}
        {submitStatus}
        {submitError}
        onPrev={prevStep}
        onNext={nextStep}
      />
    {:else if currentStep === 3}
      <OnboardingStepTemplate
        {templates}
        bind:selectedTemplateId
        {storeName}
        {subdomain}
        {submitStatus}
        {submitError}
        onPrev={prevStep}
        onNext={nextStep}
      />
    {:else if currentStep === 4}
      <OnboardingSuccessStep
        {subdomain}
        {storeName}
        {address}
      />
    {/if}
  </Card>
</div>
