<script lang="ts">
  import { Button, Modal, Input } from '@/components/ui';

  export let open: boolean = false;
  export let isEditing: boolean = false;
  export let formName: string = '';
  export let isSaving: boolean = false;
  export let error: string | null = null;
  export let onSave: () => void;
</script>

<Modal bind:open title={isEditing ? 'Edit Kategori' : 'Tambah Kategori'}>
  <div class="space-y-5">
    <p class="text-sm text-secondary">Tambahkan kategori barang yang tersedia di toko Anda</p>
    {#if error}
      <div class="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20 flex gap-2 text-sm animate-fade-in-up">
        <span class="material-symbols-outlined text-base">error</span>
        <p class="font-medium">{error}</p>
      </div>
    {/if}

    <Input 
      label="Nama Kategori"
      placeholder="Contoh: Makanan, Minuman" 
      bind:value={formName}
      disabled={isSaving}
      required
    />
  </div>

  <svelte:fragment slot="footer">
    <Button 
      variant="secondary"
      size="sm"
      on:click={() => (open = false)}
      disabled={isSaving}
    >
      Batal
    </Button>
    <Button 
      variant="dark"
      size="sm"
      on:click={onSave}
      disabled={isSaving || !formName.trim()}
      loading={isSaving}
      className="font-bold"
    >
      Simpan Kategori
    </Button>
  </svelte:fragment>
</Modal>
