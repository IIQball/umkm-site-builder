<script lang="ts">
  import {
    ArrowLeft,
    CheckCircle,
    Loader2,
    Check,
    Layout,
    Store,
    ShoppingBag,
    PhoneCall,
    ShieldCheck
  } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateItem } from '../onboarding.types';

  export let templates: TemplateItem[] = [];
  export let selectedTemplateId: string = '';
  export let storeName: string = '';
  export let subdomain: string = '';
  export let submitStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  export let submitError: string = '';
  export let onPrev: () => void;
  export let onNext: () => void;

  $: if (!selectedTemplateId && templates.length > 0) {
    selectedTemplateId = templates[0].id;
  }

  $: activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
</script>

<div class="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
  <div class="border-b border-light pb-6">
    <h2 class="text-heading-md text-main font-bold font-heading leading-tight">
      Pilih Desain Template Toko
    </h2>
    <p class="text-body-sm text-secondary mt-0.5 font-sans">
      Pilih tampilan dasar toko online Anda. Setiap elemen, warna, dan konten dapat diubah nanti di editor visual no-code.
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
            class="group relative flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer text-left active:scale-[0.98] {selectedTemplateId === tpl.id
              ? 'bg-primary/[0.03] border-primary ring-2 ring-primary/20 shadow-xs'
              : 'bg-card border-light hover:border-primary/40 hover:bg-nested/30'}"
          >
            <!-- Thumbnail Image -->
            <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-nested border border-light shrink-0 relative">
              {#if tpl.thumbnailUrl}
                <img
                  src={tpl.thumbnailUrl}
                  alt={tpl.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center text-muted">
                  <Layout size={22} />
                </div>
              {/if}
              {#if selectedTemplateId === tpl.id}
                <div class="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                  <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              {/if}
            </div>

            <!-- Content Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap mb-1">
                {#if tpl.isOwned}
                  <span class="text-3xs font-bold uppercase tracking-caps px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Milik Anda
                  </span>
                {:else if tpl.price === 0}
                  <span class="text-3xs font-bold uppercase tracking-caps px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Gratis
                  </span>
                {/if}
                {#if tpl.categoryName}
                  <span class="text-3xs font-semibold px-2 py-0.5 rounded-md bg-nested text-muted border border-light">
                    {tpl.categoryName}
                  </span>
                {/if}
              </div>

              <h3 class="text-sm font-bold font-heading text-main truncate group-hover:text-primary transition-colors">
                {tpl.name}
              </h3>
              <p class="text-body-sm text-secondary line-clamp-2 mt-0.5 leading-relaxed font-sans">
                {tpl.description || 'Template profesional siap pakai untuk promosi produk & transaksi WhatsApp.'}
              </p>

              <div class="mt-2.5">
                <button
                  type="button"
                  on:click|stopPropagation={() => (selectedTemplateId = tpl.id)}
                  class="text-xs font-bold font-sans px-3 py-1 rounded-lg transition-all {selectedTemplateId === tpl.id
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-nested hover:bg-primary/10 text-main hover:text-primary'}"
                >
                  {selectedTemplateId === tpl.id ? 'Terpilih' : 'Pilih Template'}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Right Pane: Live Interactive Preview Frame (7 cols) -->
    <div class="lg:col-span-7 order-1 lg:order-2 sticky top-6">
      <div class="bg-card rounded-2xl border border-light shadow-sm overflow-hidden">
        <!-- Mockup Browser Top Bar -->
        <div class="h-10 px-4 bg-nested border-b border-light flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></div>
          </div>
          <div class="px-3 py-1 rounded-md bg-card border border-light text-2xs font-mono text-secondary flex items-center gap-1.5 max-w-[260px] truncate shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="text-main font-semibold truncate">{subdomain || 'tokomami'}.umkm.site</span>
          </div>
          <div class="text-3xs font-bold uppercase tracking-caps text-primary">
            Preview
          </div>
        </div>

        <!-- Preview Body Canvas -->
        <div class="p-4 sm:p-5 bg-nested/40 min-h-[380px] max-h-[460px] overflow-y-auto scrollbar-thin">
          {#if activeTemplate}
            <div class="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <!-- Mockup Store Header -->
              <div class="bg-card p-3 rounded-xl border border-light shadow-2xs flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <Store size={15} />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold font-heading text-main leading-tight">
                      {storeName || 'Nama Toko Anda'}
                    </h4>
                    <p class="text-3xs text-secondary leading-tight">Katalog Resmi & WhatsApp Order</p>
                  </div>
                </div>
                <span class="text-3xs font-bold uppercase tracking-caps px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Buka
                </span>
              </div>

              <!-- Mockup Hero Showcase Banner -->
              <div class="relative rounded-2xl overflow-hidden border border-light bg-slate-950 text-white min-h-[150px] flex items-center p-5">
                {#if activeTemplate.thumbnailUrl}
                  <img
                    src={activeTemplate.thumbnailUrl}
                    alt={activeTemplate.name}
                    class="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
                  />
                {/if}
                <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent"></div>
                <div class="relative z-10 space-y-2 max-w-xs">
                  <span class="text-3xs font-bold uppercase tracking-caps text-primary-light bg-primary/20 px-2 py-0.5 rounded border border-primary/30">
                    {activeTemplate.name}
                  </span>
                  <h3 class="text-base font-bold font-heading leading-tight drop-shadow-sm">
                    {storeName || 'Selamat Datang di Toko Kami'}
                  </h3>
                  <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    Produk berkualitas tinggi dengan pengiriman cepat langsung dari pengrajin & produsen terpercaya.
                  </p>
                  <button
                    type="button"
                    class="mt-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall size={12} /> Hubungi Penjual
                  </button>
                </div>
              </div>

              <!-- Mockup Product Catalog Grid Preview -->
              <div class="space-y-2">
                <div class="flex items-center justify-between px-1">
                  <span class="text-xs font-bold text-main flex items-center gap-1">
                    <ShoppingBag size={13} class="text-primary" /> Produk Unggulan
                  </span>
                  <span class="text-3xs text-secondary font-medium">3 Produk Sampel</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  {#each [1, 2, 3] as idx}
                    <div class="bg-card p-2 rounded-xl border border-light text-center space-y-1 shadow-2xs">
                      <div class="w-full h-14 rounded-lg bg-nested flex items-center justify-center text-secondary/60 text-3xs">
                        Foto {idx}
                      </div>
                      <p class="text-xs font-bold text-main truncate font-sans">Produk Spesial #{idx}</p>
                      <p class="text-2xs font-extrabold text-primary">Rp 45.000</p>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Feature Callout -->
              <div class="p-3 bg-card rounded-xl border border-light flex items-center gap-2.5 text-secondary">
                <ShieldCheck size={16} class="text-emerald-500 shrink-0" />
                <span class="text-xs leading-snug">
                  Template ini sudah dioptimasi untuk kecepatan buka instan di smartphone.
                </span>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  {#if submitError}
    <div class="p-3.5 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-xs text-[var(--color-error)] flex items-center gap-2">
      <span class="font-medium">{submitError}</span>
    </div>
  {/if}

  <div class="mt-4 flex justify-between gap-3 pt-6 border-t border-light">
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
      class="font-bold font-sans"
      disabled={submitStatus === 'submitting' || !selectedTemplateId}
      on:click={onNext}
    >
      {#if submitStatus === 'submitting'}
        <Loader2 size={16} class="animate-spin" />
        Menyimpan...
      {:else}
        Selesai & Buat Toko
        <CheckCircle size={16} />
      {/if}
    </Button>
  </div>
</div>
