<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Menu, Zap, Ticket } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Klaim Kupon';
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: promoTitle = props.promoTitle || '⚡ FLASH SALE';
  $: initialDurationHours = Number(props.promoDurationHours) || 4;

  let totalSeconds = initialDurationHours * 3600;
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let animatePulse = false;

  // React to prop duration changes
  $: {
    const desiredSeconds = (Number(props.promoDurationHours) || 4) * 3600;
    if (totalSeconds <= 0 || totalSeconds > desiredSeconds) {
      totalSeconds = desiredSeconds;
    }
  }

  $: hours = Math.floor(totalSeconds / 3600);
  $: minutes = Math.floor((totalSeconds % 3600) / 60);
  $: seconds = totalSeconds % 60;

  $: formattedHours = `${String(hours).padStart(2, '0')} Jam`;
  $: formattedMinutes = `${String(minutes).padStart(2, '0')} Mnt`;
  $: formattedSeconds = `${String(seconds).padStart(2, '0')} Dtk`;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin klaim kupon promo ${promoTitle}!`);

  onMount(() => {
    timerInterval = setInterval(() => {
      if (totalSeconds <= 1) {
        // Auto-Reset Loop: Reset to initial duration
        totalSeconds = (Number(props.promoDurationHours) || 4) * 3600;
      } else {
        totalSeconds -= 1;
      }
      // Micro-animation trigger on each second tick
      animatePulse = true;
      setTimeout(() => (animatePulse = false), 150);
    }, 1000);
  });

  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
</script>

<!-- Top Ribbon: Flash Sale Live Countdown -->
<div class="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white text-xs py-1.5 shadow-xs">
  <div
    class="w-full mx-auto flex items-center justify-between box-border"
    style="padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
  >
    <span class="font-bold flex items-center gap-1 text-[11px] tracking-wide">
      <Zap size={13} class="fill-current text-yellow-300 animate-bounce" />
      <span>{promoTitle}</span>
    </span>

    <div class="flex items-center gap-1.5 text-[10px] font-mono select-none">
      {#if !isMobile}
        <span class="text-rose-200 font-semibold">Sisa Waktu:</span>
      {/if}
      <span class="px-1.5 py-0.5 bg-black/35 rounded font-bold border border-white/10 shadow-inner">
        {formattedHours}
      </span>
      <span class="px-1.5 py-0.5 bg-black/35 rounded font-bold border border-white/10 shadow-inner">
        {formattedMinutes}
      </span>
      <span class={`px-1.5 py-0.5 bg-black/35 rounded font-bold border border-white/10 shadow-inner transition-transform duration-150 ${animatePulse ? 'scale-110 bg-yellow-400 text-slate-950' : ''}`}>
        {formattedSeconds}
      </span>
    </div>
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

  <!-- Right Controls: Desktop Promo CTA & Mobile 44x44px Hamburger Button -->
  <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
    {#if isDesktop || viewMode === 'tablet'}
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
      >
        <Ticket size={15} />
        <span>{ctaText || 'Klaim Kupon'}</span>
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
