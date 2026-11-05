<script lang="ts">
  import Modal from "@/components/ui/Modal.svelte";
  import Button from "@/components/ui/Button.svelte";

  export let notificationToDelete: string | null = null;
  export let onConfirm: (id: string) => void;
  export let onCancel: () => void;

  function stopEvent(e?: unknown) {
    if (!e || typeof e !== "object") return;
    const evt = e as {
      stopPropagation?: () => void;
      stopImmediatePropagation?: () => void;
      detail?: {
        stopPropagation?: () => void;
        stopImmediatePropagation?: () => void;
      };
    };
    evt.stopPropagation?.();
    evt.stopImmediatePropagation?.();
    evt.detail?.stopPropagation?.();
    evt.detail?.stopImmediatePropagation?.();
  }

  function handleConfirm(e?: unknown) {
    stopEvent(e);
    if (!notificationToDelete) return;
    const id = notificationToDelete;
    notificationToDelete = null;
    onConfirm(id);
  }

  function handleCancel(e?: unknown) {
    stopEvent(e);
    notificationToDelete = null;
    onCancel();
  }
</script>

<Modal
  open={!!notificationToDelete}
  title="Hapus Notifikasi?"
  size="xs"
  borderless
  on:close={handleCancel}
>
  <p class="text-sm text-secondary leading-relaxed">
    Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
  </p>
  <svelte:fragment slot="footer">
    <div class="flex items-center justify-end gap-2">
      <Button variant="secondary" on:click={handleCancel}>Batal</Button>
      <Button
        variant="destructive"
        on:click={handleConfirm}
      >
        Ya, Hapus
      </Button>
    </div>
  </svelte:fragment>
</Modal>
