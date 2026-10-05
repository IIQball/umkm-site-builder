<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Send,
    AlertCircle,
    Info,
    RefreshCw,
  } from 'lucide-svelte';
  import { Modal, Button } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let isOpen: boolean = false;
  export let templateId: string = '';
  export let templateName: string = 'Template';
  export let templatePrice: number = 0;
  export let initialPlatformFeePercentage: number = 30;
  export let onClose: () => void = () => {};
  export let onConfirm: () => Promise<boolean | void> = async () => {};

  let platformFeePercentage: number = initialPlatformFeePercentage;
  let isLoadingFee: boolean = false;
  let isSubmitting: boolean = false;
  let errorMessage: string | null = null;
  let wasOpen: boolean = false;

  $: designerPercentage = Math.max(0, 100 - platformFeePercentage);

  $: platformFeeAmount = templatePrice > 0
    ? Math.round((templatePrice * platformFeePercentage) / 100)
    : 0;

  $: designerAmount = templatePrice > 0
    ? templatePrice - platformFeeAmount
    : 0;

  const fetchCommissionSettings = async () => {
    try {
      isLoadingFee = true;
      const res = await fetch(`/api/public/commission?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && typeof data.data?.platformFeePercentage === 'number') {
          platformFeePercentage = data.data.platformFeePercentage;
        }
      }
    } catch {
      // Keep current fee on network error
    } finally {
      isLoadingFee = false;
    }
  };

  const handleWindowFocus = () => {
    if (isOpen) {
      fetchCommissionSettings();
    }
  };

  onMount(() => {
    window.addEventListener('focus', handleWindowFocus);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleWindowFocus);
    }
  });

  $: if (isOpen) {
    errorMessage = null;
    if (!wasOpen) {
      wasOpen = true;
      fetchCommissionSettings();
    }
  } else {
    wasOpen = false;
  }

  const handleClose = () => {
    if (isSubmitting) return;
    errorMessage = null;
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    errorMessage = null;
    try {
      await onConfirm();
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Gagal mengajukan template untuk kurasi';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Modal
  bind:open={isOpen}
  title="Ajukan Template untuk Kurasi"
  description={templateId ? `${templateName} (ID: ${templateId})` : templateName}
  size="md"
  on:close={handleClose}
>
  <div class="space-y-4 text-xs font-sans">
    <!-- Error Alert if any -->
    {#if errorMessage}
      <div class="alert alert-error text-xs rounded-xl shadow-xs py-2.5 px-3 flex items-start gap-2">
        <AlertCircle size={16} class="shrink-0 mt-0.5" />
        <span class="leading-relaxed">{errorMessage}</span>
      </div>
    {/if}

    <!-- Curation Flow Note -->
    <div class="rounded-xl bg-nested/50 border border-light p-3.5 space-y-1.5">
      <div class="flex items-center gap-1.5 font-semibold text-main">
        <Info size={14} class="text-primary shrink-0" />
        <span>Ketentuan Peninjauan Desain</span>
      </div>
      <p class="text-secondary leading-relaxed pl-5">
        Template akan ditinjau tim kurator sebelum terbit ke katalog publik. Konfigurasi template akan dikunci sementara selama peninjauan berlangsung.
      </p>
    </div>

    <!-- Clean Commission Breakdown Card -->
    <div class="rounded-xl border border-light bg-card p-4 space-y-3">
      <div class="flex items-center justify-between pb-1">
        <span class="font-semibold text-main text-xs">
          Rincian Pembagian Hasil
        </span>
        <button
          type="button"
          class="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1.5 p-1 -mr-1 rounded hover:bg-nested disabled:opacity-50 cursor-pointer"
          disabled={isLoadingFee}
          on:click={fetchCommissionSettings}
          title="Sinkronkan data komisi terbaru"
        >
          <RefreshCw size={12} class={isLoadingFee ? 'animate-spin text-primary' : ''} />
          <span>{isLoadingFee ? 'Memperbarui...' : 'Sinkronkan'}</span>
        </button>
      </div>

      <!-- Ratio Indicator -->
      <div class="grid grid-cols-2 gap-2 text-center">
        <div class="bg-nested/60 rounded-lg py-2 px-3 border border-light/60">
          <span class="text-xs-dense text-muted block">Fee Platform</span>
          <span class="text-sm font-bold text-main font-mono">{platformFeePercentage}%</span>
        </div>
        <div class="bg-nested/60 rounded-lg py-2 px-3 border border-light/60">
          <span class="text-xs-dense text-muted block">Hak Desainer</span>
          <span class="text-sm font-bold text-success font-mono">{designerPercentage}%</span>
        </div>
      </div>

      <!-- Line items -->
      <div class="pt-1 border-t border-light/80 space-y-1.5">
        <div class="flex justify-between items-center text-secondary">
          <span>Harga Jual Template</span>
          <span class="font-semibold text-main font-mono">
            {templatePrice > 0 ? formatIDR(templatePrice) : 'Gratis (Rp 0)'}
          </span>
        </div>

        {#if templatePrice > 0}
          <div class="flex justify-between items-center text-muted">
            <span>Potongan Fee ({platformFeePercentage}%)</span>
            <span class="font-mono">-{formatIDR(platformFeeAmount)}</span>
          </div>
          <div class="border-t border-light/80 pt-2 flex justify-between items-center">
            <span class="font-medium text-main">Estimasi Diterima Desainer</span>
            <span class="font-bold text-success font-mono text-sm">
              {formatIDR(designerAmount)}
            </span>
          </div>
        {:else}
          <p class="text-muted italic pt-0.5 text-xs-dense">
            *Template gratis tidak dikenakan potongan fee platform.
          </p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Modal Footer Actions -->
  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={isSubmitting}
      on:click={handleClose}
    >
      Batal
    </Button>
    <Button
      variant="primary"
      size="sm"
      loading={isSubmitting}
      disabled={isSubmitting}
      on:click={handleSubmit}
    >
      <Send size={13} class="mr-1" />
      <span>Ya, Ajukan Sekarang</span>
    </Button>
  </svelte:fragment>
</Modal>