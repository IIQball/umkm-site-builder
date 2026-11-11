<script lang="ts">
  import { Input } from "@/components/ui";

  export let searchCategoryName = "";
  export let categories: Array<{ id: string; name: string }> = [];

  let isDropdownOpen = false;

  $: displayedCategories = categories.filter(
    (c) =>
      !searchCategoryName ||
      searchCategoryName.toLowerCase() === "semua kategori" ||
      c.name.toLowerCase().includes(searchCategoryName.toLowerCase()),
  );

  function selectCategory(name: string) {
    searchCategoryName = name;
    isDropdownOpen = false;
  }
</script>

<div class="relative w-full sm:w-auto {isDropdownOpen ? 'block' : ''}">
  <div class="relative w-full sm:min-w-[200px]">
    <Input
      id="categorySearchInput"
      placeholder="Ketik kategori..."
      bind:value={searchCategoryName}
      on:focus={() => (isDropdownOpen = true)}
      on:blur={() => setTimeout(() => (isDropdownOpen = false), 200)}
      size="sm"
    >
      <svelte:fragment slot="prefix">
        <span class="material-symbols-outlined text-lg">filter_list</span>
      </svelte:fragment>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        slot="suffix"
        class="flex items-center cursor-pointer px-1"
        on:mousedown|preventDefault={() => {
          if (isDropdownOpen) {
            isDropdownOpen = false;
            document.getElementById("categorySearchInput")?.blur();
          } else {
            isDropdownOpen = true;
            document.getElementById("categorySearchInput")?.focus();
          }
        }}
      >
        <span class="material-symbols-outlined text-base">expand_more</span>
      </div>
    </Input>
  </div>
  {#if isDropdownOpen}
    <ul class="absolute right-0 z-20 p-1.5 flex flex-col gap-0.5 shadow-md bg-card rounded-xl w-full mt-2 max-h-60 overflow-y-auto border border-light">
      <li>
        <button
          type="button"
          class="text-sm font-bold font-sans cursor-pointer text-main w-full text-left px-3 py-2 rounded-lg hover:bg-nested/80"
          on:click={() => selectCategory("Semua Kategori")}
        >
          Semua Kategori
        </button>
      </li>
      {#each displayedCategories as category}
        <li>
          <button
            type="button"
            class="text-sm font-medium font-sans cursor-pointer text-main w-full text-left px-3 py-2 rounded-lg hover:bg-nested/80"
            on:click={() => selectCategory(category.name)}
          >
            {category.name}
          </button>
        </li>
      {/each}
      {#if displayedCategories.length === 0}
        <li class="px-4 py-2 text-sm font-sans text-muted text-center">Kategori tidak ditemukan</li>
      {/if}
    </ul>
  {/if}
</div>

