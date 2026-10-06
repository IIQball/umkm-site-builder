<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ArrowLeft,
    CheckCircle,
    Loader2,
    Palette,
    Layout,
    Sparkles,
    MessageSquare,
    HelpCircle,
    Store,
    Compass,
    AlertCircle,
  } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { StoreContentCustomization, TemplateItem, StoreBranchItem } from '../onboarding.types';
  import { buildTemplateCustomizationPayload } from './content/contentCustomization.helpers';
  import ContentHeaderTab from './content/ContentHeaderTab.svelte';
  import ContentHeroTab from './content/ContentHeroTab.svelte';
  import ContentFeaturesTab from './content/ContentFeaturesTab.svelte';
  import ContentTestimonialsTab from './content/ContentTestimonialsTab.svelte';
  import ContentFaqTab from './content/ContentFaqTab.svelte';
  import ContentFooterTab from './content/ContentFooterTab.svelte';
  import ContentDesignTab from './content/ContentDesignTab.svelte';
  import OnboardingContentPreview from './OnboardingContentPreview.svelte';
  import { mergeStoreCustomization } from '@/lib/templates/mergeCustomization';
  import { migrateTemplateConfig } from '@/lib/templates/migration';
  import { DEFAULT_TEMPLATE_CONFIG } from '@/schemas/templates/template.defaults';
  import { buildCanvasCssVars } from '@/components/builder/canvas/canvasCss.helpers';
  import { loadDynamicGoogleFonts } from '@/components/builder/canvas/fontLoader.helpers';
  import { getMainDomain } from '@/lib/domain';

  export let templates: TemplateItem[] = [];
  export let categories: Array<{ id: string; name: string }> = [];
  export let selectedTemplateId: string = '';
  export let subdomain: string = '';
  export let storeName: string = '';
  export let waNumber: string = '';
  export let address: string = '';
  export let googleMapsUrl: string = '';
  export let branchMode: 'single' | 'multi' = 'single';
  export let branches: StoreBranchItem[] = [];
  export let isEdit: boolean = false;
  export let customization: StoreContentCustomization;
  export let submitStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  export let submitError: string = '';
  export let onPrev: () => void;
  export let onSubmit: () => void;

  type ContentTab = 'design' | 'header' | 'hero' | 'features' | 'testimonials' | 'faq' | 'footer';
  let activeTab: ContentTab = 'design';

  let mainDomain = 'localhost:4321';
  let previewViewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  let canonicalMapsUrl: string = '';

  const TABS: Array<{ id: ContentTab; label: string; icon: typeof Palette }> = [
    { id: 'design', label: 'Warna', icon: Palette },
    { id: 'header', label: 'Header', icon: Compass },
    { id: 'hero', label: 'Hero', icon: Layout },
    { id: 'features', label: 'Keunggulan', icon: Sparkles },
    { id: 'testimonials', label: 'Ulasan', icon: MessageSquare },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'footer', label: 'Footer', icon: Store },
  ];

  onMount(() => {
    mainDomain = getMainDomain();
  });

  function triggerSync() {
    customization = { ...customization };
  }

  $: {
    const rawMaps = googleMapsUrl || customization?.maps?.branches?.[0]?.googleMapsUrl || '';
    if (rawMaps && (rawMaps.includes('goo.gl') || rawMaps.includes('maps.app.goo.gl'))) {
      fetch(`/api/public/resolve-maps?url=${encodeURIComponent(rawMaps)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.canonicalUrl) {
            canonicalMapsUrl = data.canonicalUrl;
          }
        })
        .catch(() => {
          canonicalMapsUrl = rawMaps;
        });
    } else {
      canonicalMapsUrl = rawMaps;
    }
  }

  $: selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  $: baseConfig = selectedTemplate?.config
    ? migrateTemplateConfig(selectedTemplate.config)
    : DEFAULT_TEMPLATE_CONFIG;

  $: headerSectionInTemplate = baseConfig?.sections?.find((s) => s.type === 'header_announcement');
  $: templateHasHeaderLogo = Boolean(
    headerSectionInTemplate &&
    (headerSectionInTemplate.props?.logoType !== 'text_only' || Boolean(headerSectionInTemplate.props?.logoImageUrl))
  );

  $: activeAddress = address || customization?.footer?.address || '';
  $: activeStoreName = customization?.header?.logoText || storeName || subdomain || 'Toko UMKM';

  $: if (address && customization?.footer && customization.footer.address !== address) {
    customization.footer.address = address;
  }

  $: if (customization) {
    if (!customization.maps) {
      customization.maps = { branchMode, branches };
    } else {
      customization.maps.branchMode = branchMode;
      customization.maps.branches = branches;
    }
  }

  $: activeStoreData = {
    id: 'preview-store',
    name: activeStoreName,
    subdomain: subdomain || 'toko',
    address: activeAddress,
    waNumber: waNumber || '',
    googleMapsUrl: canonicalMapsUrl || googleMapsUrl || customization?.maps?.branches?.[0]?.googleMapsUrl || '',
    branchMode: branchMode || customization?.maps?.branchMode || 'single',
    branches: (branches && branches.length > 0) ? branches : (customization?.maps?.branches || []),
  };

  $: finalMergedConfig = mergeStoreCustomization(baseConfig, buildTemplateCustomizationPayload(customization), activeStoreData);
  $: canvasCssVars = buildCanvasCssVars(finalMergedConfig.theme ?? {}, false, previewViewMode);
  $: loadDynamicGoogleFonts(finalMergedConfig.theme?.typography?.headingFont, finalMergedConfig.theme?.typography?.bodyFont);
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
  <!-- Header Title -->
  <div class="border-b border-light pb-4">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Kustomisasi Konten & Tampilan Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Sesuaikan header, banner hero, keunggulan, ulasan, FAQ, footer, dan warna toko dengan live preview real-time.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
    <!-- Left Section: Content Editor Controls (5 cols) -->
    <div class="lg:col-span-5 flex flex-col justify-between h-[540px] space-y-3">
      <div class="flex flex-col flex-1 min-h-0 space-y-3">
        <!-- Tabs Selector Pills -->
        <div class="flex items-center gap-1.5 p-1 bg-nested rounded-xl border border-light overflow-x-auto scrollbar-none shrink-0">
          {#each TABS as tab}
            <button
              type="button"
              on:click={() => (activeTab = tab.id)}
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-2xs font-bold font-sans transition-all whitespace-nowrap cursor-pointer {activeTab === tab.id
                ? 'bg-card text-main shadow-2xs border border-light'
                : 'text-secondary hover:text-main'}"
            >
              <svelte:component this={tab.icon} size={13} class={activeTab === tab.id ? 'text-primary' : ''} />
              <span>{tab.label}</span>
            </button>
          {/each}
        </div>

        <!-- Active Tab Form Pane: Expands & Scrolls Internally -->
        <div
          class="p-4 sm:p-5 rounded-2xl bg-nested border border-light flex-1 min-h-0 overflow-y-auto scrollbar-thin"
          on:input={triggerSync}
          on:change={triggerSync}
        >
          {#if activeTab === 'design'}
            <ContentDesignTab bind:customization onUpdate={triggerSync} />
          {:else if activeTab === 'header'}
            <ContentHeaderTab bind:customization hasLogo={templateHasHeaderLogo} onUpdate={triggerSync} />
          {:else if activeTab === 'hero'}
            <ContentHeroTab bind:customization onUpdate={triggerSync} />
          {:else if activeTab === 'features'}
            <ContentFeaturesTab bind:customization onUpdate={triggerSync} />
          {:else if activeTab === 'testimonials'}
            <ContentTestimonialsTab bind:customization onUpdate={triggerSync} />
          {:else if activeTab === 'faq'}
            <ContentFaqTab bind:customization onUpdate={triggerSync} />
          {:else if activeTab === 'footer'}
            <ContentFooterTab bind:customization onUpdate={triggerSync} />
          {/if}
        </div>
      </div>

      <!-- Bottom Anchored Actions: Flushed with Preview Bottom -->
      <div class="mt-auto pt-2.5 border-t border-light/60 space-y-2 shrink-0">
        {#if submitError}
          <div class="p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2">
            <AlertCircle size={15} class="shrink-0" />
            <span class="font-medium">{submitError}</span>
          </div>
        {/if}

        <div class="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="md"
            class="font-bold font-sans"
            disabled={submitStatus === 'submitting'}
            on:click={onPrev}
          >
            <ArrowLeft size={16} />
            Kembali
          </Button>

          <Button
            variant="primary"
            size="md"
            class="font-bold font-sans flex-1"
            loading={submitStatus === 'submitting'}
            disabled={submitStatus === 'submitting'}
            on:click={onSubmit}
          >
            {#if submitStatus === 'submitting'}
              <Loader2 size={16} class="animate-spin" />
              Menyimpan...
            {:else}
              {isEdit ? 'Simpan Perubahan Toko' : 'Selesai & Buat Toko'}
              <CheckCircle size={16} />
            {/if}
          </Button>
        </div>
      </div>
    </div>

    <!-- Right Section: Real Live Storefront Preview (7 cols) -->
    <div class="lg:col-span-7 sticky top-6">
      <OnboardingContentPreview
        {baseConfig}
        {finalMergedConfig}
        {activeStoreData}
        {categories}
        {subdomain}
        {mainDomain}
        {canvasCssVars}
        bind:previewViewMode
      />
    </div>
  </div>
</div>
