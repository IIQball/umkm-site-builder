<script lang="ts">
  import { UploadCloud, X, Loader2 } from 'lucide-svelte';
  import {
    compressToWebP,
    uploadToCloudinary,
    deleteOldImage,
  } from '../../inspector/imageUpload.helpers';

  export let imageUrl: string = '';
  export let onPropChange: (key: string, value: unknown) => void;

  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;
  let isDragging = false;

  async function processImageFile(file: File) {
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format berkas wajib JPG, JPEG, PNG, atau WebP';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal berkas sebelum dikompresi adalah 5MB';
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 25;
      const webpBlob = await compressToWebP(file, 1920, 1080);
      uploadProgress = 65;
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_hero.webp`);
      uploadProgress = 100;

      const oldUrl = imageUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }

      onPropChange('imageUrl', url);
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
    if (file) processImageFile(file);
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
    if (file) processImageFile(file);
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
      e.preventDefault();
      fileInput?.click();
    }
  }

  async function handleRemoveImage() {
    const oldUrl = imageUrl;
    onPropChange('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="pt-2 border-t border-base-300 dark:border-slate-800">
  <div class="flex items-center justify-between mb-2">
    <span class="block font-semibold text-xs text-base-content/80">
      Gambar Spanduk / Ilustrasi
    </span>
    {#if imageUrl}
      <span class="badge badge-success badge-xs font-bold">
        Tersedia
      </span>
    {/if}
  </div>

  {#if imageUrl}
    <div class="relative group rounded-xl overflow-hidden aspect-video bg-base-200 border border-base-300 dark:border-slate-800 mb-2.5 shadow-sm">
      <img src={imageUrl} alt="Spanduk Hero" class="w-full h-full object-cover" />
      <button
        type="button"
        on:click={handleRemoveImage}
        class="btn btn-circle btn-error btn-xs absolute top-2 right-2 shadow-lg cursor-pointer"
        title="Hapus gambar secara permanen"
      >
        <X size={13} />
      </button>
    </div>
  {/if}

  <input
    id="hero-img-uploader"
    bind:this={fileInput}
    type="file"
    accept="image/png,image/jpeg,image/jpg,image/webp"
    class="hidden"
    on:change={handleFileInputChange}
  />

  <!-- Interactive Dropzone for Drag & Drop or Click Manual -->
  <div
    role="button"
    tabindex="0"
    on:click={() => { if (!isUploading) fileInput?.click(); }}
    on:keydown={handleKeydown}
    on:dragenter|preventDefault={() => { if (!isUploading) isDragging = true; }}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    class={`relative w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer select-none ${
      isDragging
        ? 'border-primary bg-primary/10 ring-2 ring-primary/30 scale-[1.01]'
        : 'border-base-300 dark:border-slate-800 hover:border-primary/50 hover:bg-base-200/50 bg-base-200/30'
    } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
  >
    {#if isUploading}
      <Loader2 size={24} class="animate-spin text-primary" />
      <span class="text-xs font-semibold text-primary">Mengunggah & Mengonversi ({uploadProgress}%)...</span>
      <progress class="progress progress-primary w-36 h-1 mt-1" value={uploadProgress} max="100"></progress>
    {:else}
      <UploadCloud size={24} class={isDragging ? 'text-primary' : 'text-primary/70'} />
      <div class="space-y-0.5">
        <p class="text-xs font-bold text-base-content">
          {imageUrl ? 'Ganti Gambar: Tarik & Lepas ke Sini' : 'Tarik & Lepas Gambar ke Sini'}
        </p>
        <p class="text-[11px] text-base-content/60">
          atau <span class="text-primary font-semibold underline">pilih berkas manual</span>
        </p>
      </div>
    {/if}
  </div>

  <div class="flex items-center justify-between text-[10.5px] text-base-content/50 mt-1.5 px-0.5">
    <span>Format: PNG, JPG, JPEG</span>
    <span>Maks 5MB</span>
  </div>

  {#if errorMessage}
    <p class="text-xs text-rose-500 font-semibold mt-1.5 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">
      {errorMessage}
    </p>
  {/if}
</div>
