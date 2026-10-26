<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Modal } from '@/components/ui';
  import ProductLogoWizard from './ProductLogoWizard.svelte';
  import AiLoadingProgress from './AiLoadingProgress.svelte';
  import AiResultPreview from './AiResultPreview.svelte';
  import { generateAiAssetClient, type GenerateAiAssetResponse } from '@/lib/api/ai-client';
  import { sanitizePromptInput } from '@/lib/security/prompt-sanitizer';
  import type { AiLogoInput } from '@/lib/validators/ai-logo';
  import type { LogoConceptType } from '@/lib/validators/ai-logo';

  export let open: boolean = false;
  export let storeId: string = '';
  export let storeName: string = '';
  export let initialCategory: string = 'Kuliner & Makanan';
  export let initialConcept: LogoConceptType = 'letter_fusion';

  const dispatch = createEventDispatcher<{
    close: void;
    success: { imageUrl: string; logId: string };
    apply: { imageUrl: string; logId: string };
  }>();

  type WizardStep = 'form' | 'generating' | 'preview';

  let currentStep: WizardStep = 'form';
  let isGenerating = false;
  let generationProgress = 15;
  let generationError = '';

  let generatedResult: GenerateAiAssetResponse | null = null;
  let lastSubmitPayload: AiLogoInput | null = null;
  let generationStartTime = 0;
  let executionDurationMs = 0;

  function resetState() {
    currentStep = 'form';
    isGenerating = false;
    generationProgress = 15;
    generationError = '';
    generatedResult = null;
    lastSubmitPayload = null;
    executionDurationMs = 0;
  }

  function handleClose() {
    open = false;
    resetState();
    dispatch('close');
  }

  async function executeLogoGeneration(payload: AiLogoInput) {
    lastSubmitPayload = payload;
    currentStep = 'generating';
    isGenerating = true;
    generationProgress = 20;
    generationError = '';
    generationStartTime = Date.now();

    // Simulasi progress halus sembari menunggu koneksi model
    const progressTimer = setInterval(() => {
      if (generationProgress < 85) {
        generationProgress += Math.floor(Math.random() * 12) + 5;
      }
    }, 1200);

    try {
      const cleanStoreName = sanitizePromptInput(payload.storeName);
      const cleanLogoText = payload.logoText ? sanitizePromptInput(payload.logoText) : undefined;
      const cleanFocal = payload.focalSubject ? sanitizePromptInput(payload.focalSubject) : undefined;

      const response = await generateAiAssetClient({
        featureType: 'logo',
        storeId,
        storeName: cleanStoreName,
        category: payload.businessCategory || initialCategory,
        businessCategory: payload.businessCategory || initialCategory,
        conceptType: payload.conceptType || payload.visualStyle,
        visualStyle: payload.visualStyle,
        logoText: cleanLogoText,
        lockupType: payload.lockupType,
        fontFamily: payload.fontFamily,
        colorPalette: payload.colorPalette.join(', '),
        focalSubject: cleanFocal,
        qualityTier: payload.qualityTier || 'high',
      });

      clearInterval(progressTimer);
      generationProgress = 100;
      executionDurationMs = Date.now() - generationStartTime;
      generatedResult = response;
      currentStep = 'preview';

      dispatch('success', {
        imageUrl: response.imageUrl,
        logId: response.logId,
      });
    } catch (err: unknown) {
      clearInterval(progressTimer);
      generationError = err instanceof Error ? err.message : 'Gagal membuat logo toko AI';
      currentStep = 'form';
    } finally {
      isGenerating = false;
    }
  }

  function handleWizardSubmit(event: CustomEvent<AiLogoInput>) {
    executeLogoGeneration(event.detail);
  }

  function handleRegenerate() {
    if (lastSubmitPayload) {
      executeLogoGeneration(lastSubmitPayload);
    } else {
      currentStep = 'form';
    }
  }

  function handleApplyResult(event: CustomEvent<{ imageUrl: string; logId: string }>) {
    dispatch('apply', {
      imageUrl: event.detail.imageUrl,
      logId: event.detail.logId,
    });
    handleClose();
  }
</script>

<Modal
  {open}
  title={currentStep === 'preview' ? 'Hasil Desain Logo Toko AI' : 'Generator Logo Toko AI'}
  description={currentStep === 'preview'
    ? 'Periksa kesesuaian logo visual toko Anda sebelum diterapkan ke identitas toko.'
    : 'Rancang logo toko profesional berbasis vektor flat & tipografi bersih tanpa repot.'}
  size="xl"
  on:close={handleClose}
>
  <div class="py-1">
    {#if generationError}
      <div class="mb-5 p-3.5 bg-error/10 border border-error/30 rounded-xl text-error text-xs flex items-start gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{generationError}</span>
      </div>
    {/if}

    {#if currentStep === 'form'}
      <ProductLogoWizard
        loading={isGenerating}
        initialStoreName={storeName}
        {initialCategory}
        {initialConcept}
        on:submit={handleWizardSubmit}
        on:cancel={handleClose}
      />
    {:else if currentStep === 'generating'}
      <div class="py-8">
        <AiLoadingProgress
          progress={generationProgress}
          title="Merancang Logo Vektor AI..."
        />
      </div>
    {:else if currentStep === 'preview' && generatedResult}
      <AiResultPreview
        imageUrl={generatedResult.imageUrl}
        featureType="logo"
        modelUsed={generatedResult.modelUsed || 'gpt-image-2.5-sunburst'}
        qualityTier={lastSubmitPayload?.qualityTier || 'high'}
        executionTimeMs={executionDurationMs}
        logId={generatedResult.logId}
        applyLabel="Pasang sebagai Logo Toko"
        on:regenerate={handleRegenerate}
        on:apply={handleApplyResult}
        on:close={handleClose}
      />
    {/if}
  </div>
</Modal>
