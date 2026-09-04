<script lang="ts">
  import { Input, Select, Textarea } from "@/components/ui";

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
    const rawValue = target.value.replace(/\D/g, "");
    basePrice = rawValue ? parseInt(rawValue, 10) : 0;
    const formatted = basePrice ? basePrice.toLocaleString("id-ID") : "";
    target.value = formatted;
  };
</script>

<div class="mb-3">
  <Input
    label="Nama Produk"
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
    value={basePrice ? basePrice.toLocaleString("id-ID") : ""}
    on:input={handlePriceInput}
    error={fieldErrors.basePrice}
  />
</div>

<div class="mb-3">
  <Textarea
    label="Deskripsi"
    bind:value={description}
  />
</div>
