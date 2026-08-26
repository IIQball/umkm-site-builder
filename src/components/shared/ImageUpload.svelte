<script lang="ts">
  import { Upload, X, AlertCircle, Loader2 } from 'lucide-svelte';

  // -- Props --
  export let folder: 'products' | 'templates' | 'stores' = 'templates';
  export let maxFiles: number = 1;
  export let maxSizeMB: number = 5;
  export let existingUrls: string[] = [];
  export let value: string = '';
  export let compact: boolean = false;
  export let label: string = '';
  export let onUpload: (urls: string[]) => void = () => {};
  export let onSingleUpload: (url: string) => void = () => {};
  export let onChange: (url: string) => void = () => {};

  // -- State --
  let uploadedUrls: string[] = [];

  // Sync state when parent resets or changes the prop
  $: {
    if (value) {
      uploadedUrls = [value];
    } else if (existingUrls && existingUrls.length > 0) {
      uploadedUrls = existingUrls.slice(0, maxFiles);
    } else {
      uploadedUrls = [];
    }
  }

  let isDragging = false;
  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  // -- Konversi Otomatis JPG/PNG ke WebP dengan target ukuran <= 200KB --
  async function convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi bertahap menuju target <= 200KB
        let quality = 0.8;
        const tryExport = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Gagal konversi ke WebP'));
              if (blob.size > 200 * 1024 && q > 0.4) {
                tryExport(q - 0.15);
              } else {
                resolve(blob);
              }
            },
            'image/webp',
            q,
          );
        };
        tryExport(quality);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = URL.createObjectURL(file);
    });
  }

  // -- Validasi Input File: Hanya menerima JPG, JPEG, dan PNG dengan maks 5MB --
  function validateFile(file: File): string | null {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Format file harus JPG, JPEG, atau PNG';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran file maksimal ${maxSizeMB}MB`;
    }
    return null;
  }

  // -- Get signed params from server --
  async function getSignedParams() {
    const response = await fetch('/api/media/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error?.message || 'Gagal mendapatkan signature upload');
    }

    const data = await response.json();
    return data.data;
  }

  // -- Upload ke Cloudinary via XHR --
  async function uploadToCloudinary(
    blob: Blob,
    params: { signature: string; timestamp: string; apiKey: string; folder: string; uploadUrl: string },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blob, `${Date.now()}_img.webp`);
      formData.append('api_key', params.apiKey);
      formData.append('timestamp', params.timestamp);
      formData.append('signature', params.signature);
      formData.append('folder', params.folder);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          uploadProgress = Math.round((event.loaded / event.total) * 100);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload ke Cloudinary gagal'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Koneksi gagal saat upload'));
      });

      xhr.open('POST', params.uploadUrl);
      xhr.send(formData);
    });
  }

  // -- Hapus file lama di Cloudinary jika diganti --
  async function deleteCloudinaryAsset(urlToDelete: string) {
    if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
    try {
      await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });
    } catch {
      // Best-effort background cleanup
    }
  }

  // -- Main upload handler --
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    errorMessage = '';

    const file = files[0];
    const validationError = validateFile(file);
    if (validationError) {
      errorMessage = validationError;
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 15;

      // Konversi otomatis JPG/PNG -> WebP (<=200KB)
      const webpBlob = await convertToWebP(file);
      uploadProgress = 45;

      const params = await getSignedParams();
      uploadProgress = 65;

      const newUrl = await uploadToCloudinary(webpBlob, params);
      uploadProgress = 100;

      const oldUrl = uploadedUrls[0];
      if (maxFiles === 1) {
        uploadedUrls = [newUrl];
        if (oldUrl && oldUrl !== newUrl) {
          deleteCloudinaryAsset(oldUrl);
        }
      } else {
        uploadedUrls = [...uploadedUrls, newUrl].slice(0, maxFiles);
      }

      onUpload(uploadedUrls);
      onSingleUpload(newUrl);
      onChange(newUrl);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Upload gagal';
    } finally {
      isUploading = false;
      uploadProgress = 0;
    }
  }

  // -- Remove image --
  async function removeImage(index: number = 0) {
    const urlToRemove = uploadedUrls[index];
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    uploadedUrls = newUrls;
    onUpload(newUrls);
    onSingleUpload('');
    onChange('');
    if (urlToRemove) {
      await deleteCloudinaryAsset(urlToRemove);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    handleFiles(event.dataTransfer?.files || null);
  }

  function handleClick() {
    if (!isUploading) {
      fileInput.click();
    }
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    handleFiles(target.files);
    target.value = '';
  }
</script>

<div class="space-y-2">
  {#if label}
    <span class="block font-medium text-[11px] text-base-content/70">{label}</span>
  {/if}

  <!-- Preview Card if Image Exists (Menampilkan hasil format WebP dari Cloudinary) -->
  {#if uploadedUrls.length > 0 && maxFiles === 1}
    <div class="relative group rounded-xl overflow-hidden bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 shadow-sm">
      <div class="aspect-video w-full flex items-center justify-center bg-slate-950/5 relative overflow-hidden">
        <img
          src={uploadedUrls[0]}
          alt="Preview WebP"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold shadow transition-all cursor-pointer"
            on:click|stopPropagation={handleClick}
            disabled={isUploading}
          >
            Ganti Gambar
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow transition-all cursor-pointer"
            on:click|stopPropagation={() => removeImage(0)}
            aria-label="Hapus gambar"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Drop Zone / Upload Button -->
    <button
      type="button"
      class="w-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center
        {compact ? 'py-4 px-3' : 'py-6 px-4'}
        {isDragging ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-base-300 dark:border-slate-800 hover:border-blue-500/60 bg-base-100 dark:bg-slate-950'}
        {isUploading ? 'pointer-events-none opacity-60' : ''}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      on:click={handleClick}
      disabled={isUploading}
      aria-label="Upload gambar"
    >
      {#if isUploading}
        <Loader2 size={compact ? 20 : 26} class="text-blue-500 animate-spin mb-1.5" />
        <p class="text-[11px] font-medium text-base-content/70">Mengompresi ke WebP & Upload... {uploadProgress}%</p>
      {:else}
        <Upload size={compact ? 18 : 24} class="text-base-content/40 mb-1.5" />
        <p class="text-xs font-semibold text-base-content/80">
          <span class="text-blue-600 dark:text-blue-400">Pilih file JPG/PNG</span> atau seret ke sini
        </p>
        <p class="text-[10px] text-base-content/50 mt-0.5">
          JPG, JPEG, PNG (Maks 5MB &bull; Auto WebP &le;200KB)
        </p>
      {/if}
    </button>
  {/if}

  <!-- Hidden file input: Hanya menerima JPG, JPEG, dan PNG -->
  <input
    bind:this={fileInput}
    type="file"
    accept="image/png,image/jpeg,image/jpg"
    class="hidden"
    on:change={handleFileSelect}
  />

  <!-- Error message -->
  {#if errorMessage}
    <div class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
      <AlertCircle size={14} class="flex-shrink-0" />
      <span>{errorMessage}</span>
    </div>
  {/if}
</div>
