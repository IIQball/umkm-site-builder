<script lang="ts">
  import { FileText } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Modal, Button } from '@/components/ui';

  export let isOpen = false;
  export let selectedUser: AdminUserItem | null = null;
  export let onClose: () => void = () => {};
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
  {#if selectedUser}
    <div class="flex flex-col items-center text-center pt-6">
      <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 ring-8 ring-primary/5">
        <FileText size={32} strokeWidth={2.5} />
      </div>
      <h3 class="text-heading-sm font-bold text-main mb-2">Alasan Penangguhan</h3>
      <p class="text-body-sm text-secondary leading-relaxed mb-6">
        Informasi penangguhan untuk akun <strong class="text-main">{selectedUser.name}</strong>
      </p>
      
      <div class="w-full text-left bg-nested border border-light rounded-2xl p-5 shadow-2xs">
        <p class="text-sm font-medium text-main leading-relaxed whitespace-pre-wrap">{selectedUser.suspendReason}</p>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <div class="flex w-full -mt-2">
      <Button
        variant="secondary"
        class="w-full font-bold"
        size="md"
        on:click={onClose}
      >
        Tutup
      </Button>
    </div>
  </svelte:fragment>
</Modal>
