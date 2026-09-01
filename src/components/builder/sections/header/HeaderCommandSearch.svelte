<script lang="ts">
  import { Search, MessageCircle } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
</script>

<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border"
  style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
>
  <div data-node="logo" class="flex items-center flex-shrink-0">
    <HeaderLogo {props} {sectionId} {isActive} />
  </div>

  <div class="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs border border-slate-200 dark:border-slate-700">
    <Search size={14} />
    <span class="flex-1 text-left">Cari katalog produk...</span>
    <kbd class="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono text-[10px]">⌘K</kbd>
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
