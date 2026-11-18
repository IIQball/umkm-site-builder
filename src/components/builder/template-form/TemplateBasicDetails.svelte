<script lang="ts">
  import { Input, Badge, SearchableSelect } from '@/components/ui';
  import ImageUpload from '@/components/ui/ImageUpload.svelte';

  export let name: string = '';
  export let loading: boolean = false;
  export let categories: Array<{ id: string; name: string; icon?: string | null }> = [];
  export let selectedCategoryId: string = '';
  export let loadingCategories: boolean = false;
  export let thumbnailUrl: string = '';

  $: categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
</script>

<!-- Template Name Input -->
<div class="space-y-1.5">
  <div class="flex items-center justify-between">
    <label for="tmpl-name" class="text-label-caps text-muted font-bold">
      Nama Template Desain <span class="text-error">*</span>
    </label>
    <span class="text-xs text-muted font-mono">{name.length}/60 karakter</span>
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

<!-- Category Searchable Dropdown strictly from DB -->
<div class="space-y-1.5">
  <div class="flex items-center justify-between">
    <label for="tmpl-category" class="text-label-caps text-muted font-bold">
      Kategori & Ceruk Usaha <span class="text-error">*</span>
    </label>
    {#if categories.length > 0}
      <span class="text-2xs text-muted font-mono">{categories.length} Kategori Tersedia</span>
    {/if}
  </div>

  {#if loadingCategories}
    <div class="flex items-center gap-2 text-xs text-muted py-2.5 px-3 bg-nested/40 rounded-xl border border-light">
      <span class="material-symbols-outlined text-sm animate-spin">refresh</span>
      <span>Memuat daftar kategori...</span>
    </div>
  {:else if categories.length === 0}
    <p class="text-xs text-muted italic py-1">Belum ada kategori template di database.</p>
  {:else}
    <SearchableSelect
      id="tmpl-category"
      bind:value={selectedCategoryId}
      options={categoryOptions}
      placeholder="Pilih kategori atau ceruk bisnis..."
      searchPlaceholder="Ketik untuk mencari kategori..."
      clearable={false}
      disabled={loading}
      size="md"
    />
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
