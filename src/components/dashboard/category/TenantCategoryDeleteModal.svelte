<script lang="ts">
  import { Button, Modal } from '@/components/ui';

  export let open: boolean = false;
  export let isDeleting: boolean = false;
  export let error: string | null = null;
  export let onDelete: () => void;
</script>

<Modal bind:open title="Konfirmasi Hapus">
  <div class="space-y-4">
    <p class="text-secondary text-sm">Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.</p>
    {#if error}
      <div class="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20 flex gap-2 text-sm animate-fade-in-up">
        <span class="material-symbols-outlined text-base">error</span>
        <p class="font-medium">{error}</p>
      </div>
    {/if}
  </div>
  <svelte:fragment slot="footer">
    <Button 
      variant="secondary"
      size="sm"
      on:click={() => (open = false)}
      disabled={isDeleting}
    >
      Batal
    </Button>
    <Button 
      variant="destructive"
      size="sm"
      on:click={onDelete}
      disabled={isDeleting}
      loading={isDeleting}
      className="font-bold"
    >
      Hapus Kategori
    </Button>
  </svelte:fragment>
</Modal>
