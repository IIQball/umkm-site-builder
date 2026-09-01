<script lang="ts">
  import { Modal, Button } from '@/components/ui';

  export let showModal: boolean = false;
  export let deletingCategory: { id: string; name: string } | null = null;
  export let isDeleting: boolean = false;
  export let onClose: () => void;
  export let onConfirm: () => void;
</script>

<Modal
  bind:open={showModal}
  title="Konfirmasi Hapus Kategori"
  size="sm"
  on:close={onClose}
>
  <div class="space-y-4">
    <div class="p-4 rounded-2xl bg-danger/10 border border-danger/20 flex items-start gap-3">
      <span class="material-symbols-outlined text-danger text-xl mt-0.5">warning</span>
      <div class="space-y-1 text-body-sm">
        <p class="font-bold text-main">Apakah Anda yakin ingin menghapus kategori ini?</p>
        <p class="text-secondary">
          Kategori <strong class="text-main">{deletingCategory?.name}</strong> akan dihapus permanen. Template yang terkait kategori ini mungkin akan kehilangan label industrinya.
        </p>
      </div>
    </div>

    <div class="flex items-center justify-end gap-3 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isDeleting}
        on:click={onClose}
      >
        Batal
      </Button>
      <Button
        variant="destructive"
        size="sm"
        loading={isDeleting}
        disabled={isDeleting}
        on:click={onConfirm}
      >
        <span class="material-symbols-outlined text-sm mr-1">delete</span>
        Hapus Permanen
      </Button>
    </div>
  </div>
</Modal>
