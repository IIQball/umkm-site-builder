<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ArrowLeft,
    CheckCircle,
    Loader2,
    Palette,
    Layout,
    Sparkles,
    HelpCircle,
    Store,
    Monitor,
    Tablet,
    Smartphone,
    AlertCircle,
  } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { StoreContentCustomization } from '../onboarding.types';
  import {
    buildTemplateCustomizationPayload,
  } from './content/contentCustomization.helpers';
  import ContentDesignTab from './content/ContentDesignTab.svelte';
  import ContentHeroTab from './content/ContentHeroTab.svelte';
  import ContentFeaturesTab from './content/ContentFeaturesTab.svelte';
  import ContentFaqTab from './content/ContentFaqTab.svelte';
  import ContentHeaderFooterTab from './content/ContentHeaderFooterTab.svelte';
  import { getMainDomain } from '@/lib/domain';

  export let selectedTemplateId: string = '';
  export let subdomain: string = '';
  export let isEdit: boolean = false;
  export let customization: StoreContentCustomization;
  export let submitStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  export let submitError: string = '';
  export let onPrev: () => void;
  export let onSubmit: () => void;

  type ContentTab = 'design' | 'hero' | 'features' | 'faq' | 'footer';
  let activeTab: ContentTab = 'design';

  let mainDomain = 'localhost:4321';
  let previewViewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  let iframeEl: HTMLIFrameElement | null = null;
  let syncTimer: ReturnType<typeof setTimeout>;

  const TABS: Array<{ id: ContentTab; label: string; icon: typeof Palette }> = [
    { id: 'design', label: 'Desain & Font', icon: Palette },
    { id: 'hero', label: 'Banner Hero', icon: Layout },
    { id: 'features', label: 'Keunggulan', icon: Sparkles },
    { id: 'faq', label: 'Tanya Jawab (FAQ)', icon: HelpCircle },
    { id: 'footer', label: 'Header & Footer', icon: Store },
  ];

  onMount(() => {
    mainDomain = getMainDomain();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        sendUpdateToPreview();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(syncTimer);
    };
  });

  function sendUpdateToPreview() {
    if (!iframeEl?.contentWindow) return;
    try {
      const payload = buildTemplateCustomizationPayload(customization);
      iframeEl.contentWindow.postMessage(
        {
          type: 'UPDATE_PREVIEW',
          customization: payload,
        },
        '*'
      );
    } catch {
      // Ignore cross-origin iframe security blocks if any
    }
  }

  // Reactive sync whenever customization changes
  $: if (customization) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sendUpdateToPreview, 80);
  }
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
  <!-- Header Title -->
  <div class="border-b border-light pb-4">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Kustomisasi Konten & Tampilan Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Sesuaikan tipografi, warna brand, teks judul hero, gambar promosi, butir keunggulan, FAQ, dan footer dengan live preview real-time.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Left Section: Content Editor Controls (5 cols) -->
    <div class="lg:col-span-5 space-y-4">
      <!-- Tabs Selector Pills -->
      <div class="flex items-center gap-1.5 p-1 bg-nested rounded-xl border border-light overflow-x-auto scrollbar-none">
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

      <!-- Active Tab Form Pane -->
      <div class="p-4 sm:p-5 rounded-2xl bg-nested border border-light min-h-[380px]">
        {#if activeTab === 'design'}
          <ContentDesignTab bind:customization />
        {:else if activeTab === 'hero'}
          <ContentHeroTab bind:customization />
        {:else if activeTab === 'features'}
          <ContentFeaturesTab bind:customization />
        {:else if activeTab === 'faq'}
          <ContentFaqTab bind:customization />
        {:else if activeTab === 'footer'}
          <ContentHeaderFooterTab bind:customization />
        {/if}
      </div>

      {#if submitError}
        <div class="p-3.5 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2">
          <AlertCircle size={15} class="shrink-0" />
          <span class="font-medium">{submitError}</span>
        </div>
      {/if}

      <!-- Bottom Navigation Buttons -->
      <div class="flex items-center justify-between gap-3 pt-2">
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

    <!-- Right Section: Real Live Preview Iframe (7 cols) -->
    <div class="lg:col-span-7 sticky top-6">
      <div class="bg-card rounded-2xl border border-light shadow-md overflow-hidden flex flex-col">
        <!-- Mockup Browser Top Bar -->
        <div class="h-11 px-4 bg-nested border-b border-light flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 shrink-0">
            <div class="w-2.5 h-2.5 rounded-full bg-error/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-warning/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-success/80"></div>
          </div>

          <!-- URL Bar -->
          <div class="px-2.5 py-1 rounded-md bg-card border border-light text-2xs font-mono text-secondary flex items-center gap-1.5 max-w-[220px] sm:max-w-[280px] truncate shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-success shrink-0"></span>
            <span class="text-main font-semibold truncate">{subdomain || 'toko'}.{mainDomain}</span>
          </div>

          <!-- Device Viewport Switcher -->
          <div class="flex items-center bg-card p-0.5 rounded-lg border border-light gap-0.5 shrink-0">
            <button
              type="button"
              on:click={() => (previewViewMode = 'desktop')}
              class="p-1 rounded text-xs transition-colors {previewViewMode === 'desktop' ? 'bg-primary text-white shadow-2xs' : 'text-secondary hover:text-main'}"
              title="Tampilan Desktop"
            >
              <Monitor size={13} />
            </button>
            <button
              type="button"
              on:click={() => (previewViewMode = 'tablet')}
              class="p-1 rounded text-xs transition-colors {previewViewMode === 'tablet' ? 'bg-primary text-white shadow-2xs' : 'text-secondary hover:text-main'}"
              title="Tampilan Tablet"
            >
              <Tablet size={13} />
            </button>
            <button
              type="button"
              on:click={() => (previewViewMode = 'mobile')}
              class="p-1 rounded text-xs transition-colors {previewViewMode === 'mobile' ? 'bg-primary text-white shadow-2xs' : 'text-secondary hover:text-main'}"
              title="Tampilan Mobile"
            >
              <Smartphone size={13} />
            </button>
          </div>
        </div>

        <!-- Real Landing Page iframe Container -->
        <div class="relative bg-nested/40 w-full h-[620px] lg:h-[700px] overflow-hidden">
          {#if selectedTemplateId}
            <iframe
              bind:this={iframeEl}
              src={`/builder/preview/${selectedTemplateId}?embed=true&view=${previewViewMode}`}
              class="w-full h-full border-0"
              title="Live Real Preview Landing Page"
              loading="lazy"
              on:load={sendUpdateToPreview}
            ></iframe>
          {:else}
            <div class="w-full h-full flex flex-col items-center justify-center text-muted text-sm gap-2">
              <Layout size={32} class="opacity-40" />
              <p>Pilih template untuk melihat preview landing page lengkap</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
