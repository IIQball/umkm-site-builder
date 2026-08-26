<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderPresetFloating from './header/HeaderPresetFloating.svelte';
  import HeaderPresetStandard from './header/HeaderPresetStandard.svelte';

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
  class="w-full flex flex-col box-border select-none transition-colors relative z-20 {activePreset === 'minimal_borderless' ? 'bg-transparent' : hasCustomBg ? '' : 'bg-base-100 dark:bg-slate-950 text-base-content'}"
>
  {#if activePreset !== 'compact_inline' && activePreset !== 'floating_pill' && activePreset !== 'minimal_borderless' && activePreset !== 'top_contact_bar'}
    <div class="w-full">
      <AnnouncementBar {props} {sectionId} {isActive} />
    </div>
  {/if}

  {#if activePreset === 'floating_pill' || activePreset === 'top_contact_bar' || activePreset === 'compact_inline'}
    <HeaderPresetFloating
      {props}
      {sectionId}
      {isActive}
      {activePreset}
      {waNumber}
      {ctaText}
      {phoneDisplay}
    />
  {:else}
    <HeaderPresetStandard
      {props}
      {sectionId}
      {isActive}
      {activePreset}
      {waNumber}
      {ctaText}
    />
  {/if}
</header>