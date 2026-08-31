<script lang="ts">
  import type { AdminUserItem } from '@/types';
  import { Modal, Button, Textarea } from '@/components/ui';
  
  export let isOpen = false;
  export let isUnsuspend = false;
  export let selectedUser: AdminUserItem | null = null;
  export let suspendReason = '';
  export let actionLoading = false;
  export let onSubmit: (status: 'active' | 'suspended', reason?: string) => void = () => {};
  export let onClose: () => void = () => {};

  function handleSubmit(status: 'active' | 'suspended') {
    onSubmit(status, suspendReason);
  }
</script>

<Modal
  open={isOpen && !!selectedUser}
  title={isUnsuspend ? 'Aktifkan Pengguna' : 'Tangguhkan Pengguna'}
  description={isUnsuspend 
    ? `Apakah Anda yakin ingin mengaktifkan kembali akun ${selectedUser?.name}?` 
    : `Berikan alasan penangguhan untuk akun ${selectedUser?.name}:`}
  size="sm"
  on:close={onClose}
>
  <div class="space-y-4">
    {#if !isUnsuspend}
      <Textarea 
        bind:value={suspendReason} 
        placeholder="Alasan penangguhan (min 5 karakter)..." 
        fullWidth
        disabled={actionLoading}
      />
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="ghost"
      size="sm"
      on:click={onClose}
      disabled={actionLoading}
    >
      Batal
    </Button>
    {#if isUnsuspend}
      <Button
        variant="primary"
        class="!bg-success hover:!bg-success/90"
        size="sm"
        loading={actionLoading}
        on:click={() => handleSubmit('active')}
      >
        Aktifkan Akun
      </Button>
    {:else}
      <Button
        variant="destructive"
        size="sm"
        loading={actionLoading}
        disabled={suspendReason.trim().length < 5}
        on:click={() => handleSubmit('suspended')}
      >
        Tangguhkan
      </Button>
    {/if}
  </svelte:fragment>
</Modal>
