<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from '../../ui/Modal.svelte';
  
  export let collapsed = false;

  let products = 0;
  let categories = 0;
  let showUpgradeModal = false;
  const MAX_PRODUCTS = 10;
  const MAX_CATEGORIES = 5;

  async function fetchQuota() {
    try {
      const res = await fetch('/api/tenant/quota');
      const data = await res.json();
      if (res.ok && data.ok) {
        products = data.data.products;
        categories = data.data.categories;
      }
    } catch (e) {
      // silent fail
    }
  }

  onMount(() => {
    fetchQuota();
    window.addEventListener('quota-updated', fetchQuota);
    return () => window.removeEventListener('quota-updated', fetchQuota);
  });

  // Variables removed
</script>

<div class="py-4 mt-auto border-t border-light flex flex-col gap-3 w-full shrink-0 {collapsed ? 'px-2 items-center' : 'px-4'}">
  {#if collapsed}
    <div 
      class="w-10 h-10 rounded-xl flex items-center justify-center text-primary hover:bg-nested transition-colors cursor-pointer" 
      title="Produk: {products}/{MAX_PRODUCTS} | Kategori: {categories}/{MAX_CATEGORIES}"
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
            <span class="text-main">{products} / {MAX_PRODUCTS} <span class="text-muted font-normal ml-0.5">Produk</span></span>
            <span class="text-primary">{Math.round((products / MAX_PRODUCTS) * 100)}%</span>
          </div>
          <div class="w-full bg-base-300 dark:bg-base-100 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5">
            <div 
              class="h-1.5 rounded-full transition-all duration-500 {products >= MAX_PRODUCTS ? 'bg-rose-500' : 'bg-primary'}" 
              style="width: {Math.min(Math.round((products / MAX_PRODUCTS) * 100), 100)}%"
            ></div>
          </div>
        </div>

        <!-- Categories Progress -->
        <div>
          <div class="flex justify-between items-end text-[10px] font-bold mb-1">
            <span class="text-main">{categories} / {MAX_CATEGORIES} <span class="text-muted font-normal ml-0.5">Kategori</span></span>
            <span class="text-primary">{Math.round((categories / MAX_CATEGORIES) * 100)}%</span>
          </div>
          <div class="w-full bg-base-300 dark:bg-base-100 rounded-full h-1.5 overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/5">
            <div 
              class="h-1.5 rounded-full transition-all duration-500 {categories >= MAX_CATEGORIES ? 'bg-rose-500' : 'bg-primary'}" 
              style="width: {Math.min(Math.round((categories / MAX_CATEGORIES) * 100), 100)}%"
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

<Modal bind:open={showUpgradeModal} size="sm">
  <div class="flex flex-col items-center justify-center py-4 text-center">
    <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
      <span class="material-symbols-outlined text-3xl">rocket_launch</span>
    </div>
    <h3 class="text-heading-sm font-bold text-main mb-2">Segera Hadir!</h3>
    <p class="text-body-sm text-secondary">
      Fitur ini sedang dalam tahap pengembangan dan akan segera hadir untuk Anda.
    </p>
  </div>
  
  <svelte:fragment slot="footer">
    <button 
      class="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all active:scale-[0.98]" 
      on:click={() => showUpgradeModal = false}
    >
      Mengerti
    </button>
  </svelte:fragment>
</Modal>
