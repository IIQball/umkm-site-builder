<script lang="ts">
  import { Upload, X, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-svelte';
  import {
    convertImageFileToWebP,
    deleteCloudinaryUploadAsset,
    requestSignedUploadParams,
    uploadWebpToCloudinary,
    validateImageUploadFile,
  } from './imageUpload.helpers';

  export let folder: 'products' | 'templates' | 'stores' = 'products';
  export let maxFiles = 5;
  export let maxSizeMB = 5;
  export let existingUrls: string[] = [];
  export let onUpload: (urls: string[]) => void = () => {};

  let uploadedUrls: string[] = [];
  $: uploadedUrls = existingUrls;

  let isDragging = false;
  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  $: canAddMore = uploadedUrls.length < maxFiles;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    errorMessage = '';

    const remaining = maxFiles - uploadedUrls.length;
    if (remaining <= 0) {
      errorMessage = `Maksimal ${maxFiles} gambar`;
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);
    for (const file of filesToProcess) {
      const validationError = validateImageUploadFile(file, maxSizeMB);
      if (validationError) {
        errorMessage = validationError;
        continue;
      }

      try {
        isUploading = true;
        uploadProgress = 0;
        const webpBlob = await convertImageFileToWebP(file);
        const params = await requestSignedUploadParams(folder);
        const url = await uploadWebpToCloudinary(webpBlob, params, (p) => {
          uploadProgress = p;
        });
        onUpload([...uploadedUrls, url]);
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Upload gagal';
      }
    }

    isUploading = false;
    uploadProgress = 0;
  }

  async function removeImage(index: number) {
    const urlToRemove = uploadedUrls[index];
    onUpload(uploadedUrls.filter((_, i) => i !== index));
    if (urlToRemove) await deleteCloudinaryUploadAsset(urlToRemove);
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    handleFiles(event.dataTransfer?.files || null);
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    handleFiles(target.files);
    target.value = '';
  }
</script>

<div class="space-y-3">
  {#if canAddMore}
    <button
      type="button"
      class="card w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
        {isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50 hover:bg-base-50'}
        {isUploading ? 'pointer-events-none opacity-60' : ''}"
      on:dragover={(e) => { e.preventDefault(); isDragging = true; }}
      on:dragleave={() => (isDragging = false)}
      on:drop={handleDrop}
      on:click={() => { if (canAddMore && !isUploading) fileInput.click(); }}
      disabled={isUploading}
      aria-label="Seret gambar atau klik untuk upload"
    >
      <div class="card-body items-center text-center py-8">
        {#if isUploading}
          <Loader2 size={32} class="text-primary animate-spin" />
          <p class="text-sm text-base-content/70">Mengupload... {uploadProgress}%</p>
          <progress class="progress progress-primary w-56 max-w-full" value={uploadProgress} max="100"></progress>
        {:else}
          <Upload size={32} class="text-base-content/40" />
          <p class="text-sm font-medium text-base-content/70">
            Seret gambar ke sini atau <span class="text-primary">klik untuk pilih</span>
          </p>
          <p class="text-xs text-base-content/40">
            PNG, JPG dan JPEG. Maks {maxSizeMB}MB. {uploadedUrls.length}/{maxFiles} gambar.
          </p>
        {/if}
      </div>
    </button>
  {/if}

  <input bind:this={fileInput} type="file" accept="image/png,image/jpeg,image/jpg" multiple={maxFiles > 1} class="hidden" on:change={handleFileSelect} />

  {#if errorMessage}
    <div class="alert alert-error text-sm rounded-xl shadow-sm">
      <AlertCircle size={16} />
      <span>{errorMessage}</span>
    </div>
  {/if}

  {#if uploadedUrls.length > 0}
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {#each uploadedUrls as url, index}
        <div class="relative group rounded-2xl overflow-hidden aspect-square bg-base-100 border border-base-200 shadow-sm">
          <img src={url} alt="Gambar produk {index + 1}" class="w-full h-full object-cover" loading="lazy" />
          <button
            type="button"
            class="btn btn-circle btn-error btn-xs absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            on:click|stopPropagation={() => removeImage(index)}
            aria-label="Hapus gambar {index + 1}"
          >
            <X size={12} />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if uploadedUrls.length === 0 && !canAddMore}
    <div class="card rounded-2xl bg-base-50 border border-base-200 py-6">
      <div class="card-body items-center text-center">
        <ImageIcon size={32} class="text-base-content/30" />
        <p class="text-sm text-base-content/50">Belum ada gambar</p>
      </div>
    </div>
  {/if}
</div>
