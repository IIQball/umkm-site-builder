<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ConfirmModalState } from './whitelist.types';
  import { Modal, Button, Textarea } from '@/components/ui';

  export let modalState: ConfirmModalState | null = null;
  export let isActionLoading = false;

  const dispatch = createEventDispatcher<{
    close: void;
    confirm: { reason?: string };
  }>();

  let suspendReason = '';

  $: if (!modalState) {
    suspendReason = ''; // reset when modal closes
  }

  const close = () => dispatch('close');
  
  const confirm = () => {
    dispatch('confirm', { 
      reason: (modalState?.type === 'toggle' && modalState.currentStatus === 'active') ? suspendReason : undefined 
    });
  };

  $: isSuspendAction = modalState?.type === 'toggle' && modalState.currentStatus === 'active';
  $: isUnsuspendAction = modalState?.type === 'toggle' && modalState.currentStatus === 'suspended';
  $: isRemoveAction = modalState?.type === 'remove';

  $: modalTitle = isRemoveAction ? 'Hapus Permanen?' : (isSuspendAction ? 'Tangguhkan Admin?' : 'Aktifkan Kembali?');
  $: modalDescription = isRemoveAction 
    ? `Anda akan menghapus profil ${modalState?.adminName} secara permanen. Semua data akses tidak dapat dikembalikan.`
    : (isSuspendAction 
        ? `Akses login untuk ${modalState?.adminName} akan ditangguhkan. Silakan berikan alasan penangguhan:`
        : `Akses login untuk ${modalState?.adminName} akan dipulihkan. Mereka dapat masuk ke sistem kembali.`);

  $: isConfirmDisabled = isActionLoading || (isSuspendAction && suspendReason.trim().length < 5);
</script>

<Modal
  open={!!modalState}
  title={modalTitle}
  description={modalDescription}
  size="sm"
  on:close={close}
>
  <div class="space-y-4">
    {#if isSuspendAction}
      <Textarea 
        bind:value={suspendReason} 
        placeholder="Alasan penangguhan (min 5 karakter)..." 
        fullWidth
        disabled={isActionLoading}
      />
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="ghost"
      size="sm"
      on:click={close}
      disabled={isActionLoading}
    >
      Batal
    </Button>
    
    {#if isRemoveAction}
      <Button
        variant="destructive"
        size="sm"
        disabled={isActionLoading}
        loading={isActionLoading}
        on:click={confirm}
      >
        Hapus
      </Button>
    {:else if isSuspendAction}
      <Button
        variant="destructive"
        size="sm"
        disabled={isConfirmDisabled}
        loading={isActionLoading}
        on:click={confirm}
      >
        Tangguhkan
      </Button>
    {:else if isUnsuspendAction}
      <Button
        variant="primary"
        class="!bg-success hover:!bg-success/90"
        size="sm"
        disabled={isActionLoading}
        loading={isActionLoading}
        on:click={confirm}
      >
        Aktifkan
      </Button>
    {/if}
  </svelte:fragment>
</Modal>
