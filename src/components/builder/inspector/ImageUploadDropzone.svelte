<script lang="ts">
  import { UploadCloud, X, Loader2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from './imageUpload.helpers';

  export let imageUrl: string = '';
  export let onImageChange: (url: string) => void;
  export let label: string = 'Unggah Gambar';
  export let placeholderTitle: string = 'Tarik & Lepas Gambar ke Sini';
  export let placeholderSubtitle: string = 'atau pilih berkas manual';
  export let maxWidth: number = 1600;
  export let maxHeight: number = 1200;
  export let folder: string = 'templates';
  export let compact: boolean = false;

  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;
  let isDragging = false;

  async function processFile(file: File) {
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format berkas wajib JPG, JPEG, atau PNG';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal berkas sebelum dikompresi adalah 5MB';
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 25;
      const webpBlob = await compressToWebP(file, maxWidth, maxHeight);
      uploadProgress = 65;
      const url = await uploadToCloudinary(webpBlob, folder, `${Date.now()}_img.webp`);
      uploadProgress = 100;

      const oldUrl = imageUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }

      onImageChange(url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Unggah gambar gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  function handleFileInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!isUploading) isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (isUploading) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
      e.preventDefault();
      fileInput?.click();
    }
  }

  async function handleRemoveImage() {
    const oldUrl = imageUrl;
    onImageChange('');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-1.5 w-full text-left">
  {#if label}
    <div class="flex items-center justify-between">
      <span class="block font-medium text-[11px] text-base-content/70">
        {label}
      </span>
      {#if imageUrl}
        <span class="badge badge-success badge-xs font-bold">
          Tersedia
        </span>
      {/if}
    </div>
  {/if}

  {#if imageUrl}
    <div class={`relative group rounded-xl overflow-hidden bg-base-200/60 border border-base-300 shadow-sm flex items-center justify-center ${compact ? 'p-2 min-h-[60px]' : 'p-3 min-h-[80px]'}`}>
      <img
        src={imageUrl}
        alt="Preview Gambar"
        class={`w-auto max-w-full object-contain rounded-md select-none ${compact ? 'max-h-12' : 'max-h-24'}`}
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        on:click={handleRemoveImage}
        class="!w-6 !h-6 !min-h-0 !p-0 !rounded-full absolute top-1.5 right-1.5 shadow-lg"
        title="Hapus gambar"
      >
        <X size={12} />
      </Button>
    </div>
  {/if}

  <input
    bind:this={fileInput}
    type="file"
    accept="image/png,image/jpeg,image/jpg,image/webp"
    class="hidden"
    on:change={handleFileInputChange}
  />

  <div
    role="button"
    tabindex="0"
    on:click={() => { if (!isUploading) fileInput?.click(); }}
    on:keydown={handleKeydown}
    on:dragenter|preventDefault={() => { if (!isUploading) isDragging = true; }}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    class={`relative w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer select-none ${compact ? 'p-2.5' : 'p-4'} ${
      isDragging
        ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-[1.01]'
        : 'border-base-300 hover:border-primary/50 hover:bg-base-200/50 bg-base-200/30'
    } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
  >
    {#if isUploading}
      <Loader2 size={compact ? 18 : 24} class="animate-spin text-primary" />
      <span class="text-xs font-semibold text-primary">Mengunggah ({uploadProgress}%)...</span>
      <progress class="progress progress-primary w-28 h-1 mt-0.5" value={uploadProgress} max="100"></progress>
    {:else}
      <UploadCloud size={compact ? 18 : 24} class={isDragging ? 'text-primary' : 'text-primary/70'} />
      <div class="space-y-0.5">
        <p class={`font-bold text-base-content ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {imageUrl ? 'Ganti Gambar: Tarik & Lepas' : placeholderTitle}
        </p>
        <p class={`text-base-content/60 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
          atau <span class="text-primary font-semibold underline">{placeholderSubtitle}</span>
        </p>
      </div>
    {/if}
  </div>

  <div class="flex items-center justify-between text-[10px] text-base-content/50 mt-1 px-0.5">
    <span>PNG, JPG, WEBP</span>
    <span>Maks 5MB</span>
  </div>

  {#if errorMessage}
    <p class="text-xs text-rose-500 font-semibold mt-1 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
      {errorMessage}
    </p>
  {/if}
</div>
