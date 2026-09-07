<script lang="ts">
  import { Input, Select, Textarea } from "@/components/ui";
  import { formatCurrencyInput, parseCurrencyInput } from "@/lib/currency";

  type Category = { id: string; name: string };

  export let name: string = "";
  export let categoryId: string = "";
  export let basePrice: number = 0;
  export let description: string = "";
  export let categories: Category[] = [];
  export let fieldErrors: Record<string, string> = {};

  const handlePriceInput = (event: Event | CustomEvent) => {
    const customEvent = event as CustomEvent;
    const target = (customEvent.detail?.target || event.target) as HTMLInputElement;
    if (!target) return;
    basePrice = parseCurrencyInput(target.value);
    target.value = formatCurrencyInput(target.value);
  };
</script>

<div class="mb-3">
  <Input
    label="Nama Produk"
    placeholder="contoh: Kaos Polos Katun Combed 30s"
    bind:value={name}
    error={fieldErrors.name}
  />
</div>

<div class="mb-3">
  <Select
    label="Kategori"
    bind:value={categoryId}
    error={fieldErrors.categoryId}
    options={categories.length === 0 ? [{value: "", label: "Belum ada kategori", disabled: true}] : categories.map(cat => ({ value: cat.id, label: cat.name }))}
  />
</div>

<div class="mb-3">
  <Input
    label="Harga Dasar"
    type="text"
    placeholder="0"
    value={formatCurrencyInput(basePrice)}
    on:input={handlePriceInput}
    error={fieldErrors.basePrice}
  />
</div>

<div class="mb-3">
  <Textarea
    label="Deskripsi"
    placeholder="contoh: Kaos berbahan katun 100% yang lembut, mudah menyerap keringat, dan sangat nyaman dipakai beraktivitas sehari-hari..."
    bind:value={description}
  />
</div>
