<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Card, Badge } from '@/components/ui';
  import { compressImageClient } from '@/lib/client-compressor';

  export let disabled: boolean = false;
  export let label: string = 'Foto Referensi Produk Asli';
  export let required: boolean = true;
  export let referenceImageBase64: string = '';
  export let originalFileName: string = '';
  export let originalFileSize: number = 0;
  export let compressedFileSize: number = 0;
  export let error: string = '';
  export let allowGalleryPicker: boolean = false;

  const dispatch = createEventDispatcher<{
    processed: { base64: string; compressedSize: number; originalFile: File };
    remove: void;
    error: string;
    pickGallery: void;
  }>();

  let isCompressing = false;
  let isDragging = false;
  let fileInputRef: HTMLInputElement;

  async function processSelectedFile(file: File) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const err = 'Pilih berkas gambar (JPG atau PNG) yang sesuai';
      dispatch('error', err);
      return;
    }

    isCompressing = true;
    try {
      const result = await compressImageClient(file);
      dispatch('processed', {
        base64: result.base64,
        compressedSize: result.size,
        originalFile: file,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memproses gambar';
      dispatch('error', message);
    } finally {
      isCompressing = false;
    }
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      processSelectedFile(input.files[0]);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      processSelectedFile(event.dataTransfer.files[0]);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleRemove() {
    if (fileInputRef) {
      fileInputRef.value = '';
    }
    dispatch('remove');
  }

  function handleContainerClick(e: MouseEvent) {
    if ((e.target as HTMLElement)?.closest('button')) return;
    fileInputRef.click();
  }

  function handleContainerKeydown(e: KeyboardEvent) {
    if ((e.target as HTMLElement)?.closest('button')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.click();
    }
  }
</script>

<div>
  <div class="flex items-center justify-between mb-2">
    <span class="block text-label-caps text-muted">
      {label} {#if required}<span class="text-error">*</span>{/if}
    </span>
    <span class="text-2xs text-muted">Otomatis Dioptimalkan (&lt; 2 MB)</span>
  </div>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    class="hidden"
    bind:this={fileInputRef}
    on:change={handleFileChange}
    {disabled}
  />

  {#if !referenceImageBase64}
    <div
      role="button"
      tabindex="0"
      class="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all {isDragging ? 'border-primary bg-primary/5' : 'border-light bg-nested hover:bg-nested/80'}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      on:click={handleContainerClick}
      on:keydown={handleContainerKeydown}
    >
      <div class="w-12 h-12 rounded-full bg-card border border-light flex items-center justify-center mx-auto mb-3 text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      {#if isCompressing}
        <div class="space-y-2">
          <p class="text-sm font-semibold text-main">Mengoptimalkan Foto...</p>
          <p class="text-2xs text-muted">Sedang merampingkan ukuran foto agar cepat diproses.</p>
        </div>
      {:else}
        <p class="text-sm font-semibold text-main mb-1">
          Klik untuk memilih foto produk atau seret ke sini
        </p>
        <p class="text-2xs text-secondary mb-2">
          Format JPG atau PNG. Foto otomatis disesuaikan agar pas dan jernih.
        </p>
        <div class="flex items-center justify-center gap-2">
          <Badge variant="secondary" size="sm" dot={false}>Maksimal 4 MB asli</Badge>
          {#if allowGalleryPicker}
            <Button
              type="button"
              variant="outline"
              size="xs"
              on:click={(e) => {
                e.stopPropagation();
                dispatch('pickGallery');
              }}
            >
              Pilih dari Galeri Mockup
            </Button>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <Card variant="bordered" padding="sm" radius="xl" class="flex flex-col sm:flex-row items-center gap-4 bg-card">
      <div class="relative w-24 h-24 rounded-xl overflow-hidden border border-light flex-shrink-0 bg-nested">
        <img
          src={referenceImageBase64}
          alt="Preview produk"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0 space-y-1 text-center sm:text-left">
        <p class="text-xs font-semibold text-main truncate" title={originalFileSize > 0 || compressedFileSize > 0 ? (originalFileName || 'Foto Produk') : undefined}>
          {originalFileName || 'Foto Produk Terunggah'}
        </p>
        <p class="text-2xs text-secondary pt-0.5">
          Foto siap digunakan untuk proses render AI.
        </p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button size="xs" variant="secondary" on:click={() => fileInputRef.click()} {disabled}>
          Ganti Foto
        </Button>
        <Button size="xs" variant="ghost" class="text-error" on:click={handleRemove} {disabled}>
          Hapus
        </Button>
      </div>
    </Card>
  {/if}

  {#if error}
    <p class="text-xs text-error mt-1.5">{error}</p>
  {/if}
</div>
