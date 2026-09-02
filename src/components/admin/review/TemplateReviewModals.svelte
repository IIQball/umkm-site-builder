<script lang="ts">
  import { CheckCircle2, XCircle } from 'lucide-svelte';
  import { Modal, Button, Textarea } from '@/components/ui';
  import type { AdminTemplateItem } from './review.types';

  export let approveModalOpen: boolean = false;
  export let rejectModalOpen: boolean = false;
  export let selectedTemplate: AdminTemplateItem | null = null;
  export let rejectionReason: string = '';
  export let actionLoading: boolean = false;
  export let onClose: () => void;
  export let onSubmitReview: (action: 'approve' | 'reject') => void;
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
          className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700"
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
