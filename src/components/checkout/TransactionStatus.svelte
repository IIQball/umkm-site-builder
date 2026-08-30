<script lang="ts">
  import { onMount } from 'svelte';

  export let invoiceId: string;
  export let onStatusUpdate: (status: 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | 'refunded') => void = () => {};

  let status: 'pending' | 'success' | 'failed' | 'expired' | 'canceled' | 'refunded' = 'pending';
  let error: string | null = null;
  let pollCount = 0;
  const maxPolls = 120; // 10 menit (interval 5 detik)

  const fetchTransactionStatus = async () => {
    try {
      const response = await fetch(`/api/public/transactions/status/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Gagal memeriksa status transaksi');
      }

      const result = await response.json();

      if (result.ok && result.data) {
        const newStatus = result.data.status;
        if (newStatus !== status) {
          status = newStatus;
          onStatusUpdate(status);
        }
      }
    } catch (err) {
       error = err instanceof Error ? err.message : 'Error memeriksa status';
    }
  };

  onMount(() => {
    fetchTransactionStatus();

    const interval = setInterval(() => {
      pollCount++;
      if (pollCount > maxPolls || status === 'success' || status === 'failed') {
        clearInterval(interval);
        return;
      }

      if (status === 'pending') {
        fetchTransactionStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<div class="w-full">
  {#if status === 'pending'}
    <div class="flex items-center justify-center gap-2 text-secondary text-xs py-1.5 animate-pulse">
      <span class="material-symbols-outlined text-base animate-spin text-primary">sync</span>
      <span class="font-medium">Mengecek status pembayaran otomatis...</span>
    </div>
  {/if}

  {#if error}
    <div class="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs py-2 px-3 mt-2 rounded-xl flex items-center justify-center gap-2">
      <span class="material-symbols-outlined text-base">warning</span>
      <span>{error}</span>
    </div>
  {/if}

  {#if status === 'success'}
    <div class="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold py-1.5">
      <span class="material-symbols-outlined text-base">verified</span>
      <span>Pembayaran Berhasil Diverifikasi</span>
    </div>
  {/if}

  {#if status === 'failed' || status === 'expired' || status === 'canceled' || status === 'refunded'}
    <div class="flex items-center justify-center gap-1.5 text-error text-xs font-semibold py-1.5">
      <span class="material-symbols-outlined text-base">cancel</span>
      <span>Pembayaran {status === 'expired' ? 'Kedaluwarsa' : status === 'canceled' ? 'Dibatalkan' : status === 'refunded' ? 'Dikembalikan' : 'Gagal'}. Silakan coba lagi.</span>
    </div>
  {/if}
</div>