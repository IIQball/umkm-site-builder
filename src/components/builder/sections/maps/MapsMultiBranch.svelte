<script lang="ts">
  import { Building2 } from 'lucide-svelte';

  export let branches: { name: string; address: string }[] = [];
  export let activeBranchIdx: number = 0;
  export let mapEmbedUrl: string = '';
  export let onSelectBranch: (idx: number) => void;
</script>

<div class="flex flex-col gap-6 text-left">
  <div class="flex flex-wrap items-center gap-2">
    {#each branches as branch, idx}
      <button
        type="button"
        on:click={() => onSelectBranch(idx)}
        class={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
          activeBranchIdx === idx
            ? 'bg-[var(--theme-primary,#2563eb)] text-white shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
        }`}
      >
        <Building2 size={14} />
        <span>{branch.name}</span>
      </button>
    {/each}
  </div>

  <div class="rounded-2xl overflow-hidden border border-base-200 dark:border-slate-800 shadow-md min-h-[360px]">
    <iframe src={mapEmbedUrl} title="Google Map Location" width="100%" height="100%" style="border:0; min-height: 360px;" loading="lazy" allowfullscreen></iframe>
  </div>
</div>
