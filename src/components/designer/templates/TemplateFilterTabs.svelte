<script lang="ts">
  import { Layers, FileEdit, Hourglass, CheckCircle2, AlertOctagon } from 'lucide-svelte';

  export let activeFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected';
  export let counts: { all: number; draft: number; pending: number; approved: number; rejected: number };
  export let onSelectFilter: (f: 'all' | 'draft' | 'pending' | 'approved' | 'rejected') => void;
</script>

<div class="flex flex-wrap items-center gap-2">
  <button
    type="button"
    on:click={() => onSelectFilter('all')}
    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer {activeFilter === 'all' ? 'bg-primary text-white font-bold shadow-sm ring-2 ring-primary/20' : 'bg-card border border-light text-secondary font-semibold hover:text-main hover:bg-nested hover:border-primary/40'}"
  >
    <Layers size={14} />
    <span>Semua ({counts.all})</span>
  </button>

  <button
    type="button"
    on:click={() => onSelectFilter('draft')}
    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer {activeFilter === 'draft' ? 'bg-primary text-white font-bold shadow-sm ring-2 ring-primary/20' : 'bg-card border border-light text-secondary font-semibold hover:text-main hover:bg-nested hover:border-primary/40'}"
  >
    <FileEdit size={14} />
    <span>Draft ({counts.draft})</span>
  </button>

  <button
    type="button"
    on:click={() => onSelectFilter('pending')}
    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer {activeFilter === 'pending' ? 'bg-primary text-white font-bold shadow-sm ring-2 ring-primary/20' : 'bg-card border border-light text-secondary font-semibold hover:text-main hover:bg-nested hover:border-primary/40'}"
  >
    <Hourglass size={14} />
    <span>Menunggu ({counts.pending})</span>
  </button>

  <button
    type="button"
    on:click={() => onSelectFilter('approved')}
    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer {activeFilter === 'approved' ? 'bg-primary text-white font-bold shadow-sm ring-2 ring-primary/20' : 'bg-card border border-light text-secondary font-semibold hover:text-main hover:bg-nested hover:border-primary/40'}"
  >
    <CheckCircle2 size={14} />
    <span>Disetujui ({counts.approved})</span>
  </button>

  <button
    type="button"
    on:click={() => onSelectFilter('rejected')}
    class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer {activeFilter === 'rejected' ? 'bg-primary text-white font-bold shadow-sm ring-2 ring-primary/20' : 'bg-card border border-light text-secondary font-semibold hover:text-main hover:bg-nested hover:border-primary/40'}"
  >
    <AlertOctagon size={14} />
    <span>Ditolak ({counts.rejected})</span>
  </button>
</div>
