<script lang="ts">
  import { FolderPlus, Edit3, AlertCircle } from 'lucide-svelte';
  import { Modal, Input, Textarea, Button } from '@/components/ui';
  import { slugify } from '@/lib/utils';
  import { iconOptions as defaultIconOptions } from './category.helpers';

  export let showModal: boolean = false;
  export let isEditing: boolean = false;
  export let formName: string = '';
  export let formSlug: string = '';
  export let formDescription: string = '';
  export let formIcon: string = 'folder';
  export let formError: string | null = null;
  export let isSaving: boolean = false;
  export let iconOptions: Array<{ value: string; label: string }> = defaultIconOptions;
  export let editTitle: string = 'Ubah Kategori Template';
  export let createTitle: string = 'Tambah Kategori Template Baru';
  export let editSubtitle: string = 'Perbarui informasi industri template';
  export let createSubtitle: string = 'Buat kategori industri baru untuk marketplace';
  export let namePlaceholder: string = 'Contoh: Kuliner & Minuman';
  export let descPlaceholder: string = 'Template yang cocok untuk restoran, cafe, kedai kopi, dan catering...';
  export let onSave: (e?: Event) => void;
  export let onClose: () => void;

  let isSlugManuallyEdited = false;

  $: if (!showModal) {
    isSlugManuallyEdited = false;
  }

  function handleNameInput() {
    if (!isEditing || !isSlugManuallyEdited) {
      formSlug = slugify(formName);
    }
  }

  function handleSlugInput() {
    isSlugManuallyEdited = true;
  }

  function resetSlugFromName() {
    isSlugManuallyEdited = false;
    formSlug = slugify(formName);
  }

  function handleSubmit(e?: Event) {
    if (e) e.preventDefault();
    if (!formSlug.trim() && formName.trim()) {
      formSlug = slugify(formName);
    }
    onSave(e);
  }
</script>

<Modal
  bind:open={showModal}
  size="md"
  on:close={onClose}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
        {#if isEditing}
          <Edit3 size={18} />
        {:else}
          <FolderPlus size={18} />
        {/if}
      </div>
      <div>
        <h3 class="text-heading-sm font-bold text-main leading-tight font-heading">
          {isEditing ? editTitle : createTitle}
        </h3>
        <p class="text-2xs text-secondary mt-0.5">
          {isEditing ? editSubtitle : createSubtitle}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form on:submit|preventDefault={handleSubmit} class="space-y-4 pt-1">
    {#if formError}
      <div class="alert alert-error text-xs rounded-xl shadow-2xs py-2 px-3 flex items-center gap-2">
        <AlertCircle size={15} class="shrink-0" />
        <span>{formError}</span>
      </div>
    {/if}

    <Input
      id="cat_name"
      label="Nama Kategori"
      required
      bind:value={formName}
      placeholder={namePlaceholder}
      size="sm"
      on:input={handleNameInput}
    />

    <Input
      id="cat_slug"
      label="Slug URL"
      required
      bind:value={formSlug}
      placeholder="kuliner-dan-minuman"
      size="sm"
      class="font-mono"
      on:input={handleSlugInput}
    >
      <svelte:fragment slot="suffix">
        {#if formName.trim()}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="!p-1 !h-auto text-primary font-medium hover:bg-transparent hover:underline"
            on:click={resetSlugFromName}
          >
            Auto dari nama
          </Button>
        {/if}
      </svelte:fragment>
    </Input>

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
            className="justify-start p-2 rounded-xl h-auto min-h-0 text-left truncate {formIcon === opt.value
              ? 'shadow-2xs font-bold'
              : 'hover:bg-nested border-light text-main'}"
            on:click={() => (formIcon = opt.value)}
          >
            <span class="material-symbols-outlined text-sm flex-shrink-0">{opt.value}</span>
            <span class="truncate">{opt.label.split(' ')[0]}</span>
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

    <button type="submit" class="hidden" aria-hidden="true" tabindex="-1"></button>
  </form>

  <svelte:fragment slot="footer">
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
      type="button"
      variant="primary"
      size="sm"
      className="rounded-xl font-bold"
      disabled={isSaving}
      on:click={() => handleSubmit()}
    >
      {isSaving ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
    </Button>
  </svelte:fragment>
</Modal>
