<script lang="ts">
  import { firstProductImageUrl } from '@/lib/products/image';
  import { createEventDispatcher } from "svelte";
  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";
  import { Button, Badge } from "@/components/ui";
  import { formatIDR } from "@/lib/currency";

  type Product = InferSelectModel<typeof productsSchema>;
  type Category = { id: string; name: string };

  export let product: Product;
  export let categories: Category[] = [];

  $: categoryName = categories.find(c => c.id === product.categoryId)?.name ?? "-";

  const dispatch = createEventDispatcher<{
    edit: Product;
    delete: string;
    toggle: { product: Product; newStatus: boolean };
  }>();

  const handleToggle = (e: Event) => {
    const target = e.target as HTMLInputElement;
    dispatch("toggle", { product, newStatus: target.checked });
  }
</script>

<tr class="group hover:bg-nested/40 transition-colors">
  <td class="px-6 py-4 align-top">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-nested flex items-center justify-center overflow-hidden border border-light shadow-sm flex-shrink-0">
        {#if firstProductImageUrl(product.imageUrls)}
          <img src={firstProductImageUrl(product.imageUrls)} alt={product.name} class="object-cover w-full h-full" />
        {:else}
          <span class="text-3xs text-muted font-bold uppercase tracking-wider">Img</span>
        {/if}
      </div>
      <div class="min-w-0">
        <div class="text-xs font-bold text-main font-sans truncate">{product.name}</div>
        {#if Array.isArray(product.variants) && product.variants.length > 0}
          {@const groups = product.variants}
          {@const hasGroups = groups.length > 0 && typeof groups[0] === 'object' && groups[0] !== null && 'groupName' in groups[0]}
          {#if hasGroups}
            <div class="text-2xs text-secondary font-sans mt-0.5 truncate">
              {groups.length} grup: {groups.map(g => g.groupName).join(', ')}
            </div>
          {:else}
            <div class="text-2xs text-secondary font-sans mt-0.5">{product.variants.length} varian</div>
          {/if}
        {/if}
      </div>
    </div>
  </td>
  <td class="px-6 py-4 align-top whitespace-nowrap">
    <Badge variant="secondary" size="sm">{categoryName}</Badge>
  </td>
  <td class="px-6 py-4 align-top">
    <div class="max-w-[200px] text-xs text-secondary font-sans line-clamp-2 leading-relaxed" title={product.description || ""}>
      {product.description || "-"}
    </div>
  </td>
  <td class="px-6 py-4 align-top whitespace-nowrap">
    <span class="text-xs font-bold font-mono text-main">
      {formatIDR(product.basePrice)}
    </span>
  </td>
  <td class="px-6 py-4 align-top">
    <div class="flex items-center gap-3">
      <Badge variant={product.isAvailable ? "success" : "secondary"} size="sm">
        {product.isAvailable ? "Tersedia" : "Kosong"}
      </Badge>
      <input 
        type="checkbox" 
        class="toggle toggle-sm toggle-success" 
        checked={product.isAvailable} 
        on:change={handleToggle} 
      />
    </div>
  </td>
  <td class="px-6 py-4 align-top text-right">
    <div class="flex items-center justify-end gap-1">
      <Button
        variant="secondary"
        size="icon"
        on:click={() => dispatch('edit', product)}
        title="Edit"
      >
        <span class="material-symbols-outlined text-base">edit</span>
      </Button>
      <Button
        variant="destructive"
        size="icon"
        className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
        on:click={() => dispatch('delete', product.id)}
        title="Hapus"
      >
        <span class="material-symbols-outlined text-base">delete</span>
      </Button>
    </div>
  </td>
</tr>
