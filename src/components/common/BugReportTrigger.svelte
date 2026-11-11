<script lang="ts">
  import { Bug } from 'lucide-svelte';
  import BugReportModal from './BugReportModal.svelte';
  import { openBugReportModal } from './bugReport.helpers';
  import type { BugReportSource } from '@/schemas/bug-report.schema';

  export let sourceApp: BugReportSource = 'site_builder';
  export let userEmail = '';
  export let showFloatingTrigger = true;

  let modalOpen = false;
</script>

{#if showFloatingTrigger && !modalOpen}
  <button
    type="button"
    on:click={openBugReportModal}
    aria-label="Laporkan masalah atau bug sistem"
    title="Laporkan Masalah / Bug"
    class="fixed bottom-4 right-4 z-40 inline-flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] px-3 sm:px-3.5 py-2 rounded-full bg-card/90 backdrop-blur-md border border-light text-secondary hover:text-main hover:border-primary/40 shadow-md transition-colors cursor-pointer text-xs font-semibold print:hidden"
  >
    <Bug size={15} class="text-primary shrink-0" />
    <span class="hidden sm:inline">Laporkan Bug</span>
  </button>
{/if}

<BugReportModal bind:open={modalOpen} {sourceApp} defaultEmail={userEmail} />
