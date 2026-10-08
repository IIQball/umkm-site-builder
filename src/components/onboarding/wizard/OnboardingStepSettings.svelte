<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowLeft,
    ArrowRight,
    AlertCircle,
    Save,
    RotateCcw,
    MessageSquare,
    Store,
  } from "lucide-svelte";
  import { Button, Badge } from "@/components/ui";
  import type { StoreContentCustomization, TemplateItem, StoreBranchItem } from "../onboarding.types";
  import { DEFAULT_WA_CHECKOUT_TEMPLATE } from "../onboarding.helpers";
  import { getMainDomain } from "@/lib/domain";
  import OnboardingContentPreview from "./OnboardingContentPreview.svelte";
  import SettingsTemplatePicker from "./SettingsTemplatePicker.svelte";
  import { mergeStoreCustomization } from "@/lib/templates/mergeCustomization";
  import { migrateTemplateConfig } from "@/lib/templates/migration";
  import { DEFAULT_TEMPLATE_CONFIG } from "@/schemas/templates/template.defaults";
  import { buildCanvasCssVars } from "@/components/builder/canvas/canvasCss.helpers";
  import { loadDynamicGoogleFonts } from "@/components/builder/canvas/fontLoader.helpers";
  import { buildTemplateCustomizationPayload } from "./content/contentCustomization.helpers";

  export let templates: TemplateItem[] = [];
  export let selectedTemplateId: string = "";
  export let subdomain: string = "";
  export let isOpen: boolean = true;
  export let waCheckoutTemplate: string = "";
  export let submitStatus: "idle" | "submitting" | "success" | "error" = "idle";
  export let submitError: string = "";
  export let onPrev: () => void;
  export let onSave: () => void;
  export let onNext: (() => void) | undefined = undefined;

  export let categories: Array<{ id: string; name: string }> = [];
  export let storeName: string = "";
  export let waNumber: string = "";
  export let address: string = "";
  export let googleMapsUrl: string = "";
  export let branchMode: "single" | "multi" = "single";
  export let branches: StoreBranchItem[] = [];
  export let customization: StoreContentCustomization | undefined = undefined;

  let mainDomain = "localhost:4321";
  let previewViewMode: "desktop" | "tablet" | "mobile" = "desktop";

  onMount(() => {
    mainDomain = getMainDomain();
  });

  $: if (!selectedTemplateId && templates.length > 0) {
    selectedTemplateId = templates[0].id;
  }

  function resetWaTemplate() {
    waCheckoutTemplate = DEFAULT_WA_CHECKOUT_TEMPLATE;
  }

  $: selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  $: baseConfig = selectedTemplate?.config
    ? migrateTemplateConfig(selectedTemplate.config)
    : DEFAULT_TEMPLATE_CONFIG;

  $: activeAddress = address || customization?.footer?.address || "";
  $: activeStoreName = customization?.header?.logoText || storeName || subdomain || "Toko UMKM";

  $: activeStoreData = {
    id: "preview-store",
    name: activeStoreName,
    subdomain: subdomain || "toko",
    address: activeAddress,
    waNumber: waNumber || "",
    googleMapsUrl: googleMapsUrl || customization?.maps?.branches?.[0]?.googleMapsUrl || "",
    branchMode: branchMode || customization?.maps?.branchMode || "single",
    branches: branches && branches.length > 0 ? branches : (customization?.maps?.branches || []),
  };

  $: finalMergedConfig = customization
    ? mergeStoreCustomization(baseConfig, buildTemplateCustomizationPayload(customization), activeStoreData)
    : baseConfig;
  $: canvasCssVars = buildCanvasCssVars(finalMergedConfig.theme ?? {}, false, previewViewMode);
  $: loadDynamicGoogleFonts(finalMergedConfig.theme?.typography?.headingFont, finalMergedConfig.theme?.typography?.bodyFont);
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
  <div class="border-b border-light pb-4">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Pengaturan Operasional & Template Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Atur status ketersediaan toko, pesan transaksi WhatsApp, dan tinjau tampilan real landing page lengkap toko Anda.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Left Section: Inputs & Template Picker (5 cols) -->
    <div class="lg:col-span-5 space-y-5">
      <!-- 1. Status Operasional Toko -->
      <div class="p-4 sm:p-5 rounded-2xl bg-nested border border-light space-y-3">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-xl bg-card border border-light flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Store size={18} />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xs sm:text-sm font-bold text-main font-heading">
                  Status Operasional Toko
                </h3>
                <Badge variant={isOpen ? "success" : "warning"} size="sm">
                  {isOpen ? "Buka" : "Tutup"}
                </Badge>
              </div>
              <p class="text-2xs text-secondary mt-0.5 leading-relaxed font-sans">
                {isOpen ? "Toko aktif. Pelanggan dapat memesan produk." : "Toko dinonaktifkan sementara dari pesanan."}
              </p>
            </div>
          </div>

          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" bind:checked={isOpen} class="sr-only peer" />
            <div class="w-11 h-6 bg-base-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <!-- 2. Template Pesan WhatsApp Checkout -->
      <div class="p-4 sm:p-5 rounded-2xl bg-nested border border-light space-y-3">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <MessageSquare size={16} class="text-primary" />
            <h3 class="text-xs sm:text-sm font-bold text-main font-heading">
              Pesan Transaksi WhatsApp
            </h3>
          </div>
          <button
            type="button"
            on:click={resetWaTemplate}
            class="inline-flex items-center gap-1 text-2xs text-secondary hover:text-primary transition-colors font-medium cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Pesan Standar</span>
          </button>
        </div>

        <p class="text-2xs text-secondary leading-relaxed font-sans">
          Teks pesan bawaan yang otomatis terisi saat pelanggan menekan tombol checkout atau chat WhatsApp di toko.
        </p>

        <textarea
          bind:value={waCheckoutTemplate}
          placeholder={DEFAULT_WA_CHECKOUT_TEMPLATE}
          rows="3"
          class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted resize-none"
        ></textarea>
      </div>

      <!-- 3. Koleksi & Pilihan Template Toko -->
      <SettingsTemplatePicker {templates} bind:selectedTemplateId />

      {#if submitError}
        <div class="p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2">
          <AlertCircle size={15} class="shrink-0" />
          <span class="font-medium">{submitError}</span>
        </div>
      {/if}

      <!-- Navigasi Aksi Bawah -->
      <div class="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="ghost"
          size="md"
          class="font-bold font-sans"
          disabled={submitStatus === "submitting"}
          on:click={onPrev}
        >
          <ArrowLeft size={16} />
          Kembali
        </Button>

        {#if onNext}
          <Button
            variant="primary"
            size="md"
            class="font-bold font-sans flex-1"
            disabled={submitStatus === "submitting"}
            on:click={onNext}
          >
            <span>Lanjut Kustomisasi Konten</span>
            <ArrowRight size={16} />
          </Button>
        {:else}
          <Button
            variant="primary"
            size="md"
            class="font-bold font-sans flex-1"
            loading={submitStatus === "submitting"}
            disabled={submitStatus === "submitting"}
            on:click={onSave}
          >
            <Save size={16} />
            <span>Simpan Perubahan Toko</span>
          </Button>
        {/if}
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
