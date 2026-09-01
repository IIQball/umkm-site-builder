<script lang="ts">
  import { Plus, RefreshCw } from 'lucide-svelte';
  import { Button } from '@/components/ui';

  export let searchQuery: string = '';
  export let loading: boolean = false;
  export let onRefresh: () => void;
  export let onCreate: () => void;
</script>

<div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
      <span class="material-symbols-outlined text-lg">category</span>
    </div>
    <div>
      <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
        Master Kategori Template
      </h3>
      <p class="text-body-sm text-secondary mt-0.5 font-sans">
        Daftar ceruk bisnis, slug URL, ikon antarmuka, dan opsi modifikasi data
      </p>
    </div>
  </div>

  <!-- Actions & Search Box -->
  <div class="flex flex-wrap items-center gap-2.5">
    <div class="relative">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari kategori / slug..."
        class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-48 sm:w-56"
      />
    </div>

    <div class="flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        on:click={onRefresh}
        disabled={loading}
        title="Refresh Data"
      >
        <RefreshCw size={14} class={loading ? 'animate-spin' : ''} />
      </Button>

      <Button
        variant="primary"
        size="sm"
        on:click={onCreate}
      >
        <Plus size={15} class="stroke-[2.5]" />
        <span>Tambah Kategori</span>
      </Button>
    </div>
  </div>
</div>
