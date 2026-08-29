<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Send,
    X,
    ShieldCheck,
    AlertCircle,
    Info,
    CheckCircle2,
    Lock,
    Coins,
    Loader2,
  } from 'lucide-svelte';

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

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
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

{#if isOpen}
  <!-- DaisyUI Modal Container -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <div
    class="modal modal-open modal-bottom sm:modal-middle z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="submit-review-title"
  >
    <div class="modal-box max-w-lg w-full p-0 overflow-hidden bg-card border border-light shadow-2xl rounded-2xl flex flex-col max-h-[85vh]">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-light bg-nested/40 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 id="submit-review-title" class="font-bold text-sm sm:text-base text-main leading-tight">
              Ajukan Template untuk Kurasi
            </h3>
            <p class="text-xs text-muted truncate max-w-[280px] sm:max-w-xs mt-0.5" title={templateId ? `${templateName} (${templateId})` : templateName}>
              {templateName}
            </p>
          </div>
        </div>
        <button
          type="button"
          on:click={handleClose}
          disabled={isSubmitting}
          class="btn btn-ghost btn-xs btn-circle text-muted hover:text-main hover:bg-nested cursor-pointer disabled:opacity-30"
          title="Tutup dialog"
        >
          <X size={16} />
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 space-y-4 flex-1 overflow-y-auto min-h-0">
        <!-- Error Alert if any -->
        {#if errorMessage}
          <div class="alert alert-error text-xs rounded-xl shadow-xs py-2.5 px-3 flex items-start gap-2">
            <AlertCircle size={16} class="shrink-0 mt-0.5" />
            <span class="leading-relaxed">{errorMessage}</span>
          </div>
        {/if}

        <!-- Notice & Curation Process Card -->
        <div class="bg-nested/50 rounded-xl p-3.5 border border-light space-y-2.5">
          <div class="flex items-center gap-2 text-xs font-semibold text-main">
            <Info size={14} class="text-primary shrink-0" />
            <span>Alur Proses Kurasi & Peninjauan</span>
          </div>

          <ul class="text-xs text-secondary space-y-1.5 pl-1.5">
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
        <div class="bg-nested/30 rounded-xl p-4 border border-light shadow-xs">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Coins size={16} class="text-primary" />
              <h4 class="text-xs font-bold text-main uppercase tracking-wider">
                Skema Komisi Penjualan
              </h4>
            </div>
            {#if isLoadingFee}
              <span class="loading loading-spinner loading-xs text-primary"></span>
            {:else}
              <span class="badge badge-sm badge-info font-medium text-xs">
                Dinamis Aktif
              </span>
            {/if}
          </div>

          <!-- Split Percentages Grid -->
          <div class="grid grid-cols-2 gap-2 text-center mb-3">
            <div class="bg-card p-2.5 rounded-lg border border-light">
              <p class="text-xs text-muted font-medium">Potongan Fee Platform</p>
              <p class="text-base font-extrabold text-warning mt-0.5">
                {platformFeePercentage}%
              </p>
            </div>
            <div class="bg-card p-2.5 rounded-lg border border-success/30">
              <p class="text-xs text-success font-semibold">Hak Bersih Desainer</p>
              <p class="text-base font-extrabold text-success mt-0.5">
                {designerPercentage}%
              </p>
            </div>
          </div>

          <!-- Financial Calculation Simulation -->
          <div class="bg-card rounded-lg p-3 border border-light text-xs space-y-1.5">
            <div class="flex justify-between items-center text-xs text-secondary">
              <span>Harga Jual Template:</span>
              <span class="font-bold text-main">
                {templatePrice > 0 ? formatRupiah(templatePrice) : 'Gratis (Rp 0)'}
              </span>
            </div>

            {#if templatePrice > 0}
              <div class="flex justify-between items-center text-xs text-muted">
                <span>Fee Platform ({platformFeePercentage}%):</span>
                <span class="text-warning">-{formatRupiah(platformFeeAmount)}</span>
              </div>
              <div class="border-t border-light pt-1.5 flex justify-between items-center font-bold text-xs">
                <span class="text-success flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Estimasi Pendapatan Desainer:
                </span>
                <span class="text-success font-extrabold">
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
      <div class="px-6 py-4 bg-nested/40 border-t border-light flex items-center justify-end gap-2.5 shrink-0">
        <button
          type="button"
          on:click={handleClose}
          disabled={isSubmitting}
          class="btn btn-ghost btn-sm text-xs font-semibold px-4 rounded-xl border border-light hover:bg-nested transition-colors cursor-pointer disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          on:click={handleSubmit}
          disabled={isSubmitting}
          class="btn btn-primary btn-sm text-white text-xs font-semibold px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isSubmitting}
            <Loader2 size={14} class="animate-spin" />
            <span>Mengajukan...</span>
          {:else}
            <Send size={13} />
            <span>Ya, Ajukan Sekarang</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
