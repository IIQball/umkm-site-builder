<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';
  import { MessageCircle, Menu, Clock, Phone } from 'lucide-svelte';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'default_split';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'default_split';
  $: hasCustomBg = !!styles?.backgroundColor;
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: ctaText = (props?.ctaText as string) || 'Chat WA';
  $: phoneDisplay = waNumber ? `+${waNumber.replace(/[^0-9]/g, '')}` : '+62 812-3456-7890';
</script>

<header
  data-node="header_container"
  class={`w-full flex flex-col box-border select-none transition-colors relative z-20 ${
    activePreset === 'minimal_borderless'
      ? 'bg-transparent text-[var(--theme-text-primary,#0f172a)]'
      : hasCustomBg
        ? ''
        : 'bg-[var(--theme-surface,white)] text-[var(--theme-text-primary,#0f172a)]'
  }`}
>
  <!-- 1. Announcement Bar (Top Row: py-2 = 8px) - shown for presets with top announcement -->
  {#if activePreset !== 'compact_inline' && activePreset !== 'floating_pill' && activePreset !== 'minimal_borderless' && activePreset !== 'top_contact_bar'}
    <div data-node="announcement_bar" class="w-full">
      <AnnouncementBar {props} {sectionId} {isActive} />
    </div>
  {/if}

  <!-- 2. Layout Presets -->

  {#if activePreset === 'floating_pill'}
    <!-- Preset A: Floating Pill (Floating margin-top 16px, pill shape 9999px, shadow-md) -->
    <div class="w-full pt-4 pb-2" style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);">
      <div
        id={`section-header-nav-${sectionId}`}
        class="header-nav-container max-w-[1200px] mx-auto h-14 sm:h-16 px-4 sm:px-6 rounded-full bg-[var(--theme-surface,#ffffff)] dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4 box-border"
      >
        <div data-node="logo" class="flex items-center flex-shrink-0">
          <HeaderLogo {props} {sectionId} {isActive} />
        </div>
        <div data-node="nav_links" class="hidden md:flex flex-1 items-center justify-center gap-6">
          <HeaderNav {props} {sectionId} {isActive} />
        </div>
        <div data-node="cta" class="flex items-center gap-2 flex-shrink-0">
          {#if waNumber}
            <a
              href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style="height: 36px; border-radius: 9999px; background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
              class="hidden sm:inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
            >
              <MessageCircle size={14} class="mr-1.5" />
              <span>{ctaText}</span>
            </a>
          {/if}
          <!-- Mobile Hamburger -->
          <button
            type="button"
            class="md:hidden p-2 rounded-full hover:bg-base-200 dark:hover:bg-slate-800 text-base-content/80"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </div>

  {:else if activePreset === 'centered_inline'}
    <!-- Preset B: Centered Inline (Logo Col 6-7 in center, Nav left, Actions right) -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto min-h-[64px] flex items-center justify-between border-b border-base-200 dark:border-slate-800 box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
    >
      <!-- Left side: Nav on desktop, Hamburger on mobile -->
      <div class="flex items-center flex-1 justify-start">
        <button
          type="button"
          class="md:hidden p-2 rounded-lg hover:bg-base-200 dark:hover:bg-slate-800 text-base-content/80"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
        <div data-node="nav_links" class="hidden md:flex items-center gap-6">
          <HeaderNav {props} {sectionId} {isActive} />
        </div>
      </div>

      <!-- Center: Logo -->
      <div data-node="logo" class="flex items-center justify-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>

      <!-- Right side: CTA / Contact button -->
      <div data-node="cta" class="flex items-center flex-1 justify-end">
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

  {:else if activePreset === 'sidebar_drawer_trigger'}
    <!-- Preset C: Sidebar Drawer Trigger (Logo left, Drawer menu trigger right + WA) -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto min-h-[56px] h-14 sm:h-16 flex items-center justify-between border-b border-base-200 dark:border-slate-800 box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
    >
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>

      <div data-node="cta" class="flex items-center gap-3 flex-shrink-0">
        {#if waNumber}
          <a
            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: 36px; border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="hidden sm:inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        {/if}
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-base-300 dark:border-slate-700 bg-base-200/60 dark:bg-slate-800 hover:bg-base-200 dark:hover:bg-slate-700 text-xs font-semibold text-base-content transition-colors cursor-pointer"
        >
          <Menu size={16} class="text-[var(--theme-primary,#2563eb)]" />
          <span class="hidden sm:inline">Menu / Navigasi</span>
        </button>
      </div>
    </div>

  {:else if activePreset === 'top_contact_bar'}
    <!-- Preset D: Top Contact Bar (Tier 1: Hours & Phone, Tier 2: Logo + Nav + WA) -->
    <!-- Tier 1 Top Contact Bar -->
    <div class="hidden sm:block w-full py-1.5 bg-slate-900 text-slate-200 text-xs border-b border-slate-800">
      <div
        class="max-w-[1200px] mx-auto flex items-center justify-between"
        style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
      >
        <div class="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
          <Clock size={12} class="text-[var(--theme-primary,#2563eb)]" />
          <span>Buka: Senin - Sabtu (08.00 - 20.00 WIB)</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] ml-auto sm:ml-0">
          <Phone size={12} class="text-[var(--theme-primary,#2563eb)]" />
          <span>Hubungi: {phoneDisplay}</span>
        </div>
      </div>
    </div>

    <!-- Tier 2 Main Bar -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-6 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
    >
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div data-node="nav_links" class="hidden md:flex items-center justify-end gap-6 flex-1">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <div data-node="cta" class="flex items-center gap-2 flex-shrink-0">
        {#if waNumber}
          <a
            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: 36px; border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        {/if}
      </div>
    </div>

  {:else if activePreset === 'minimal_borderless'}
    <!-- Preset E: Minimal Borderless (Transparent overlay, no border) -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-6 min-h-[64px] box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
    >
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div data-node="nav_links" class="hidden md:flex items-center justify-end gap-6 flex-1">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <div data-node="cta" class="flex items-center gap-2 flex-shrink-0">
        {#if waNumber}
          <a
            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: 36px; border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="hidden sm:inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        {/if}
        <button
          type="button"
          class="md:hidden p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-current"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </div>

  {:else if activePreset === 'centered_stacked'}
    <!-- Centered Stacked Preset -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto py-4 flex flex-col items-center justify-center gap-4 border-b border-base-200 dark:border-slate-800 box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
    >
      <div data-node="logo" class="flex items-center justify-center">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div data-node="nav_links" class="flex items-center justify-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
    </div>

  {:else if activePreset === 'compact_inline'}
    <!-- Compact Inline Preset: Single row h-14 (56px) -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto h-14 flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
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
            style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        {/if}
      </div>
    </div>

  {:else}
    <!-- Default Split Preset -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-6 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
    >
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div data-node="nav_links" class="flex items-center justify-end gap-6 flex-1">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      {#if waNumber}
        <div data-node="cta" class="hidden sm:flex items-center flex-shrink-0">
          <a
            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 text-xs font-bold transition-transform active:scale-95 shadow-sm"
          >
            <MessageCircle size={14} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        </div>
      {/if}
    </div>
  {/if}
</header>