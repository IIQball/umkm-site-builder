<script lang="ts">
  import { CheckCircle2, XCircle } from 'lucide-svelte';
  import { Modal, Button, Textarea } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';
  import type { AdminTemplateItem } from './review.types';

  export let approveModalOpen: boolean = false;
  export let rejectModalOpen: boolean = false;
  export let revisionNotesModalOpen: boolean = false;
  export let selectedTemplate: AdminTemplateItem | null = null;
  export let rejectionReason: string = '';
  export let actionLoading: boolean = false;
  export let onClose: () => void;
  export let onSubmitReview: (action: 'approve' | 'reject') => void;
  export let onOpenApproveFromNotes: (() => void) | undefined = undefined;
  export let onOpenRejectFromNotes: (() => void) | undefined = undefined;
</script>

<!-- Approve Modal -->
<Modal
  bind:open={approveModalOpen}
  size="sm"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Setujui Template Desain
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Publikasikan template ke marketplace UMKM
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if selectedTemplate}
    <div class="space-y-4 pt-1">
      <p class="text-xs text-secondary leading-relaxed font-sans">
        Apakah Anda yakin ingin menyetujui template <strong class="text-main">{selectedTemplate.name}</strong> karya <strong class="text-main">{selectedTemplate.designerName || selectedTemplate.designerEmail}</strong>? Template ini akan langsung dapat dibeli dan digunakan oleh semua tenant UMKM.
      </p>

      <div class="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={onClose}
          disabled={actionLoading}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={() => onSubmitReview('approve')}
          disabled={actionLoading}
        >
          {actionLoading ? 'Menyetujui...' : 'Konfirmasi Setujui'}
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<!-- Reject Modal -->
<Modal
  bind:open={rejectModalOpen}
  size="md"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <XCircle size={20} />
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Tolak / Minta Revisi Template
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Kirimkan catatan kurasi kepada desainer
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if selectedTemplate}
    <div class="space-y-4 pt-1">
      <p class="text-xs text-secondary leading-relaxed font-sans">
        Tuliskan alasan penolakan atau perbaikan yang perlu dilakukan oleh desainer <strong class="text-main">{selectedTemplate.name}</strong>:
      </p>

      <Textarea
        bind:value={rejectionReason}
        placeholder="Contoh: Tata letak pada section hero kurang kontras pada mobile breakpoint..."
        rows={4}
        className="text-xs font-sans"
      />

      <div class="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={onClose}
          disabled={actionLoading}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-xl font-bold"
          on:click={() => onSubmitReview('reject')}
          disabled={actionLoading || rejectionReason.trim().length < 5}
        >
          {actionLoading ? 'Memproses...' : 'Kirim Penolakan'}
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<!-- Revision Notes Modal (1 Modal: Alasan Penolakan Admin + Balasan Desainer + Diajukan Kembali Pada) -->
<Modal
  bind:open={revisionNotesModalOpen}
  size="md"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">history_edu</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Catatan & Riwayat Revisi Template
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          {selectedTemplate?.name} • <span class="font-bold text-amber-600 dark:text-amber-400">Revisi #{selectedTemplate?.revisionCount || 1}</span>
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if selectedTemplate}
    <div class="space-y-4 pt-1">
      <!-- Diajukan Kembali Pada Info Pill -->
      <div class="p-3 rounded-2xl bg-nested border border-light flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 text-secondary">
          <span class="material-symbols-outlined text-sm text-primary">schedule</span>
          <span class="font-medium">Diajukan Kembali pada:</span>
        </div>
        <span class="font-mono font-bold text-main">
          {formatDate(selectedTemplate.updatedAt || selectedTemplate.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <!-- Alasan Penolakan Superadmin / Kurator -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 font-heading">
          <span class="material-symbols-outlined text-sm">cancel</span>
          <span>Alasan Penolakan Kurator Sebelumnya</span>
        </div>
        <div class="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-main leading-relaxed font-sans whitespace-pre-wrap">
          {selectedTemplate.rejectionReason || 'Tidak ada alasan penolakan awal yang tercantum.'}
        </div>
      </div>

      <!-- Balasan & Penjelasan Perbaikan dari Desainer -->
      <div class="space-y-1.5">
        <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary font-heading">
          <span class="material-symbols-outlined text-sm">edit_note</span>
          <span>Balasan / Rincian Perbaikan Desainer</span>
        </div>
        <div class="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-main leading-relaxed font-sans whitespace-pre-wrap">
          {selectedTemplate.revisionNotes || 'Desainer tidak menyertakan rincian teks perbaikan tambahan.'}
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-between gap-2 pt-3 border-t border-light">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={onClose}
        >
          Tutup
        </Button>

        {#if selectedTemplate.status === 'pending'}
          <div class="flex items-center gap-2">
            {#if onOpenRejectFromNotes}
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl font-bold"
                on:click={onOpenRejectFromNotes}
              >
                Tolak Lagi
              </Button>
            {/if}
            {#if onOpenApproveFromNotes}
              <Button
                variant="primary"
                size="sm"
                className="rounded-xl font-bold"
                on:click={onOpenApproveFromNotes}
              >
                Setujui Desain
              </Button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Modal>
