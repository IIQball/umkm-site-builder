<script lang="ts">
  import { onMount } from 'svelte';
  import { Card } from '@/components/ui';
  import OnboardingStepSubdomain from './wizard/OnboardingStepSubdomain.svelte';
  import OnboardingStepStoreInfo from './wizard/OnboardingStepStoreInfo.svelte';
  import OnboardingStepTemplate from './wizard/OnboardingStepTemplate.svelte';
  import OnboardingStepSettings from './wizard/OnboardingStepSettings.svelte';
  import OnboardingStepContent from './wizard/OnboardingStepContent.svelte';
  import OnboardingStepper from './wizard/OnboardingStepper.svelte';
  import OnboardingSuccessStep from './wizard/OnboardingSuccessStep.svelte';
  import type {
    TemplateItem,
    OnboardingStep,
    ExistingStoreData,
    StoreContentCustomization,
    StoreBranchItem,
    ValidationStatus,
  } from './onboarding.types';
  import { validateSubdomainLocally } from '@/lib/validators/subdomain';
  import {
    validateStoreInfo,
    checkSubdomainAvailability,
    submitOnboardStore,
    submitUpdateStore,
    DEFAULT_WA_CHECKOUT_TEMPLATE,
    DEFAULT_REGION,
    loadSavedOnboardingState,
    saveOnboardingState,
    clearOnboardingState,
  } from './onboarding.helpers';
  import {
    createDefaultContentCustomization,
    extractContentCustomizationFromStore,
    buildTemplateCustomizationPayload,
  } from './wizard/content/contentCustomization.helpers';

  export let categories: Array<{ id: string; name: string }> = [];
  export let templates: TemplateItem[] = [];
  export let isEdit: boolean = false;
  export let existingStore: ExistingStoreData | null = null;
  export let tenantId: string | undefined = undefined;

  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

  // Wizard Form State
  let currentStep: OnboardingStep = 1;
  let subdomain = '';
  let subdomainStatus: ValidationStatus = 'idle';
  let subdomainMessage = '';
  let debounceTimer: ReturnType<typeof setTimeout>;

  let storeName = '';
  let categoryId = '';
  let waNumber = '';
  let googleMapsUrl = '';
  let address = '';
  let branchMode: 'single' | 'multi' = 'single';
  let branches: StoreBranchItem[] = [];
  let regionData = { ...DEFAULT_REGION };
  let formErrors: Record<string, string> = {};

  let selectedTemplateId = '';
  let isOpen = true;
  let waCheckoutTemplate = '';
  let contentCustomization: StoreContentCustomization = createDefaultContentCustomization();
  let submitStatus: SubmitStatus = 'idle';
  let submitError = '';

  onMount(() => {
    if (isEdit && existingStore) {
      subdomain = existingStore.subdomain || '';
      subdomainStatus = 'available';
      storeName = existingStore.name || '';
      categoryId = existingStore.categoryId || '';
      waNumber = existingStore.waNumber || '';
      googleMapsUrl = existingStore.googleMapsUrl || '';
      address = existingStore.address || '';
      if (existingStore.regionData) regionData = { ...DEFAULT_REGION, ...existingStore.regionData };
      selectedTemplateId = existingStore.templateId || (templates[0]?.id ?? '');
      isOpen = existingStore.isOpen !== false;
      waCheckoutTemplate = existingStore.waCheckoutTemplate || DEFAULT_WA_CHECKOUT_TEMPLATE;
      branchMode = existingStore.branchMode || (existingStore.customization?.maps as any)?.branchMode || (existingStore.customization?.branchMode as any) || 'single';
      branches = existingStore.branches || (existingStore.customization?.maps as any)?.branches || (existingStore.customization?.branches as any) || [];
      const cat = categories.find((c) => c.id === existingStore?.categoryId)?.name || '';
      contentCustomization = extractContentCustomizationFromStore(existingStore.customization, storeName, cat, address);
      contentCustomization.maps = { branchMode, branches };
      return;
    }

    const state = loadSavedOnboardingState();
    if (state) {
      if (state.currentStep && state.currentStep >= 1 && state.currentStep <= 4) {
        currentStep = state.currentStep;
      }
      subdomain = state.subdomain || '';
      storeName = state.storeName || '';
      categoryId = state.categoryId || '';
      waNumber = state.waNumber || '';
      googleMapsUrl = state.googleMapsUrl || '';
      address = state.address || '';
      if (state.branchMode) branchMode = state.branchMode;
      if (Array.isArray(state.branches)) branches = state.branches;
      selectedTemplateId = state.selectedTemplateId || '';
      if (state.regionData) regionData = state.regionData;
      subdomainStatus = state.subdomainStatus || 'idle';
      subdomainMessage = state.subdomainMessage || '';
      if (state.contentCustomization) contentCustomization = state.contentCustomization;
      if (address && contentCustomization?.footer) contentCustomization.footer.address = address;
    }
    if (!selectedTemplateId && templates.length > 0) {
      selectedTemplateId = templates[0].id;
    }
  });

  function saveState() {
    if (isEdit) return;
    saveOnboardingState({
      currentStep, subdomain, storeName, categoryId, waNumber, googleMapsUrl,
      address, regionData, selectedTemplateId, subdomainStatus, subdomainMessage,
      branchMode, branches, contentCustomization,
    });
  }

  $: isStep1Valid = isEdit ? true : subdomainStatus === 'available';

  function onSubdomainInput(e: Event) {
    if (isEdit) return;
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
    debounceTimer = setTimeout(async () => {
      subdomainStatus = 'checking';
      const res = await checkSubdomainAvailability(subdomain);
      subdomainStatus = res.status;
      subdomainMessage = res.message;
    }, 300);
  }

  function nextStep() {
    if (currentStep === 1 && isStep1Valid) {
      currentStep = 2;
      saveState();
    } else if (currentStep === 2) {
      const validation = validateStoreInfo({
        storeName, categoryId, waNumber, googleMapsUrl, address, regionData,
      });
      formErrors = validation.errors;
      if (validation.isValid) {
        if (!contentCustomization.hero.title || contentCustomization.hero.title === 'Toko Unggulan Anda') {
          const cat = categories.find((c) => c.id === categoryId)?.name || '';
          contentCustomization = createDefaultContentCustomization(storeName, cat, address);
        }
        if (address && contentCustomization?.footer) contentCustomization.footer.address = address;
        contentCustomization.maps = { branchMode, branches };
        currentStep = 3;
        saveState();
      }
    } else if (currentStep === 3) {
      currentStep = 4;
      saveState();
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep = (currentStep - 1) as OnboardingStep;
      saveState();
    }
  }

  async function handleOnboardSubmit() {
    submitStatus = 'submitting';
    submitError = '';
    contentCustomization.maps = { branchMode, branches };
    const custPayload = buildTemplateCustomizationPayload(contentCustomization);
    const res = await submitOnboardStore({
      subdomain, name: storeName.trim(), categoryId, waNumber: waNumber.trim(),
      googleMapsUrl: googleMapsUrl.trim(), address, regionData,
      templateId: selectedTemplateId, tenantId, customization: custPayload,
    });

    if (!res.ok) {
      submitStatus = 'error';
      submitError = res.error || 'Gagal menyimpan profil toko';
      if (res.code === 'DUPLICATE_KEY') {
        currentStep = 1;
        subdomainStatus = 'taken';
        subdomainMessage = 'Subdomain sudah digunakan, silakan pilih yang lain';
        saveState();
      }
      return;
    }

    submitStatus = 'success';
    currentStep = 5;
    clearOnboardingState();
  }

  async function handleEditSubmit() {
    if (!existingStore?.id) return;
    submitStatus = 'submitting';
    submitError = '';
    contentCustomization.maps = { branchMode, branches };
    const custPayload = buildTemplateCustomizationPayload(contentCustomization);
    const res = await submitUpdateStore({
      storeId: existingStore.id, name: storeName.trim(), categoryId,
      waNumber: waNumber.trim(), googleMapsUrl: googleMapsUrl.trim(),
      address, regionData, templateId: selectedTemplateId, isOpen,
      waCheckoutTemplate, customization: custPayload,
    });

    if (!res.ok) {
      submitStatus = 'error';
      submitError = res.error || 'Gagal menyimpan pengaturan toko';
      return;
    }

    submitStatus = 'success';
    currentStep = 5;
  }
</script>

<div class="w-full transition-all duration-300">
  <OnboardingStepper
    {currentStep}
    {isEdit}
    onStepClick={(s) => { currentStep = s; }}
  />

  <Card padding="lg" variant="bordered" class="w-full transition-all duration-300">
    {#if currentStep === 1}
      <OnboardingStepSubdomain
        {isEdit} bind:subdomain {subdomainStatus} {subdomainMessage} {isStep1Valid}
        onInput={onSubdomainInput} onNext={nextStep}
      />
    {:else if currentStep === 2}
      <OnboardingStepStoreInfo
        {isEdit} bind:storeName bind:categoryId {categories}
        bind:waNumber bind:googleMapsUrl bind:address bind:regionData
        bind:branchMode bind:branches
        {formErrors} {submitStatus} {submitError}
        onPrev={prevStep} onNext={nextStep}
      />
    {:else if currentStep === 3}
      {#if isEdit}
        <OnboardingStepSettings
          {templates} {subdomain} bind:selectedTemplateId
          bind:isOpen bind:waCheckoutTemplate {submitStatus} {submitError}
          onPrev={prevStep} onSave={handleEditSubmit} onNext={nextStep}
        />
      {:else}
        <OnboardingStepTemplate
          {templates} bind:selectedTemplateId {storeName} {subdomain}
          {submitStatus} {submitError} onPrev={prevStep} onNext={nextStep}
        />
      {/if}
    {:else if currentStep === 4}
      <OnboardingStepContent
        {templates} {categories} {selectedTemplateId} {subdomain} {storeName}
        {waNumber} {address} {googleMapsUrl} {branchMode} {branches} {isEdit}
        bind:customization={contentCustomization} {submitStatus} {submitError}
        onPrev={prevStep} onSubmit={isEdit ? handleEditSubmit : handleOnboardSubmit}
      />
    {:else if currentStep === 5}
      <OnboardingSuccessStep
        {isEdit} {subdomain} {storeName} {address} onResetStep={() => { currentStep = 1; }}
      />
    {/if}
  </Card>
</div>
