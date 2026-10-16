<script lang="ts">
  import { AlertTriangle, Trash2 } from 'lucide-svelte';
  import { Modal, Button } from '@/components/ui';

  export let showModal: boolean = false;
  export let deletingCategory: { id: string; name: string } | null = null;
  export let isDeleting: boolean = false;
  export let warningText: string = 'Template yang terkait kategori ini mungkin akan kehilangan label industrinya.';
  export let onClose: () => void;
  export let onConfirm: () => void;
</script>

<Modal
  bind:open={showModal}
  size="sm"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-error/10 text-error flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Trash2 size={18} />
      </div>
      <div>
        <h3 class="font-heading font-bold text-heading-sm text-main leading-tight">
          Konfirmasi Hapus
        </h3>
        <p class="text-2xs text-secondary mt-0.5">
          Tindakan ini tidak dapat dibatalkan
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="p-4 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-3">
    <AlertTriangle size={18} class="text-error flex-shrink-0 mt-0.5" />
    <div class="space-y-1 text-sm">
      <p class="font-heading font-bold text-main text-xs">Apakah Anda yakin ingin menghapus kategori ini?</p>
      <p class="text-secondary text-xs leading-relaxed">
        Kategori <strong class="text-main font-semibold">{deletingCategory?.name}</strong> akan dihapus permanen. {warningText}
      </p>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      className="rounded-xl font-bold"
      disabled={isDeleting}
      on:click={onClose}
    >
      Batal
    </Button>
    <Button
      variant="destructive"
      size="sm"
      className="rounded-xl font-bold"
      loading={isDeleting}
      disabled={isDeleting}
      on:click={onConfirm}
    >
      <Trash2 size={13} class="mr-1" />
      Hapus Permanen
    </Button>
  </svelte:fragment>
</Modal>

