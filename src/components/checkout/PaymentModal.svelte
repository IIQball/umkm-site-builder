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
  class="modal modal-bottom sm:modal-middle backdrop-blur-xs"
  on:cancel={(e) => {
    e.preventDefault();
    closeModal();
  }}
>
  <div class="modal-box max-w-3xl w-full h-[85vh] max-h-[750px] flex flex-col p-0 overflow-hidden bg-card border border-light shadow-2xl rounded-3xl animate-scale-in">
    <!-- Header -->
    <div class="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-light bg-card z-20">
      <div class="flex items-center gap-2.5 text-sm font-bold text-main font-heading">
        <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <span class="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <span>Kanal Pembayaran Terenkripsi</span>
      </div>
      <button
        type="button"
        class="w-8 h-8 rounded-xl flex items-center justify-center text-secondary hover:text-main hover:bg-nested active:scale-95 transition-all cursor-pointer"
        on:click={closeModal}
        title="Tutup Halaman"
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
          title="Pembayaran"
          allow="payment"
        />
      {:else}
        <div class="flex flex-col items-center justify-center h-full gap-4 p-6">
          <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs text-secondary font-medium">Memuat halaman pembayaran...</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Backdrop -->
  <form method="dialog" class="modal-backdrop">
    <button type="submit" on:click|preventDefault={closeModal} />
  </form>
</dialog>

