<script lang="ts">
  import { Modal } from '@/components/ui';

  export let open: boolean = false;
  export let paymentUrl: string = '';
  export let onClose: () => void = () => {};

  const closeModal = () => {
    open = false;
    onClose();
  };

  export function showModal() {
    open = true;
  }
</script>

<Modal
  {open}
  size="xl"
  bodyPadding={false}
  showCloseButton={true}
  on:close={closeModal}
  class="max-w-3xl w-full h-[85vh] max-h-[750px]"
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-2.5 text-sm font-bold text-main font-heading">
      <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px]">verified_user</span>
      </div>
      <span>Kanal Pembayaran Terenkripsi</span>
    </div>
  </svelte:fragment>

  <!-- Content: iframe payment gateway -->
  <div class="w-full h-full min-h-[500px] relative overflow-hidden bg-nested">
    {#if paymentUrl}
      <iframe
        src={paymentUrl}
        class="absolute inset-0 w-full h-full border-none"
        title="Pembayaran"
        allow="payment"></iframe>
    {:else}
      <div class="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div class="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-secondary font-medium">Memuat halaman pembayaran...</p>
      </div>
    {/if}
  </div>
</Modal>

