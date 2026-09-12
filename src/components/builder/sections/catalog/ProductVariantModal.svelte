<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X, Plus, Minus, ShoppingBag, ShoppingCart } from 'lucide-svelte';
  import type { ProductItem } from '@/types';
  import { formatIDR } from '@/lib/currency';

  export let isOpen: boolean = false;
  export let product: ProductItem | null = null;
  export let mode: 'cart' | 'buy' = 'cart';
  export let onClose: () => void = () => {};
  export let onAddToCart: (
    product: ProductItem,
    selections: Record<string, { name: string; priceAdjustment?: number }>,
    qty: number,
    finalUnitPrice: number
  ) => void = () => {};
  export let onBuyNow: (
    product: ProductItem,
    selections: Record<string, { name: string; priceAdjustment?: number }>,
    qty: number,
    finalUnitPrice: number
  ) => void = () => {};

  let qty = 1;
  let selectedVariants: Record<string, { name: string; priceAdjustment?: number }> = {};

  $: basePrice = Number(product?.basePrice ?? product?.price ?? 0);

  $: normalizedVariants = Array.isArray(product?.variants)
    ? product.variants.map((group: any, idx: number) => ({
        id: group?.id || `group_${idx}`,
        groupName: group?.groupName || group?.name || `Varian ${idx + 1}`,
        options: Array.isArray(group?.options) ? group.options : [],
      }))
    : [];

  // Reset & initialize defaults when product opens
  $: if (isOpen && product) {
    qty = 1;
    const initial: Record<string, { name: string; priceAdjustment?: number }> = {};
    normalizedVariants.forEach((group) => {
      const avail = group.options.find((o: any) => o.isAvailable !== false);
      if (avail) {
        initial[group.groupName] = avail;
      } else if (group.options[0]) {
        initial[group.groupName] = group.options[0];
      }
    });
    selectedVariants = initial;
  }

  const handleSelectOption = (groupName: string, option: { name: string; priceAdjustment?: number }) => {
    selectedVariants[groupName] = option;
    selectedVariants = { ...selectedVariants };
  };

  const adjustQty = (delta: number) => {
    const next = qty + delta;
    if (next >= 1 && next <= 99) qty = next;
  };

  $: variantAdjustment = Object.values(selectedVariants).reduce(
    (sum, opt) => sum + (Number(opt?.priceAdjustment) || 0),
    0
  );
  $: unitPrice = basePrice + variantAdjustment;
  $: totalPrice = unitPrice * qty;

  $: displayImage = product?.image || product?.imageUrl || product?.imageUrls?.[0] || null;
  $: categoryName = product?.categoryName || product?.category?.name || null;

  const handleConfirmAddToCart = () => {
    if (!product) return;
    onAddToCart(product, selectedVariants, qty, unitPrice);
    onClose();
  };

  const handleConfirmBuyNow = () => {
    if (!product) return;
    onBuyNow(product, selectedVariants, qty, unitPrice);
    onClose();
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) onClose();
  };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen && product}
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Pilih Varian Produk"
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
    transition:fade={{ duration: 180 }}
  >
    <button
      type="button"
      class="fixed inset-0 w-full h-full cursor-default bg-transparent border-none p-0 -z-10"
      on:click={onClose}
      aria-label="Tutup modal"
      tabindex="-1"
    ></button>
    <div
      class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      transition:scale={{ start: 0.95, duration: 200 }}
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <h3 class="text-base font-bold text-slate-900 dark:text-white">
          {mode === 'buy' ? 'Beli Sekarang' : 'Tambah ke Keranjang'}
        </h3>
        <button
          type="button"
          on:click={onClose}
          class="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Content (Scrollable) -->
      <div class="p-5 overflow-y-auto space-y-5 text-left">
        <!-- Product Quick Info -->
        <div class="flex gap-4 items-start bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div class="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
            {#if displayImage}
              <img
                src={displayImage}
                alt={product.name}
                class="w-full h-full object-cover"
              />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-slate-400">
                <ShoppingBag size={24} />
              </div>
            {/if}
          </div>

          <div class="flex-1 min-w-0">
            {#if categoryName}
              <span class="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mb-1">
                {categoryName}
              </span>
            {/if}
            <h4 class="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
              {product.name}
            </h4>
            {#if product.description}
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                {product.description}
              </p>
            {/if}
            <p class="text-sm font-extrabold font-mono text-[var(--theme-primary,#2563eb)] mt-1.5">
              {formatIDR(unitPrice)}
            </p>
          </div>
        </div>

        <!-- Variant Groups -->
        {#if normalizedVariants.length > 0}
          <div class="space-y-4 pt-1">
            {#each normalizedVariants as group}
              {#if group.options.length > 0}
                <div>
                  <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    {group.groupName}
                  </span>
                  <div class="flex flex-wrap gap-2">
                    {#each group.options as opt}
                      {@const isSelected = selectedVariants[group.groupName]?.name === opt.name}
                      <button
                        type="button"
                        disabled={opt.isAvailable === false}
                        on:click={() => handleSelectOption(group.groupName, opt)}
                        class="px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all {
                          isSelected
                            ? 'bg-[var(--theme-primary,#2563eb)] border-[var(--theme-primary,#2563eb)] text-white shadow-sm ring-2 ring-[var(--theme-primary,#2563eb)]/20'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        } disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {opt.name}
                        {#if opt.priceAdjustment}
                          <span class="text-[11px] ml-1 opacity-90">(+{formatIDR(opt.priceAdjustment)})</span>
                        {/if}
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {/if}

        <!-- Quantity Selector -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Jumlah
            </span>
            <span class="text-[11px] text-slate-400">Atur kuantitas pesanan</span>
          </div>

          <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden">
            <button
              type="button"
              on:click={() => adjustQty(-1)}
              class="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Kurang kuantitas"
            >
              <Minus size={14} />
            </button>
            <span class="w-10 text-center font-bold font-mono text-sm text-slate-900 dark:text-white">
              {qty}
            </span>
            <button
              type="button"
              on:click={() => adjustQty(1)}
              class="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Tambah kuantitas"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer & Action Buttons -->
      <div class="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500 dark:text-slate-400 font-medium">Total Pembayaran</span>
          <span class="text-lg font-black font-mono text-[var(--theme-primary,#2563eb)]">
            {formatIDR(totalPrice)}
          </span>
        </div>

        {#if mode === 'buy'}
          <button
            type="button"
            on:click={handleConfirmBuyNow}
            class="w-full py-3.5 px-4 rounded-xl bg-[var(--theme-primary,#2563eb)] hover:brightness-110 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Beli Sekarang</span>
          </button>
        {:else}
          <button
            type="button"
            on:click={handleConfirmAddToCart}
            class="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:brightness-110 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span>+ Keranjang</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
