<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';
  import { MessageCircle } from 'lucide-svelte';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let layoutPreset: string = 'default_split';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'default_split';
  $: hasCustomBg = !!styles?.backgroundColor;
  $: waNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '';
  $: ctaText = (props?.ctaText as string) || 'Chat WA';
</script>

<header
  data-node="header_container"
  class={`w-full flex flex-col box-border select-none transition-colors ${
    hasCustomBg ? '' : 'bg-[var(--theme-surface,white)] text-[var(--theme-text-primary,#0f172a)]'
  }`}
>
  <!-- 1. Announcement Bar (Top Row: py-2 = 8px) -->
  {#if activePreset !== 'compact_inline'}
    <div data-node="announcement_bar" class="w-full">
      <AnnouncementBar {props} {sectionId} {isActive} />
    </div>
  {/if}

  <!-- 2. Main Header Navbar Navigation -->
  {#if activePreset === 'centered_stacked'}
    <!-- Centered Stacked Preset -->
    <div
      id={`section-header-nav-${sectionId}`}
      class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center gap-4 border-b border-base-200 dark:border-slate-800"
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
      class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800"
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
      class="w-full max-w-[var(--theme-max-width,1200px)] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6 border-b border-base-200 dark:border-slate-800 min-h-[56px]"
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