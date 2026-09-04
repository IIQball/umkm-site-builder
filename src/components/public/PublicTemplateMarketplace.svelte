<script lang="ts">
  import { Palette, RotateCcw } from 'lucide-svelte';
  import { Pagination } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import type { PublicTemplate, CategoryItem } from './marketplace.types';
  import MarketplaceFilterBar from './marketplace/MarketplaceFilterBar.svelte';
  import MarketplaceCard from './marketplace/MarketplaceCard.svelte';
  import { filterTemplates } from './marketplace/marketplace.helpers';

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

  $: filteredTemplates = filterTemplates(
    templates,
    selectedCategorySlug,
    selectedPriceFilter,
    searchQuery,
    selectedSort
  );

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

    if (template.price === 0) {
      purchasingId = template.id;
      try {
        const res = await fetch('/api/tenant/template/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: template.id }),
        });
        const result = await res.json();
        if (res.ok && (result.ok || result.success)) {
          addToast({
            type: 'success',
            message: `Template gratis "${template.name}" berhasil dipasang ke toko Anda!`,
          });
          window.location.href = '/dashboard';
        } else {
          addToast({
            type: 'error',
            message: result.error?.message || 'Gagal menerapkan template',
          });
        }
      } catch {
        addToast({
          type: 'error',
          message: 'Terjadi kesalahan koneksi',
        });
      } finally {
        purchasingId = null;
      }
      return;
    }

    purchasingId = template.id;
    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });
      const result = await res.json();
      if (res.ok && (result.ok || result.success) && result.data?.externalId) {
        window.location.href = `/checkout/${result.data.externalId}`;
      } else {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal membuat tagihan pembayaran',
        });
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Gagal menghubungi server pembayaran',
      });
    } finally {
      purchasingId = null;
    }
  };
</script>

<div class="space-y-8 animate-fade-in-up">
  <!-- Search & Filter Controls -->
  <MarketplaceFilterBar
    bind:searchQuery
    bind:selectedCategorySlug
    bind:selectedPriceFilter
    bind:selectedSort
    {categories}
    {templates}
    onReset={resetFilters}
  />

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
        <MarketplaceCard
          {tpl}
          {isOwned}
          {isPurchasing}
          {isTenantOrGuest}
          onPurchase={handlePurchase}
        />
      {/each}
    </div>

    {#if filteredTemplates.length > pageSize}
      <div class="pt-6 flex justify-center">
        <Pagination
          bind:currentPage
          totalItems={filteredTemplates.length}
          {pageSize}
        />
      </div>
    {/if}
  {/if}
</div>
