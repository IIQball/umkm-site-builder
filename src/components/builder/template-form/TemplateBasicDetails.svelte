<script lang="ts">
  import { Input, Badge } from '@/components/ui';
  import ImageUpload from '@/components/shared/ImageUpload.svelte';

  export let name: string = '';
  export let loading: boolean = false;
  export let categories: Array<{ id: string; name: string; icon?: string | null }> = [];
  export let selectedCategoryId: string = '';
  export let loadingCategories: boolean = false;
  export let thumbnailUrl: string = '';
</script>

<!-- Template Name Input -->
<div class="space-y-1.5">
  <div class="flex items-center justify-between">
    <label for="tmpl-name" class="text-label-caps text-muted font-bold">
      Nama Template Desain <span class="text-error">*</span>
    </label>
    <span class="text-3xs text-muted font-mono">{name.length}/60 karakter</span>
  </div>
  <Input
    id="tmpl-name"
    placeholder="Contoh: Template Resto & Kuliner Nusantara"
    bind:value={name}
    disabled={loading}
    maxLength={60}
    className="font-semibold"
  >
    <span slot="prefix" class="material-symbols-outlined text-base text-muted select-none">
      palette
    </span>
  </Input>
</div>

<!-- Category Pills strictly from DB -->
<div class="space-y-2">
  <span class="text-label-caps text-muted font-bold block">Kategori & Ceruk Usaha</span>
  {#if loadingCategories}
    <div class="flex items-center gap-2 text-xs text-muted py-2">
      <span class="material-symbols-outlined text-sm animate-spin">refresh</span>
      <span>Memuat kategori...</span>
    </div>
  {:else if categories.length === 0}
    <p class="text-xs text-muted italic py-1">Belum ada kategori template di database.</p>
  {:else}
    <div class="flex flex-wrap gap-2">
      {#each categories as cat}
        <button
          type="button"
          on:click={() => (selectedCategoryId = cat.id)}
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border {selectedCategoryId ===
          cat.id
            ? 'bg-primary text-white border-primary shadow-2xs'
            : 'bg-nested/80 border-light text-secondary hover:text-main'}"
        >
          <span class="material-symbols-outlined text-sm">{cat.icon || 'folder'}</span>
          <span>{cat.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<!-- Thumbnail Upload Section -->
<div class="space-y-2 bg-nested/40 border border-light rounded-2xl p-4">
  <div class="flex items-center justify-between">
    <span class="text-label-caps text-muted font-bold block">
      Thumbnail Sampul Template (Opsional)
    </span>
    {#if thumbnailUrl}
      <Badge variant="emerald" size="sm" dot>Gambar Terpasang</Badge>
    {/if}
  </div>
  <ImageUpload
    folder="templates"
    maxFiles={1}
    maxSizeMB={5}
    existingUrls={thumbnailUrl ? [thumbnailUrl] : []}
    onUpload={(urls) => {
      thumbnailUrl = urls[0] || '';
    }}
  />
</div>
