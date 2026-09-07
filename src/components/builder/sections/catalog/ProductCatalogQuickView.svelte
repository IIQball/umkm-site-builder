<script lang="ts">
  import { X, Package } from 'lucide-svelte';
  import WhatsAppIcon from '../../../ui/WhatsAppIcon.svelte';
  import { generateWhatsAppOrderUrl } from '../../../../lib/whatsapp';
  import { formatIDR } from '@/lib/currency';
  import type { ProductItem } from '@/types';

  export let quickViewProduct: ProductItem | null = null;
  export let activeStoreId: string | null = null;
  export let storeWaNumber: string = '';
  export let onClose: () => void = () => {};

  let quickViewSelections: Record<string, string> = {};

  $: if (quickViewProduct) {
    quickViewSelections = {};
    if (quickViewProduct.variants && Array.isArray(quickViewProduct.variants)) {
      quickViewProduct.variants.forEach((g: any) => {
        const firstAvail = g.options?.find((o: any) => o.isAvailable);
        if (firstAvail) {
          quickViewSelections[g.groupName] = firstAvail.name;
        } else if (g.options?.[0]) {
          quickViewSelections[g.groupName] = g.options[0].name;
        }
      });
    }
  }

  const handleVariantChange = (groupName: string, value: string) => {
    quickViewSelections[groupName] = value;
    quickViewSelections = { ...quickViewSelections };
  };

  $: computedPrice = (() => {
    if (!quickViewProduct) return 0;
    let base = typeof quickViewProduct.price === 'number'
      ? quickViewProduct.price
      : parseFloat(String(quickViewProduct.price).replace(/[^0-9.-]+/g, '')) || 0;
    if (quickViewProduct.variants && Array.isArray(quickViewProduct.variants)) {
      for (const group of quickViewProduct.variants) {
        const selectedOptionName = quickViewSelections[group.groupName];
        if (selectedOptionName && group.options) {
          const opt = group.options.find((o: any) => o.name === selectedOptionName);
          if (opt && typeof opt.priceAdjustment === 'number') {
            base += opt.priceAdjustment;
          }
        }
      }
    }
    return base;
  })();

  $: variantString = (() => {
    if (!quickViewProduct || !quickViewProduct.variants || !Array.isArray(quickViewProduct.variants)) return undefined;
    const parts: string[] = [];
    for (const group of quickViewProduct.variants) {
      const selectedName = quickViewSelections[group.groupName];
      if (selectedName) {
        parts.push(`${group.groupName}: ${selectedName}`);
      }
    }
    return parts.length > 0 ? parts.join(', ') : undefined;
  })();
</script>

{#if quickViewProduct}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    on:click={onClose}
  >
    <div 
      class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
      on:click|stopPropagation
    >
      <button
        type="button"
        on:click={onClose}
        class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X size={18} />
      </button>

      <div class="flex flex-col sm:flex-row h-full overflow-y-auto">
        <div class="w-full sm:w-1/2 bg-slate-100 dark:bg-slate-800 shrink-0">
          {#if quickViewProduct.imageUrl}
            <img src={quickViewProduct.imageUrl} alt={quickViewProduct.name} class="w-full h-64 sm:h-full object-cover" />
          {:else}
            <div class="w-full h-64 sm:h-full flex items-center justify-center text-slate-400">
              <Package size={48} />
            </div>
          {/if}
        </div>

        <div class="w-full sm:w-1/2 p-6 flex flex-col">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">{quickViewProduct.name}</h3>
          {#if quickViewProduct.description}
            <p class="text-sm text-slate-500 mb-6">{quickViewProduct.description}</p>
          {/if}

          {#if quickViewProduct.variants && Array.isArray(quickViewProduct.variants) && quickViewProduct.variants.length > 0}
            <div class="flex flex-col gap-4 mb-6">
              {#each quickViewProduct.variants as group}
                <div>
                  <span class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{group.groupName}</span>
                  <div class="flex flex-wrap gap-2">
                    {#each group.options as opt}
                      <button
                        type="button"
                        disabled={!opt.isAvailable}
                        on:click={() => handleVariantChange(group.groupName, opt.name)}
                        class={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          quickViewSelections[group.groupName] === opt.name
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {opt.name} {opt.priceAdjustment ? `(+${formatIDR(opt.priceAdjustment)})` : ''}
                      </button>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            <span class="text-xs uppercase font-semibold text-slate-400 block mb-1">Total Harga</span>
            <p class="text-2xl font-extrabold text-blue-600 mb-4 font-mono">
              {formatIDR(computedPrice)}
            </p>
            
            <a
              href={activeStoreId && storeWaNumber
                ? generateWhatsAppOrderUrl(
                    storeWaNumber,
                    quickViewProduct.name || '',
                    computedPrice,
                    variantString
                  )
                : '#'}
              target={activeStoreId && storeWaNumber ? '_blank' : undefined}
              rel="noopener noreferrer"
              class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <WhatsAppIcon size={18} />
              Lanjut Pesan via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
