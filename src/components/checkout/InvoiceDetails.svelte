<script lang="ts">
  import type { CheckoutPageData } from '@/types/payments';

  export let data: CheckoutPageData;

  const handlePayNow = () => {
    if (data.paymentUrl) {
      window.open(data.paymentUrl, '_blank');
    }
  };

  const getStatusBadgeClass = () => {
    switch (data.status) {
      case 'completed':
        return 'badge-success';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const getStatusText = () => {
    switch (data.status) {
      case 'completed':
        return 'Pembayaran Berhasil';
      case 'failed':
        return 'Pembayaran Gagal';
      default:
        return 'Menunggu Pembayaran';
    }
  };
</script>

<div class="space-y-6">
  <!-- Status Badge -->
  <div class="flex justify-center">
    <div class="badge {getStatusBadgeClass()} badge-lg gap-2">
      <span>{getStatusText()}</span>
    </div>
  </div>

  <!-- Invoice Details Card -->
  <div class="card bg-base-100 shadow-md border border-base-300">
    <div class="card-body space-y-4">
      <h2 class="card-title text-2xl">Detail Pembayaran</h2>

      <!-- Invoice ID -->
      <div class="form-control">
        <label class="label">
          <span class="label-text text-base font-semibold">ID Invoice</span>
        </label>
        <div class="input input-bordered input-md bg-base-200 text-sm overflow-x-auto">
          {data.invoiceId}
        </div>
      </div>

      <!-- Amount -->
      <div class="form-control">
        <label class="label">
          <span class="label-text text-base font-semibold">Jumlah Pembayaran</span>
        </label>
        <div class="text-3xl font-bold text-primary">
          {data.amountFormatted}
        </div>
      </div>

      <!-- Expires At -->
      {#if data.expiresAt}
        <div class="form-control">
          <label class="label">
            <span class="label-text text-sm text-base-content/60">Berlaku Hingga</span>
          </label>
          <div class="text-sm">
            {new Date(data.expiresAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      {/if}

      <!-- Payment Method (if available) -->
      {#if data.paymentMethod}
        <div class="form-control">
          <label class="label">
            <span class="label-text text-sm text-base-content/60">Metode Pembayaran</span>
          </label>
          <div class="text-sm capitalize">
            {data.paymentMethod}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Pay Now Button (show if pending) -->
  {#if data.status === 'pending' && data.paymentUrl}
    <button
      on:click={handlePayNow}
      class="btn btn-primary btn-lg w-full"
      aria-label="Bayar Sekarang - Buka halaman pembayaran Xendit di tab baru"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      Bayar Sekarang
    </button>
    <p class="text-center text-sm text-base-content/60">
      Akan membuka halaman pembayaran di tab baru
    </p>
  {/if}

  <!-- Success Message -->
  {#if data.status === 'completed'}
    <div class="alert alert-success shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 class="font-bold">Pembayaran Berhasil!</h3>
        <div class="text-sm">Akun Anda telah diaktifkan. Terima kasih!</div>
      </div>
    </div>
  {/if}

  <!-- Error Message -->
  {#if data.status === 'failed'}
    <div class="alert alert-error shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2"
        />
      </svg>
      <div>
        <h3 class="font-bold">Pembayaran Gagal</h3>
        <div class="text-sm">Silakan coba lagi atau hubungi dukungan kami.</div>
      </div>
    </div>
  {/if}

  <!-- Xendit Status Embed Notice -->
  <div class="alert alert-info">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div>
      <h3 class="font-bold">Status Pembayaran Real-time</h3>
      <div class="text-sm">
        Halaman ini akan memperbarui status secara otomatis setelah pembayaran diterima.
      </div>
    </div>
  </div>
</div>

<style>
  /* daisyUI tokens only, no custom styles */
</style>
