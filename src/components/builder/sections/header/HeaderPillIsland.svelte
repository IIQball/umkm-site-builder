<script lang="ts">
  import { MessageCircle } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Chat WA';
</script>

<div class="w-full py-3 px-4 box-border">
  <div
    id={`section-header-nav-${sectionId}`}
    class="max-w-5xl mx-auto h-14 px-6 rounded-full bg-[var(--theme-surface,white)]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between gap-4 box-border"
  >
    <div data-node="logo" class="flex items-center flex-shrink-0">
      <HeaderLogo {props} {sectionId} {isActive} />
    </div>
    <div data-node="nav_links" class="flex-1 hidden md:flex items-center justify-center gap-6">
      <HeaderNav {props} {sectionId} {isActive} />
    </div>
    <div data-node="cta" class="flex items-center gap-2 flex-shrink-0">
      {#if waNumber}
        <a
          href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 36px); border-radius: 9999px; background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
        >
          <MessageCircle size={14} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      {/if}
    </div>
  </div>
</div>
