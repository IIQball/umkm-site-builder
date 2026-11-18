<script lang="ts">
  import { Upload, AlertCircle, Image as ImageIcon, Loader2, Sparkles, Plus } from 'lucide-svelte';
  import ImageUploadPreview from './ImageUploadPreview.svelte';
  import {
    deleteCloudinaryUploadAsset,
    uploadSingleFileWorkflow,
  } from './imageUpload.helpers';

  export let folder: 'products' | 'templates' | 'stores' = 'products';
  export let maxFiles = 5;
  export let maxSizeMB = 5;
  export let existingUrls: string[] = [];
  export let allowGalleryPicker: boolean = false;
  export let onPickGallery: (replaceIndex?: number | null) => void = () => {};
  export let onUpload: (urls: string[]) => void = () => {};

  let uploadedUrls: string[] = [];
  $: uploadedUrls = existingUrls;

  let activeImageIndex = 0;
  $: if (activeImageIndex >= uploadedUrls.length && uploadedUrls.length > 0) {
    activeImageIndex = uploadedUrls.length - 1;
  }
  $: activeUrl = uploadedUrls[activeImageIndex] || '';

  let isDragging = false;
  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;
  let replaceIndex: number | null = null;

  $: canAddMore = uploadedUrls.length < maxFiles;

  function triggerManualUpload(indexToReplace: number | null = null) {
    replaceIndex = indexToReplace;
    fileInput.click();
  }

  function handleTriggerGallery(indexToReplace: number | null = null) {
    onPickGallery(indexToReplace);
  }

  function setAsPrimary(index: number) {
    if (index === 0 || index >= uploadedUrls.length) return;
    const item = uploadedUrls[index];
    const rest = uploadedUrls.filter((_, i) => i !== index);
    onUpload([item, ...rest]);
    activeImageIndex = 0;
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    errorMessage = '';

    if (replaceIndex !== null && replaceIndex >= 0 && replaceIndex < uploadedUrls.length) {
      isUploading = true;
      uploadProgress = 0;
      const res = await uploadSingleFileWorkflow(files[0], folder, maxSizeMB, (p) => (uploadProgress = p));
      isUploading = false;
      uploadProgress = 0;
      if (res.error) {
        errorMessage = res.error;
        replaceIndex = null;
        return;
      }
      if (res.url) {
        const oldUrl = uploadedUrls[replaceIndex];
        const updated = [...uploadedUrls];
        updated[replaceIndex] = res.url;
        onUpload(updated);
        if (oldUrl) await deleteCloudinaryUploadAsset(oldUrl);
      }
      replaceIndex = null;
      return;
    }

    const remaining = maxFiles - uploadedUrls.length;
    if (remaining <= 0) {
      if (activeImageIndex >= 0 && activeImageIndex < uploadedUrls.length) {
        replaceIndex = activeImageIndex;
        return handleFiles(files);
      }
      errorMessage = `Maksimal ${maxFiles} gambar`;
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);
    let currentUrls = [...uploadedUrls];
    for (const file of filesToProcess) {
      isUploading = true;
      uploadProgress = 0;
      const res = await uploadSingleFileWorkflow(file, folder, maxSizeMB, (p) => (uploadProgress = p));
      if (res.error) {
        errorMessage = res.error;
      } else if (res.url) {
        currentUrls = [...currentUrls, res.url];
        onUpload(currentUrls);
        activeImageIndex = currentUrls.length - 1;
      }
    }
    isUploading = false;
    uploadProgress = 0;
  }

  async function removeImage(index: number) {
    const urlToRemove = uploadedUrls[index];
    const nextUrls = uploadedUrls.filter((_, i) => i !== index);
    onUpload(nextUrls);
    if (activeImageIndex >= nextUrls.length && nextUrls.length > 0) {
      activeImageIndex = nextUrls.length - 1;
    }
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

<div class="space-y-3 font-sans">
  {#if isUploading}
    <div class="p-4 rounded-2xl bg-card border border-light flex flex-col items-center justify-center text-center gap-2 shadow-2xs">
      <Loader2 size={24} class="text-primary animate-spin" />
      <p class="text-xs font-semibold text-main">Mengunggah gambar... {uploadProgress}%</p>
      <div class="w-48 max-w-full bg-light rounded-full h-1.5 overflow-hidden">
        <div class="bg-primary h-full transition-all duration-300" style="width: {uploadProgress}%"></div>
      </div>
    </div>
  {/if}

  <!-- Empty State: 2 Clear Choices or Single Dropzone -->
  {#if uploadedUrls.length === 0 && canAddMore && !isUploading}
    {#if allowGalleryPicker}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          class="group w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-5 flex flex-col items-center justify-center text-center gap-2.5
            {isDragging ? 'border-primary bg-primary/5' : 'border-light/80 hover:border-primary/50 bg-card hover:bg-nested/60'} shadow-2xs"
          on:dragover={(e) => { e.preventDefault(); isDragging = true; }}
          on:dragleave={() => (isDragging = false)}
          on:drop={handleDrop}
          on:click={() => triggerManualUpload(null)}
        >
          <div class="w-11 h-11 rounded-xl bg-nested border border-light flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all shadow-2xs">
            <Upload size={20} />
          </div>
          <div>
            <p class="text-xs font-bold text-main leading-snug">Upload Manual</p>
            <p class="text-3xs text-muted font-sans mt-0.5">Dari komputer / HP (Maks {maxSizeMB}MB)</p>
          </div>
        </button>

        <button
          type="button"
          class="group w-full rounded-2xl border-2 border-dashed border-primary/35 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer p-5 flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs"
          on:click={() => handleTriggerGallery(null)}
        >
          <div class="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <p class="text-xs font-bold text-primary leading-snug">Galeri Desain AI</p>
            <p class="text-3xs text-primary/70 font-sans mt-0.5">Gunakan mockup / poster Studio AI</p>
          </div>
        </button>
      </div>
    {:else}
      <button
        type="button"
        class="group w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-6 sm:p-7 flex flex-col items-center justify-center text-center gap-3
          {isDragging ? 'border-primary bg-primary/5' : 'border-light/80 hover:border-primary/50 bg-nested/20 hover:bg-nested/50'}"
        on:dragover={(e) => { e.preventDefault(); isDragging = true; }}
        on:dragleave={() => (isDragging = false)}
        on:drop={handleDrop}
        on:click={() => triggerManualUpload(null)}
        aria-label="Seret gambar atau klik untuk upload"
      >
        <div class="w-12 h-12 rounded-2xl bg-card border border-light flex items-center justify-center text-secondary group-hover:text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all shadow-2xs">
          <Upload size={22} />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-main">
            Seret gambar ke sini atau <span class="text-primary font-bold hover:underline">klik untuk pilih</span>
          </p>
          <p class="text-2xs text-muted font-sans">
            PNG, JPG atau JPEG. Maks {maxSizeMB}MB. ({uploadedUrls.length}/{maxFiles} gambar)
          </p>
        </div>
      </button>
    {/if}
  {/if}

  <input bind:this={fileInput} type="file" accept="image/png,image/jpeg,image/jpg" multiple={maxFiles > 1 && replaceIndex === null} class="hidden" on:change={handleFileSelect} />

  {#if errorMessage}
    <div class="alert alert-error text-xs rounded-xl shadow-xs flex items-center gap-2">
      <AlertCircle size={16} class="shrink-0" />
      <span>{errorMessage}</span>
    </div>
  {/if}

  <!-- When Images Exist: Featured Active Preview & Thumbnail List -->
  {#if uploadedUrls.length > 0}
    <div class="space-y-3">
      <ImageUploadPreview
        {activeUrl}
        {activeImageIndex}
        totalImages={uploadedUrls.length}
        {maxFiles}
        {allowGalleryPicker}
        {isUploading}
        onUploadManual={() => triggerManualUpload(activeImageIndex)}
        onPickGallery={() => handleTriggerGallery(activeImageIndex)}
        onRemove={() => removeImage(activeImageIndex)}
        onSetPrimary={() => setAsPrimary(activeImageIndex)}
      />

      <!-- Thumbnails Grid (when maxFiles > 1) -->
      {#if maxFiles > 1}
        <div class="space-y-1.5">
          <p class="text-3xs font-bold text-muted uppercase tracking-wider font-mono px-1">
            Daftar Gambar ({uploadedUrls.length}/{maxFiles}) &bull; Klik untuk pratinjau & ganti
          </p>
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {#each uploadedUrls as url, index}
              <button
                type="button"
                class="relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer p-0.5
                  {activeImageIndex === index ? 'border-primary ring-2 ring-primary/30 shadow-xs' : 'border-light/80 hover:border-primary/50'}"
                on:click={() => (activeImageIndex = index)}
                title="Pilih gambar {index + 1}"
              >
                <img src={url} alt="Thumbnail {index + 1}" class="w-full h-full object-cover rounded-lg" />
                {#if index === 0}
                  <span class="absolute bottom-1 left-1 px-1 py-0.2 rounded text-5xs font-bold bg-primary text-white">
                    Utama
                  </span>
                {/if}
              </button>
            {/each}

            {#if canAddMore && !isUploading}
              <button
                type="button"
                class="rounded-xl border-2 border-dashed border-light/90 hover:border-primary/50 aspect-square flex flex-col items-center justify-center gap-0.5 text-muted hover:text-primary bg-card hover:bg-nested/60 transition-all cursor-pointer shadow-2xs"
                on:click={() => triggerManualUpload(null)}
                title="Tambah gambar baru manual"
              >
                <Plus size={16} />
                <span class="text-4xs font-bold font-sans">Tambah</span>
              </button>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  {#if uploadedUrls.length === 0 && !canAddMore}
    <div class="rounded-2xl bg-nested/40 border border-light py-6 flex flex-col items-center justify-center text-center gap-1.5">
      <ImageIcon size={28} class="text-muted" />
      <p class="text-xs text-muted">Belum ada gambar</p>
    </div>
  {/if}
</div>
