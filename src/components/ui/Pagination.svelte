<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let currentPage: number = 1;
  export let totalItems: number = 0;
  export let pageSize: number = 10;
  export let showInfo: boolean = true;
  export let size: 'xs' | 'sm' | 'md' = 'sm';
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    pageChange: number;
  }>();

  $: totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  $: startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  $: endIndex = Math.min(currentPage * pageSize, totalItems);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
    dispatch('pageChange', page);
  }

  // Generate smart pagination page numbers with ellipsis
  $: pages = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  })();

  const btnSizeClass = size === 'xs' ? 'btn-xs text-2xs min-h-[28px] h-7' : size === 'md' ? 'btn-md text-sm min-h-[40px] h-10' : 'btn-sm text-xs min-h-[32px] h-8';
</script>

{#if totalItems > 0}
  <div class="px-6 py-4 border-t border-light flex flex-col sm:flex-row items-center justify-between gap-3 {className}">
    <!-- Info Text -->
    {#if showInfo}
      <p class="text-xs text-secondary font-medium">
        Menampilkan <strong class="text-main font-bold font-mono">{startIndex}-{endIndex}</strong> dari <strong class="text-main font-bold font-mono">{totalItems}</strong> data
      </p>
    {:else}
      <div></div>
    {/if}

    <!-- DaisyUI Pagination Join Group -->
    {#if totalPages > 1}
      <div class="join border border-light rounded-xl overflow-hidden shadow-2xs">
        <!-- Prev Button -->
        <button
          type="button"
          class="join-item btn {btnSizeClass} bg-nested hover:bg-nested/80 border-0 text-main font-bold disabled:opacity-35 disabled:bg-nested/50 cursor-pointer"
          disabled={currentPage <= 1}
          on:click={() => goToPage(currentPage - 1)}
          aria-label="Halaman Sebelumnya"
        >
          <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        <!-- Page Numbers -->
        {#each pages as p}
          {#if p === '...'}
            <button
              type="button"
              class="join-item btn {btnSizeClass} btn-disabled bg-nested/60 border-0 text-muted cursor-default select-none font-mono"
            >
              ...
            </button>
          {:else}
            <button
              type="button"
              class="join-item btn {btnSizeClass} border-0 font-mono font-bold cursor-pointer transition-all {currentPage === p ? 'bg-slate-900 text-white dark:bg-orange dark:text-white shadow-inner' : 'bg-nested hover:bg-nested/80 text-main'}"
              on:click={() => goToPage(Number(p))}
              aria-current={currentPage === p ? 'page' : undefined}
            >
              {p}
            </button>
          {/if}
        {/each}

        <!-- Next Button -->
        <button
          type="button"
          class="join-item btn {btnSizeClass} bg-nested hover:bg-nested/80 border-0 text-main font-bold disabled:opacity-35 disabled:bg-nested/50 cursor-pointer"
          disabled={currentPage >= totalPages}
          on:click={() => goToPage(currentPage + 1)}
          aria-label="Halaman Selanjutnya"
        >
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    {/if}
  </div>
{/if}
