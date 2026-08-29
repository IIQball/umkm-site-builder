<script lang="ts">
  import { History, Receipt } from 'lucide-svelte';
  import { formatIDR } from '@/lib/utils/format';
  import type { PayoutHistoryItem } from '@/types';

  export let payoutHistory: PayoutHistoryItem[] = [];
  export let isLoading = false;
</script>

<div class="bg-card border border-light rounded-2xl p-6 shadow-sm space-y-4 mt-5">
  <div class="flex items-center justify-between border-b border-light pb-3">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <History size={16} />
      </div>
      <h3 class="text-sm font-bold text-main">Riwayat Penarikan Dana</h3>
    </div>
  </div>

  {#if isLoading}
    <div class="space-y-3">
      <div class="h-10 bg-nested rounded-xl animate-pulse"></div>
      <div class="h-10 bg-nested rounded-xl animate-pulse"></div>
    </div>
  {:else if payoutHistory.length === 0}
    <div class="text-center py-8 text-secondary">
      <div class="w-10 h-10 mx-auto text-muted mb-1 flex items-center justify-center">
        <Receipt size={28} />
      </div>
      <p class="text-xs">Belum ada riwayat penarikan dana.</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead>
          <tr class="border-b border-light text-muted text-label-caps">
            <th class="py-2.5">Tanggal</th>
            <th class="py-2.5">Nominal</th>
            <th class="py-2.5">Status</th>
            <th class="py-2.5">Keterangan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light">
          {#each payoutHistory as payout}
            <tr>
              <td class="py-3 text-main font-mono">
                {new Date(payout.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td class="py-3 text-main font-bold font-mono">{formatIDR(payout.amount)}</td>
              <td class="py-3">
                {#if payout.status === 'processing'}
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 animate-pulse">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping flex-shrink-0"></span>
                    Processing
                  </span>
                {:else if payout.status === 'completed'}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                    Completed
                  </span>
                {:else if payout.status === 'rejected'}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error border border-error/20">
                    Rejected
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20">
                    {payout.status}
                  </span>
                {/if}
              </td>
              <td class="py-3 text-secondary">
                <div class="truncate max-w-[200px]">
                  {payout.gatewayMessage || (payout.status === 'processing' ? 'Sedang diproses oleh platform' : payout.status === 'completed' ? 'Dana berhasil ditransfer' : 'Penarikan ditolak')}
                </div>
                {#if payout.xenditPayoutId || payout.gatewayReference}
                  <div class="text-xs text-muted font-mono mt-0.5 whitespace-nowrap">
                    {#if payout.xenditPayoutId}
                      ID: {payout.xenditPayoutId}
                    {/if}
                    {#if payout.xenditPayoutId && payout.gatewayReference}
                      <span class="mx-1">|</span>
                    {/if}
                    {#if payout.gatewayReference}
                      Ref: {payout.gatewayReference}
                    {/if}
                  </div>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
