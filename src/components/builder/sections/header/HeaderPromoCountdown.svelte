<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Menu, Ticket } from 'lucide-svelte';
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import TemplateThemeToggle from './TemplateThemeToggle.svelte';
  import type { HeaderAnnouncementProps } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { generateWhatsAppLink } from '@/lib/whatsapp';
  import { stripEmoji } from './headerIcons';
  import { resolveFeatureIcon } from '../features/featureIcons';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let waNumber: string = '';
  export let ctaText: string = 'Klaim Kupon';
  export let hasAnnouncementRow: boolean = true;
  export let announcementBarOrder: number = 0;
  export let navbarContainerOrder: number = 1;
  export let navbarOrder: string[] = ['logo', 'nav_links', 'cta'];
  export let onToggleMobileMenu: () => void = () => {};

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isDesktop = viewMode === 'desktop';
  $: isMobile = viewMode === 'mobile';
  $: isSmallScreen = viewMode === 'mobile' || viewMode === 'tablet';

  $: hasLogo = navbarOrder.includes('logo');
  $: hasNav = navbarOrder.includes('nav_links');
  $: hasCta = navbarOrder.includes('cta');

  $: promoTitle = stripEmoji(props.promoTitle) || 'FLASH SALE HARI INI';
  $: promoIcon = (props.promoIcon as string) || 'flame';

  function parseDuration(val: unknown): number {
    const n = Number(val);
    return !isNaN(n) && n > 0 && isFinite(n) ? n : 4;
  }

  let totalSeconds = parseDuration(props?.promoDurationHours) * 3600;
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let animatePulse = false;

  // React to prop duration changes safely (immune to NaN)
  $: {
    const desiredSeconds = parseDuration(props?.promoDurationHours) * 3600;
    if (isNaN(totalSeconds) || totalSeconds <= 0 || totalSeconds > desiredSeconds) {
      totalSeconds = desiredSeconds;
    }
  }

  $: safeSeconds =
    typeof totalSeconds === 'number' && !isNaN(totalSeconds) && isFinite(totalSeconds) && totalSeconds >= 0
      ? Math.floor(totalSeconds)
      : parseDuration(props?.promoDurationHours) * 3600;

  $: hours = Math.floor(safeSeconds / 3600);
  $: minutes = Math.floor((safeSeconds % 3600) / 60);
  $: seconds = safeSeconds % 60;

  $: formattedHours = `${String(hours).padStart(2, '0')} Jam`;
  $: formattedMinutes = `${String(minutes).padStart(2, '0')} Mnt`;
  $: formattedSeconds = `${String(seconds).padStart(2, '0')} Dtk`;

  $: waUrl = generateWhatsAppLink(waNumber, `Halo, saya ingin klaim kupon promo ${promoTitle}!`);

  onMount(() => {
    timerInterval = setInterval(() => {
      const desiredSeconds = parseDuration(props?.promoDurationHours) * 3600;
      if (isNaN(totalSeconds) || totalSeconds <= 1) {
        totalSeconds = desiredSeconds;
      } else {
        totalSeconds = Math.max(0, totalSeconds - 1);
      }
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

<div class="w-full flex flex-col">
  <!-- Top Ribbon: Flash Sale Live Countdown -->
  {#if hasAnnouncementRow}
    <div
      style="order: {announcementBarOrder}; background: linear-gradient(90deg, var(--theme-secondary, var(--color-secondary, #dc2626)), var(--theme-primary, var(--color-primary, #e11d48))); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-body, var(--font-family, inherit));"
      class="w-full py-1.5 shadow-xs"
    >
      <div
        class="w-full mx-auto flex items-center justify-between box-border"
        style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); font-size: var(--theme-text-caption, var(--text-caption-size, 12px));"
      >
        <span class="font-bold flex items-center gap-1.5 tracking-wide">
          <svelte:component this={resolveFeatureIcon(promoIcon)} size={13} class="fill-current text-yellow-300 animate-bounce flex-shrink-0" />
          <span>{promoTitle}</span>
        </span>

        <div class="flex items-center gap-1.5 text-[10px] font-mono select-none">
          {#if !isMobile}
            <span class="font-semibold opacity-90">Sisa Waktu:</span>
          {/if}
          <span
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 6px));"
            class="px-1.5 py-0.5 bg-black/35 font-bold border border-white/10 shadow-inner"
          >
            {formattedHours}
          </span>
          <span
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 6px));"
            class="px-1.5 py-0.5 bg-black/35 font-bold border border-white/10 shadow-inner"
          >
            {formattedMinutes}
          </span>
          <span
            style="border-radius: var(--theme-btn-radius, var(--btn-radius, 6px));"
            class={`px-1.5 py-0.5 bg-black/35 font-bold border border-white/10 shadow-inner transition-transform duration-150 ${animatePulse ? 'scale-110 bg-white/20 text-white' : ''}`}
          >
            {formattedSeconds}
          </span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Navbar -->
  <div
    id={`section-header-nav-${sectionId}`}
    class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 min-h-[64px] h-16 box-border relative overflow-visible"
    style="order: {navbarContainerOrder}; max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px)); border-bottom: 1px solid var(--color-border); font-family: var(--theme-font-body, inherit);"
  >
    <!-- Logo on Far Left Column 1 -->
    {#if hasLogo}
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
    {/if}

    <!-- Desktop Nav Links in Center -->
    {#if hasNav && isDesktop}
      <div data-node="nav_links" class="flex-1 flex items-center justify-center">
        <HeaderNav {props} {sectionId} {isActive} onlyDesktop={true} />
      </div>
    {/if}

    <!-- Right Controls: Desktop Promo CTA & Mobile 44x44px Hamburger Button -->
    <div data-node="cta" class="flex items-center gap-2 flex-shrink-0 ml-auto">
      <!-- Theme Toggle (Sebelum tombol CTA) -->
      <TemplateThemeToggle size="sm" />

      {#if hasCta && (isDesktop || viewMode === 'tablet')}
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 38px); border-radius: var(--theme-btn-radius, var(--btn-radius, 8px)); background-color: var(--theme-secondary, var(--color-secondary, #dc2626)); color: var(--theme-btn-primary-text, var(--btn-primary-text, white)); font-family: var(--theme-font-heading, var(--font-heading, inherit)); font-size: var(--theme-text-caption, var(--text-caption-size, 13px));"
          class="inline-flex items-center justify-center gap-1.5 px-4 font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
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
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 10px)); border: 1px solid var(--color-border); color: var(--theme-text-primary, var(--color-text-main)); background: var(--color-card-base, var(--theme-surface, transparent)); font-family: var(--theme-font-body, inherit);"
          class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer shadow-xs ml-auto"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>
      {/if}
    </div>
  </div>
</div>
