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
  export let assistedTenants: Array<{ id: string; name: string; storeName: string; storeId: string }> = [];
  export let initialTenantId: string = '';
  export let currentUserId: string | null = null;
  export let isLoggedIn: boolean = false;
  export let userRole: string | null = null;

  $: isTenantOrGuest = !isLoggedIn || userRole === 'tenant';

  let templates = [...initialTemplates];
  let searchQuery = '';
  let selectedCategorySlug: string = 'all';
  let selectedPriceFilter: 'all' | 'free' | 'paid' | 'under50' | '50to100' | 'above100' = 'all';
  let selectedSort: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' = 'newest';
  let selectedTenantId: string = initialTenantId;

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

    if (userRole === 'admin' && !selectedTenantId) {
      addToast({
        type: 'error',
        message: 'Silakan pilih tenant binaan terlebih dahulu di dropdown!',
      });
      const el = document.getElementById('assisted-tenant-select');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    purchasingId = template.id;
    try {
      const payload: { templateId: string; tenantId?: string; assistedBy?: string | null } = {
        templateId: template.id,
      };

      if (userRole === 'admin' && selectedTenantId) {
        payload.tenantId = selectedTenantId;
        payload.assistedBy = currentUserId;
      }

      const res = await fetch('/api/tenant/transactions/template-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || 'Gagal memproses transaksi');
      }

      if (result.isFree) {
        addToast({
          type: 'success',
          message: userRole === 'admin'
            ? `Template gratis "${template.name}" berhasil dipasangkan ke tenant binaan!`
            : `Template gratis "${template.name}" berhasil dipasang ke toko Anda!`,
        });
        setTimeout(() => {
          window.location.href = userRole === 'admin' ? '/admin' : '/dashboard';
        }, 1500);
      } else if (result.data?.externalId) {
        window.location.href = `/checkout/${result.data.externalId}`;
      } else {
        throw new Error('Respons tidak valid dari server');
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghubungi server pembayaran',
      });
    } finally {
      purchasingId = null;
    }
  };
</script>

<div class="space-y-8 animate-fade-in-up">
  {#if userRole === 'admin'}
    <div class="p-5 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">support_agent</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-bold text-indigo-950 dark:text-indigo-100 uppercase tracking-wider">
              Beli untuk Tenant Binaan
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-bold bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
              Jasa Pendamping
            </span>
          </div>
          <p class="text-xs text-indigo-700 dark:text-indigo-300/80 mt-0.5">
            Pilih toko binaan untuk membelikan template. Transaksi otomatis mencatat fee pendampingan Anda.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-shrink-0">
        <select
          id="assisted-tenant-select"
          bind:value={selectedTenantId}
          class="px-3.5 py-2.5 rounded-2xl bg-card border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-main focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer min-w-[220px]"
        >
          <option value="">-- Pilih Tenant Binaan --</option>
          {#each assistedTenants as tenant (tenant.id)}
            <option value={tenant.id}>
              {tenant.storeName} ({tenant.name})
            </option>
          {/each}
        </select>
      </div>
    </div>
  {/if}

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
          {userRole}
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
