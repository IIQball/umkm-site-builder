<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { AlertTriangle, Loader2, X } from 'lucide-svelte';

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

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open && !loading) {
      handleCancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <div
    class="modal modal-open"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-template-title"
    on:click={handleBackdropClick}
  >
    <div class="modal-box max-w-md">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
        on:click={handleCancel}
        disabled={loading}
        aria-label="Tutup"
      >
        <X size={16} />
      </button>

      <div class="flex items-start gap-3 mb-4">
        <div class="rounded-full bg-warning/15 p-2 shrink-0 mt-0.5">
          <AlertTriangle size={20} class="text-warning" />
        </div>
        <div>
          <h3 id="confirm-template-title" class="font-semibold text-lg">
            Ganti Tema Toko?
          </h3>
          <p class="text-sm text-base-content/60 mt-1">
            Tampilan toko Anda akan berubah sesuai template baru. Perubahan ini akan menimpa kustomisasi yang ada.
          </p>
        </div>
      </div>

      <div class="bg-base-200 rounded-xl p-4 space-y-2 text-sm">
        {#if currentTemplateName}
          <div class="flex justify-between">
            <span class="text-base-content/60">Tema saat ini</span>
            <span class="font-medium">{currentTemplateName}</span>
          </div>
        {/if}
        <div class="flex justify-between">
          <span class="text-base-content/60">Tema baru</span>
          <span class="font-medium text-primary">{templateName}</span>
        </div>
      </div>

      <div class="modal-action mt-6">
        <button
          class="btn btn-ghost"
          on:click={handleCancel}
          disabled={loading}
        >
          Batal
        </button>
        <button
          class="btn btn-primary"
          on:click={handleConfirm}
          disabled={loading}
        >
          {#if loading}
            <Loader2 size={16} class="animate-spin" />
            Menerapkan...
          {:else}
            Ya, Ganti Tema
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
