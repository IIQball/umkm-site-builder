<script lang="ts">
  import {
    Check,
    Copy,
    CreditCard,
    RefreshCw,
    LayoutDashboard,
    Palette,
    Lock,
  } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';
  import { Button } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let pageData: CheckoutPageData;
  export let checkoutTitle: string;
  export let checkoutDescription: string;
  export let isTemplatePurchase: boolean;
  export let copied: boolean = false;
  export let onCopyInvoice: () => void;
  export let onOpenPaymentModal: () => void;
</script>

<div class="bg-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
  <div>
    <h2 class="text-heading-sm font-bold text-main font-heading">
      {checkoutTitle}
    </h2>
    <p class="text-body-xs text-secondary mt-0.5">
      {checkoutDescription}
    </p>
  </div>

  <div class="flex items-center justify-between bg-nested/80 px-3.5 py-2.5 rounded-2xl border border-light">
    <div class="min-w-0">
      <span class="text-2xs text-secondary font-medium uppercase tracking-wider">No. Invoice Tagihan</span>
      <p class="font-mono text-xs font-bold text-main truncate mt-0.5">{pageData.invoiceId}</p>
    </div>
    <button
      type="button"
      class="p-2 rounded-xl bg-card hover:bg-nested text-secondary hover:text-main active:scale-95 transition-all cursor-pointer border border-light shadow-2xs"
      title="Salin Nomor Invoice"
      on:click={onCopyInvoice}
    >
      {#if copied}
        <Check size={14} class="text-emerald-500" />
      {:else}
        <Copy size={14} />
      {/if}
    </button>
  </div>

  <!-- Price Breakdown -->
  <div class="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
    <div class="flex justify-between items-center text-secondary">
      <span>Biaya Lisensi Template</span>
      <span class="font-mono font-medium text-main">{formatIDR(pageData.amount)}</span>
    </div>
    <div class="flex justify-between items-center text-secondary">
      <span>Biaya Layanan & Payment Gateway</span>
      <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-3xs">Gratis Rp 0</span>
    </div>
    <div class="flex justify-between items-center text-secondary">
      <span>PPN / Pajak Transaksi</span>
      <span class="font-mono font-medium text-secondary">Termasuk (0%)</span>
    </div>

    <div class="flex justify-between items-baseline pt-4 border-t border-slate-200 dark:border-slate-800">
      <span class="text-sm font-extrabold text-main font-heading">Total Pembayaran</span>
      <span class="font-mono text-2xl font-black text-primary">
        {formatIDR(pageData.amount)}
      </span>
    </div>
  </div>

  <!-- Action CTA Buttons -->
  <div class="pt-3 space-y-2.5">
    {#if pageData.status === 'success'}
      <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
        <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300 block font-heading">
          🎉 Transaksi Berhasil & Aktif!
        </span>
        <p class="text-2xs text-emerald-800 dark:text-emerald-200/90 leading-relaxed font-sans">
          Template kini telah ditambahkan ke koleksi toko Anda dan siap diterapkan langsung ke storefront.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <Button
          href="/dashboard"
          variant="primary"
          size="md"
          className="w-full font-bold shadow-xs active:scale-95 text-xs rounded-2xl"
        >
          <LayoutDashboard size={15} />
          <span>Dashboard Toko</span>
        </Button>
        <Button
          href="/dashboard/templates"
          variant="secondary"
          size="md"
          className="w-full font-bold active:scale-95 text-xs rounded-2xl"
        >
          <Palette size={15} />
          <span>Galeri Template</span>
        </Button>
      </div>
    {:else if pageData.status === 'pending'}
      <Button
        variant="primary"
        size="lg"
        className="w-full font-bold shadow-md shadow-primary/20 text-sm active:scale-95 py-3 rounded-2xl"
        on:click={onOpenPaymentModal}
      >
        <CreditCard size={18} class="mr-1.5" />
        <span>Bayar Sekarang ({formatIDR(pageData.amount)})</span>
      </Button>

      <div class="flex items-center justify-center gap-2 pt-1 text-2xs text-secondary">
        <Lock size={12} class="text-emerald-500" />
        <span>Enkripsi SSL 256-bit & Xendit Verified Gateway</span>
      </div>
    {:else}
      <Button
        href={isTemplatePurchase ? '/templates' : '/dashboard'}
        variant="primary"
        size="md"
        className="w-full font-bold shadow-xs active:scale-95 text-xs rounded-2xl"
      >
        <RefreshCw size={15} />
        <span>Pilih Template Lain</span>
      </Button>
    {/if}
  </div>
</div>
