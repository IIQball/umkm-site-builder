<script lang="ts">
  import { ChevronDown, MessageCircle } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';

  let showMegaMenu = false;
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border relative"
  style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
>
  <div data-node="logo" class="flex items-center flex-shrink-0">
    <HeaderLogo {props} {sectionId} {isActive} />
  </div>

  <div class="hidden md:flex items-center gap-6 text-xs font-semibold">
    <div class="relative">
      <button
        type="button"
        on:click={() => (showMegaMenu = !showMegaMenu)}
        class="flex items-center gap-1 hover:text-[var(--theme-primary,#2563eb)] cursor-pointer"
      >
        <span>Kategori Produk</span>
        <ChevronDown size={14} class={`transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
      </button>

      {#if showMegaMenu}
        <div class="absolute top-full left-0 mt-3 w-80 p-4 rounded-2xl bg-[var(--theme-surface,white)] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 grid grid-cols-2 gap-3 text-left">
          <a href="#food" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 block">
            <span class="font-bold text-xs block">Makanan</span>
            <span class="text-[10px] text-slate-400">Kuliner & Snack</span>
          </a>
          <a href="#fashion" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 block">
            <span class="font-bold text-xs block">Fashion</span>
            <span class="text-[10px] text-slate-400">Pakaian & Batik</span>
          </a>
          <a href="#craft" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 block">
            <span class="font-bold text-xs block">Kerajinan</span>
            <span class="text-[10px] text-slate-400">Handmade UMKM</span>
          </a>
          <a href="#drinks" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 block">
            <span class="font-bold text-xs block">Minuman</span>
            <span class="text-[10px] text-slate-400">Kopi & Herbal</span>
          </a>
        </div>
      {/if}
    </div>
    <a href="#about" class="hover:text-[var(--theme-primary,#2563eb)]">Tentang Toko</a>
    <a href="#contact" class="hover:text-[var(--theme-primary,#2563eb)]">Kontak</a>
  </div>

  <div data-node="cta" class="flex items-center gap-2 flex-shrink-0">
    {#if waNumber}
      <a
        href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noreferrer"
        style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
        class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
      >
        <MessageCircle size={14} class="mr-1.5" />
        <span>{ctaText}</span>
      </a>
    {/if}
  </div>
</div>
