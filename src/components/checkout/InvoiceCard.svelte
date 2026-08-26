<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import { Copy, ShieldCheck, ExternalLink } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';

  export let pageData: CheckoutPageData;
  export let transactionType: 'store_registration' | 'template_purchase';
  export let templateName: string;

  let copied = false;
  function copyInvoiceId() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(pageData.invoiceId);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
  <!-- Invoice Details Column -->
  <div class="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-base-100 dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-xl space-y-6">
    <div class="flex items-center justify-between border-b border-base-200 dark:border-slate-800 pb-4">
      <div>
        <span class="text-xs font-semibold text-base-content/60">ID Tagihan (Invoice)</span>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="font-mono font-bold text-sm text-base-content">{pageData.invoiceId}</span>
          <button
            type="button"
            on:click={copyInvoiceId}
            class="p-1 text-base-content/50 hover:text-primary rounded cursor-pointer"
            title="Salin ID Invoice"
          >
            <Copy size={13} />
          </button>
          {#if copied}
            <span class="text-[10px] text-emerald-500 font-medium">Disalin!</span>
          {/if}
        </div>
      </div>
      <span class="badge badge-primary badge-sm font-bold uppercase">
        {transactionType === 'template_purchase' ? 'Beli Template' : 'Registrasi Toko'}
      </span>
    </div>

    <!-- Product / Item Summary -->
    <div class="p-4 rounded-2xl bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 space-y-2">
      <span class="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">Rincian Pembelian</span>
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-sm text-base-content">
          {transactionType === 'template_purchase' ? `Template: ${templateName || 'Desain Website'}` : 'Biaya Registrasi Toko Baru'}
        </h3>
        <span class="font-black text-sm text-primary">{formatCurrency(pageData.amount)}</span>
      </div>
    </div>

    <!-- Instructions -->
    <div class="space-y-3 text-xs text-base-content/70">
      <h4 class="font-bold text-base-content">Instruksi Pembayaran Xendit:</h4>
      <ol class="list-decimal list-inside space-y-1.5 leading-relaxed">
        <li>Klik tombol <strong>Bayar Sekarang</strong> untuk membuka gateway pembayaran aman Xendit.</li>
        <li>Pilih metode pembayaran yang Anda inginkan (QRIS, Transfer Bank Virtual Account, atau E-Wallet).</li>
        <li>Selesaikan pembayaran sebelum batas waktu berakhir. Status akan otomatis diperbarui.</li>
      </ol>
    </div>

    <div class="flex items-center gap-2 text-xs text-base-content/50 pt-2 border-t border-base-200 dark:border-slate-800">
      <ShieldCheck size={16} class="text-emerald-500 flex-shrink-0" />
      <span>Pembayaran diproses secara aman dan terenkripsi melalui Xendit Payment Gateway.</span>
    </div>
  </div>

  <!-- Action & Status Column -->
  <div class="lg:col-span-5 space-y-6">
    <div class="p-6 rounded-3xl bg-base-100 dark:bg-slate-900 border border-base-200 dark:border-slate-800 shadow-xl space-y-4 text-center">
      <span class="text-xs font-semibold text-base-content/60">Total yang Harus Dibayar</span>
      <h2 class="text-3xl font-black text-primary">{formatCurrency(pageData.amount)}</h2>

      <div class="pt-2">
        <a
          href={pageData.invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-primary shadow-lg hover:opacity-90 transition-all cursor-pointer"
        >
          <span>Bayar Sekarang via Xendit</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  </div>
</div>
