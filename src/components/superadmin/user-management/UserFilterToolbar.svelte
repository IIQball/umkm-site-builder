<script lang="ts">
  export let searchQuery = '';
  export let roleFilter: 'all' | 'tenant' | 'designer' = 'all';
  export let statusFilter: 'all' | 'active' | 'suspended' = 'all';
  export let showRoleFilter = false;
  export let roleOptions: Array<{ value: string; label: string }> = [];
  export let statusOptions: Array<{ value: string; label: string }> = [];
</script>

<div class="flex flex-wrap items-center gap-2.5 max-w-full">
  <div class="relative">
    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Cari nama atau email..."
      class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-44 sm:w-52"
    />
  </div>

  {#if showRoleFilter}
    <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto max-w-full">
      {#each roleOptions as opt}
        <button
          type="button"
          on:click={() => (roleFilter = opt.value as 'all' | 'tenant' | 'designer')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] whitespace-nowrap {roleFilter === opt.value ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          {opt.label}
        </button>
      {/each}
    </div>
  {/if}

  <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto max-w-full">
    {#each statusOptions as opt}
      <button
        type="button"
        on:click={() => (statusFilter = opt.value as 'all' | 'active' | 'suspended')}
        class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] whitespace-nowrap {statusFilter === opt.value ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
      >
        {opt.label}
      </button>
    {/each}
  </div>
</div>

