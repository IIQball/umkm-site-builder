<script lang="ts">
  import {
    Palette,
    Store,
    Sparkles,
    CheckCircle2,
    Zap,
    Smartphone,
    Globe,
  } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';

  export let pageData: CheckoutPageData;
  export let lineItemTitle: string;
  export let lineItemSubtitle: string;
</script>

<div class="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
  <!-- Browser Showcase Mockup -->
  <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-nested shadow-sm group transition-all">
    <div class="px-4 py-2.5 bg-canvas/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
      </div>
      <div class="flex-1 max-w-[200px] text-center">
        <div class="px-3 py-0.5 rounded-lg bg-card text-2xs font-mono text-secondary truncate border border-light">
          demo.umkm.id/{pageData.invoiceId.toLowerCase().slice(-6)}
        </div>
      </div>
      <div class="flex items-center gap-1 text-2xs text-secondary font-medium">
        <Sparkles size={12} class="text-primary" />
        <span>Tema Siap Pakai</span>
      </div>
    </div>

    <div class="aspect-video w-full relative overflow-hidden bg-nested">
      {#if pageData.templateThumbnailUrl}
        <img
          src={pageData.templateThumbnailUrl}
          alt={lineItemTitle}
          class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
        />
      {:else}
        <div class="w-full h-full flex flex-col items-center justify-center gap-2 text-secondary bg-nested">
          <Store size={48} class="text-primary/60" />
          <span class="text-xs font-semibold text-main">Pratinjau Desain Website UMKM</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Template Meta & Designer Profile -->
  <div class="space-y-3">
    <h1 class="text-heading-md sm:text-heading-lg font-bold text-main font-heading leading-snug">
      {lineItemTitle}
    </h1>
    <p class="text-body-sm text-secondary leading-relaxed">
      {pageData.templateDescription || lineItemSubtitle}
    </p>

    <div class="flex flex-wrap items-center gap-3 pt-1">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-nested border border-light text-xs text-secondary">
        <div class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xs font-heading">
          {(pageData.designerName || 'D')[0].toUpperCase()}
        </div>
        <span class="text-2xs">Kreator: <strong class="text-main font-semibold">{pageData.designerName || 'Desainer Resmi'}</strong></span>
        <span class="material-symbols-outlined text-primary text-[15px]">verified</span>
      </div>

      <div class="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-2xs font-semibold">
        <CheckCircle2 size={13} />
        <span>Desain Terverifikasi SaaS</span>
      </div>
    </div>
  </div>

  <!-- Value Benefits Cards -->
  <div class="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
    <h2 class="text-xs font-bold text-main uppercase tracking-wider font-heading flex items-center gap-1.5">
      <Sparkles size={14} class="text-primary" />
      <span>Fasilitas & Hak Lisensi Termasuk</span>
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
      <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
        <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
          <Zap size={15} class="text-primary shrink-0" />
          <span>Lisensi Seumur Hidup</span>
        </div>
        <p class="text-2xs text-secondary leading-relaxed">
          Sekali bayar untuk selamanya tanpa biaya langganan bulanan atau tahunan.
        </p>
      </div>

      <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
        <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
          <Palette size={15} class="text-primary shrink-0" />
          <span>No-Code Visual Editor</span>
        </div>
        <p class="text-2xs text-secondary leading-relaxed">
          Bebas ubah warna, font tipografi, banner hero, & susunan section sesuka hati.
        </p>
      </div>

      <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
        <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
          <Smartphone size={15} class="text-primary shrink-0" />
          <span>Siap Order WhatsApp</span>
        </div>
        <p class="text-2xs text-secondary leading-relaxed">
          Terhubung otomatis dengan tombol pemesanan WhatsApp toko Anda.
        </p>
      </div>

      <div class="p-3.5 rounded-2xl bg-nested/60 border border-light space-y-1 hover:border-primary/30 transition-colors">
        <div class="flex items-center gap-2 text-main font-bold text-xs font-heading">
          <Globe size={15} class="text-primary shrink-0" />
          <span>Subdomain Instan</span>
        </div>
        <p class="text-2xs text-secondary leading-relaxed">
          Langsung tayang online di alamat subdomain toko UMKM Anda seketika.
        </p>
      </div>
    </div>
  </div>
</div>
