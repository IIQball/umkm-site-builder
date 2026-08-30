<script lang="ts">
  import { ShoppingCart, CheckCircle, Loader } from 'lucide-svelte';
  import { addToast } from '@/lib/toast';

  export let templateId: string;
  export let price: number; // in IDR
  export let isOwned: boolean = false;
  export let isLoggedIn: boolean = false;

  let loading = false;
  let errorMessage = '';
  let successMessage = '';

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?redirect=/templates`;
      return;
    }

    loading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const response = await fetch('/api/tenant/transactions/template-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Gagal memproses transaksi');
      }

      if (result.isFree) {
        successMessage = result.message || 'Template gratis ditambahkan!';
        addToast({
          type: 'success',
          message: 'Template berhasil ditambahkan ke akun Anda!',
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result.data?.externalId) {
        window.location.href = `/checkout/${result.data.externalId}`;
      } else {
        throw new Error('Respons tidak valid dari server');
      }
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      loading = false;
    }
  };
</script>

<div class="w-full flex flex-col gap-1">
  {#if errorMessage}
    <div class="bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 mb-1 animate-fade-in font-sans">
      <span>{errorMessage}</span>
    </div>
  {/if}

  {#if successMessage}
    <div class="bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 mb-1 animate-fade-in font-sans">
      <CheckCircle size={14} />
      <span>{successMessage}</span>
    </div>
  {/if}

  {#if isOwned}
    <button
      type="button"
      class="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl py-2 px-3 text-xs font-bold shadow-2xs w-full flex items-center justify-center gap-1.5 cursor-default"
      disabled
    >
      <CheckCircle size={15} />
      <span>Milik Anda</span>
    </button>
  {:else}
    <button
      type="button"
      on:click={handlePurchase}
      class="bg-primary hover:bg-primary-dark text-white rounded-2xl py-2.5 px-4 text-xs font-bold shadow-xs w-full flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
      disabled={loading}
    >
      {#if loading}
        <Loader size={15} class="animate-spin" />
        <span>Memproses...</span>
      {:else}
        <ShoppingCart size={15} />
        <span>{price === 0 ? 'Gunakan Gratis' : 'Beli Template'}</span>
      {/if}
    </button>
  {/if}
</div>
