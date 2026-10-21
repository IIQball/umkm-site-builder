<script lang="ts">
  import { onMount } from 'svelte';
  import { Zap, ChevronRight } from 'lucide-svelte';
  import type { AiCreditBalance } from '@/services/ai-credit.service';

  export let storeId: string;
  export let creditBalance: AiCreditBalance | null = null;
  export let isLoading = false;
  export let error: string | null = null;

  onMount(async () => {
    isLoading = true;
    error = null;
    try {
      const res = await fetch(`/api/tenant/ai-credit/${storeId}`);
      if (!res.ok) {
        throw new Error('Gagal memuat saldo kredit');
      }
      creditBalance = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan';
    } finally {
      isLoading = false;
    }
  });

  $: displayBalance = creditBalance?.balance ?? 0;
  $: isLowCredit = displayBalance <= 1;
</script>

<div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
  {#if isLoading}
    <div class="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-blue-600"></div>
    <span class="text-sm text-blue-700 dark:text-blue-300">Memuat...</span>
  {:else if error}
    <Zap size={18} class="text-orange-500" />
    <span class="text-sm text-orange-600 dark:text-orange-400">{error}</span>
  {:else}
    <Zap size={18} class={isLowCredit ? 'text-orange-500' : 'text-blue-600'} />
    <div class="flex flex-col gap-0.5">
      <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
        Saldo Kredit AI
      </span>
      <span class={`text-sm font-bold ${isLowCredit ? 'text-orange-600 dark:text-orange-400' : 'text-blue-700 dark:text-blue-300'}`}>
        {displayBalance} poin
      </span>
    </div>
    <a
      href="/dashboard/tenant/ai-topup"
      class="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
    >
      Top-up
      <ChevronRight size={14} />
    </a>
  {/if}
</div>

<style>
  :global(.dark) {
    --tw-bg-opacity: 1;
  }
</style>
