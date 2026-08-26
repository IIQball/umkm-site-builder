<script lang="ts">
  import { formatIDR } from '@/lib/utils/format';
  import { History, Copy, Check } from 'lucide-svelte';
  import type { PayoutHistoryItem } from '@/types/finance';
  import { getPayoutStatusBadge } from './bank.helpers';

  export let payoutHistory: PayoutHistoryItem[] = [];

  $: items = Array.isArray(payoutHistory) ? payoutHistory : [];

  let copiedId: string | null = null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      setTimeout(() => { copiedId = null; }, 1800);
    } catch {
      // clipboard not available
    }
  };

  const formatDate = (d: Date | string): string => {
    try {
      return new Date(d).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(d);
    }
  };
</script>

<div class="bg-card border border-light rounded-2xl overflow-hidden shadow-sm">
  <div class="px-6 py-4 border-b border-light flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <History size={18} />
      </div>
      <div>
        <h3 class="text-sm font-bold text-main">Riwayat Penarikan Saldo (Payout)</h3>
        <p class="text-xs text-muted">Log pengajuan pencairan dana ke rekening bank</p>
      </div>
    </div>
    {#if items.length > 0}
      <span class="text-xs font-semibold text-secondary bg-nested border border-light rounded-lg px-2.5 py-1">
        {items.length} transaksi
      </span>
    {/if}
  </div>

  {#if items.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4 text-muted">
        <History size={28} />
      </div>
      <h4 class="text-sm font-bold text-main mb-1.5">Belum Ada Pengajuan Penarikan</h4>
      <p class="text-xs text-secondary max-w-xs leading-relaxed">
        Riwayat penarikan saldo Anda beserta status pemrosesan transfer bank akan tercatat secara otomatis di sini.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr class="bg-nested/60 border-b border-light">
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Tanggal</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Payout ID</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Rekening Tujuan</th>
            <th class="text-right text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Nominal</th>
            <th class="text-center text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light/50">
          {#each items as item}
            {@const badge = getPayoutStatusBadge(item.status)}
            <tr class="hover:bg-nested/40 transition-colors">
              <td class="px-6 py-3.5 text-xs text-muted whitespace-nowrap">
                {formatDate(item.createdAt)}
              </td>
              <td class="px-4 py-3.5">
                <button
                  type="button"
                  on:click={() => copyToClipboard(item.id)}
                  class="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-primary hover:bg-primary/10 rounded-lg px-1.5 py-0.5 transition-colors cursor-pointer"
                  title="Salin ID Penarikan"
                >
                  <span class="truncate max-w-[110px]">{item.id}</span>
                  {#if copiedId === item.id}
                    <Check size={12} class="text-emerald-500 flex-shrink-0" />
                  {:else}
                    <Copy size={12} class="flex-shrink-0" />
                  {/if}
                </button>
              </td>
              <td class="px-4 py-3.5 text-xs">
                {#if item.bankAccount}
                  <div class="flex flex-col">
                    <span class="font-bold text-main">{item.bankAccount.bankName} - {item.bankAccount.accountNumber}</span>
                    {#if item.bankAccount.holderName || item.bankAccount.accountHolder}
                      <span class="text-[11px] text-muted uppercase">{item.bankAccount.holderName || item.bankAccount.accountHolder}</span>
                    {/if}
                  </div>
                {:else}
                  <span class="text-muted">—</span>
                {/if}
              </td>
              <td class="px-4 py-3.5 text-right font-mono text-xs font-bold text-main whitespace-nowrap">
                {formatIDR(item.amount)}
              </td>
              <td class="px-6 py-3.5 text-center whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border {badge.class}">
                  {badge.label}
                </span>
                {#if item.gatewayMessage && item.status.toLowerCase() === 'failed'}
                  <p class="text-[10px] text-rose-500 mt-1 max-w-[150px] truncate" title={item.gatewayMessage}>
                    {item.gatewayMessage}
                  </p>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
