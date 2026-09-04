<script lang="ts">
  import { Modal, Textarea, Button } from '@/components/ui';

  export let showModal: boolean = false;
  export let isEditing: boolean = false;
  export let formName: string = '';
  export let formSlug: string = '';
  export let formDescription: string = '';
  export let formIcon: string = 'folder';
  export let formError: string | null = null;
  export let isSaving: boolean = false;
  export let iconOptions: Array<{ value: string; label: string }> = [];
  export let onNameInput: (e: Event) => void;
  export let onSave: (e: Event) => void;
  export let onClose: () => void;
</script>

<Modal
  bind:open={showModal}
  size="md"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">{isEditing ? 'edit_note' : 'add_circle'}</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          {isEditing ? 'Ubah Kategori Template' : 'Tambah Kategori Template Baru'}
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          {isEditing ? 'Perbarui informasi industri template' : 'Buat kategori industri baru untuk marketplace'}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form on:submit={onSave} class="space-y-4 pt-1">
    {#if formError}
      <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-sans">
        {formError}
      </div>
    {/if}

    <div class="space-y-1.5">
      <label for="cat_name" class="text-xs font-bold text-main block font-heading">
        Nama Kategori <span class="text-rose-500">*</span>
      </label>
      <input
        id="cat_name"
        type="text"
        value={formName}
        on:input={onNameInput}
        placeholder="Contoh: Kuliner & Minuman"
        required
        class="w-full bg-nested/80 border border-light rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all font-sans"
      />
    </div>

    <div class="space-y-1.5">
      <label for="cat_slug" class="text-xs font-bold text-main block font-heading">
        Slug URL <span class="text-rose-500">*</span>
      </label>
      <input
        id="cat_slug"
        type="text"
        bind:value={formSlug}
        placeholder="kuliner-dan-minuman"
        required
        class="w-full bg-nested/80 border border-light rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-muted font-mono focus:outline-none focus:border-primary/50 focus:bg-card transition-all"
      />
    </div>

    <div class="space-y-1.5">
      <label for="cat_icon" class="text-xs font-bold text-main block font-heading">
        Ikon Representatif (Google Material Symbols)
      </label>
      <div class="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-nested/50 rounded-2xl border border-light">
        {#each iconOptions as opt}
          <button
            type="button"
            on:click={() => (formIcon = opt.value)}
            class="flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left {formIcon === opt.value
              ? 'bg-primary text-white border-primary shadow-2xs font-bold'
              : 'bg-card hover:bg-nested border-light text-main'}"
          >
            <span class="material-symbols-outlined text-sm flex-shrink-0">{opt.value}</span>
            <span class="truncate">{opt.value}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-1.5">
      <label for="cat_desc" class="text-xs font-bold text-main block font-heading">
        Deskripsi Singkat (Opsional)
      </label>
      <Textarea
        id="cat_desc"
        bind:value={formDescription}
        placeholder="Template yang cocok untuk restoran, cafe, kedai kopi, dan catering..."
        rows={2}
        className="text-xs font-sans"
      />
    </div>

    <div class="flex items-center justify-end gap-2 pt-3 border-t border-light">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold"
        on:click={onClose}
        disabled={isSaving}
      >
        Batal
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className="rounded-xl font-bold"
        disabled={isSaving}
      >
        {isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
      </Button>
    </div>
  </form>
</Modal>
