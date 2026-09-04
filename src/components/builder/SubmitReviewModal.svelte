<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Send,
    AlertCircle,
    Info,
    CheckCircle2,
    Lock,
    Coins,
  } from 'lucide-svelte';
  import { Modal, Button, Badge } from '@/components/ui';

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

  $: designerPercentage = Math.max(0, 100 - platformFeePercentage);

  $: platformFeeAmount = templatePrice > 0
    ? Math.round((templatePrice * platformFeePercentage) / 100)
    : 0;

  $: designerAmount = templatePrice > 0
    ? templatePrice - platformFeeAmount
    : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const fetchCommissionSettings = async () => {
    try {
      isLoadingFee = true;
      const res = await fetch('/api/public/commission');
      if (res.ok) {
        const data = await res.json();
        if (data.ok && typeof data.data?.platformFeePercentage === 'number') {
          platformFeePercentage = data.data.platformFeePercentage;
        }
      }
    } catch {
      // Keep default or initialPlatformFeePercentage
    } finally {
      isLoadingFee = false;
    }
  };

  onMount(() => {
    fetchCommissionSettings();
  });

  $: if (isOpen) {
    errorMessage = null;
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
  <div class="space-y-4">
    <!-- Error Alert if any -->
    {#if errorMessage}
      <div class="alert alert-error text-xs rounded-xl shadow-xs py-2.5 px-3 flex items-start gap-2">
        <AlertCircle size={16} class="shrink-0 mt-0.5" />
        <span class="leading-relaxed font-sans">{errorMessage}</span>
      </div>
    {/if}

    <!-- Notice & Curation Process Card -->
    <div class="bg-nested/50 rounded-2xl p-4 border border-light space-y-2.5">
      <div class="flex items-center gap-2 text-xs font-semibold text-main">
        <Info size={14} class="text-primary shrink-0" />
        <span class="font-heading">Alur Proses Kurasi & Peninjauan</span>
      </div>

      <ul class="text-xs text-secondary space-y-1.5 pl-1.5 font-sans">
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <span>Status template akan beralih menjadi <strong>"Menunggu Review"</strong>.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <span>Tim Admin akan meninjau kelayakan desain, tata letak responsif, dan konten template.</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
          <span class="flex items-center gap-1">
            <span>Selama peninjauan, template akan dikunci untuk pengeditan.</span>
            <Lock size={11} class="text-warning inline shrink-0" />
          </span>
        </li>
      </ul>
    </div>

    <!-- Dynamic Platform Commission Breakdown Card -->
    <div class="bg-nested/30 rounded-2xl p-4 border border-light shadow-xs">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <Coins size={16} class="text-primary" />
          <h4 class="text-xs font-bold text-main uppercase tracking-wider font-heading">
            Skema Komisi Penjualan
          </h4>
        </div>
        {#if isLoadingFee}
          <span class="loading loading-spinner loading-xs text-primary"></span>
        {:else}
          <Badge variant="sky" size="sm">
            Dinamis Aktif
          </Badge>
        {/if}
      </div>

      <!-- Split Percentages Grid -->
      <div class="grid grid-cols-2 gap-2 text-center mb-3">
        <div class="bg-card p-2.5 rounded-xl border border-light">
          <p class="text-xs text-muted font-medium font-sans">Potongan Fee Platform</p>
          <p class="text-base font-extrabold text-warning mt-0.5 font-mono">
            {platformFeePercentage}%
          </p>
        </div>
        <div class="bg-card p-2.5 rounded-xl border border-success/30">
          <p class="text-xs text-success font-semibold font-sans">Hak Bersih Desainer</p>
          <p class="text-base font-extrabold text-success mt-0.5 font-mono">
            {designerPercentage}%
          </p>
        </div>
      </div>

      <!-- Financial Calculation Simulation -->
      <div class="bg-card rounded-xl p-3 border border-light text-xs space-y-1.5 font-sans">
        <div class="flex justify-between items-center text-xs text-secondary">
          <span>Harga Jual Template:</span>
          <span class="font-bold text-main font-mono">
            {templatePrice > 0 ? formatRupiah(templatePrice) : 'Gratis (Rp 0)'}
          </span>
        </div>

        {#if templatePrice > 0}
          <div class="flex justify-between items-center text-xs text-muted">
            <span>Fee Platform ({platformFeePercentage}%):</span>
            <span class="text-warning font-mono">-{formatRupiah(platformFeeAmount)}</span>
          </div>
          <div class="border-t border-light pt-1.5 flex justify-between items-center font-bold text-xs">
            <span class="text-success flex items-center gap-1">
              <CheckCircle2 size={13} />
              Estimasi Pendapatan Desainer:
            </span>
            <span class="text-success font-extrabold font-mono">
              {formatRupiah(designerAmount)}
            </span>
          </div>
        {:else}
          <p class="text-xs text-muted italic pt-1">
            *Template gratis tidak dikenakan potongan biaya platform.
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

