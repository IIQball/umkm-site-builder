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
  export let status: string = 'draft';
  export let rejectionReason: string | null | undefined = undefined;
  export let revisionCount: number = 0;
  export let initialPlatformFeePercentage: number = 30;
  export let onClose: () => void = () => {};
  export let onConfirm: (revisionNotes?: string) => Promise<boolean | void> = async () => {};

  let platformFeePercentage: number = initialPlatformFeePercentage;
  let maxRevisions: number = 3;
  let revisionNotes: string = '';
  let isLoadingFee: boolean = false;
  let isSubmitting: boolean = false;
  let errorMessage: string | null = null;
  let wasOpen: boolean = false;

  $: isRejected = status === 'rejected' || Boolean(rejectionReason);
  $: isLimitReached = isRejected && revisionCount >= maxRevisions;
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
        if (data.ok && data.data) {
          if (typeof data.data.platformFeePercentage === 'number') {
            platformFeePercentage = data.data.platformFeePercentage;
          }
          if (typeof data.data.maxTemplateRevisions === 'number') {
            maxRevisions = data.data.maxTemplateRevisions;
          }
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
      revisionNotes = '';
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
    if (isLimitReached) {
      errorMessage = `Batas pengajuan revisi telah tercapai (maksimal ${maxRevisions} kali). Template tidak dapat diajukan ulang.`;
      return;
    }
    if (isRejected && revisionNotes.trim().length < 5) {
      errorMessage = 'Mohon berikan penjelasan perbaikan yang telah Anda buat (minimal 5 karakter).';
      return;
    }
    isSubmitting = true;
    errorMessage = null;
    try {
      await onConfirm(isRejected ? revisionNotes.trim() : undefined);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Gagal mengajukan template untuk kurasi';
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Modal
  bind:open={isOpen}
  title={isRejected ? 'Ajukan Ulang Revisi Template' : 'Ajukan Template untuk Kurasi'}
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

    <!-- Previous Rejection Alert -->
    {#if isRejected && rejectionReason}
      <div class="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3.5 space-y-1.5">
        <div class="flex items-center justify-between gap-1.5 font-bold text-rose-600 dark:text-rose-400">
          <div class="flex items-center gap-1.5">
            <AlertCircle size={14} class="shrink-0" />
            <span>Alasan Penolakan Kurator</span>
          </div>
          <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-rose-500/15">
            Revisi ke-{revisionCount + 1}/{maxRevisions}
          </span>
        </div>
        <p class="text-secondary leading-relaxed pl-5 whitespace-pre-wrap">
          {rejectionReason}
        </p>
      </div>
    {/if}

    <!-- Revision Notes Form Input -->
    {#if isRejected}
      <div class="rounded-xl border border-light bg-card p-3.5 space-y-2">
        <label for="revision-notes-input" class="block font-semibold text-main text-xs">
          Penjelasan Perbaikan Desain <span class="text-rose-500">*</span>
        </label>
        <textarea
          id="revision-notes-input"
          bind:value={revisionNotes}
          disabled={isSubmitting || isLimitReached}
          rows="3"
          class="w-full bg-nested border border-light rounded-xl p-3 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
          placeholder="Jelaskan perbaikan apa saja yang telah Anda buat berdasarkan catatan kurator di atas..."
          maxlength="500"
        ></textarea>
        <div class="flex justify-between items-center text-xs text-muted">
          <span>Wajib diisi minimal 5 karakter</span>
          <span class="font-mono">{revisionNotes.length}/500</span>
        </div>
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
      disabled={isSubmitting || isLimitReached}
      on:click={handleSubmit}
    >
      <Send size={13} class="mr-1" />
      <span>{isRejected ? 'Kirim Revisi Sekarang' : 'Ya, Ajukan Sekarang'}</span>
    </Button>
  </svelte:fragment>
</Modal>