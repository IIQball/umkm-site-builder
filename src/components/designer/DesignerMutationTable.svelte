<script lang="ts">
  import { formatIDR } from '@/lib/utils/format';

  export let mutations: Array<{
    id: string;
    amount: number;
    balanceAfter: number;
    type: 'CREDIT' | 'DEBIT';
    description: string;
    referenceId: string | null;
    createdAt: Date | string;
  }>;

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

  const formatDate = (d: Date | string): string =>
    new Date(d).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
</script>

<div class="bg-card border border-light rounded-2xl overflow-hidden shadow-sm">
  <div class="px-6 py-4 border-b border-light flex items-center justify-between">
    <div>
      <h3 class="text-sm font-bold text-main">Riwayat Mutasi & Transaksi</h3>
      <p class="text-xs text-muted mt-0.5">Buku besar dompet & komisi penjualan</p>
    </div>
    {#if mutations.length > 0}
      <span class="text-xs font-semibold text-secondary bg-nested border border-light rounded-lg px-2.5 py-1">
        {mutations.length} entri
      </span>
    {/if}
  </div>

  {#if mutations.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-muted">receipt_long</span>
      </div>
      <h4 class="text-sm font-bold text-main mb-1.5">Belum Ada Mutasi</h4>
      <p class="text-xs text-secondary max-w-xs leading-relaxed">
        Mutasi saldo dan komisi penjualan template akan dicatat secara otomatis di sini.
      </p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr class="bg-nested/60 border-b border-light">
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Tanggal</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Tipe</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Keterangan</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Reference ID</th>
            <th class="text-right text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Nominal</th>
            <th class="text-right text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Saldo Akhir</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light/50">
          {#each mutations as mut}
            <tr class="hover:bg-nested/40 transition-colors">
              <td class="px-6 py-3.5 text-xs text-muted whitespace-nowrap">
                {formatDate(mut.createdAt)}
              </td>
              <td class="px-4 py-3.5">
                {#if mut.type === 'CREDIT'}
                  <span class="badge-custom badge-custom-emerald text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0"></span>
                    CREDIT
                  </span>
                {:else}
                  <span class="badge-custom badge-custom-rose text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0"></span>
                    DEBIT
                  </span>
                {/if}
              </td>
              <td class="px-4 py-3.5 text-xs font-medium text-main max-w-[180px] whitespace-normal break-words">
                {mut.description}
              </td>
              <td class="px-4 py-3.5">
                {#if mut.referenceId}
                  <button
                    type="button"
                    on:click={() => copyToClipboard(mut.referenceId ?? '')}
                    class="flex items-center gap-1.5 font-mono text-xs text-muted hover:text-primary hover:bg-primary/10 rounded-lg px-1.5 py-0.5 transition-colors cursor-pointer"
                    title="Salin Reference ID"
                  >
                    <span class="truncate max-w-[100px]">{mut.referenceId}</span>
                    <span class="material-symbols-outlined text-sm flex-shrink-0">
                      {copiedId === mut.referenceId ? 'check' : 'content_copy'}
                    </span>
                  </button>
                {:else}
                  <span class="text-xs text-muted">—</span>
                {/if}
              </td>
              <td
                class="px-4 py-3.5 text-right font-mono text-xs font-bold whitespace-nowrap"
                class:text-success={mut.type === 'CREDIT'}
                class:text-error={mut.type === 'DEBIT'}
              >
                {mut.type === 'CREDIT' ? '+' : '-'}{formatIDR(mut.amount)}
              </td>
              <td class="px-6 py-3.5 text-right font-mono text-xs font-semibold text-secondary whitespace-nowrap">
                {formatIDR(mut.balanceAfter)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
