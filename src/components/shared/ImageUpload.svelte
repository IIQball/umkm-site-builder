<script lang="ts">
  import { Upload, X, Loader2, Sparkles } from 'lucide-svelte';
  import {
    validateImageFile,
    compressToWebP,
    fetchUploadSignature,
    deleteCloudinaryMedia,
  } from './imageUpload.helpers';

  export let value: string | string[] = '';
  export let maxFiles = 1;
  export let folder = 'umkm-site-builder/uploads';
  export let label = 'Unggah Gambar';
  export let compact = false;
  export let onSingleUpload: ((url: string) => void) | undefined = undefined;

  let isDragging = false;
  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  $: imageList = Array.isArray(value)
    ? value.filter(Boolean)
    : value
      ? [value]
      : [];

  async function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files?.length) {
      await processFiles(Array.from(target.files));
      target.value = '';
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files?.length) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }

  async function processFiles(files: File[]) {
    errorMessage = '';
    const availableSlots = maxFiles - imageList.length;
    if (availableSlots <= 0) {
      errorMessage = `Maksimal ${maxFiles} gambar yang diperbolehkan`;
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);

    for (const file of filesToUpload) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        errorMessage = validation.error || 'Berkas tidak valid';
        return;
      }
    }

    isUploading = true;
    uploadProgress = 10;

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const rawFile = filesToUpload[i];
        uploadProgress = 20 + Math.round((i / filesToUpload.length) * 30);

        const compressedBlob = await compressToWebP(rawFile);
        const webpFile = new File(
          [compressedBlob],
          rawFile.name.replace(/\.[^/.]+$/, '') + '.webp',
          { type: 'image/webp' },
        );

        uploadProgress = 50 + Math.round((i / filesToUpload.length) * 20);
        const sig = await fetchUploadSignature(folder);

        const formData = new FormData();
        formData.append('file', webpFile);
        formData.append('api_key', sig.apiKey);
        formData.append('timestamp', String(sig.timestamp));
        formData.append('signature', sig.signature);
        formData.append('folder', sig.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dr0lbwygk'}/image/upload`,
          { method: 'POST', body: formData },
        );

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error?.message || 'Gagal mengunggah gambar ke server');
        }

        const uploadedData = await uploadRes.json();
        uploadedUrls.push(uploadedData.secure_url);
      }

      uploadProgress = 100;

      if (maxFiles === 1) {
        value = uploadedUrls[0] || '';
        if (onSingleUpload) onSingleUpload(value);
      } else {
        value = [...imageList, ...uploadedUrls];
      }
    } catch (err: any) {
      errorMessage = err.message || 'Terjadi kesalahan saat mengunggah gambar';
    } finally {
      isUploading = false;
      uploadProgress = 0;
    }
  }

  async function removeImage(index: number) {
    const urlToRemove = imageList[index];
    if (!urlToRemove) return;

    deleteCloudinaryMedia(urlToRemove);

    if (maxFiles === 1) {
      value = '';
      if (onSingleUpload) onSingleUpload('');
    } else {
      const updated = [...imageList];
      updated.splice(index, 1);
      value = updated;
    }
  }
</script>

<div class="w-full space-y-3">
  {#if label}
    <div class="flex items-center justify-between">
      <span class="block text-xs font-semibold text-base-content/80">{label}</span>
      <span class="text-[10px] text-base-content/50">Maksimal {maxFiles} gambar (JPG, PNG, JPEG &le; 5MB)</span>
    </div>
  {/if}

  {#if errorMessage}
    <div class="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center justify-between">
      <span>{errorMessage}</span>
      <button type="button" on:click={() => (errorMessage = '')} class="p-1 hover:opacity-70 cursor-pointer">
        <X size={12} />
      </button>
    </div>
  {/if}

  {#if imageList.length > 0}
    <div class="grid gap-2.5 {maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-3 sm:grid-cols-4'}">
      {#each imageList as imgUrl, index}
        <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 aspect-square">
          <img src={imgUrl} alt="Pratinjau" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              on:click={() => removeImage(index)}
              class="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer shadow-md"
              title="Hapus Gambar"
            >
              <X size={14} />
            </button>
          </div>
          <div class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white flex items-center gap-1">
            <Sparkles size={8} class="text-amber-400" />
            <span>WebP</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if imageList.length < maxFiles}
    <div
      role="button"
      tabindex="0"
      aria-label="Upload Area"
      on:dragenter|preventDefault={() => (isDragging = true)}
      on:dragleave|preventDefault={() => (isDragging = false)}
      on:dragover|preventDefault={() => (isDragging = true)}
      on:drop={handleDrop}
      class="relative flex flex-col items-center justify-center {compact ? 'py-4' : 'py-6'} px-4 border-2 border-dashed rounded-2xl transition-all cursor-pointer {isDragging ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-base-300 dark:border-slate-800 hover:border-primary/50 bg-base-200/30 dark:bg-slate-900/30'}"
      on:click={() => fileInput.click()}
      on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); }}
    >
      <input
        bind:this={fileInput}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        multiple={maxFiles > 1}
        on:change={handleFileSelect}
        class="hidden"
      />

      {#if isUploading}
        <div class="flex flex-col items-center gap-2 py-2">
          <Loader2 size={24} class="text-primary animate-spin" />
          <div class="text-center">
            <span class="font-bold text-xs text-base-content">Mengompresi ke WebP & Mengunggah...</span>
            <div class="w-32 bg-base-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-primary h-1.5 transition-all duration-300" style="width: {uploadProgress}%"></div>
            </div>
          </div>
        </div>
      {:else}
        <div class="flex flex-col items-center text-center gap-1.5">
          <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Upload size={18} />
          </div>
          <div>
            <p class="font-bold text-xs text-base-content">
              Klik atau seret gambar ke sini
            </p>
            <p class="text-[10px] text-base-content/50 mt-0.5">
              JPG, PNG, JPEG &le; 5MB (Otomatis dikonversi ke WebP &le; 200KB)
            </p>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
