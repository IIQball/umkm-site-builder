<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowLeft,
    ArrowRight,
    Check,
    Layout,
    AlertCircle,
    Save,
    RotateCcw,
    MessageSquare,
    Store,
    ExternalLink,
    Monitor,
    Tablet,
    Smartphone,
  } from "lucide-svelte";
  import { Button, Badge } from "@/components/ui";
  import type { TemplateItem } from "../onboarding.types";
  import { DEFAULT_WA_CHECKOUT_TEMPLATE } from "../onboarding.helpers";
  import { getMainDomain } from "@/lib/domain";

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
</script>

<div
  class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300"
>
  <div class="border-b border-light pb-4">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Pengaturan Operasional & Template Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Atur status ketersediaan toko, pesan transaksi WhatsApp, dan tinjau
      tampilan real landing page lengkap toko Anda.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Left Section: Inputs & Template Picker (5 cols) -->
    <div class="lg:col-span-5 space-y-5">
      <!-- 1. Status Operasional Toko -->
      <div
        class="p-4 sm:p-5 rounded-2xl bg-nested border border-light space-y-3"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-xl bg-card border border-light flex items-center justify-center text-primary shrink-0 mt-0.5"
            >
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
              <p
                class="text-2xs text-secondary mt-0.5 leading-relaxed font-sans"
              >
                {isOpen
                  ? "Toko aktif. Pelanggan dapat memesan produk."
                  : "Toko dinonaktifkan sementara dari pesanan."}
              </p>
            </div>
          </div>

          <label
            class="relative inline-flex items-center cursor-pointer shrink-0"
          >
            <input type="checkbox" bind:checked={isOpen} class="sr-only peer" />
            <div
              class="w-11 h-6 bg-base-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
            ></div>
          </label>
        </div>
      </div>

      <!-- 2. Template Pesan WhatsApp Checkout -->
      <div
        class="p-4 sm:p-5 rounded-2xl bg-nested border border-light space-y-3"
      >
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
          Teks pesan bawaan yang otomatis terisi saat pelanggan menekan tombol
          checkout atau chat WhatsApp di toko.
        </p>

        <textarea
          bind:value={waCheckoutTemplate}
          placeholder={DEFAULT_WA_CHECKOUT_TEMPLATE}
          rows="3"
          class="w-full bg-card text-main border border-light rounded-xl p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted resize-none"
        ></textarea>
      </div>

      <!-- 3. Koleksi & Pilihan Template Toko -->
      <div
        class="p-4 sm:p-5 rounded-2xl bg-nested border border-light space-y-3"
      >
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h3 class="text-xs sm:text-sm font-bold text-main font-heading">
              Pilihan Template Toko ({templates.length})
            </h3>
            <p class="text-2xs text-secondary mt-0.5 font-sans">
              Klik template untuk melihat preview langsung landing page di
              sebelah kanan.
            </p>
          </div>

          <a
            href="/templates"
            class="inline-flex items-center gap-1 text-2xs font-semibold text-primary hover:underline shrink-0"
          >
            <span>Katalog</span>
            <ExternalLink size={11} />
          </a>
        </div>

        <div
          class="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin"
        >
          {#each templates as tpl (tpl.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              on:click={() => (selectedTemplateId = tpl.id)}
              class="flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-150 {selectedTemplateId ===
              tpl.id
                ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-2xs'
                : 'bg-card border-light hover:border-primary/40 hover:bg-nested/40'}"
            >
              <div
                class="w-12 h-12 rounded-lg overflow-hidden bg-nested border border-light shrink-0 relative"
              >
                {#if tpl.thumbnailUrl}
                  <img
                    src={tpl.thumbnailUrl}
                    alt={tpl.name}
                    class="w-full h-full object-cover"
                  />
                {:else}
                  <div
                    class="w-full h-full flex items-center justify-center text-muted"
                  >
                    <Layout size={16} />
                  </div>
                {/if}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <p class="text-xs font-bold text-main truncate font-heading">
                    {tpl.name}
                  </p>
                  {#if tpl.categoryName}
                    <span
                      class="text-3xs font-semibold px-1.5 py-0.2 rounded bg-nested text-muted border border-light"
                    >
                      {tpl.categoryName}
                    </span>
                  {/if}
                </div>
                <p
                  class="text-2xs text-secondary line-clamp-1 mt-0.5 font-sans"
                >
                  {tpl.description ||
                    "Template toko online responsif dan optimal."}
                </p>
              </div>

              <div class="shrink-0">
                {#if selectedTemplateId === tpl.id}
                  <span
                    class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs"
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                {:else}
                  <span
                    class="w-4 h-4 rounded-full border border-light flex items-center justify-center"
                  ></span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>

      {#if submitError}
        <div
          class="p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2"
        >
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

    <!-- Right Section: Real Landing Page Preview (7 cols) -->
    <div class="lg:col-span-7 sticky top-6">
      <div
        class="bg-card rounded-2xl border border-light shadow-md overflow-hidden flex flex-col"
      >
        <!-- Mockup Browser Top Bar -->
        <div
          class="h-11 px-4 bg-nested border-b border-light flex items-center justify-between gap-2"
        >
          <div class="flex items-center gap-1.5 shrink-0">
            <div class="w-2.5 h-2.5 rounded-full bg-error/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-warning/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-success/80"></div>
          </div>

          <!-- URL Bar -->
          <div
            class="px-2.5 py-1 rounded-md bg-card border border-light text-2xs font-mono text-secondary flex items-center gap-1.5 max-w-[220px] sm:max-w-[280px] truncate shadow-2xs"
          >
            <span class="w-2 h-2 rounded-full bg-success shrink-0"></span>
            <span class="text-main font-semibold truncate"
              >{subdomain || "toko"}.{mainDomain}</span
            >
          </div>

          <!-- Device Viewport Switcher -->
          <div
            class="flex items-center bg-card p-0.5 rounded-lg border border-light gap-0.5 shrink-0"
          >
            <button
              type="button"
              on:click={() => (previewViewMode = "desktop")}
              class="p-1 rounded text-xs transition-colors {previewViewMode ===
              'desktop'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-secondary hover:text-main'}"
              title="Tampilan Desktop"
            >
              <Monitor size={13} />
            </button>
            <button
              type="button"
              on:click={() => (previewViewMode = "tablet")}
              class="p-1 rounded text-xs transition-colors {previewViewMode ===
              'tablet'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-secondary hover:text-main'}"
              title="Tampilan Tablet"
            >
              <Tablet size={13} />
            </button>
            <button
              type="button"
              on:click={() => (previewViewMode = "mobile")}
              class="p-1 rounded text-xs transition-colors {previewViewMode ===
              'mobile'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-secondary hover:text-main'}"
              title="Tampilan Mobile"
            >
              <Smartphone size={13} />
            </button>
          </div>
        </div>

        <!-- Real Landing Page iframe Container -->
        <div
          class="relative bg-nested/40 w-full h-[620px] lg:h-[700px] overflow-hidden"
        >
          {#if selectedTemplateId}
            <iframe
              src={`/builder/preview/${selectedTemplateId}?embed=true&view=${previewViewMode}`}
              class="w-full h-full border-0"
              title="Real Landing Page Preview"
              loading="lazy"
            ></iframe>
          {:else}
            <div
              class="w-full h-full flex flex-col items-center justify-center text-muted text-sm gap-2"
            >
              <Layout size={32} class="opacity-40" />
              <p>Pilih template untuk melihat preview landing page lengkap</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
