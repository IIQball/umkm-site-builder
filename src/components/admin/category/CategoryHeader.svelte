<script lang="ts">
  import { RefreshCw, Search } from 'lucide-svelte';
  import { Button } from '@/components/ui';

  export let searchQuery: string = '';
  export let loading: boolean = false;
  export let onRefresh: () => void;
  export let title: string = 'Master Kategori Template';
  export let subtitle: string = 'Daftar ceruk bisnis, slug URL, ikon antarmuka, dan opsi modifikasi data';
  export let icon: string = 'category';
</script>

<div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
  <div class="flex items-center gap-3">
    <div class="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
      <slot name="icon">
        <span class="material-symbols-outlined text-lg">{icon}</span>
      </slot>
    </div>
    <div>
      <h3 class="font-heading font-bold text-heading-md text-main leading-tight">
        {title}
      </h3>
      <p class="text-sm text-secondary mt-0.5">
        {subtitle}
      </p>
    </div>
  </div>

  <!-- Actions & Search Box -->
  <div class="flex flex-wrap items-center gap-2.5">
    <div class="relative">
      <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari kategori / slug..."
        class="bg-nested border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-48 sm:w-56"
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
    </div>
  </div>
</div>

