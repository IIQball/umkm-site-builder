<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';
  import HeaderPillIsland from './header/HeaderPillIsland.svelte';
  import HeaderCommandSearch from './header/HeaderCommandSearch.svelte';
  import HeaderMegaMenu from './header/HeaderMegaMenu.svelte';
  import { MessageCircle, Clock, MapPin } from 'lucide-svelte';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'default_split';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'default_split';
  $: hasCustomBg = !!styles?.backgroundColor;
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '';
  $: ctaText = (props?.ctaText as string) || 'Chat WA';
  $: address = (props?.address as string) || 'Jakarta, Indonesia';
  $: storeHours = (props?.storeHours as string) || 'Buka: 08.00 - 21.00 WIB';
</script>

<header
  data-node="header_container"
  class={`w-full flex flex-col box-border select-none transition-colors relative z-20 ${
    activePreset === 'transparent_glass_header'
      ? 'backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/40 dark:border-slate-800/40 text-[var(--theme-text-primary,#0f172a)]'
      : hasCustomBg
      ? ''
      : 'bg-[var(--theme-surface,white)] text-[var(--theme-text-primary,#0f172a)]'
  }`}
>
  <!-- Top Announcement / Contact Bar -->
  {#if activePreset === 'top_contact_bar'}
    <div class="w-full bg-slate-900 text-slate-200 text-xs py-1.5 px-6 border-b border-slate-800">
      <div
        class="w-full mx-auto flex items-center justify-between gap-4 box-border"
        style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
      >
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5"><Clock size={12} class="text-emerald-400" /> {storeHours}</span>
          <span class="hidden sm:flex items-center gap-1.5"><MapPin size={12} class="text-blue-400" /> {address}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Toko Buka
          </span>
        </div>
      </div>
    </div>
  {:else if activePreset !== 'compact_inline' && activePreset !== 'floating_pill_island' && activePreset !== 'transparent_glass_header' && activePreset !== 'minimal_action_only'}
    <div data-node="announcement_bar" class="w-full">
      <AnnouncementBar {props} {sectionId} {isActive} />
    </div>
  {/if}

  <!-- Header Nav Layout Variants -->
  {#if activePreset === 'floating_pill_island'}
    <HeaderPillIsland {props} {sectionId} {isActive} {waNumber} {ctaText} />

  {:else if activePreset === 'split_nav_centered_logo'}
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
    >
      <div class="flex-1 hidden md:flex items-center justify-start gap-4 text-xs font-semibold">
        <a href="#products" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">Produk</a>
        <a href="#about" class="hover:text-[var(--theme-primary,#2563eb)] transition-colors">Tentang</a>
      </div>
      <div data-node="logo" class="flex items-center justify-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div class="flex-1 flex items-center justify-end gap-4 text-xs font-semibold">
        <a href="#contact" class="hidden md:inline-block hover:text-[var(--theme-primary,#2563eb)] transition-colors">Kontak</a>
        {#if waNumber}
          <a
            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 font-bold text-xs shadow-sm"
          >
            <span>{ctaText}</span>
          </a>
        {/if}
      </div>
    </div>

  {:else if activePreset === 'command_search_bar'}
    <HeaderCommandSearch {props} {sectionId} {isActive} {waNumber} {ctaText} />

  {:else if activePreset === 'mega_menu_dropdown'}
    <HeaderMegaMenu {props} {sectionId} {isActive} {waNumber} {ctaText} />

  {:else if activePreset === 'minimal_action_only'}
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[56px] box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 56px;"
    >
      <div data-node="logo" class="flex items-center">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      {#if waNumber}
        <a
          href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          style="height: var(--theme-btn-height, 36px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
          class="inline-flex items-center justify-center px-5 font-bold text-xs shadow-sm active:scale-95 transition-transform"
        >
          <MessageCircle size={14} class="mr-1.5" />
          <span>{ctaText}</span>
        </a>
      {/if}
    </div>

  {:else if activePreset === 'centered_stacked'}
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex flex-col items-center justify-center py-4 gap-3 border-b border-base-200 dark:border-slate-800 box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px);"
    >
      <div data-node="logo" class="flex items-center justify-center">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div data-node="nav_links" class="flex items-center justify-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
    </div>

  {:else}
    <!-- Default Split / Compact Inline -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="header-nav-container w-full mx-auto flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800 min-h-[64px] box-border"
      style="padding-left: var(--active-safe-zone, 32px); padding-right: var(--active-safe-zone, 32px); height: 64px;"
    >
      <div data-node="logo" class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div data-node="nav_links" class="flex-1 hidden md:flex items-center justify-center">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <div data-node="cta" class="flex items-center gap-2 flex-shrink-0">
        {#if waNumber}
          <a
            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            style="height: var(--theme-btn-height, 40px); border-radius: var(--theme-btn-radius, 8px); background-color: var(--theme-primary, #2563eb); color: var(--theme-btn-primary-text, #ffffff);"
            class="inline-flex items-center justify-center px-4 font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-transform"
          >
            <MessageCircle size={15} class="mr-1.5" />
            <span>{ctaText}</span>
          </a>
        {/if}
      </div>
    </div>
  {/if}
</header>