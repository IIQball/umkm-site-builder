<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowLeft,
    ArrowRight,
    Loader2,
    Check,
    Layout,
  } from "lucide-svelte";
  import { Button, Badge } from "@/components/ui";
  import type { TemplateItem } from "../onboarding.types";
  import { getMainDomain } from "@/lib/domain";
  import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";
  import OnboardingTemplatePreview from "./OnboardingTemplatePreview.svelte";

  export let templates: TemplateItem[] = [];
  export let selectedTemplateId: string = "";
  export let storeName: string = "";
  export let subdomain: string = "";
  export let submitStatus: "idle" | "submitting" | "success" | "error" = "idle";
  export let submitError: string = "";
  export let onPrev: () => void;
  export let onNext: () => void;

  let mainDomain = "localhost:4321";
  onMount(() => {
    mainDomain = getMainDomain();
  });

  $: if (!selectedTemplateId && templates.length > 0) {
    selectedTemplateId = templates[0].id;
  }

  $: activeTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];
</script>

<div
  class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300"
>
  <div class="border-b border-light pb-6">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Pilih Desain Template Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Pilih tampilan dasar toko online Anda. Setiap elemen, warna, dan konten
      dapat diubah nanti di editor visual no-code.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Left Pane: Template Cards List (5 cols) -->
    <div class="lg:col-span-5 space-y-3 order-2 lg:order-1">
      <p class="text-label-caps text-muted px-1">
        Koleksi Template Pilihan ({templates.length})
      </p>

      <div class="space-y-3">
        {#each templates as tpl (tpl.id)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            on:click={() => (selectedTemplateId = tpl.id)}
            class="group relative flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer text-left active:scale-[0.98] {selectedTemplateId ===
            tpl.id
              ? 'bg-primary/[0.03] border-primary ring-2 ring-primary/20 shadow-xs'
              : 'bg-card border-light hover:border-primary/40 hover:bg-nested/30'}"
          >
            <!-- Thumbnail Image -->
            <div
              class="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-nested border border-light shrink-0 relative"
            >
              {#if tpl.thumbnailUrl}
                <img
                  src={getOptimizedCloudinaryUrl(tpl.thumbnailUrl, 200)}
                  alt={tpl.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              {:else}
                <div
                  class="w-full h-full flex items-center justify-center text-muted"
                >
                  <Layout size={22} />
                </div>
              {/if}
              {#if selectedTemplateId === tpl.id}
                <div
                  class="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]"
                >
                  <div
                    class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs"
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              {/if}
            </div>

            <!-- Content Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap mb-1">
                {#if tpl.isOwned}
                  <Badge variant="success" size="sm">
                    Milik Anda
                  </Badge>
                {:else if tpl.price === 0}
                  <Badge variant="info" size="sm">
                    Gratis
                  </Badge>
                {/if}
                {#if tpl.categoryName}
                  <span
                    class="text-3xs font-semibold px-2 py-0.5 rounded-md bg-nested text-muted border border-light"
                  >
                    {tpl.categoryName}
                  </span>
                {/if}
              </div>

              <h3
                class="text-sm font-bold font-heading text-main truncate group-hover:text-primary transition-colors"
              >
                {tpl.name}
              </h3>
              <p
                class="text-body-sm text-secondary line-clamp-2 mt-0.5 leading-relaxed font-sans"
              >
                {tpl.description ||
                  "Template profesional siap pakai untuk promosi produk & transaksi WhatsApp."}
              </p>

              <div class="mt-2.5">
                <button
                  type="button"
                  on:click|stopPropagation={() => (selectedTemplateId = tpl.id)}
                  class="text-xs font-bold font-sans px-3 py-1 rounded-lg transition-all {selectedTemplateId ===
                  tpl.id
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-nested hover:bg-primary/10 text-main hover:text-primary'}"
                >
                  {selectedTemplateId === tpl.id
                    ? "Terpilih"
                    : "Pilih Template"}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Right Pane: Live Interactive Preview Frame (7 cols) -->
    <OnboardingTemplatePreview
      {activeTemplate}
      {storeName}
      {subdomain}
      {mainDomain}
    />
  </div>

  {#if submitError}
    <div
      class="p-3.5 rounded-xl bg-error/10 border border-error/20 text-xs text-error flex items-center gap-2"
    >
      <span class="font-medium">{submitError}</span>
    </div>
  {/if}

  <div class="mt-4 flex justify-between gap-3 pt-6 border-t border-light">
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

    <Button
      variant="primary"
      size="md"
      class="font-bold font-sans"
      disabled={submitStatus === "submitting" || !selectedTemplateId}
      on:click={onNext}
    >
      {#if submitStatus === "submitting"}
        <Loader2 size={16} class="animate-spin" />
        Memproses...
      {:else}
        Lanjut Kustomisasi Konten
        <ArrowRight size={16} />
      {/if}
    </Button>
  </div>
</div>
