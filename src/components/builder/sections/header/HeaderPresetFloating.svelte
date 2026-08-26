<script lang="ts">
  import HeaderLogo from './HeaderLogo.svelte';
  import HeaderNav from './HeaderNav.svelte';
  import { MessageCircle, Clock, Phone } from 'lucide-svelte';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps;
  export let sectionId: string;
  export let isActive: boolean;
  export let activePreset: string;
  export let waNumber: string;
  export let ctaText: string;
  export let phoneDisplay: string;
</script>

{#if activePreset === 'floating_pill'}
  <div class="w-full pt-4 pb-2 px-4 sm:px-8">
    <div class="max-w-6xl mx-auto h-14 sm:h-16 px-4 sm:px-6 rounded-full bg-base-100 dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
      <div class="flex items-center flex-shrink-0">
        <HeaderLogo {props} {sectionId} {isActive} />
      </div>
      <div class="hidden md:flex flex-1 items-center justify-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <div class="flex items-center gap-2">
        <a
          href="https://wa.me/{waNumber}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
        >
          <MessageCircle size={14} />
          <span>{ctaText}</span>
        </a>
      </div>
    </div>
  </div>

{:else if activePreset === 'top_contact_bar'}
  <div class="w-full">
    <!-- Top Micro Bar -->
    <div class="w-full bg-base-200/80 dark:bg-slate-900 px-4 sm:px-8 py-1.5 border-b border-base-300 dark:border-slate-800 text-[11px] text-base-content/70">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Clock size={12} class="text-primary" />
          <span>Buka: 08:00 - 21:00 WIB</span>
        </div>
        <div class="flex items-center gap-2">
          <Phone size={12} class="text-primary" />
          <span>{phoneDisplay}</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="w-full px-4 sm:px-8 h-16 flex items-center justify-between gap-4 border-b border-base-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto w-full flex items-center justify-between">
        <HeaderLogo {props} {sectionId} {isActive} />
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
  </div>

{:else}
  <!-- compact_inline -->
  <div class="w-full px-4 sm:px-8 h-14 flex items-center justify-between border-b border-base-200 dark:border-slate-800">
    <div class="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
      <HeaderLogo {props} {sectionId} {isActive} />
      <div class="hidden md:flex items-center gap-6">
        <HeaderNav {props} {sectionId} {isActive} />
      </div>
      <a
        href="https://wa.me/{waNumber}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
        style:background-color="var(--theme-primary)"
      >
        <span>{ctaText}</span>
      </a>
    </div>
  </div>
{/if}
