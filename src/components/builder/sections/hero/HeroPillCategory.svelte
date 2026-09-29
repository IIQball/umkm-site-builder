<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Katalog UMKM Terlengkap';
  export let tagName: string = 'h1';
  export let title: string = 'Cari Kebutuhan Kuliner & Snack Favorit Anda';
  export let subtitle: string = 'Pilih kategori di bawah untuk langsung memilah produk segar siap kirim ke alamat Anda hari ini.';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['badge', 'title', 'subtitle', 'category_pills', 'image'];

  let activeCategory = 'Semua Menu';
  const categories = ['Semua Menu', 'Aneka Keripik', 'Sambal Kemasan', 'Kopi Bubuk', 'Kue Tradisional'];

  $: hasCategoryPills = elementOrder.includes('category_pills');
  $: hasImage = elementOrder.includes('image');
  $: isPillActive = activeNodeId === 'hero_pill_category' || activeNodeId === 'pill_category';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

{#snippet pillsBlock()}
  {#if hasCategoryPills}
    <div
      data-node="hero_pill_category"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_pill_category')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_pill_category')}
      class={`flex flex-wrap items-center justify-center gap-2 pt-2 mb-2 p-2 rounded-2xl transition-all cursor-pointer ${
        isPillActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      {#each categories as cat}
        <button
          type="button"
          on:click|stopPropagation={() => (activeCategory = cat)}
          style="border-radius: var(--theme-btn-radius, var(--btn-radius, 9999px)); {activeCategory === cat ? 'background-color: var(--theme-primary, var(--color-primary)); color: var(--theme-btn-primary-text, currentColor);' : 'background-color: var(--color-nested-base); color: var(--color-text-secondary); border: 1px solid var(--color-border);'}"
          class={`btn btn-sm h-9 px-4 text-xs font-heading font-semibold shadow-xs ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
        >
          {cat}
        </button>
      {/each}
    </div>
  {/if}
{/snippet}

{#snippet imageBlock()}
  {#if hasImage && imageUrl}
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_image')}
      class={`w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border)] transition-all cursor-pointer my-2 ${
        isImageActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
    </div>
  {/if}
{/snippet}

<div class="py-12 text-center max-w-3xl mx-auto w-full">
  <HeroHeaderContent
    {badgeText}
    {tagName}
    {title}
    {subtitle}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    {elementOrder}
    align="center"
    customBlocks={{ category_pills: pillsBlock, image: imageBlock }}
  />
</div>
