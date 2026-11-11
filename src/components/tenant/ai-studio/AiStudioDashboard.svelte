<script lang="ts">
  import { onMount } from 'svelte';
  import { AlertCircle, CheckCircle2, LayoutTemplate, Package, Tag, X } from 'lucide-svelte';
  import { Card } from '@/components/ui';
  import ProductLogoWizard from './ProductLogoWizard.svelte';
  import ProductPackagingWizard from './ProductPackagingWizard.svelte';
  import ProductPosterWizard from './ProductPosterWizard.svelte';
  import AiLoadingProgress from './AiLoadingProgress.svelte';
  import AiAssetGallery from './AiAssetGallery.svelte';
  import AiDeveloperTestBar from './AiDeveloperTestBar.svelte';
  import AiCreditTopupBanner from './AiCreditTopupBanner.svelte';
  import AiStudioHeaderBar from './AiStudioHeaderBar.svelte';
  import TransactionStatus from '@/components/checkout/TransactionStatus.svelte';
  import { generateAiAssetClient } from '@/lib/api/ai-client';
  import { formatAiErrorMessage } from '@/lib/errors/ai-error';
  import { apiFetch } from '@/lib/api/parse-response';
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
  let creditPurchaseInvoiceId = '';

  $: creditStatusStyle = creditBalance <= 0
    ? { badge: 'bg-error/10 text-error border-error/25 hover:bg-error/20', subtext: 'text-error/80' }
    : creditBalance <= 2
    ? { badge: 'bg-warning/10 text-warning border-warning/25 hover:bg-warning/20', subtext: 'text-warning/80' }
    : { badge: 'bg-success/10 text-success border-success/25 hover:bg-success/20', subtext: 'text-success/80' };

  async function fetchCreditBalance() {
    if (!storeId) return;
    isCreditLoading = true;
    try {
      const res = await apiFetch<{
        balance?: number;
        totalPurchased?: number;
        tier?: string;
        packageName?: string;
      }>(`/api/tenant/ai-credit/${storeId}`);
      if (res.success && res.data) {
        const data = res.data;
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
      const res = await apiFetch<AiAssetItem[] | { items?: AiAssetItem[] }>('/api/tenant/ai/history');
      if (res.success && res.data) {
        assets = Array.isArray(res.data) ? res.data : (res.data.items || []);
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
      creditPurchaseInvoiceId = urlParams.get('creditPurchase') || '';
    }
  });

  function handleCreditPurchaseStatus(status: 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | 'refunded') {
    if (status !== 'success') return;

    void fetchCreditBalance();
    creditPurchaseInvoiceId = '';
    const url = new URL(window.location.href);
    url.searchParams.delete('creditPurchase');
    window.history.replaceState(null, '', url);
  }

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
  {#if creditPurchaseInvoiceId}
    <div class="rounded-2xl border border-light bg-card px-4 py-2">
      <TransactionStatus
        invoiceId={creditPurchaseInvoiceId}
        onStatusUpdate={handleCreditPurchaseStatus}
      />
    </div>
  {/if}

  {#if isTestMode}
    <AiDeveloperTestBar bind:isTesting />
  {/if}

  <!-- Navigasi Tab Utama (Studio Desain vs Galeri Desain) -->
  <AiStudioHeaderBar bind:mainTab assetsCount={assets.length} {storeName} {creditBalance} {creditStatusStyle} />

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
        <AlertCircle size={16} class="flex-shrink-0" />
        <span>{generalError}</span>
      </div>
      <button type="button" class="text-error hover:opacity-80 p-1 cursor-pointer flex items-center justify-center rounded-lg" on:click={() => (generalError = '')} aria-label="Tutup error">
        <X size={14} />
      </button>
    </div>
  {/if}

  {#if successNotice}
    <div class="p-3.5 bg-success/10 border border-success/20 rounded-2xl text-success text-xs flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <CheckCircle2 size={16} class="flex-shrink-0" />
        <span>{successNotice}</span>
      </div>
      <button type="button" class="text-success hover:opacity-80 p-1 cursor-pointer flex items-center justify-center rounded-lg" on:click={() => (successNotice = '')} aria-label="Tutup notifikasi">
        <X size={14} />
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
          <Package size={14} />
          <span>Mockup Kemasan Produk</span>
        </button>
        <button type="button" class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 {designSubTab === 'poster' ? 'bg-primary text-primary-content font-bold shadow-xs' : 'bg-nested hover:bg-card text-secondary border border-light'}" on:click={() => (designSubTab = 'poster')}>
          <LayoutTemplate size={14} />
          <span>Poster Promosi Makanan</span>
        </button>
        <button type="button" class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 {designSubTab === 'logo' ? 'bg-primary text-primary-content font-bold shadow-xs' : 'bg-nested hover:bg-card text-secondary border border-light'}" on:click={() => (designSubTab = 'logo')}>
          <Tag size={14} />
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
