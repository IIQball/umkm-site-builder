<script lang="ts">
  export let badgeText: string = 'Katalog UMKM Terlengkap';
  export let tagName: string = 'h1';
  export let title: string = 'Cari Kebutuhan Kuliner & Snack Favorit Anda';
  export let subtitle: string = 'Pilih kategori di bawah untuk langsung memilah produk segar siap kirim ke alamat Anda hari ini.';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80';
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  let activeCategory = 'Semua Menu';
  const categories = ['Semua Menu', 'Aneka Keripik', 'Sambal Kemasan', 'Kopi Bubuk', 'Kue Tradisional'];
</script>

<div class="py-12 text-center max-w-3xl mx-auto">
  {#if badgeText}
    <span
      data-node="badge"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'badge')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'badge')}
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-semibold mb-6 cursor-pointer"
    >
      {badgeText}
    </span>
  {/if}

  <svelte:element
    this={tagName || 'h1'}
    data-node="title"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'title')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'title')}
    class="cq-title-lg font-extrabold text-[var(--theme-text-primary,#0f172a)] tracking-tight mb-4 cursor-pointer"
  >
    {title}
  </svelte:element>

  <div
    data-node="subtitle"
    role="button"
    tabindex="0"
    on:click={(e) => selectNode && selectNode(e, 'subtitle')}
    on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'subtitle')}
    class="cursor-pointer mb-4"
  >
    <p class="text-base text-[var(--theme-text-muted,#64748b)] leading-relaxed">
      {subtitle}
    </p>
  </div>

  <!-- Category Pills Filter -->
  <div class="flex flex-wrap items-center justify-center gap-2 pt-4 mb-8">
    {#each categories as cat}
      <button
        type="button"
        on:click={() => (activeCategory = cat)}
        class={`h-9 px-4 rounded-full text-xs font-semibold transition-all ${
          activeCategory === cat
            ? 'bg-blue-600 text-white shadow-xs'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {cat}
      </button>
    {/each}
  </div>

  <div data-node="image" class="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
    <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
  </div>
</div>
