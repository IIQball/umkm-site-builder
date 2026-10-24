<script lang="ts">
  import { AlertTriangle, Zap, ChevronRight, X } from 'lucide-svelte';

  export let isOpen = false;
  export let storeId: string = '';
  export let creditBalance: number = 0;
  export let requiredCredit: number = 1;
  export let featureType: string = 'AI feature';
  export let onClose: () => void = () => {};
  export let onTopUp: () => void = () => {
    window.location.href = '/dashboard/tenant/ai-topup';
  };

  $: isInsufficient = creditBalance < requiredCredit;
  $: shortfallCredit = Math.max(0, requiredCredit - creditBalance);

  const handleClose = () => {
    isOpen = false;
    onClose();
  };

  const handleTopUp = () => {
    onTopUp();
  };
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div>
    class="fixed inset-0 z-40 bg-black/50 transition-opacity"
    on:click={handleClose}
    role="presentation"
  </div>

  <!-- Modal Container -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="relative w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-900 dark:shadow-2xl"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <!-- Close Button -->
      <button
        type="button"
        on:click={handleClose}
        class="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
        aria-label="Tutup"
      >
        <X size={20} />
      </button>

      <!-- Header -->
      <div class="border-b border-gray-200 bg-red-50 px-6 py-5 dark:border-gray-700 dark:bg-red-950/30">
        <div class="flex items-start gap-3">
          <AlertTriangle size={24} class="mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <h2
              id="modal-title"
              class="text-lg font-bold text-red-900 dark:text-red-100"
            >
              Saldo Kredit AI Tidak Cukup
            </h2>
            <p id="modal-description" class="mt-1 text-sm text-red-700 dark:text-red-300">
              Anda tidak dapat menggunakan fitur ini tanpa kredit yang memadai
            </p>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="space-y-4 px-6 py-5">
        <!-- Current Balance Section -->
        <div class="rounded-md bg-blue-50 p-4 dark:bg-blue-950/30">
          <div class="flex items-center gap-2 mb-3">
            <Zap size={16} class="text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
              Informasi Kredit
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-blue-700 dark:text-blue-300">Saldo Saat Ini</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {creditBalance}
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-400">poin</p>
            </div>
            <div>
              <p class="text-xs text-blue-700 dark:text-blue-300">Dibutuhkan</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {requiredCredit}
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-400">poin</p>
            </div>
          </div>
        </div>

        <!-- Shortfall Alert -->
        {#if isInsufficient && shortfallCredit > 0}
          <div class="rounded-md border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950/30">
            <p class="text-sm text-orange-800 dark:text-orange-200">
              <span class="font-semibold">Kekurangan:</span>
              {shortfallCredit} poin lagi untuk menggunakan fitur ini
            </p>
          </div>
        {/if}

        <!-- Feature Info -->
        <div class="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            <span class="font-medium">Fitur:</span> {featureType}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div class="flex gap-3">
          <button
            type="button"
            on:click={handleClose}
            class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Nanti
          </button>
          <button
            type="button"
            on:click={handleTopUp}
            class="flex-1 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Top-up Sekarang
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.dark) {
    color-scheme: dark;
  }
</style>
