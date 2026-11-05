<script lang="ts">
  import { Button, Modal, Input } from '@/components/ui';

  export let open: boolean = false;
  export let isEditing: boolean = false;
  export let formName: string = '';
  export let isSaving: boolean = false;
  export let error: string | null = null;
  export let onSave: () => void;
</script>

<Modal bind:open size="md">
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">{isEditing ? 'edit_note' : 'add_circle'}</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          {isEditing ? 'Ubah Kategori' : 'Tambah Kategori Baru'}
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          {isEditing ? 'Perbarui nama kategori yang sudah ada' : 'Tambahkan kategori barang yang tersedia di toko Anda'}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4 pt-1">
    {#if error}
      <div class="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20 flex gap-2 text-sm animate-fade-in-up">
        <span class="material-symbols-outlined text-base">error</span>
        <p class="font-medium">{error}</p>
      </div>
    {/if}

    <div class="space-y-1.5">
      <label for="cat_name" class="text-xs font-bold text-main block font-heading">
        Nama Kategori <span class="text-rose-500">*</span>
      </label>
      <Input 
        id="cat_name"
        placeholder="Contoh: Makanan, Minuman" 
        bind:value={formName}
        disabled={isSaving}
        required
      />
    </div>
  </div>

  <svelte:fragment slot="footer">
    <Button 
      variant="secondary"
      size="sm"
      className="rounded-xl font-bold"
      on:click={() => (open = false)}
      disabled={isSaving}
    >
      Batal
    </Button>
    <Button 
      variant="primary"
      size="sm"
      className="rounded-xl font-bold"
      on:click={onSave}
      disabled={isSaving || !formName.trim()}
      loading={isSaving}
    >
      {isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
    </Button>
  </svelte:fragment>
</Modal>
