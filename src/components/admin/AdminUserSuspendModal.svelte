<script lang="ts">
  import type { AdminUserItem } from '@/types';
  import { Modal, Button, Textarea } from '@/components/ui';
  import { CheckCircle2, AlertTriangle } from 'lucide-svelte';
  
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
  title=""
  description=""
  size="sm"
  borderless={true}
  bodyPadding={true}
  on:close={onClose}
>
  {#if isUnsuspend}
    <div class="flex flex-col items-center text-center pt-6">
      <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 ring-8 ring-emerald-500/5">
        <CheckCircle2 size={32} strokeWidth={2.5} />
      </div>
      <h3 class="text-heading-sm font-bold text-main mb-2">Aktifkan Pengguna</h3>
      <p class="text-body-sm text-secondary leading-relaxed px-2">
        Apakah Anda yakin ingin mengaktifkan kembali akun <strong class="text-main">{selectedUser?.name}</strong>?
      </p>
    </div>
  {:else}
    <div class="flex flex-col items-center text-center pt-6">
      <div class="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 ring-8 ring-rose-500/5">
        <AlertTriangle size={32} strokeWidth={2.5} />
      </div>
      <h3 class="text-heading-sm font-bold text-main mb-2">Tangguhkan Pengguna</h3>
      <p class="text-body-sm text-secondary leading-relaxed px-2 mb-6">
        Berikan alasan penangguhan untuk akun <strong class="text-main">{selectedUser?.name}</strong>:
      </p>
      
      <div class="w-full text-left">
        <Textarea 
          bind:value={suspendReason} 
          placeholder="Alasan penangguhan (min 5 karakter)..." 
          fullWidth
          disabled={actionLoading}
        />
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex gap-3 w-full -mt-2">
      <Button
        variant="secondary"
        class="flex-1"
        size="md"
        on:click={onClose}
        disabled={actionLoading}
      >
        Batal
      </Button>
      {#if isUnsuspend}
        <Button
          variant="primary"
          class="flex-1 font-bold shadow-md shadow-primary/20"
          size="md"
          loading={actionLoading}
          on:click={() => handleSubmit('active')}
        >
          Aktifkan
        </Button>
      {:else}
        <Button
          variant="destructive"
          class="flex-1 font-bold shadow-md shadow-rose-500/20"
          size="md"
          loading={actionLoading}
          disabled={suspendReason.trim().length < 5}
          on:click={() => handleSubmit('suspended')}
        >
          Tangguhkan
        </Button>
      {/if}
    </div>
  </svelte:fragment>
</Modal>
