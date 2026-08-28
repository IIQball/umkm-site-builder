<script lang="ts">
  import { ArrowLeft, Check, Copy, Clock, CreditCard, RefreshCw, LayoutDashboard, Palette, ShieldCheck } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';
  import TransactionStatus from './TransactionStatus.svelte';
  import PaymentModal from './PaymentModal.svelte';

  export let pageData: CheckoutPageData;
  export let checkoutTitle: string;
  export let checkoutDescription: string;
  export let lineItemTitle: string;
  export let lineItemSubtitle: string;
  export let isTemplatePurchase: boolean;
  export let invoiceId: string;

  let showCopyToast = false;

  const copyInvoice = () => {
    navigator.clipboard.writeText(pageData.invoiceId);
    showCopyToast = true;
    setTimeout(() => {
      showCopyToast = false;
    }, 2200);
  };
</script>

<main class="w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden relative">
  <!-- Top Section / Breadcrumb & Status -->
  <div class="px-6 py-4 border-b border-base-content/10 flex justify-between items-center bg-base-100">
    <a 
      href="/" 
      class="inline-flex items-center gap-2 text-xs font-semibold text-base-content/70 hover:text-primary transition-colors"
    >
      <ArrowLeft size={16} />
      Kembali ke Beranda
    </a>
    
    {#if pageData.status === 'success'}
      <div class="badge-custom badge-custom-emerald px-3 py-1 text-xs font-semibold border flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-success rounded-full"></div>
        Lunas
      </div>
    {:else if pageData.status === 'failed'}
      <div class="badge-custom badge-custom-rose px-3 py-1 text-xs font-semibold border flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-error rounded-full"></div>
        Gagal
      </div>
    {:else if pageData.status === 'expired'}
      <div class="badge-custom badge-custom-warning px-3 py-1 text-xs font-semibold border flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-warning rounded-full"></div>
        Kedaluwarsa
      </div>
    {:else}
      <div class="badge-custom badge-custom-amber px-3 py-1 text-xs font-semibold border animate-pulse flex items-center gap-1.5">
        <div class="w-1.5 h-1.5 bg-warning rounded-full"></div>
        Menunggu Pembayaran
      </div>
    {/if}
  </div>

  <!-- Header Content -->
  <div class="p-6 md:p-8 space-y-6">
    <div class="text-center space-y-2">
      {#if pageData.status === 'success'}
        <div class="w-12 h-12 icon-wrapper icon-wrapper-emerald rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-success">
          <Check size={24} />
        </div>
      {/if}
      <h1 class="text-2xl font-extrabold tracking-tight text-base-content">{checkoutTitle}</h1>
      <p class="text-xs text-base-content/70 max-w-sm mx-auto leading-relaxed">
        {checkoutDescription}
      </p>
    </div>

    <!-- Inner Nested Invoice Card -->
    <div class="bg-base-200/60 rounded-xl border border-base-content/10 p-5 space-y-5">
      <!-- Reference Box -->
      <div class="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-content/10 shadow-sm">
        <div>
          <p class="text-xs font-medium text-base-content/60 mb-0.5">No. Referensi Tagihan</p>
          <p class="text-xs font-mono font-bold text-base-content tracking-wide">{pageData.invoiceId}</p>
        </div>
        <button 
          type="button" 
          class="btn btn-ghost btn-xs btn-square text-base-content/60 hover:text-base-content cursor-pointer" 
          title="Salin Nomor Referensi"
          on:click={copyInvoice}
        >
          <Copy size={16} />
        </button>
      </div>

      <!-- Line Items -->
      <div class="space-y-3 pt-1">
        <div class="flex justify-between items-start border-b border-base-content/10 pb-3">
          <div class="max-w-[70%]">
            <p class="text-xs font-semibold text-base-content">{lineItemTitle}</p>
            <p class="text-xs text-base-content/60">{lineItemSubtitle}</p>
          </div>
          <p class="text-xs font-semibold text-base-content">{pageData.amountFormatted}</p>
        </div>
      </div>

      <!-- Total Amount -->
      <div class="pt-1 flex flex-col items-center justify-center space-y-1 text-center">
        <p class="text-xs font-bold text-base-content/60 uppercase tracking-widest">Total Pembayaran</p>
        <p class="text-3xl font-black text-base-content tracking-tight font-mono">{pageData.amountFormatted}</p>
        
        {#if pageData.status === 'pending'}
          <p class="text-xs text-warning mt-2 inline-flex items-center gap-1.5 bg-warning/10 px-2.5 py-1 rounded-md font-medium border border-warning/20">
            <Clock size={14} />
            Berlaku hingga 24 jam ke depan
          </p>
        {/if}
      </div>
    </div>

    <!-- Action Button & Poller -->
    {#if pageData.status === 'pending'}
      <div class="space-y-3 pt-1">
        {#if pageData.paymentUrl}
          <button 
            type="button"
            class="btn btn-primary w-full text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 border-none cursor-pointer"
            on:click={() => {
              const modal = document.getElementById('payment_modal');
              if (modal instanceof HTMLDialogElement) modal.showModal();
            }}
          >
            <span>Lanjutkan ke Pembayaran</span>
            <CreditCard size={18} />
          </button>
        {:else}
          <button 
            type="button"
            class="btn btn-primary w-full text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 border-none cursor-pointer"
            on:click={() => window.location.reload()}
          >
            <span>Muat Ulang Halaman</span>
            <RefreshCw size={18} />
          </button>
        {/if}
        
        <TransactionStatus 
          {invoiceId} 
          onStatusUpdate={(status) => {
            if (status === 'success') {
              const modal = document.getElementById('payment_modal');
              if (modal instanceof HTMLDialogElement) {
                modal.close();
              }
              window.location.reload();
            }
          }}
        />
      </div>
    {:else if pageData.status === 'success'}
      <div class="space-y-3 pt-1">
        <a 
          href={isTemplatePurchase ? '/templates' : '/dashboard'} 
          class="btn btn-primary w-full text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 border-none text-center cursor-pointer"
        >
          <span>{isTemplatePurchase ? 'Kembali ke Katalog Template' : 'Menuju Dashboard'}</span>
          {#if isTemplatePurchase}
            <Palette size={18} />
          {:else}
            <LayoutDashboard size={18} />
          {/if}
        </a>
        
        <TransactionStatus {invoiceId} />
      </div>
    {/if}

    <!-- Payment Modal -->
    {#if pageData.paymentUrl}
      <PaymentModal 
        paymentUrl={pageData.paymentUrl}
        onClose={() => {}}
      />
    {/if}
  </div>

  <!-- Footer Info -->
  <div class="bg-base-200/40 p-4 border-t border-base-content/10 flex flex-col items-center justify-center gap-2 text-xs text-base-content/60">
    <div class="flex items-center gap-1.5 text-success font-medium">
      <ShieldCheck size={16} />
      <span>Transaksi aman dan terverifikasi otomatis</span>
    </div>
    <div class="flex gap-4 text-base-content/70 font-medium">
      <a class="hover:text-primary underline decoration-base-content/20 underline-offset-2 transition-colors" href="/help">Pusat Bantuan</a>
      <span class="text-base-content/30">•</span>
      <a class="hover:text-primary underline decoration-base-content/20 underline-offset-2 transition-colors" href="/contact">Hubungi Kami</a>
    </div>
  </div>
</main>

{#if showCopyToast}
  <div class="toast toast-top toast-end fixed z-50 p-4 transition-all duration-200">
    <div class="alert alert-success shadow-xl text-white text-xs font-semibold py-2.5 px-4 gap-2 rounded-xl flex items-center">
      <Check size={16} />
      <span>Nomor referensi berhasil disalin</span>
    </div>
  </div>
{/if}
