<script lang="ts">
  import { onMount } from 'svelte';
  import { AlertCircle, CheckCircle2, LayoutTemplate, Package, Tag, X, ArrowLeft } from 'lucide-svelte';
  import { Card, Button } from '@/components/ui';
  import ProductLogoWizard from './ProductLogoWizard.svelte';
  import ProductPackagingWizard from './ProductPackagingWizard.svelte';
  import ProductPosterWizard from './ProductPosterWizard.svelte';
  import AiLoadingProgress from './AiLoadingProgress.svelte';
  import AiResultPreview from './AiResultPreview.svelte';
  import AiAssetGallery from './AiAssetGallery.svelte';
  import AiCreditTopupBanner from './AiCreditTopupBanner.svelte';
  import AiStudioHeaderBar from './AiStudioHeaderBar.svelte';
  import TransactionStatus from '@/components/checkout/TransactionStatus.svelte';
  import { generateAiAssetClient } from '@/lib/api/ai-client';
  import { formatAiErrorMessage } from '@/lib/errors/ai-error';
  import { toast } from '@/lib/toast';
  import type { AiAssetItem } from './gallery.constants';
  import type { AiStudioMainTab, AiStudioSubTab, AiStudioGeneratePayload } from './studio.types';
  import {
    getCreditStatusStyle,
    fetchCreditBalanceApi,
    fetchAssetHistoryApi,
    buildLogoPayload,
    buildPackagingPayload,
    buildPosterPayload,
  } from './studio.helpers';

  export let storeId: string = '';
  export let storeName: string = '';

  const SUB_TABS = [
    { id: 'packaging' as const, label: 'Mockup Kemasan Produk', icon: Package },
    { id: 'poster' as const, label: 'Poster Promosi Makanan', icon: LayoutTemplate },
    { id: 'logo' as const, label: 'Logo Toko Minimalis', icon: Tag },
  ];

  let mainTab: AiStudioMainTab = 'studio';
  let designSubTab: AiStudioSubTab = 'packaging';
  let isGenerating = false;
  let generationProgress = 10;
  let generationTitle = 'Sedang Merancang Visual AI...';
  let generalError = '';
  let successNotice = '';

  let generatedAsset: {
    imageUrl: string;
    featureType: 'logo' | 'packaging_mockup' | 'product_poster';
    logId: string;
    qualityTier: 'standard' | 'high';
  } | null = null;

  let assets: AiAssetItem[] = [];
  let isAssetsLoading = false;

  let creditBalance = 0;
  let creditTotalPurchased = 0;
  let activeTier = 'trial';
  let activePackageName = 'Belum Ada Paket Aktif';
  let isCreditLoading = false;
  let creditPurchaseInvoiceId = '';

  $: creditStatusStyle = getCreditStatusStyle(creditBalance);

  async function loadBalance() {
    isCreditLoading = true;
    const res = await fetchCreditBalanceApi(storeId);
    if (res) {
      creditBalance = res.balance;
      creditTotalPurchased = res.totalPurchased;
      activeTier = res.tier;
      activePackageName = res.packageName;
    }
    isCreditLoading = false;
  }

  async function loadHistory() {
    isAssetsLoading = true;
    assets = await fetchAssetHistoryApi();
    isAssetsLoading = false;
  }

  onMount(() => {
    loadHistory();
    loadBalance();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      creditPurchaseInvoiceId = urlParams.get('creditPurchase') || '';
    }
  });

  function handleCreditPurchaseStatus(status: string) {
    if (status !== 'success') return;
    void loadBalance();
    creditPurchaseInvoiceId = '';
    const url = new URL(window.location.href);
    url.searchParams.delete('creditPurchase');
    window.history.replaceState(null, '', url);
  }

  async function executeGeneration(payload: AiStudioGeneratePayload) {
    const reqCredits = payload.qualityTier === 'high' ? 2 : 1;
    if (creditBalance < reqCredits) {
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
      const res = await generateAiAssetClient({
        ...payload,
        storeId,
        qualityTier: payload.qualityTier || 'high',
        size: payload.size || '1024x1024',
      });

      generationProgress = 100;
      successNotice = 'Desain visual AI berhasil dibuat dan disimpan ke galeri!';
      toast.success(successNotice);
      await Promise.all([loadHistory(), loadBalance()]);

      generatedAsset = {
        imageUrl: res.imageUrl,
        featureType: payload.featureType,
        logId: res.logId,
        qualityTier: (payload.qualityTier as 'standard' | 'high') || 'high',
      };
    } catch (err: unknown) {
      generalError = formatAiErrorMessage(err);
      toast.error(generalError);
    } finally {
      isGenerating = false;
    }
  }
</script>

<div class="space-y-6">
  {#if creditPurchaseInvoiceId}
    <div class="rounded-2xl border border-light bg-card px-4 py-2">
      <TransactionStatus invoiceId={creditPurchaseInvoiceId} onStatusUpdate={handleCreditPurchaseStatus} />
    </div>
  {/if}

  <AiStudioHeaderBar bind:mainTab assetsCount={assets.length} {storeName} {creditBalance} {creditStatusStyle} />

  <AiCreditTopupBanner
    balance={creditBalance}
    totalPurchased={creditTotalPurchased}
    {activeTier}
    packageName={activePackageName}
    loading={isCreditLoading}
  />

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

  {#if isGenerating}
    <AiLoadingProgress active={isGenerating} progress={generationProgress} title={generationTitle} />
  {/if}

  <!-- Tab 1: Studio Desain -->
  {#if mainTab === 'studio' && !isGenerating}
    <div class="space-y-6">
      {#if generatedAsset}
        <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-light">
              <h3 class="font-heading font-bold text-base text-main">
                Pratinjau Hasil Desain Baru
              </h3>
              <Button
                variant="ghost"
                size="xs"
                class="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                on:click={() => (generatedAsset = null)}
              >
                <ArrowLeft size={13} />
                <span>Buat Desain Lainnya</span>
              </Button>
            </div>
            <AiResultPreview
              imageUrl={generatedAsset.imageUrl}
              featureType={generatedAsset.featureType}
              qualityTier={generatedAsset.qualityTier}
              logId={generatedAsset.logId}
              {storeId}
              on:regenerate={() => (generatedAsset = null)}
            />
          </div>
        </Card>
      {:else}
        <div class="flex flex-wrap items-center gap-2 border-b border-light pb-3">
          {#each SUB_TABS as tab}
            <button
              type="button"
              class="px-3.5 py-1.5 text-xs font-heading font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 {designSubTab === tab.id ? 'bg-primary text-primary-content font-bold shadow-xs' : 'bg-nested hover:bg-card text-secondary border border-light'}"
              on:click={() => (designSubTab = tab.id)}
            >
              <svelte:component this={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          {/each}
        </div>

        {#if designSubTab === 'packaging'}
          <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
            <ProductPackagingWizard loading={isGenerating} on:submit={(e) => executeGeneration(buildPackagingPayload(e.detail))} on:cancel={() => (mainTab = 'gallery')} />
          </Card>
        {:else if designSubTab === 'poster'}
          <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
            <ProductPosterWizard loading={isGenerating} on:submit={(e) => executeGeneration(buildPosterPayload(e.detail))} on:cancel={() => (mainTab = 'gallery')} />
          </Card>
        {:else if designSubTab === 'logo'}
          <Card variant="bordered" padding="lg" radius="2xl" class="bg-card">
            <ProductLogoWizard loading={isGenerating} initialStoreName={storeName} on:submit={(e) => executeGeneration(buildLogoPayload(e.detail))} on:cancel={() => (mainTab = 'gallery')} />
          </Card>
        {/if}
      {/if}
    </div>
  {/if}

  <!-- Tab 2: Galeri Desain -->
  {#if mainTab === 'gallery' && !isGenerating}
    <AiAssetGallery
      {assets}
      {storeId}
      loading={isAssetsLoading}
      on:create={() => (mainTab = 'studio')}
      on:refresh={loadHistory}
    />
  {/if}
</div>
