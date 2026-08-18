<script lang="ts">
  import { onMount } from 'svelte';
  
  export let invoiceId: string;
  export let onStatusUpdate: (status: 'pending' | 'completed' | 'failed') => void = () => {};

  let status: 'pending' | 'completed' | 'failed' = 'pending';
  let loading = true;
  let error: string | null = null;
  let pollCount = 0;
  const maxPolls = 120; // Poll for 10 minutes (5s interval)

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/status/${invoiceId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      const result = await response.json();

      if (result.ok && result.data) {
        const newStatus = result.data.status;
        if (newStatus !== status) {
          status = newStatus;
          onStatusUpdate(status);
        }

        // Stop polling if payment is completed or failed
        if (status === 'completed' || status === 'failed') {
          loading = false;
          return;
        }
      }
    } catch (err) {
      console.error('[PaymentStatus] Error fetching status:', err);
      error = err instanceof Error ? err.message : 'Error fetching status';
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    // Initial fetch
    fetchPaymentStatus();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      pollCount++;
      if (pollCount > maxPolls) {
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

<div class="space-y-3">
  {#if loading && status === 'pending'}
    <div class="flex items-center gap-2">
      <span class="loading loading-spinner loading-sm"></span>
      <span class="text-sm text-base-content/60">Memperbarui status...</span>
    </div>
  {/if}

  {#if error}
    <div class="alert alert-warning alert-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="text-xs">{error}</span>
    </div>
  {/if}

  {#if status === 'completed'}
    <div class="alert alert-success alert-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span class="text-xs">Pembayaran berhasil diproses!</span>
    </div>
  {/if}

  {#if status === 'failed'}
    <div class="alert alert-error alert-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span class="text-xs">Pembayaran gagal. Silakan coba lagi.</span>
    </div>
  {/if}
</div>
