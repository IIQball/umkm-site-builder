<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import type { CheckoutPageData } from '@/types';
  import { Badge, Button } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import TransactionStatus from './TransactionStatus.svelte';
  import PaymentModal from './PaymentModal.svelte';
  import CheckoutItemDetails from './CheckoutItemDetails.svelte';
  import CheckoutPaymentBreakdown from './CheckoutPaymentBreakdown.svelte';

  export let pageData: CheckoutPageData;
  export let checkoutTitle: string;
  export let checkoutDescription: string;
  export let lineItemTitle: string;
  export let lineItemSubtitle: string;
  export let isTemplatePurchase: boolean;
  export let invoiceId: string;

  let copied = false;

  const copyInvoice = async () => {
    try {
      await navigator.clipboard.writeText(pageData.invoiceId);
      copied = true;
      toast.info('Nomor invoice berhasil disalin');
      setTimeout(() => {
        copied = false;
      }, 2500);
    } catch {
      toast.error('Gagal menyalin nomor invoice');
    }
  };

  let isPaymentModalOpen = false;

  const openPaymentModal = () => {
    isPaymentModalOpen = true;
  };
</script>

<main class="w-full space-y-6 animate-fade-in-up">
  <!-- Stepper Breadcrumb Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
    <div class="flex items-center gap-2 text-xs font-semibold">
      <Button
        href={isTemplatePurchase ? '/templates' : '/dashboard'}
        variant="secondary"
        size="xs"
        className="font-bold"
      >
        <ArrowLeft size={14} />
        <span>Katalog</span>
      </Button>

      <span class="text-secondary/40">/</span>
      
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20">
        <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span>Konfirmasi Tagihan</span>
      </div>
    </div>

    <div>
      {#if pageData.status === 'success'}
        <Badge variant="emerald" dot size="sm">
          Lunas & Terverifikasi
        </Badge>
      {:else if pageData.status === 'failed'}
        <Badge variant="rose" dot size="sm">
          Pembayaran Gagal
        </Badge>
      {:else if pageData.status === 'expired'}
        <Badge variant="warning" dot size="sm">
          Tagihan Kedaluwarsa
        </Badge>
      {:else}
        <Badge variant="amber" dot pulse size="sm">
          Menunggu Pembayaran
        </Badge>
      {/if}
    </div>
  </div>

  <!-- 2-Column Split Grid (12 Cols) -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
    <!-- LEFT COLUMN - Template Presentation & Benefits -->
    <div class="md:col-span-7 space-y-6">
      <CheckoutItemDetails
        {pageData}
        {lineItemTitle}
        {lineItemSubtitle}
      />
    </div>

    <!-- RIGHT COLUMN - Payment Card / Receipt & Live Polling Status -->
    <div class="md:col-span-5 space-y-6">
      <CheckoutPaymentBreakdown
        {pageData}
        {checkoutTitle}
        {checkoutDescription}
        {isTemplatePurchase}
        {copied}
        onCopyInvoice={copyInvoice}
        onOpenPaymentModal={openPaymentModal}
      />

      <TransactionStatus {invoiceId} />
    </div>
  </div>

  <PaymentModal
    open={isPaymentModalOpen}
    paymentUrl={pageData.paymentUrl || ''}
    onClose={() => (isPaymentModalOpen = false)}
  />
</main>
