<script lang="ts">
  import { Menu, Bike } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Pesan Sekarang';
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: deliveryText = props.deliveryText || '🛵 Siap Kirim Instan: Estimasi 30 Menit';
  $: deliveryPartners = props.deliveryPartners || 'Tersedia GrabFood & GoFood';

  $: waUrl = generateWhatsAppLink(waNumber, 'Halo, saya ingin pesan delivery!');
</script>

<!-- Top Ribbon: Delivery Info -->
<div class="w-full bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 text-xs py-1.5 border-b border-orange-200/60 dark:border-orange-900/60">
  <div
    class="w-full mx-auto flex items-center justify-between box-border text-[11px]"
    style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
  >
    <span class="font-medium flex items-center gap-1.5">
      <span>{deliveryText}</span>
    </span>
    {#if !isMobile}
      <span class="font-semibold text-orange-700 dark:text-orange-400">
        {deliveryPartners}
      </span>
    {/if}
  </div>
</div>

<!-- Main Navbar -->
<div
  id={`section-header-nav-${sectionId}`}
  class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] h-16 box-border relative overflow-visible"
  style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
>
  <!-- Logo on Far Left Column 1 -->
  <div data-node="logo" class="flex items-center flex-shrink-0">
    <HeaderLogo {props} {sectionId} {isActive} />
  </div>

  <!-- Desktop Nav Links in Center -->
  {#if isDesktop}
    <div data-node="nav_links" class="flex-1 flex items-center justify-center">
      <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
    </div>
  {/if}

  <!-- Right Controls: Desktop Delivery CTA & Mobile 44x44px Hamburger Button -->
  <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
    {#if isDesktop || viewMode === 'tablet'}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
      >
        <Bike size={15} />
        <span>{ctaText || 'Pesan Sekarang'}</span>
      </a>
    {/if}

    <!-- Tablet & Mobile Hamburger Button: Area 44x44px, High Contrast -->
    {#if isSmallScreen}
      <button
        type="button"
        on:click={onToggleMobileMenu}
        class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-800 dark:text-slate-100 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-colors cursor-pointer shadow-xs ml-auto"
        aria-label="Buka menu navigasi"
      >
        <Menu size={20} />
      </button>
    {/if}
  </div>
</div>
