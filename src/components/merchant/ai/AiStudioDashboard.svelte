<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Badge } from '@/components/ui';
  import ProductLogoWizard from './ProductLogoWizard.svelte';
  import ProductPackagingWizard from './ProductPackagingWizard.svelte';
  import ProductPosterWizard from './ProductPosterWizard.svelte';
  import AiLoadingProgress from './AiLoadingProgress.svelte';
  import AiAssetGallery from './AiAssetGallery.svelte';
  import AiDeveloperTestBar from './AiDeveloperTestBar.svelte';
  import AiCreditTopupBanner from './AiCreditTopupBanner.svelte';
  import { generateAiAssetClient } from '@/lib/api/ai-client';
  import { formatAiErrorMessage } from '@/lib/errors/ai-error';
  import { toast } from '@/lib/toast';
  import type { AiAssetItem } from './gallery.constants';
  import type { AiLogoInput } from '@/lib/validators/ai-logo';
  import type { AiPackagingInput } from '@/lib/validators/ai-packaging';
  import type { AiPosterInput } from '@/lib/validators/ai-poster';
  import type { AiStudioMainTab, AiStudioSubTab, AiStudioGeneratePayload } from './studio.types';

  export let storeId: string = '';
  export let storeName: string = '';

  let mainTab: AiStudioMainTab = 'studio';
  let designSubTab: AiStudioSubTab = 'packaging';

  let isGenerating = false;
  let generationProgress = 10;
  let generationTitle = 'Sedang Merancang Visual AI...';
  let generalError = '';
  let successNotice = '';

  let assets: AiAssetItem[] = [];
  let isAssetsLoading = false;
  let isTestMode = false;
  let isTesting = false;

  let creditBalance = 0;
  let creditTotalPurchased = 0;
  let activeTier = 'trial';
  let activePackageName = 'Belum Ada Paket Aktif';
  let isCreditLoading = false;

  $: creditStatusStyle = creditBalance <= 0
    ? { badge: 'bg-error/10 text-error border-error/25 hover:bg-error/20', subtext: 'text-error/80' }
    : creditBalance <= 2
    ? { badge: 'bg-warning/10 text-warning border-warning/25 hover:bg-warning/20', subtext: 'text-warning/80' }
    : { badge: 'bg-success/10 text-success border-success/25 hover:bg-success/20', subtext: 'text-success/80' };

  async function fetchCreditBalance() {
    if (!storeId) return;
    isCreditLoading = true;
    try {
      const res = await fetch(`/api/tenant/ai-credit/${storeId}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        creditBalance = typeof data.balance === 'number' ? data.balance : 0;
        creditTotalPurchased = typeof data.totalPurchased === 'number' ? data.totalPurchased : 0;
        activeTier = data.tier || 'trial';
        activePackageName = data.packageName || (creditTotalPurchased > 0 ? 'Paket Aktif' : 'Belum Ada Paket Aktif');
      }
    } catch {
      // Offline fallback
    } finally {
      isCreditLoading = false;
    }
  }

  async function fetchAssetHistory() {
    isAssetsLoading = true;
    try {
      const res = await fetch('/api/tenant/ai/history');
      if (res.ok) {
        const json = await res.json();
        assets = json.data?.items || json.items || [];
      }
    } catch {
      // Offline fallback
    } finally {
      isAssetsLoading = false;
    }
  }

  onMount(() => {
    fetchAssetHistory();
    fetchCreditBalance();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      isTestMode = urlParams.get('testMode') === 'true';
    }
  });

  async function executeGeneration(payload: AiStudioGeneratePayload) {
    const reqCredits = payload.qualityTier === 'high' ? 2 : 1;
    if (creditBalance < reqCredits && !(isTestMode && isTesting)) {
      generalError = creditBalance <= 0
        ? 'Kredit AI toko Anda telah habis. Silakan lakukan isi ulang kredit terlebih dahulu.'
        : `Kredit tidak mencukupi untuk desain ini (butuh ${reqCredits} kredit, tersisa ${creditBalance} kredit).`;
      toast.error(generalError);
      return;
    }

    isGenerating = true;
    generationProgress = 15;
    generationTitle = `Membuat ${payload.featureType === 'logo' ? 'Logo' : payload.featureType === 'packaging_mockup' ? 'Mockup Kemasan' : 'Poster'} AI...`;
    generalError = '';
    successNotice = '';

    try {
      await generateAiAssetClient({
        ...payload,
        storeId,
        qualityTier: payload.qualityTier || 'high',
        isTesting: isTestMode && isTesting,
        size: payload.size || '1024x1024',
      });

      generationProgress = 100;
      successNotice = 'Desain visual AI berhasil dibuat dan disimpan ke galeri!';
      toast.success(successNotice);
      await Promise.all([fetchAssetHistory(), fetchCreditBalance()]);
      mainTab = 'gallery';
    } catch (err: unknown) {
      generalError = formatAiErrorMessage(err);
      toast.error(generalError);
    } finally {
      isGenerating = false;
    }
  }

  function handleLogoSubmit(event: CustomEvent<AiLogoInput>) {
    const d = event.detail;
    executeGeneration({
      featureType: 'logo',
      prompt: `Logo for ${d.storeName}, category: ${d.businessCategory || 'general'}, concept: ${d.conceptType || d.visualStyle || 'pictorial_symbol'}.`,
      storeName: d.storeName,
      visualStyle: d.visualStyle,
      conceptType: d.conceptType,
      businessCategory: d.businessCategory,
      logoText: d.logoText,
      lockupType: d.lockupType,
      fontFamily: d.fontFamily,
      colorPalette: d.colorPalette.join(', '),
      qualityTier: d.qualityTier,
      focalSubject: d.focalSubject,
    });
  }

  function handlePackagingSubmit(event: CustomEvent<AiPackagingInput>) {
    const d = event.detail;
    executeGeneration({
      featureType: 'packaging_mockup',
      prompt: `Commercial 3D mockup of ${d.packagingType.replace('_', ' ')} with label "${d.productLabel}".`,
      packagingType: d.packagingType,
      productLabel: d.productLabel,
      presentationStyle: d.presentationStyle,
      image: d.referenceImageBase64,
      qualityTier: d.qualityTier,
    });
  }

  function handlePosterSubmit(event: CustomEvent<AiPosterInput>) {
    const d = event.detail;
    const style = d.posterStyle || d.backgroundMood || 'vietnam_editorial';
    executeGeneration({
      featureType: 'product_poster',
      prompt: `Appetizing poster for "${d.productName || 'Product'}" with headline "${d.titleText}"${d.subText ? `, tagline: "${d.subText}"` : ''}, style: ${style.replace('_', ' ')}.`,
      productName: d.productName,
      titleText: d.titleText,
      subText: d.subText,
      posterStyle: style,
      image: d.referenceImageBase64,
      size: d.sizeRatio === '2:3' ? '1024x1536' : '1024x1024',
      qualityTier: d.qualityTier,
    });
  }
</script>

<div class="space-y-6">
  {#if isTestMode}
    <AiDeveloperTestBar bind:isTesting />
  {/if}

  <!-- Navigasi Tab Utama (Studio Desain vs Galeri Desain) -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card rounded-3xl border border-light shadow-xs">
    <div class="flex items-center gap-1.5 p-1 bg-nested rounded-2xl border border-light">
      <button type="button" class="px-4 py-2 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 {mainTab === 'studio' ? 'bg-card text-main shadow-xs border border-light' : 'text-secondary hover:text-main'}" on:click={() => (mainTab = 'studio')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        <span>Studio Desain</span>
      </button>
      <button type="button" class="px-4 py-2 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 {mainTab === 'gallery' ? 'bg-card text-main shadow-xs border border-light' : 'text-secondary hover:text-main'}" on:click={() => (mainTab = 'gallery')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span>Galeri Desain ({assets.length})</span>
      </button>
    </div>

    <div class="flex items-center gap-2.5">
      {#if storeName}
        <Badge variant="secondary" size="md" dot={true}>Toko: {storeName}</Badge>
      {/if}
      <a
        href="/dashboard/credits/buy"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs border {creditStatusStyle.badge}"
        title="Klik untuk isi ulang kredit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span>{creditBalance} Kredit</span>
        <span class="text-2xs font-normal {creditStatusStyle.subtext}">• Top Up</span>
      </a>
      <Badge variant="primary" size="md" dot={false}>Studio Visual</Badge>
    </div>
  </div>

  <!-- Peringatan Halus & Nudge Upgrade Kredit AI -->
  <AiCreditTopupBanner
    balance={creditBalance}
    totalPurchased={creditTotalPurchased}
    {activeTier}
    packageName={activePackageName}
    loading={isCreditLoading}
  />

  <!-- Notifikasi Error / Sukses -->
  {#if generalError}
    <div class="p-3.5 bg-error/10 border border-error/20 rounded-2xl text-error text-xs flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{generalError}</span>
      </div>
      <button type="button" class="text-error hover:opacity-80 p-1 cursor-pointer flex items-center justify-center rounded-lg" on:click={() => (generalError = '')} aria-label="Tutup error">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  {/if}

  {#if successNotice}
    <div class="p-3.5 bg-success/10 border border-success/20 rounded-2xl text-success text-xs flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>{successNotice}</span>
      </div>
      <button type="button" class="text-success hover:opacity-80 p-1 cursor-pointer flex items-center justify-center rounded-lg" on:click={() => (successNotice = '')} aria-label="Tutup notifikasi">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  {/if}

  <!-- Visualizer Loading Progres -->
  {#if isGenerating}
    <AiLoadingProgress active={isGenerating} progress={generationProgress} title={generationTitle} />
  {/if}

  <!-- Konten Tab 1: Studio Desain -->
  {#if mainTab === 'studio' && !isGenerating}
    <div class="space-y-6">
      <!-- Sub-Tab Wizard Fitur -->
      <div class="flex flex-wrap items-center gap-2 border-b border-light pb-3">
        <button type="button" class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 {designSubTab === 'packaging' ? 'bg-primary text-primary-content font-bold shadow-xs' : 'bg-nested hover:bg-card text-secondary border border-light'}" on:click={() => (designSubTab = 'packaging')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          <span>Mockup Kemasan Produk</span>
        </button>
        <button type="button" class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 {designSubTab === 'poster' ? 'bg-primary text-primary-content font-bold shadow-xs' : 'bg-nested hover:bg-card text-secondary border border-light'}" on:click={() => (designSubTab = 'poster')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <span>Poster Promosi Makanan</span>
        </button>
        <button type="button" class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 {designSubTab === 'logo' ? 'bg-primary text-primary-content font-bold shadow-xs' : 'bg-nested hover:bg-card text-secondary border border-light'}" on:click={() => (designSubTab = 'logo')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
          <span>Logo Toko Minimalis</span>
        </button>
      </div>

      <!-- Panel Wizard Terpilih (Inline Tanpa Modal) -->
      {#if designSubTab === 'packaging'}
        <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
          <ProductPackagingWizard loading={isGenerating} on:submit={handlePackagingSubmit} on:cancel={() => (mainTab = 'gallery')} />
        </Card>
      {:else if designSubTab === 'poster'}
        <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
          <ProductPosterWizard loading={isGenerating} on:submit={handlePosterSubmit} on:cancel={() => (mainTab = 'gallery')} />
        </Card>
      {:else if designSubTab === 'logo'}
        <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
          <ProductLogoWizard loading={isGenerating} initialStoreName={storeName} on:submit={handleLogoSubmit} on:cancel={() => (mainTab = 'gallery')} />
        </Card>
      {/if}
    </div>
  {/if}

  <!-- Konten Tab 2: Galeri Desain -->
  {#if mainTab === 'gallery' && !isGenerating}
    <AiAssetGallery
      {assets}
      loading={isAssetsLoading}
      on:create={() => (mainTab = 'studio')}
      on:refresh={fetchAssetHistory}
    />
  {/if}
</div>
