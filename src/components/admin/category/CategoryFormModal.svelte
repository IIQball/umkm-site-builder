<script lang="ts">
  import { Modal, Input, Textarea, Button } from '@/components/ui';

  export let showModal: boolean = false;
  export let isEditing: boolean = false;
  export let formName: string = '';
  export let formSlug: string = '';
  export let formDescription: string = '';
  export let formIcon: string = 'folder';
  export let formError: string | null = null;
  export let isSaving: boolean = false;
  export let iconOptions: Array<{ value: string; label: string }> = [];
  export let editTitle: string = 'Ubah Kategori Template';
  export let createTitle: string = 'Tambah Kategori Template Baru';
  export let editSubtitle: string = 'Perbarui informasi industri template';
  export let createSubtitle: string = 'Buat kategori industri baru untuk marketplace';
  export let namePlaceholder: string = 'Contoh: Kuliner & Minuman';
  export let descPlaceholder: string = 'Template yang cocok untuk restoran, cafe, kedai kopi, dan catering...';
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
        <h3 class="text-base font-extrabold text-main leading-tight">
          {isEditing ? editTitle : createTitle}
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          {isEditing ? editSubtitle : createSubtitle}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form on:submit={onSave} class="space-y-4 pt-1">
    {#if formError}
      <div class="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">error</span>
        <span>{formError}</span>
      </div>
    {/if}

    <Input
      id="cat_name"
      label="Nama Kategori"
      required
      value={formName}
      placeholder={namePlaceholder}
      size="sm"
      on:input={onNameInput}
    />

    <Input
      id="cat_slug"
      label="Slug URL"
      required
      bind:value={formSlug}
      placeholder="kuliner-dan-minuman"
      size="sm"
      class="font-mono"
    />

    <div class="space-y-1.5">
      <span class="block text-label-caps text-muted">
        Ikon Representatif (Google Material Symbols)
      </span>
      <div class="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-nested/50 rounded-2xl border border-light">
        {#each iconOptions as opt}
          <Button
            type="button"
            size="xs"
            variant={formIcon === opt.value ? 'primary' : 'outline'}
            class="!justify-start !p-2 !rounded-xl !h-auto !min-h-0 text-left truncate {formIcon === opt.value
              ? 'shadow-2xs font-bold'
              : 'hover:bg-nested border-light text-main'}"
            on:click={() => (formIcon = opt.value)}
          >
            <span class="material-symbols-outlined text-sm flex-shrink-0">{opt.value}</span>
            <span class="truncate">{opt.value}</span>
          </Button>
        {/each}
      </div>
    </div>

    <Textarea
      id="cat_desc"
      label="Deskripsi Singkat (Opsional)"
      bind:value={formDescription}
      placeholder={descPlaceholder}
      rows={2}
      class="text-xs"
    />

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
