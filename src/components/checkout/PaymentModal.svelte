<script lang="ts">
  export let paymentUrl: string = '';
  export let onClose: () => void = () => {};

  let modalElement: HTMLDialogElement;

  const closeModal = () => {
    onClose();
    modalElement?.close();
  };
</script>

<dialog
  bind:this={modalElement}
  id="payment_modal"
  class="modal modal-bottom sm:modal-middle"
  on:cancel={(e) => {
    e.preventDefault();
    closeModal();
  }}
>
  <div class="modal-box max-w-3xl w-full h-[85vh] max-h-[750px] flex flex-col p-0 overflow-hidden bg-card border border-light shadow-2xl rounded-2xl">
    <!-- Header -->
    <div class="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-light bg-card z-20">
      <div class="flex items-center gap-2 text-sm font-bold text-main">
        <span class="material-symbols-outlined text-primary text-[20px]">shield</span>
        Halaman Pembayaran Aman
      </div>
      <button
        type="button"
        class="btn btn-sm btn-circle btn-ghost text-secondary hover:text-main hover:bg-nested z-20 cursor-pointer"
        on:click={closeModal}
        title="Tutup"
      >
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>

    <!-- Content: iframe payment gateway -->
    <div class="flex-1 w-full relative overflow-hidden bg-nested">
      {#if paymentUrl}
        <iframe
          src={paymentUrl}
          class="absolute inset-0 w-full h-full border-none"
          title="Xendit Payment Gateway"
          allow="payment"
        />
      {:else}
        <div class="flex flex-col items-center justify-center h-full gap-4 p-6">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="text-xs text-muted">Memuat halaman pembayaran...</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Backdrop -->
  <form method="dialog" class="modal-backdrop">
    <button type="submit" on:click|preventDefault={closeModal} />
  </form>
</dialog>

