<script lang="ts">
  import {
    Palette,
    Eye,
    ShoppingCart,
    CheckCircle2,
    RotateCcw,
  } from 'lucide-svelte';
  import { Pagination } from '@/components/ui';
  import { formatCurrency } from '@/lib/utils';
  import { addToast } from '@/lib/toast';
  import type { PublicTemplate, CategoryItem } from './marketplace.types';

  export let initialTemplates: PublicTemplate[] = [];
  export let categories: CategoryItem[] = [];
  export let ownedTemplateIds: string[] = [];
  export let isLoggedIn: boolean = false;
  export let userRole: string | null = null;

  $: isTenantOrGuest = !isLoggedIn || userRole === 'tenant';

  let templates = [...initialTemplates];
  let searchQuery = '';
  let selectedCategorySlug: string = 'all';
  let selectedPriceFilter: 'all' | 'free' | 'paid' | 'under50' | '50to100' | 'above100' = 'all';
  let selectedSort: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' = 'newest';

  let purchasingId: string | null = null;
  let currentPage = 1;
  const pageSize = 9;

  // Filter & Sort Logic
  $: filteredTemplates = templates
    .filter((tpl) => {
      // 1. Category Filter
      if (selectedCategorySlug !== 'all') {
        if (tpl.categorySlug !== selectedCategorySlug) return false;
      }

      // 2. Price Filter
      if (selectedPriceFilter === 'free') {
        if (tpl.price !== 0) return false;
      } else if (selectedPriceFilter === 'paid') {
        if (tpl.price <= 0) return false;
      } else if (selectedPriceFilter === 'under50') {
        if (tpl.price <= 0 || tpl.price > 50000) return false;
      } else if (selectedPriceFilter === '50to100') {
        if (tpl.price < 50000 || tpl.price > 100000) return false;
      } else if (selectedPriceFilter === 'above100') {
        if (tpl.price <= 100000) return false;
      }

      // 3. Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchName = tpl.name.toLowerCase().includes(q);
        const matchDesc = tpl.description ? tpl.description.toLowerCase().includes(q) : false;
        const matchDesigner = tpl.designerName ? tpl.designerName.toLowerCase().includes(q) : false;
        const matchCategory = tpl.categoryName ? tpl.categoryName.toLowerCase().includes(q) : false;
        if (!matchName && !matchDesc && !matchDesigner && !matchCategory) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (selectedSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (selectedSort === 'price_asc') {
        return a.price - b.price;
      }
      if (selectedSort === 'price_desc') {
        return b.price - a.price;
      }
      if (selectedSort === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  $: {
    searchQuery;
    selectedCategorySlug;
    selectedPriceFilter;
    selectedSort;
    currentPage = 1;
  }

  $: paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    searchQuery = '';
    selectedCategorySlug = 'all';
    selectedPriceFilter = 'all';
    selectedSort = 'newest';
    currentPage = 1;
  };

  const handlePurchase = async (template: PublicTemplate) => {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/templates`;
      return;
    }

    purchasingId = template.id;

    try {
      const response = await fetch('/api/tenant/transactions/template-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Gagal memproses pembelian');
      }

      if (result.isFree) {
        addToast({
          type: 'success',
          message: result.message || 'Template gratis berhasil ditambahkan ke toko Anda!',
        });
        ownedTemplateIds = [...ownedTemplateIds, template.id];
      } else if (result.data?.externalId) {
        window.location.href = `/checkout/${result.data.externalId}`;
      } else {
        throw new Error('Respons tidak valid dari server');
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Terjadi kesalahan transaksi',
      });
    } finally {
      purchasingId = null;
    }
  };
</script>

<div class="space-y-8 md:space-y-10">
  <!-- Search, Filter Bar & Sorting Toolbar -->
  <div class="bg-card border border-light rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
    <!-- Top Row: Search Input + Sorting Dropdown -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Search Capsule -->
      <div class="relative flex-1 max-w-xl">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg pointer-events-none">
          search
        </span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari tema toko, kuliner, fashion, nama desainer..."
          class="w-full bg-nested/70 border border-light rounded-full pl-11 pr-4 py-3 text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all shadow-2xs font-sans"
        />
        {#if searchQuery}
          <button
            type="button"
            on:click={() => (searchQuery = '')}
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-main text-xs bg-nested px-2.5 py-1 rounded-full cursor-pointer"
          >
            Hapus
          </button>
        {/if}
      </div>

      <!-- Price & Sort Dropdown Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Price Filter Dropdown -->
        <div class="relative min-w-[140px]">
          <select
            bind:value={selectedPriceFilter}
            class="w-full bg-nested/70 border border-light rounded-2xl px-3.5 py-2.5 text-xs font-bold text-main focus:outline-none focus:border-primary transition-all shadow-2xs cursor-pointer appearance-none pr-8"
          >
            <option value="all">Semua Harga</option>
            <option value="free">Gratis (Rp 0)</option>
            <option value="paid">Berbayar (Semua)</option>
            <option value="under50">&lt; Rp 50.000</option>
            <option value="50to100">Rp 50.000 - Rp 100.000</option>
            <option value="above100">&gt; Rp 100.000</option>
          </select>
          <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            expand_more
          </span>
        </div>

        <!-- Sorting Dropdown -->
        <div class="relative min-w-[150px]">
          <select
            bind:value={selectedSort}
            class="w-full bg-nested/70 border border-light rounded-2xl px-3.5 py-2.5 text-xs font-bold text-main focus:outline-none focus:border-primary transition-all shadow-2xs cursor-pointer appearance-none pr-8"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga: Terendah</option>
            <option value="price_desc">Harga: Tertinggi</option>
            <option value="name_asc">Nama (A - Z)</option>
          </select>
          <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            sort
          </span>
        </div>

        {#if searchQuery || selectedCategorySlug !== 'all' || selectedPriceFilter !== 'all' || selectedSort !== 'newest'}
          <button
            type="button"
            on:click={resetFilters}
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer active:scale-95"
            title="Reset Semua Filter"
          >
            <RotateCcw size={13} />
            <span class="hidden sm:inline">Reset</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- Category Pills Rail (Smooth scroll) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-light/60">
      <button
        type="button"
        on:click={() => (selectedCategorySlug = 'all')}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer {selectedCategorySlug === 'all'
          ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-2xs'
          : 'bg-nested/80 hover:bg-card border border-light text-secondary hover:text-main'}"
      >
        <span class="material-symbols-outlined text-sm">grid_view</span>
        <span>Semua Kategori</span>
        <span class="text-3xs opacity-80 bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
          {templates.length}
        </span>
      </button>

      {#each categories as cat (cat.id)}
        {@const count = templates.filter((t) => t.categorySlug === cat.slug).length}
        <button
          type="button"
          on:click={() => (selectedCategorySlug = cat.slug)}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer {selectedCategorySlug === cat.slug
            ? 'bg-slate-900 text-white dark:bg-primary dark:text-white shadow-2xs'
            : 'bg-nested/80 hover:bg-card border border-light text-secondary hover:text-main'}"
        >
          <span class="material-symbols-outlined text-sm">{cat.icon || 'folder'}</span>
          <span>{cat.name}</span>
          {#if count > 0}
            <span class="text-3xs opacity-80 bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
              {count}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Active Filter Summary & Result Count -->
  <div class="flex items-center justify-between text-xs text-secondary px-1">
    <div class="flex items-center gap-2">
      <span class="font-bold text-main">
        Menampilkan {filteredTemplates.length} dari {templates.length} template
      </span>
      {#if selectedCategorySlug !== 'all'}
        <span class="text-muted">•</span>
        <span class="bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
          Kategori: {categories.find((c) => c.slug === selectedCategorySlug)?.name || selectedCategorySlug}
        </span>
      {/if}
      {#if selectedPriceFilter !== 'all'}
        <span class="text-muted">•</span>
        <span class="bg-orange/10 text-orange font-bold px-2.5 py-0.5 rounded-full border border-orange/20">
          {selectedPriceFilter === 'free' ? 'Gratis' : selectedPriceFilter === 'under50' ? '< Rp 50.000' : selectedPriceFilter === '50to100' ? 'Rp 50rb - 100rb' : 'Berbayar'}
        </span>
      {/if}
    </div>
  </div>

  <!-- Templates Grid -->
  {#if filteredTemplates.length === 0}
    <!-- Empty State -->
    <div class="bg-card border border-light rounded-3xl py-20 px-8 text-center shadow-sm space-y-4">
      <div class="w-16 h-16 rounded-3xl bg-nested border border-light flex items-center justify-center text-muted mx-auto shadow-2xs">
        <Palette size={32} />
      </div>
      <h3 class="text-heading-md font-bold text-main">Tidak Ada Template yang Cocok</h3>
      <p class="text-body-sm text-secondary max-w-md mx-auto leading-relaxed">
        Kami tidak menemukan template yang sesuai dengan filter atau kata kunci pencarian Anda. Coba reset filter untuk melihat seluruh koleksi.
      </p>
      <div class="pt-2">
        <button
          type="button"
          on:click={resetFilters}
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>Reset Semua Filter</span>
        </button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {#each paginatedTemplates as tpl (tpl.id)}
        {@const isOwned = ownedTemplateIds.includes(tpl.id)}
        {@const isPurchasing = purchasingId === tpl.id}
        <div class="bg-card border border-light hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group relative">
          <!-- Thumbnail Frame -->
          <div class="relative h-52 w-full bg-nested flex items-center justify-center overflow-hidden border-b border-light">
            {#if tpl.thumbnailUrl}
              <img
                src={tpl.thumbnailUrl}
                alt={tpl.name}
                class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            {:else}
              <div class="flex flex-col items-center justify-center text-muted gap-2 p-6 text-center">
                <div class="w-12 h-12 rounded-2xl bg-card border border-light flex items-center justify-center text-muted shadow-2xs">
                  <Palette size={24} />
                </div>
                <span class="text-xs font-medium text-secondary">Pratinjau Desain Toko</span>
              </div>
            {/if}

            <!-- Floating Top Badges -->
            <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
              <!-- Category Pill -->
              {#if tpl.categoryName}
                <span class="inline-flex items-center gap-1.5 bg-card/90 dark:bg-slate-900/90 backdrop-blur-md text-main border border-light px-3 py-1 rounded-full text-3xs font-bold shadow-xs">
                  <span class="material-symbols-outlined text-xs text-primary">{tpl.categoryIcon || 'category'}</span>
                  <span>{tpl.categoryName}</span>
                </span>
              {:else}
                <span class="inline-flex items-center gap-1 bg-card/90 dark:bg-slate-900/90 backdrop-blur-md text-secondary border border-light px-3 py-1 rounded-full text-3xs font-bold shadow-xs">
                  Umum
                </span>
              {/if}

              <!-- Price Badge -->
              {#if tpl.price === 0}
                <span class="inline-flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-3xs font-bold shadow-xs tracking-wider uppercase">
                  Gratis
                </span>
              {:else}
                <span class="inline-flex items-center gap-1 bg-card/95 dark:bg-slate-900/95 backdrop-blur-md text-main font-mono font-black px-3 py-1 rounded-full text-xs shadow-xs border border-light">
                  {formatCurrency(tpl.price)}
                </span>
              {/if}
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <!-- Title & Price Details -->
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <h3 class="text-heading-md font-bold text-main line-clamp-1 group-hover:text-primary transition-colors font-heading">
                  {tpl.name}
                </h3>
              </div>

              <!-- Description -->
              <p class="text-body-sm text-secondary line-clamp-2 leading-relaxed font-sans">
                {tpl.description || 'Template toko online responsif dengan tata letak optimal untuk konversi penjualan produk UMKM.'}
              </p>
            </div>

            <div class="space-y-4 pt-2 border-t border-light/60">
              <!-- Designer Profile Info -->
              <div class="flex items-center justify-between text-xs text-secondary">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-2xs flex items-center justify-center flex-shrink-0 border border-primary/20">
                    {tpl.designerName ? tpl.designerName.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <span class="truncate font-bold text-main font-sans">
                    {tpl.designerName || 'Kreator Desainer'}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              {#if isTenantOrGuest}
                <div class="grid grid-cols-2 gap-2.5 pt-1">
                  <!-- Preview Button -->
                  <a
                    href={`/builder/preview/${tpl.id}`}
                    class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-nested hover:bg-card border border-light text-main hover:border-slate-300 dark:hover:border-slate-600 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Pratinjau</span>
                  </a>

                  <!-- Purchase / Owned Action Button -->
                  {#if isOwned}
                    <a
                      href="/dashboard/templates"
                      class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Milik Anda</span>
                    </a>
                  {:else}
                    <button
                      type="button"
                      on:click={() => handlePurchase(tpl)}
                      disabled={isPurchasing}
                      class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                    >
                      {#if isPurchasing}
                        <span class="material-symbols-outlined text-sm animate-spin">refresh</span>
                        <span>Memproses...</span>
                      {:else}
                        <ShoppingCart size={14} class="stroke-[2.5]" />
                        <span>{tpl.price === 0 ? 'Gunakan Gratis' : 'Beli'}</span>
                      {/if}
                    </button>
                  {/if}
                </div>
              {:else}
                <div class="pt-1">
                  <a
                    href={`/builder/preview/${tpl.id}`}
                    class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-nested hover:bg-card border border-light text-main hover:border-slate-300 dark:hover:border-slate-600 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>Pratinjau Langsung</span>
                  </a>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Pagination -->
    <div class="pt-4">
      <Pagination
        bind:currentPage
        totalItems={filteredTemplates.length}
        {pageSize}
      />
    </div>
  {/if}
</div>
