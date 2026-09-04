<script lang="ts">
  import { Upload, X, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-svelte';

  // -- Props --
  export let folder: 'products' | 'templates' | 'stores' = 'products';
  export let maxFiles: number = 5;
  export let maxSizeMB: number = 5;
  export let existingUrls: string[] = [];
  export let onUpload: (urls: string[]) => void = () => {};

  // -- State --
  let uploadedUrls: string[] = [];
  
  // Sync state when parent resets or changes the prop
  $: uploadedUrls = existingUrls;
  
  let isDragging = false;
  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  $: canAddMore = uploadedUrls.length < maxFiles;

  // -- WebP conversion via Canvas --
  async function convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Gagal konversi ke WebP'));
            }
          },
          'image/webp',
          0.85,
        );
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = URL.createObjectURL(file);
    });
  }

  // -- Validate file before processing --
  function validateFile(file: File): string | null {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return 'Format harus PNG atau JPG';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Ukuran maksimal ${maxSizeMB}MB`;
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
      throw new Error(data.error?.message || 'Gagal mendapatkan signature');
    }

    const data = await response.json();
    return data.data;
  }

  // -- Upload to Cloudinary via XHR (for progress) --
  async function uploadToCloudinary(
    blob: Blob,
    params: { signature: string; timestamp: string; apiKey: string; folder: string; uploadUrl: string },
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blob, 'image.webp');
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

  // -- Main upload handler --
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
      const validationError = validateFile(file);
      if (validationError) {
        errorMessage = validationError;
        continue;
      }

      try {
        isUploading = true;
        uploadProgress = 0;

        // Convert to WebP
        const webpBlob = await convertToWebP(file);

        // Get signed params
        const params = await getSignedParams();

        // Upload directly to Cloudinary
        const url = await uploadToCloudinary(webpBlob, params);

        const newUrls = [...uploadedUrls, url];
        onUpload(newUrls);
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Upload gagal';
      }
    }

    isUploading = false;
    uploadProgress = 0;
  }

  // -- Cleanup Cloudinary Asset --
  async function deleteCloudinaryAsset(urlToDelete: string) {
    if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
    try {
      await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });
    } catch {
      // Background cleanup best-effort
    }
  }

  // -- Remove image --
  async function removeImage(index: number) {
    const urlToRemove = uploadedUrls[index];
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    onUpload(newUrls);
    if (urlToRemove) {
      await deleteCloudinaryAsset(urlToRemove);
    }
  }

  // -- Drag and drop handlers --
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
    if (canAddMore && !isUploading) {
      fileInput.click();
    }
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    handleFiles(target.files);
    target.value = '';
  }
</script>

<div class="space-y-3">
  <!-- Drop Zone -->
  {#if canAddMore}
    <button
      type="button"
      class="card w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
        {isDragging ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50 hover:bg-base-50'}
        {isUploading ? 'pointer-events-none opacity-60' : ''}"
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      on:click={handleClick}
      disabled={isUploading}
      aria-label="Seret gambar atau klik untuk upload"
    >
      <div class="card-body items-center text-center py-8">
        {#if isUploading}
          <Loader2 size={32} class="text-primary animate-spin" />
          <p class="text-sm text-base-content/70">Mengupload... {uploadProgress}%</p>
          <progress
            class="progress progress-primary w-56"
            value={uploadProgress}
            max="100"
          ></progress>
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

  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    accept="image/png,image/jpeg,image/jpg"
    multiple={maxFiles > 1}
    class="hidden"
    on:change={handleFileSelect}
  />

  <!-- Error message -->
  {#if errorMessage}
    <div class="alert alert-error text-sm rounded-xl shadow-sm">
      <AlertCircle size={16} />
      <span>{errorMessage}</span>
    </div>
  {/if}

  <!-- Preview grid -->
  {#if uploadedUrls.length > 0}
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {#each uploadedUrls as url, index}
        <div class="relative group rounded-2xl overflow-hidden aspect-square bg-base-100 border border-base-200 shadow-sm">
          <img
            src={url}
            alt="Gambar produk {index + 1}"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            type="button"
            class="btn btn-circle btn-error btn-xs absolute top-2 right-2
              opacity-0 group-hover:opacity-100 transition-opacity"
            on:click|stopPropagation={() => removeImage(index)}
            aria-label="Hapus gambar {index + 1}"
          >
            <X size={12} />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Empty state (no images and can't add more) -->
  {#if uploadedUrls.length === 0 && !canAddMore}
    <div class="card rounded-2xl bg-base-50 border border-base-200 py-6">
      <div class="card-body items-center text-center">
        <ImageIcon size={32} class="text-base-content/30" />
        <p class="text-sm text-base-content/50">Belum ada gambar</p>
      </div>
    </div>
  {/if}
</div>
