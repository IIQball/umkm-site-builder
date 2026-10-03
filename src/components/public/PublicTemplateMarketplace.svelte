<script lang="ts">
  import { Palette, RotateCcw } from 'lucide-svelte';
  import { Pagination, Button } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import type { PublicTemplate, CategoryItem, AssistedTenant } from './marketplace.types';
  import MarketplaceFilterBar from './marketplace/MarketplaceFilterBar.svelte';
  import MarketplaceCard from './marketplace/MarketplaceCard.svelte';
  import TemplatePurchaseModal from './marketplace/TemplatePurchaseModal.svelte';
  import AssistedTenantBanner from './marketplace/AssistedTenantBanner.svelte';
  import { filterTemplates } from './marketplace/marketplace.helpers';

  export let initialTemplates: PublicTemplate[] = [];
  export let categories: CategoryItem[] = [];
  export let ownedTemplateIds: string[] = [];
  export let assistedTenants: AssistedTenant[] = [];
  export let initialTenantId: string = '';
  export let currentUserId: string | null = null;
  export let isLoggedIn: boolean = false;
  export let userRole: string | null = null;
  export let adminServiceFee: number = 5000;

  $: isAdmin = userRole === 'admin' || userRole === 'superadmin';
  $: isTenantOrGuest = !isLoggedIn || userRole === 'tenant';

  let templates = [...initialTemplates];
  let searchQuery = '';
  let selectedCategorySlug: string = 'all';
  let selectedPriceFilter: 'all' | 'free' | 'paid' | 'under50' | '50to100' | 'above100' = 'all';
  let selectedSort: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' = 'newest';
  let selectedTenantId: string = initialTenantId;

  $: tenantOptions = assistedTenants.map((t) => ({
    value: t.id,
    label: t.storeName,
    sublabel: `Pemilik: ${t.name}`,
  }));

  $: selectedTenant = assistedTenants.find((t) => t.id === selectedTenantId);
  $: selectedTenantOwnedTemplateIds = selectedTenant?.ownedTemplateIds || [];

  let purchasingId: string | null = null;
  let isPurchaseModalOpen = false;
  let selectedPurchaseTemplate: PublicTemplate | null = null;
  let isSubmittingPurchase = false;
  let currentPage = 1;
  const pageSize = 9;

  $: filteredTemplates = filterTemplates(
    templates,
    selectedCategorySlug,
    selectedPriceFilter,
    searchQuery,
    selectedSort
  );

  $: if (searchQuery !== undefined || selectedCategorySlug || selectedPriceFilter || selectedSort) currentPage = 1;

  $: paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    searchQuery = '';
    selectedCategorySlug = 'all';
    selectedPriceFilter = 'all';
    selectedSort = 'newest';
    currentPage = 1;
  };

  const handlePurchase = (template: PublicTemplate) => {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/templates`;
      return;
    }

    if (isAdmin && !selectedTenantId) {
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

    selectedPurchaseTemplate = template;
    isPurchaseModalOpen = true;
  };

  $: isPurchaseModalOwned = Boolean(
    selectedTenant &&
      selectedPurchaseTemplate &&
      (selectedPurchaseTemplate.price === 0 || selectedTenantOwnedTemplateIds.includes(selectedPurchaseTemplate.id))
  );

  const closeModal = () => {
    if (!isSubmittingPurchase) {
      isPurchaseModalOpen = false;
      selectedPurchaseTemplate = null;
    }
  };

  const executePurchase = async () => {
    if (!selectedPurchaseTemplate) return;
    const template = selectedPurchaseTemplate;
    isSubmittingPurchase = true;
    purchasingId = template.id;

    try {
      const isAlreadyOwned = Boolean(
        selectedTenant && (template.price === 0 || selectedTenantOwnedTemplateIds.includes(template.id))
      );

      // Skenario toko sudah memiliki template -> Pasang langsung ke toko binaan tanpa tagihan baru
      if (isAdmin && selectedTenant && isAlreadyOwned) {
        const res = await fetch(`/api/stores/${selectedTenant.storeId}/apply-template`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: template.id }),
        });
        const result = await res.json();
        if (!res.ok || !result.ok) throw new Error(result.error?.message || 'Gagal memasang template ke toko');

        addToast({
          type: 'success',
          message: `Template "${template.name}" berhasil dipasang ke toko ${selectedTenant.storeName}!`,
        });
        isPurchaseModalOpen = false;
        selectedTenant.currentTemplateId = template.id;
        if (!selectedTenant.ownedTemplateIds?.includes(template.id)) {
          selectedTenant.ownedTemplateIds = [...(selectedTenant.ownedTemplateIds || []), template.id];
        }
        setTimeout(() => { window.location.href = `/admin/merchants`; }, 1500);
        return;
      }

      // Skenario pembelian template berbayar baru
      const payload: { templateId: string; tenantId?: string; assistedBy?: string | null } = {
        templateId: template.id,
      };

      if (isAdmin && selectedTenantId) {
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
          message: isAdmin
            ? `Template gratis "${template.name}" berhasil dipasangkan ke tenant binaan!`
            : `Template gratis "${template.name}" berhasil dipasang ke toko Anda!`,
        });
        isPurchaseModalOpen = false;
        setTimeout(() => {
          window.location.href = isAdmin ? '/admin' : '/dashboard';
        }, 1500);
      } else if (result.data?.externalId) {
        window.location.href = `/checkout/${result.data.externalId}`;
      } else {
        throw new Error('Respons tidak valid dari server');
      }
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghubungi server',
      });
      isSubmittingPurchase = false;
    } finally {
      purchasingId = null;
    }
  };
</script>

<div class="space-y-8 animate-fade-in-up">
  {#if isAdmin}
    <AssistedTenantBanner
      bind:selectedTenantId
      {tenantOptions}
      {selectedTenant}
      {adminServiceFee}
    />
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
      <h2 class="text-heading-md font-bold text-main">Tidak Ada Template yang Cocok</h2>
      <p class="text-body-sm text-secondary max-w-md mx-auto leading-relaxed">
        Kami tidak menemukan template yang sesuai dengan filter atau kata kunci pencarian Anda. Coba reset filter untuk melihat seluruh koleksi.
      </p>
      <div class="pt-2">
        <Button variant="primary" size="sm" on:click={resetFilters}>
          <RotateCcw size={14} />
          Reset Semua Filter
        </Button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {#each paginatedTemplates as tpl (tpl.id)}
        {@const isOwned = ownedTemplateIds.includes(tpl.id)}
        {@const isOwnedBySelectedTenant = Boolean(
          selectedTenant && (tpl.price === 0 || selectedTenantOwnedTemplateIds.includes(tpl.id))
        )}
        {@const isPurchasing = purchasingId === tpl.id}
        <MarketplaceCard
          {tpl}
          {isOwned}
          {isPurchasing}
          {isTenantOrGuest}
          {userRole}
          {adminServiceFee}
          hasSelectedTenant={Boolean(selectedTenantId)}
          {isOwnedBySelectedTenant}
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

  <TemplatePurchaseModal
    open={isPurchaseModalOpen}
    template={selectedPurchaseTemplate}
    {isAdmin}
    {selectedTenant}
    {adminServiceFee}
    isOwnedForTenant={isPurchaseModalOwned}
    isSubmitting={isSubmittingPurchase}
    onConfirm={executePurchase}
    onCancel={closeModal}
  />
</div>
