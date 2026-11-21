<script lang="ts">
  import { SearchableSelect } from "@/components/ui";

  export let searchCategoryName = "";
  export let categories: Array<{ id: string; name: string }> = [];

  $: options = [
    { value: "", label: "Semua Kategori" },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ];
</script>

<div class="w-full sm:w-56">
  <SearchableSelect
    {options}
    bind:value={searchCategoryName}
    placeholder="Semua Kategori"
    searchPlaceholder="Cari kategori produk..."
    clearable={false}
    size="sm"
  />
</div>


