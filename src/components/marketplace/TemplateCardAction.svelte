<script lang="ts">
  import { ShoppingCart, CheckCircle, Loader } from 'lucide-svelte';

  export let templateId: string;
  export let price: number; // in cents
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
      const response = await fetch('/api/transactions/template-purchase', {
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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (result.data?.externalId) {
        // Redirect to checkout page which handles the Xendit iframe/details
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
    <div class="alert alert-error text-white text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 mb-1 animate-fade-in">
      <span>{errorMessage}</span>
    </div>
  {/if}

  {#if successMessage}
    <div class="alert alert-success text-white text-[11px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 mb-1 animate-fade-in">
      <CheckCircle size={14} />
      <span>{successMessage}</span>
    </div>
  {/if}

  {#if isOwned}
    <button
      type="button"
      class="btn btn-success btn-sm text-white rounded-xl text-xs font-semibold shadow-sm w-full gap-1.5"
      disabled
    >
      <CheckCircle size={15} />
      <span>Milik Anda</span>
    </button>
  {:else}
    <button
      type="button"
      on:click={handlePurchase}
      class="btn btn-primary btn-sm rounded-xl text-xs font-bold shadow-sm w-full gap-1.5 text-white active:scale-[0.98] transition-transform"
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
