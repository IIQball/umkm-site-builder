<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Trash2, AlertTriangle, Loader2 } from 'lucide-svelte';

  export let isOpen = false;
  export let mode: 'single' | 'bulk' = 'single';
  export let templateName = '';
  export let targetTemplate: { name: string } | null = null;
  export let selectedCount = 0;
  export let isDeleting = false;
  export let onConfirm: (() => void) | undefined = undefined;
  export let onClose: (() => void) | undefined = undefined;

  $: displayName = templateName || targetTemplate?.name || '';

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  const handleConfirm = () => {
    if (isDeleting) return;
    if (onConfirm) onConfirm();
    dispatch('confirm');
  };

  const handleCancel = () => {
    if (isDeleting) return;
    if (onClose) onClose();
    dispatch('cancel');
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      handleCancel();
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen && !isDeleting) {
      handleCancel();
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:click={handleBackdropClick}
    on:keydown={(e) => { if (e.key === 'Escape') handleCancel(); }}
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-card border border-light rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4 text-left scale-100 transition-transform"
      role="document"
    >
      <!-- Header with Danger Icon -->
      <div class="flex items-start gap-3">
        <div class="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-inner">
          <Trash2 size={22} class="stroke-[2.2]" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base font-black text-main leading-snug">
            Hapus Template Secara Permanen?
          </h3>
          <p class="text-xs text-secondary mt-1 leading-relaxed">
            {#if mode === 'bulk'}
              Anda akan menghapus <strong class="text-main font-bold">{selectedCount} template</strong> yang dipilih secara permanen dari basis data.
            {:else}
              Apakah Anda yakin ingin menghapus template <strong class="text-main font-bold">"{displayName}"</strong> secara permanen?
            {/if}
          </p>
        </div>
      </div>

      <!-- Warning Callout -->
      <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-start gap-2.5 text-xs font-medium leading-relaxed">
        <AlertTriangle size={16} class="flex-shrink-0 mt-0.5 text-rose-600" />
        <span>Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</span>
      </div>

      <!-- Modal Action Buttons -->
      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-light mt-1">
        <button
          type="button"
          disabled={isDeleting}
          on:click={handleCancel}
          class="px-4 py-2 text-xs font-bold text-secondary hover:text-main border border-light hover:bg-nested rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="button"
          disabled={isDeleting}
          on:click={handleConfirm}
          class="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {#if isDeleting}
            <Loader2 size={14} class="animate-spin" />
            <span>Menghapus...</span>
          {:else}
            <Trash2 size={14} />
            <span>Ya, Hapus Permanen</span>
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
