<script lang="ts">
  import type { HeaderAnnouncementProps, SectionStyles } from '@/types';
  import AnnouncementBar from './header/AnnouncementBar.svelte';
  import HeaderLogo from './header/HeaderLogo.svelte';
  import HeaderNav from './header/HeaderNav.svelte';

  export let props: HeaderAnnouncementProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: hasCustomBg = !!styles?.backgroundColor;
</script>

<div class="w-full flex flex-col box-border">
  <!-- 1. Top Full-Width Row: Announcement Bar -->
  <AnnouncementBar {props} {sectionId} {isActive} />

  <!-- 2. Main Header Navbar Row: Logo on Left, Nav on Right -->
  <div
    class={`w-full border-b box-border transition-colors ${
      hasCustomBg ? '' : 'bg-white border-slate-200/80'
    }`}
  >
    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between min-w-0">
      <!-- Left Side: Store Logo -->
      <HeaderLogo {props} {sectionId} {isActive} />

      <!-- Right Side: Navigation Menu & Action -->
      <HeaderNav {props} {sectionId} {isActive} />
    </div>
  </div>
</div>
