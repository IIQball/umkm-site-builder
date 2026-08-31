<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { AlertTriangle } from 'lucide-svelte';
  import { Modal, Button } from '@/components/ui';

  export let open = false;
  export let templateName = '';
  export let currentTemplateName = '';
  export let loading = false;

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  function handleConfirm() {
    dispatch('confirm');
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<Modal {open} size="sm" on:close={handleCancel}>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <AlertTriangle size={20} />
      </div>
      <div>
        <h3 id="confirm-template-title" class="font-bold text-main text-base font-heading">
          Ganti Tema Toko?
        </h3>
        <p class="text-xs text-secondary mt-0.5 font-sans">
          Tampilan toko Anda akan disesuaikan dengan template baru.
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4">
    <p class="text-xs text-secondary leading-relaxed font-sans">
      Tampilan storefront Anda akan langsung berubah menggunakan desain template ini.
    </p>

    <div class="bg-nested/70 rounded-2xl p-4 space-y-2 text-xs border border-light font-sans">
      {#if currentTemplateName}
        <div class="flex justify-between items-center">
          <span class="text-secondary">Tema saat ini:</span>
          <span class="font-bold text-main">{currentTemplateName}</span>
        </div>
      {/if}
      <div class="flex justify-between items-center pt-1 border-t border-light/50">
        <span class="text-secondary">Tema baru:</span>
        <span class="font-bold text-primary">{templateName}</span>
      </div>
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      disabled={loading}
      on:click={handleCancel}
    >
      Batal
    </Button>
    <Button
      variant="primary"
      size="sm"
      loading={loading}
      disabled={loading}
      on:click={handleConfirm}
      className="font-bold"
    >
      Ya, Ganti Tema
    </Button>
  </svelte:fragment>
</Modal>
