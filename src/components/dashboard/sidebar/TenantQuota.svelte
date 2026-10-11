<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from '../../ui/Modal.svelte';
  import Input from '../../ui/Input.svelte';
  import Button from '../../ui/Button.svelte';
  import { toast } from '@/lib/toast';
  
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
      const res = await fetch('/api/tenant/quota');
      const data = await res.json();
      if (res.ok && data.ok) {
        products = data.data.products;
        categories = data.data.categories;
        maxProducts = data.data.maxProducts ?? 15;
        maxCategories = data.data.maxCategories ?? 5;
      }
    } catch (e) {
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
      const res = await fetch('/api/tenant/quota/request-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlots: Number(requestCategories),
          productSlots: Number(requestProducts)
        })
      });
      
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(data.message || 'Permintaan berhasil dikirim');
        showUpgradeModal = false;
        requestProducts = 0;
        requestCategories = 0;
      } else {
        toast.error(data.error?.message || 'Gagal mengirim permintaan');
      }
    } catch (e) {
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
</script>

<div class="py-4 mt-auto border-t border-light flex flex-col gap-3 w-full shrink-0 {collapsed ? 'px-2 items-center' : 'px-4'}">
  {#if collapsed}
    <div 
      class="w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-nested transition-colors cursor-pointer" 
      title="Produk: {products}/{maxProducts} | Kategori: {categories}/{maxCategories}"
    >
      <span class="material-symbols-outlined text-xl icon-filled">cloud</span>
    </div>
  {:else}
    <div class="flex items-center gap-2.5 text-main">
      <span class="material-symbols-outlined text-xl text-primary icon-filled">cloud</span>
      <span class="text-xs font-bold font-heading leading-tight">Status Kuota</span>
    </div>

    <div class="space-y-1.5 mt-0.5">
      <div class="space-y-3">
        <!-- Products Progress -->
        <div>
          <div class="flex justify-between items-end text-[10px] font-bold mb-1">
            <span class="text-main">{products} / {maxProducts} <span class="text-muted font-normal ml-0.5">Produk</span></span>
            <span class="text-primary">{Math.round((products / maxProducts) * 100)}%</span>
          </div>
          <div class="w-full bg-base-300 dark:bg-base-100 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5">
            <div 
              class="h-1.5 rounded-full {products >= maxProducts ? 'bg-rose-500' : 'bg-primary'} transition-all duration-300" 
              style="width: {progressProducts}%"
            ></div>
          </div>
        </div>

        <!-- Categories Progress -->
        <div>
          <div class="flex justify-between items-end text-[10px] font-bold mb-1">
            <span class="text-main">{categories} / {maxCategories} <span class="text-muted font-normal ml-0.5">Kategori</span></span>
            <span class="text-primary">{Math.round((categories / maxCategories) * 100)}%</span>
          </div>
          <div class="w-full bg-base-300 dark:bg-base-100 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5">
            <div 
              class="h-1.5 rounded-full {categories >= maxCategories ? 'bg-rose-500' : 'bg-primary'} transition-all duration-300" 
              style="width: {progressCategories}%"
            ></div>
          </div>
        </div>
      </div>
      <button 
        on:click={() => showUpgradeModal = true}
        class="w-full mt-3 py-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg text-[11px] font-bold font-heading transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 group"
      >
        <span class="material-symbols-outlined text-[14px] transition-transform group-hover:-translate-y-0.5">rocket_launch</span>
        Tingkatkan
      </button>
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
