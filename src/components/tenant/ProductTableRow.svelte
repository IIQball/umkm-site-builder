<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { InferSelectModel } from "drizzle-orm";
  import type { products as productsSchema } from "../../db/schema";

  type Product = InferSelectModel<typeof productsSchema>;

  export let product: Product;

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

<tr class="hover:bg-base-50/50 transition-colors group">
  <td class="px-4 py-3">
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="mask mask-squircle w-10 h-10 bg-base-200 flex items-center justify-center overflow-hidden border border-base-300/50">
          {#if Array.isArray(product.imageUrls) && product.imageUrls.length > 0 && (product.imageUrls[0].url || typeof product.imageUrls[0] === "string")}
            <img src={product.imageUrls[0].url || product.imageUrls[0]} alt={product.name} class="object-cover w-full h-full" />
          {:else}
            <span class="text-[10px] opacity-40 font-medium uppercase">Img</span>
          {/if}
        </div>
      </div>
      <div>
        <div class="font-semibold text-base-content">{product.name}</div>
        {#if Array.isArray(product.variants) && product.variants.length > 0}
          <div class="text-xs text-base-content/50 font-medium mt-0.5">{product.variants.length} varian</div>
        {/if}
      </div>
    </div>
  </td>
  <td class="px-4 py-3">
    <div class="max-w-xs text-xs text-base-content/70 line-clamp-2 leading-relaxed" title={product.description || ""}>
      {product.description || "-"}
    </div>
  </td>
  <td class="px-4 py-3 whitespace-nowrap font-medium text-base-content/90">
    Rp {product.basePrice.toLocaleString("id-ID")}
  </td>
  <td class="px-4 py-3">
    <div class="flex items-center gap-2">
      <span class="badge badge-sm font-medium {product.isAvailable ? 'bg-success/15 text-success-content border-none' : 'bg-base-200 text-base-content/60 border-none'}">
        {product.isAvailable ? "Tersedia" : "Kosong"}
      </span>
      <input type="checkbox" class="toggle toggle-xs toggle-success" checked={product.isAvailable} on:change={handleToggle} />
    </div>
  </td>
  <td class="px-4 py-3 text-right">
    <div class="flex justify-end gap-2">
      <button class="btn btn-sm btn-info btn-outline" on:click={() => dispatch('edit', product)}>
        Edit
      </button>
      <button class="btn btn-sm btn-error btn-outline" on:click={() => dispatch('delete', product.id)}>
        Hapus
      </button>
    </div>
  </td>
</tr>
