<script lang="ts">
  import { onMount } from 'svelte';

  export let invoiceId: string;
  export let onStatusUpdate: (status: 'pending' | 'completed' | 'failed') => void = () => {};

  let status: 'pending' | 'completed' | 'failed' = 'pending';
  let error: string | null = null;
  let pollCount = 0;
  const maxPolls = 120; // 10 menit (interval 5 detik)

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Gagal memeriksa status pembayaran');
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
      console.error('[PaymentStatus] Error:', err);
      error = err instanceof Error ? err.message : 'Error memeriksa status';
    }
  };

  onMount(() => {
    fetchPaymentStatus();

    const interval = setInterval(() => {
      pollCount++;
      if (pollCount > maxPolls || status === 'completed' || status === 'failed') {
        clearInterval(interval);
        return;
      }

      if (status === 'pending') {
        fetchPaymentStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  });
</script>

<div class="w-full">
  {#if status === 'pending'}
    <div class="flex items-center justify-center gap-2 text-base-content/60 text-xs py-1 animate-pulse">
      <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
      <span>Mengecek status pembayaran otomatis...</span>
    </div>
  {/if}

  {#if error}
    <div class="alert alert-warning text-xs py-2 px-3 mt-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
      <span class="material-symbols-outlined text-[16px]">warning</span>
      <span>{error}</span>
    </div>
  {/if}

  {#if status === 'completed'}
    <div class="flex items-center justify-center gap-1.5 text-emerald-500 text-xs font-semibold py-1">
      <span class="material-symbols-outlined text-[16px]">verified</span>
      <span>Pembayaran Berhasil Diverifikasi</span>
    </div>
  {/if}

  {#if status === 'failed'}
    <div class="flex items-center justify-center gap-1.5 text-rose-500 text-xs font-semibold py-1">
      <span class="material-symbols-outlined text-[16px]">cancel</span>
      <span>Pembayaran Gagal. Silakan coba lagi.</span>
    </div>
  {/if}
</div>