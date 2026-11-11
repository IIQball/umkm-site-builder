<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Modal, Button } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import { apiFetch } from '@/lib/api/parse-response';

  export let showModal = false;
  export let deletingId: string | null = null;

  const dispatch = createEventDispatcher();
  let deleteLoading = false;

  const closeModal = () => {
    showModal = false;
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    deleteLoading = true;
    try {
      const result = await apiFetch(`/api/products/${deletingId}`, {
        method: 'DELETE',
        fallbackError: 'Gagal menghapus produk.',
      });
      if (result.success) {
        toast.success(result.message || 'Produk berhasil dihapus.');
        closeModal();
        window.dispatchEvent(new CustomEvent('quota-updated'));
        dispatch('success');
      } else {
        toast.error(result.message, 'Gagal Menghapus Produk');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan saat menghapus produk.');
    } finally {
      deleteLoading = false;
      deletingId = null;
    }
  };
</script>

<Modal open={showModal} size="sm" on:close={closeModal}>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-error/15 border border-error/25 text-error flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">delete</span>
      </div>
      <div>
        <h3 class="font-bold text-main text-heading-md font-heading leading-tight">
          Hapus Produk
        </h3>
        <p class="text-body-sm text-secondary mt-1 font-sans">
          Konfirmasi penghapusan data katalog produk
        </p>
      </div>
    </div>
  </svelte:fragment>

  <p class="text-body-base text-secondary leading-relaxed font-sans pt-1">
    Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
  </p>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={deleteLoading}
      on:click={closeModal}
    >
      Batal
    </Button>
    <Button
      variant="destructive"
      size="sm"
      loading={deleteLoading}
      disabled={deleteLoading}
      on:click={confirmDelete}
      className="font-bold px-6"
    >
      Hapus
    </Button>
  </svelte:fragment>
</Modal>
