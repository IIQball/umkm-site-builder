<script lang="ts">
  import { Modal, Button } from '@/components/ui';

  export let selectedRejection: {
    id: string;
    name: string;
    reason: string;
    revisionCount?: number;
  } | null = null;
  export let onClose: () => void;

  let maxRevisions = 3;
  let isLoadingLimit = false;

  const loadRealTimeLimit = async () => {
    try {
      isLoadingLimit = true;
      const res = await fetch('/api/public/commission');
      const json = await res.json();
      if (json.ok && json.data?.maxTemplateRevisions !== undefined) {
        maxRevisions = Number(json.data.maxTemplateRevisions);
      }
    } catch {
      // Keep default 3
    } finally {
      isLoadingLimit = false;
    }
  };

  $: if (selectedRejection) {
    loadRealTimeLimit();
  }

  $: revisionCount = selectedRejection?.revisionCount ?? 0;
  $: remainingRevisions = Math.max(0, maxRevisions - revisionCount);
  $: canRevise = remainingRevisions > 0;
</script>

<Modal
  open={!!selectedRejection}
  size="md"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">feedback</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Alasan Penolakan Kurator
        </h3>
        <p class="text-2xs text-muted mt-0.5 truncate max-w-[260px]">
          {selectedRejection?.name}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4 pt-1">
    <!-- Catatan Kurasi -->
    <div class="space-y-1.5">
      <span class="text-xs uppercase tracking-wider font-bold text-muted font-heading">
        Catatan Penolakan
      </span>
      <div class="p-4 rounded-2xl bg-nested border border-light text-xs text-main leading-relaxed font-sans whitespace-pre-wrap">
        {selectedRejection?.reason}
      </div>
    </div>

    <!-- Real-Time Info Batas Revisi -->
    <div class="p-4 rounded-2xl border {canRevise ? 'bg-amber-500/10 border-amber-500/25 text-amber-950 dark:text-amber-200' : 'bg-rose-500/10 border-rose-500/25 text-rose-950 dark:text-rose-200'} space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-base {canRevise ? 'text-amber-500' : 'text-rose-500'}">
            {canRevise ? 'history_edu' : 'block'}
          </span>
          <span class="text-xs font-bold font-heading">
            {canRevise ? 'Ketentuan Pengajuan Revisi Desain' : 'Batas Pengajuan Revisi Habis'}
          </span>
        </div>
        {#if isLoadingLimit}
          <span class="text-xs text-muted animate-pulse">Memuat limit...</span>
        {:else}
          <span class="text-2xs font-mono font-bold px-2 py-0.5 rounded-full bg-card/80 border border-light">
            Maksimal {maxRevisions}x Revisi
          </span>
        {/if}
      </div>

      <p class="text-2xs leading-relaxed opacity-90">
        {#if canRevise}
          Template ini telah melalui <strong>{revisionCount} kali revisi</strong>. Anda masih memiliki <strong>{remainingRevisions} kali kesempatan</strong> untuk mengajukan perbaikan kembali ke tim kurasi.
        {:else}
          Template ini telah mencapai batas maksimal <strong>{maxRevisions} kali revisi</strong> dan tidak dapat diajukan ulang kembali.
        {/if}
      </p>
    </div>

    <!-- Modal Actions -->
    <div class="flex items-center justify-end gap-2 pt-2 border-t border-light">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold"
        on:click={onClose}
      >
        Tutup
      </Button>

      {#if canRevise && selectedRejection?.id}
        <Button
          href={`/builder/new?id=${selectedRejection.id}`}
          variant="primary"
          size="sm"
          className="rounded-xl font-bold"
        >
          <span class="material-symbols-outlined text-xs">edit</span>
          <span>Edit Ulang Template</span>
        </Button>
      {/if}
    </div>
  </div>
</Modal>
