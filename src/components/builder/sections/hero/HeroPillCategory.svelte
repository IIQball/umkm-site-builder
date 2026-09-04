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

  let activeCategory = 'Semua Menu';
  const categories = ['Semua Menu', 'Aneka Keripik', 'Sambal Kemasan', 'Kopi Bubuk', 'Kue Tradisional'];

  $: isPillActive = activeNodeId === 'hero_pill_category' || activeNodeId === 'pill_category';
  $: isImageActive = activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

<div class="py-12 text-center max-w-3xl mx-auto space-y-6">
  <HeroHeaderContent
    {badgeText}
    {tagName}
    {title}
    {subtitle}
    {activeNodeId}
    {selectNode}
    {selectNodeKey}
    align="center"
  />

  <!-- Category Pills Filter (Sub-node hero_pill_category) -->
  <div
    data-node="hero_pill_category"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'hero_pill_category')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_pill_category')}
    class={`flex flex-wrap items-center justify-center gap-2 pt-4 mb-4 p-2 rounded-2xl transition-all cursor-pointer ${
      isPillActive
        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 bg-blue-50/20 dark:bg-blue-950/20'
        : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
    }`}
  >
    {#each categories as cat}
      <button
        type="button"
        on:click|stopPropagation={() => (activeCategory = cat)}
        class={`h-9 px-4 rounded-full text-xs font-heading font-semibold transition-all cursor-pointer active:scale-[0.98] ${
          activeCategory === cat
            ? 'bg-[var(--color-primary,#2563eb)] text-white shadow-xs'
            : 'bg-slate-100 dark:bg-slate-800 text-[var(--color-text-secondary,#334155)] hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {cat}
      </button>
    {/each}
  </div>

  {#if imageUrl}
    <div
      data-node="image"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_image')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_image')}
      class={`w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border,rgba(15,23,42,0.08))] transition-all cursor-pointer ${
        isImageActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
    </div>
  {/if}
</div>
