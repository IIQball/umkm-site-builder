<script lang="ts">
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import { MessageCircle, Menu } from 'lucide-svelte';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps;
  export let sectionId: string;
  export let isActive: boolean;
  export let activePreset: string;
  export let waNumber: string;
  export let ctaText: string;
</script>

{#if activePreset === 'centered_stacked'}
  <div class="w-full flex flex-col items-center justify-center py-4 px-4 gap-3 border-b border-base-200 dark:border-slate-800">
    <HeaderLogo {props} {sectionId} {isActive} />
    <HeaderNav {props} {sectionId} {isActive} />
  </div>

{:else if activePreset === 'centered_inline'}
  <div class="w-full px-4 sm:px-8 h-16 flex items-center justify-between border-b border-base-200 dark:border-slate-800">
    <div class="max-w-6xl mx-auto w-full grid grid-cols-3 items-center">
      <div class="flex items-center justify-start">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <div class="flex items-center justify-center">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div class="flex items-center justify-end">
        <a
          href="https://wa.me/{waNumber}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
          style:background-color="var(--theme-primary)"
        >
          <MessageCircle size={14} />
          <span>{ctaText}</span>
        </a>
      </div>
    </div>
  </div>

{:else if activePreset === 'sidebar_drawer_trigger'}
  <div class="w-full px-4 sm:px-8 h-16 flex items-center justify-between border-b border-base-200 dark:border-slate-800">
    <div class="max-w-6xl mx-auto w-full flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button type="button" class="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content cursor-pointer">
          <Menu size={18} />
        </button>
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div class="hidden md:flex items-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <a
        href="https://wa.me/{waNumber}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
        style:background-color="var(--theme-primary)"
      >
        <MessageCircle size={14} />
        <span>{ctaText}</span>
      </a>
    </div>
  </div>

{:else}
  <!-- default_split & minimal_borderless -->
  <div class="w-full px-4 sm:px-8 h-16 flex items-center justify-between {activePreset === 'minimal_borderless' ? '' : 'border-b border-base-200 dark:border-slate-800'}">
    <div class="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
      <HeaderLogo {props} {sectionId} {isActive} />
      <div class="hidden md:flex items-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <div class="flex items-center gap-3">
        <a
          href="https://wa.me/{waNumber}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
        >
          <MessageCircle size={14} />
          <span>{ctaText}</span>
        </a>
      </div>
    </div>
  </div>
{/if}
