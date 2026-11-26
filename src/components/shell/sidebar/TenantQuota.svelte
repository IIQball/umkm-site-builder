<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from '../../ui/Modal.svelte';
  import Input from '../../ui/Input.svelte';
  import Button from '../../ui/Button.svelte';
  import { toast } from '@/lib/toast';
  import { apiFetch } from '@/lib/api/parse-response';
  
  export let collapsed = false;

  let products = 0;
  let categories = 0;
  let showUpgradeModal = false;
  let requestProducts = 0;
  let requestCategories = 0;
  let isSubmitting = false;
  let maxProducts = 15;
  let maxCategories = 5;

  let progressProducts = 0;
  let progressCategories = 0;

  $: {
    if (maxProducts > 0 && typeof products === 'number') {
      progressProducts = Math.min((products / maxProducts) * 100, 100) || 0;
    }
    if (maxCategories > 0 && typeof categories === 'number') {
      progressCategories = Math.min((categories / maxCategories) * 100, 100) || 0;
    }
  }

  async function fetchQuota() {
    try {
      const res = await apiFetch<{
        products: number;
        categories: number;
        maxProducts?: number;
        maxCategories?: number;
      }>('/api/tenant/quota');
      if (res.success && res.data) {
        products = res.data.products;
        categories = res.data.categories;
        maxProducts = res.data.maxProducts ?? 15;
        maxCategories = res.data.maxCategories ?? 5;
      }
    } catch {
      // silent fail
    }
  }

  async function submitUpgradeRequest() {
    if (requestProducts === 0 && requestCategories === 0) {
      toast.error('Silakan isi jumlah slot tambahan yang dibutuhkan');
      return;
    }

    isSubmitting = true;
    try {
      const result = await apiFetch('/api/tenant/quota/request-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlots: Number(requestCategories),
          productSlots: Number(requestProducts)
        }),
        fallbackError: 'Gagal mengirim permintaan',
      });

      if (result.success) {
        toast.success(result.message || 'Permintaan berhasil dikirim');
        showUpgradeModal = false;
        requestProducts = 0;
        requestCategories = 0;
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      isSubmitting = false;
    }
  }

  onMount(() => {
    fetchQuota();
    window.addEventListener('quota-updated', fetchQuota);
    return () => window.removeEventListener('quota-updated', fetchQuota);
  });
  $: nearLimit = (maxProducts > 0 && products >= maxProducts) || (maxCategories > 0 && categories >= maxCategories);
</script>

<div
  class="border-t border-light shrink-0 w-full {collapsed
    ? 'px-2 py-2.5 flex justify-center'
    : 'px-3.5 py-2.5 space-y-2'}"
>
  {#if collapsed}
    <button
      type="button"
      on:click={() => (showUpgradeModal = true)}
      class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer {nearLimit
        ? 'text-error hover:bg-error/10'
        : 'text-primary hover:bg-nested'}"
      title="Produk: {products}/{maxProducts} • Kategori: {categories}/{maxCategories} (Klik untuk tingkatkan)"
      aria-label="Status kuota toko, klik untuk tingkatkan kuota"
    >
      <span class="material-symbols-outlined text-lg icon-filled">cloud</span>
      {#if nearLimit}
        <span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-error"></span>
      {/if}
    </button>
  {:else}
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="material-symbols-outlined text-base text-primary icon-filled shrink-0">
          cloud
        </span>
        <span class="text-xs font-bold font-heading text-main truncate">
          Kuota Toko
        </span>
      </div>

      <button
        type="button"
        on:click={() => (showUpgradeModal = true)}
        class="inline-flex items-center gap-1 min-h-[28px] md:min-h-[24px] px-2.5 py-0.5 rounded-full text-2xs font-bold font-heading transition-colors cursor-pointer shrink-0 {nearLimit
          ? 'bg-error/10 text-error hover:bg-error hover:text-white'
          : 'bg-primary/15 text-primary hover:bg-primary hover:text-slate-950'}"
        aria-label="Ajukan penambahan kuota toko"
      >
        <span class="material-symbols-outlined text-xs">rocket_launch</span>
        <span>Tingkatkan</span>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2.5">
      <div class="min-w-0 space-y-1">
        <div class="flex items-baseline justify-between gap-1 text-2xs leading-none">
          <span class="text-secondary font-medium truncate">Produk</span>
          <span class="font-mono font-bold tabular-nums shrink-0 {products >= maxProducts ? 'text-error' : 'text-main'}">
            {products}/{maxProducts}
          </span>
        </div>
        <div class="w-full bg-nested border border-light/60 rounded-full h-1.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300 {products >= maxProducts ? 'bg-error' : 'bg-primary'}"
            style="width: {progressProducts}%"
          ></div>
        </div>
      </div>

      <div class="min-w-0 space-y-1">
        <div class="flex items-baseline justify-between gap-1 text-2xs leading-none">
          <span class="text-secondary font-medium truncate">Kategori</span>
          <span class="font-mono font-bold tabular-nums shrink-0 {categories >= maxCategories ? 'text-error' : 'text-main'}">
            {categories}/{maxCategories}
          </span>
        </div>
        <div class="w-full bg-nested border border-light/60 rounded-full h-1.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300 {categories >= maxCategories ? 'bg-error' : 'bg-primary'}"
            style="width: {progressCategories}%"
          ></div>
        </div>
      </div>
    </div>
  {/if}
</div>

<Modal bind:open={showUpgradeModal} size="sm" title="Tingkatkan Kuota" on:close={() => { showUpgradeModal = false; requestProducts = 0; requestCategories = 0; }}>
  <div class="flex flex-col gap-4 -mt-2 pb-2">
    <p class="text-sm text-secondary leading-relaxed">
      Kirim permintaan ke admin untuk menambahkan batas maksimal produk dan kategori di toko Anda.
    </p>
    
    <div class="space-y-4 mt-1">
      <div class="space-y-1">
        <Input
          type="number"
          label="Tambahan Kuota Produk"
          min={0}
          placeholder="Contoh: 10"
          bind:value={requestProducts}
          class="no-spinners"
        />
        <p class="text-[11px] text-muted font-medium ml-1">Limit toko saat ini: {maxProducts} Produk</p>
      </div>
      <div class="space-y-1">
        <Input
          type="number"
          label="Tambahan Kuota Kategori"
          min={0}
          placeholder="Contoh: 5"
          bind:value={requestCategories}
          class="no-spinners"
        />
        <p class="text-[11px] text-muted font-medium ml-1">Limit toko saat ini: {maxCategories} Kategori</p>
      </div>
    </div>
  </div>
  
  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => showUpgradeModal = false} disabled={isSubmitting}>
      Batal
    </Button>
    <Button variant="primary" on:click={submitUpgradeRequest} disabled={isSubmitting} loading={isSubmitting}>
      Kirim Permintaan
    </Button>
  </svelte:fragment>
</Modal>
