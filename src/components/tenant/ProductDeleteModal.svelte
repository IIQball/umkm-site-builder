<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let showModal = false;
  export let deletingId: string | null = null;

  const dispatch = createEventDispatcher();
  
  let dialogElement: HTMLDialogElement;
  let deleteLoading = false;

  $: if (dialogElement) {
    if (showModal) {
      if (!dialogElement.open) dialogElement.showModal();
    } else {
      if (dialogElement.open) dialogElement.close();
    }
  }

  const closeModal = () => {
    showModal = false;
  }

  const confirmDelete = async () => {
    if (!deletingId) return;
    deleteLoading = true;
    try {
      const res = await fetch(`/api/products/${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        closeModal();
        dispatch('success');
      } else {
        alert('Gagal menghapus: ' + data.error.message);
      }
    } catch (e: unknown) {
      alert('Error: ' + (e instanceof Error ? e.message : 'Terjadi kesalahan'));
    } finally {
      deleteLoading = false;
      deletingId = null;
    }
  }
</script>

<dialog class="modal backdrop-blur-sm" bind:this={dialogElement} on:close={closeModal}>
  <div class="modal-box rounded-2xl p-6 md:p-8">
    <h3 class="font-bold text-xl text-base-content tracking-tight mb-2">Hapus Produk</h3>
    <p class="py-4 text-base-content/70">Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.</p>
    <div class="modal-action mt-6">
      <button class="btn btn-ghost rounded-xl" on:click={closeModal}>Batal</button>
      <button class="btn bg-error hover:bg-error/90 text-white border-none shadow-sm rounded-xl px-6" on:click={confirmDelete} disabled={deleteLoading}>
        {#if deleteLoading}
          <span class="loading loading-spinner"></span>
        {/if}
        Hapus
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
