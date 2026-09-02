<script lang="ts">
  import { Modal, Button } from '@/components/ui';

  export let open: boolean = false;
  export let targetTemplates: Array<{ id: string; name: string }> = [];
  export let isDeleting: boolean = false;
  export let onConfirm: () => void;
  export let onClose: () => void;

  $: count = targetTemplates.length;
  $: isBatch = count > 1;
</script>

<Modal
  {open}
  title=""
  size="md"
  on:close={onClose}
>
  <div class="flex flex-col items-center text-center p-2">
    <!-- Destructive Icon Badge -->
    <div class="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center mb-4 ring-8 ring-rose-500/5">
      <span class="material-symbols-outlined text-3xl">delete_forever</span>
    </div>

    <h3 class="text-heading-md font-bold text-main mb-1.5 font-heading">
      {isBatch ? `Hapus Permanen ${count} Draf Template?` : 'Hapus Permanen Draf Template?'}
    </h3>

    <p class="text-body-sm text-secondary max-w-sm mb-4 font-sans">
      {#if isBatch}
        Sebanyak <strong class="text-main font-semibold">{count} draf template</strong> yang Anda pilih akan dihapus permanen dari sistem database.
      {:else if count === 1}
        Template draf <strong class="text-main font-semibold">"{targetTemplates[0]?.name}"</strong> akan dihapus permanen dari sistem database.
      {/if}
    </p>

    <!-- Warning Box -->
    <div class="w-full p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 text-left mb-5 flex items-start gap-3 text-xs">
      <span class="material-symbols-outlined text-rose-500 text-base mt-0.5 flex-shrink-0">warning</span>
      <div class="text-rose-800 dark:text-rose-300 leading-relaxed font-sans">
        <strong class="font-bold block mb-0.5">Peringatan Hard Delete:</strong>
        Tindakan ini tidak dapat dibatalkan. Seluruh data konfigurasi, token visual, dan konten draf akan hilang selamanya.
      </div>
    </div>

    <!-- If batch, show list of names -->
    {#if isBatch}
      <div class="w-full max-h-32 overflow-y-auto mb-4 p-2 bg-nested rounded-xl border border-light text-left space-y-1">
        {#each targetTemplates as tpl}
          <div class="text-xs text-main font-mono px-2 py-1 bg-card rounded-md border border-light flex items-center justify-between">
            <span class="truncate">{tpl.name}</span>
            <span class="text-3xs text-muted flex-shrink-0 ml-2">#{tpl.id.slice(0, 6)}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="md"
      className="rounded-xl font-bold"
      disabled={isDeleting}
      on:click={onClose}
    >
      Batal
    </Button>
    <Button
      variant="destructive"
      size="md"
      className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
      disabled={isDeleting}
      on:click={onConfirm}
    >
      <span class="material-symbols-outlined text-sm">
        {isDeleting ? 'progress_activity' : 'delete'}
      </span>
      <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Permanen'}</span>
    </Button>
  </svelte:fragment>
</Modal>
