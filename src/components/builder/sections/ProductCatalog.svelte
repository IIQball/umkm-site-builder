<script lang="ts">
  import { editorStore } from '../stores/editorStore';
  import type { ProductCatalogProps, SectionStyles, ProductItem } from '@/types/builder';
  import { Package, ShoppingBag } from 'lucide-svelte';

  export let props: ProductCatalogProps = {};
  export let styles: SectionStyles = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: products = (Array.isArray(props?.products) ? props.products : []) as ProductItem[];
  $: hasCustomColor = !!styles?.color;

  let draggedIdx: number | null = null;
  let dropTargetIdx: number | null = null;

  const onDragStart = (e: DragEvent, index: number) => {
    if (!isActive) return;
    draggedIdx = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  };

  const onDragOver = (e: DragEvent, index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    e.preventDefault();
    dropTargetIdx = index;
  };

  const onDrop = (e: DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      draggedIdx = null;
      dropTargetIdx = null;
      return;
    }

    const list = [...products];
    const [moved] = list.splice(draggedIdx, 1);
    list.splice(targetIdx, 0, moved);
    editorStore.updateSectionProps(sectionId, { products: list });

    draggedIdx = null;
    dropTargetIdx = null;
  };
</script>

<div class="max-w-6xl mx-auto w-full">
  <div class="mb-8 text-center">
    <h2 class={`text-2xl font-bold tracking-tight mb-2 ${hasCustomColor ? '' : 'text-slate-900'}`}>
      {props?.title || 'Katalog Produk Pilihan'}
    </h2>
    <p class={`text-xs ${hasCustomColor ? 'opacity-80' : 'text-slate-600'}`}>
      {props?.subtitle || 'Pilih produk terbaik kami dengan jaminan kualitas terdepan'}
    </p>
  </div>

  {#if products.length === 0}
    <div class="p-8 border border-dashed border-slate-300 rounded-2xl text-center text-slate-400 bg-slate-50 flex flex-col items-center gap-2">
      <ShoppingBag size={28} class="text-slate-300" />
      <p class="text-xs">Belum ada produk. Tambahkan produk melalui panel layer.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each products as product, index (product.name + index)}
        <div
          role="listitem"
          draggable={isActive}
          on:dragstart={(e) => onDragStart(e, index)}
          on:dragover={(e) => onDragOver(e, index)}
          on:dragleave={() => (dropTargetIdx = null)}
          on:drop={(e) => onDrop(e, index)}
          class={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all flex flex-col ${
            isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-400' : ''
          } ${dropTargetIdx === index ? 'border-blue-500 ring-2 ring-blue-400/40 shadow-xl' : 'border-slate-100'} ${
            draggedIdx === index ? 'opacity-30' : ''
          }`}
        >
          {#if product.imageUrl}
            <img src={product.imageUrl} alt={product.name} class="w-full h-48 object-cover bg-slate-100" />
          {:else}
            <div class="w-full h-48 bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-1.5">
              <Package size={26} class="text-slate-300" />
              <span class="text-[11px]">Foto Produk</span>
            </div>
          {/if}

          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="font-bold text-sm text-slate-900 line-clamp-1">{product.name || 'Nama Produk'}</h3>
                {#if product.badge}
                  <span class="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
                    {product.badge}
                  </span>
                {/if}
              </div>
              <p class="text-lg font-extrabold text-blue-600 mb-3">
                Rp {typeof product.price === 'number' ? product.price.toLocaleString('id-ID') : product.price || '0'}
              </p>
            </div>

            <button
              type="button"
              on:click|preventDefault
              class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Pesan via WhatsApp</span>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
