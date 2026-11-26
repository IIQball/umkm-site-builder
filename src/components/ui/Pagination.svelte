<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let currentPage: number = 1;
  export let totalItems: number = 0;
  export let pageSize: number = 10;
  export let showInfo: boolean = true;
  export let size: 'xs' | 'sm' | 'md' = 'sm';
  export let autoUpdateUrl: boolean = true;
  export let pageParam: string = 'page';
  let className: string = '';
  export { className as class };

  const dispatch = createEventDispatcher<{
    pageChange: number;
  }>();

  $: totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  $: startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  $: endIndex = Math.min(currentPage * pageSize, totalItems);

  onMount(() => {
    if (autoUpdateUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const urlPage = parseInt(url.searchParams.get(pageParam) || '', 10);
      if (urlPage && urlPage > 0 && urlPage !== currentPage) {
        currentPage = urlPage;
      }
    }
  });

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    currentPage = page;
    dispatch('pageChange', page);

    if (autoUpdateUrl && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set(pageParam, page.toString());
      window.location.assign(url.toString());
    }
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

  const btnSizeClass = size === 'xs'
    ? 'min-w-[28px] h-7 text-2xs px-1.5'
    : size === 'md'
    ? 'min-w-[40px] h-10 text-sm px-3'
    : 'min-w-[34px] h-8.5 text-xs px-2.5';

  const navBtnSizeClass = size === 'xs'
    ? 'w-7 h-7 text-xs'
    : size === 'md'
    ? 'w-10 h-10 text-base'
    : 'w-8.5 h-8.5 text-sm';
</script>

{#if totalItems > 0}
  <div class="px-6 py-4 border-t border-light flex flex-col sm:flex-row items-center justify-between gap-4 {className}">
    <!-- Info Text -->
    {#if showInfo}
      <p class="text-xs text-secondary font-medium">
        Menampilkan <strong class="text-main font-bold font-mono">{startIndex}-{endIndex}</strong> dari <strong class="text-main font-bold font-mono">{totalItems}</strong> data
      </p>
    {:else}
      <div></div>
    {/if}

    <!-- Pagination Controls (Clean Flex layout, no squishing) -->
    {#if totalPages > 1}
      <div class="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-nested/60 border border-light shadow-2xs">
        <!-- Prev Button -->
        <button
          type="button"
          class="{navBtnSizeClass} rounded-xl flex items-center justify-center font-bold text-secondary hover:text-main hover:bg-card border border-transparent hover:border-light transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
          disabled={currentPage <= 1}
          on:click={() => goToPage(currentPage - 1)}
          aria-label="Halaman Sebelumnya"
        >
          <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        <!-- Page Numbers -->
        {#each pages as p}
          {#if p === '...'}
            <span
              class="{navBtnSizeClass} flex items-center justify-center text-muted font-mono font-bold select-none shrink-0"
            >
              ...
            </span>
          {:else}
            <button
              type="button"
              class="{btnSizeClass} rounded-xl font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center {currentPage === p
                ? 'bg-primary text-white shadow-xs border border-primary'
                : 'text-secondary hover:text-main hover:bg-card border border-transparent hover:border-light'}"
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
          class="{navBtnSizeClass} rounded-xl flex items-center justify-center font-bold text-secondary hover:text-main hover:bg-card border border-transparent hover:border-light transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
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
