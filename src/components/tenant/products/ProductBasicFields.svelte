<script lang="ts">
  import { Input, SearchableSelect, Textarea } from "@/components/ui";
  import { formatCurrencyInput, parseCurrencyInput } from "@/lib/currency";

  type Category = { id: string; name: string };

  export let name: string = "";
  export let categoryId: string = "";
  export let basePrice: number = 0;
  export let description: string = "";
  export let categories: Category[] = [];
  export let fieldErrors: Record<string, string> = {};

  $: categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handlePriceInput = (event: Event | CustomEvent) => {
    const customEvent = event as CustomEvent;
    const target = (customEvent.detail?.target || event.target) as HTMLInputElement;
    if (!target) return;
    basePrice = parseCurrencyInput(target.value);
    target.value = formatCurrencyInput(target.value);
  };
</script>

<div class="space-y-1.5 mb-4">
  <label for="prod_name" class="text-xs font-bold text-main block font-heading">
    Nama Produk <span class="text-error">*</span>
  </label>
  <Input
    id="prod_name"
    placeholder="contoh: Kaos Polos Katun Combed 30s"
    bind:value={name}
    error={fieldErrors.name}
  />
</div>

<div class="space-y-1.5 mb-4">
  <label for="prod_category" class="text-xs font-bold text-main block font-heading">
    Kategori <span class="text-error">*</span>
  </label>
  {#if categories.length === 0}
    <p class="text-xs text-muted italic py-1">Belum ada kategori produk. Silakan buat kategori terlebih dahulu.</p>
  {:else}
    <SearchableSelect
      id="prod_category"
      bind:value={categoryId}
      options={categoryOptions}
      placeholder="Pilih kategori produk..."
      searchPlaceholder="Cari kategori..."
      clearable={false}
      size="md"
      error={fieldErrors.categoryId}
    />
  {/if}
</div>

<div class="space-y-1.5 mb-4">
  <label for="prod_price" class="text-xs font-bold text-main block font-heading">
    Harga Dasar <span class="text-error">*</span>
  </label>
  <Input
    id="prod_price"
    type="text"
    placeholder="0"
    value={formatCurrencyInput(basePrice)}
    on:input={handlePriceInput}
    error={fieldErrors.basePrice}
  />
</div>

<div class="space-y-1.5 mb-4">
  <label for="prod_desc" class="text-xs font-bold text-main block font-heading">
    Deskripsi Singkat (Opsional)
  </label>
  <Textarea
    id="prod_desc"
    placeholder="contoh: Kaos berbahan katun 100% yang lembut, mudah menyerap keringat, dan sangat nyaman dipakai beraktivitas sehari-hari..."
    bind:value={description}
    className="text-xs font-sans"
  />
</div>
