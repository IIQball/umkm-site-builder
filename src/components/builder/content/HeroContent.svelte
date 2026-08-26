<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { makeHandlePropChange } from './content.helpers';
  import { Upload, X, Loader2 } from 'lucide-svelte';

  export let section: TemplateSection;
  export let onUpdate: (section: TemplateSection) => void;

  $: handlePropChange = makeHandlePropChange(section, onUpdate);
  $: subtitle = (section.props?.subtitle as string) ?? '';
  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';

  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  // Konversi JPG/PNG -> WebP dengan resolusi wajar & kompresi bertahap agar <= 200KB
  async function compressToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Batasi dimensi maksimum agar file ringan dan pas untuk Hero
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
        if (!ctx) return reject(new Error('Canvas context tidak tersedia'));

        ctx.drawImage(img, 0, 0, width, height);

        // Kompresi dinamis menuju target ~200KB
        let quality = 0.8;
        const tryExport = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Gagal kompresi WebP'));
              // Jika masih > 200KB dan quality masih bisa diturunkan
              if (blob.size > 200 * 1024 && q > 0.4) {
                tryExport(q - 0.15);
              } else {
                resolve(blob);
              }
            },
            'image/webp',
            q
          );
        };
        tryExport(quality);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.src = URL.createObjectURL(file);
    });
  }

  async function deleteOldImage(urlToDelete: string) {
    if (!urlToDelete || !urlToDelete.includes('cloudinary.com')) return;
    try {
      await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });
    } catch {
      // Ignore background deletion failure
    }
  }

  async function handleImageUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal file sebelum dikompresi adalah 5MB';
      input.value = '';
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 15;

      const webpBlob = await compressToWebP(file);
      uploadProgress = 40;

      // Get signed upload token
      const signRes = await fetch('/api/media/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'templates' }),
      });

      if (!signRes.ok) throw new Error('Gagal mendapatkan izin upload');
      const { data: signData } = await signRes.json();

      uploadProgress = 60;

      // Direct upload ke Cloudinary
      const formData = new FormData();
      formData.append('file', webpBlob, `${Date.now()}_hero.webp`);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp);
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const cloudRes = await fetch(signData.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!cloudRes.ok) throw new Error('Upload Cloudinary gagal');
      const cloudData = await cloudRes.json();
      uploadProgress = 100;

      // Hapus gambar lama jika ada pergantian gambar
      const oldUrl = imageUrl;
      if (oldUrl && oldUrl !== cloudData.secure_url) {
        await deleteOldImage(oldUrl);
      }

      // Update state gambar di template section
      handlePropChange('imageUrl', cloudData.secure_url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gagal';
    } finally {
      isUploading = false;
      input.value = '';
    }
  }

  async function handleRemoveImage() {
    const oldUrl = imageUrl;
    handlePropChange('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-4">
  <div>
    <label for="hero-title" class="block font-semibold text-xs text-base-content/80 mb-1">Judul Utama (Title)</label>
    <input
      id="hero-title"
      type="text"
      value={section.props?.title ?? ''}
      on:input={(e) => handlePropChange('title', e.currentTarget.value)}
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
      placeholder="Selamat datang di toko kami"
    />
  </div>

  <div>
    <label for="hero-subtitle" class="block font-semibold text-xs text-base-content/80 mb-1">Subjudul (Subtitle)</label>
    <textarea
      id="hero-subtitle"
      value={subtitle}
      on:input={(e) => handlePropChange('subtitle', e.currentTarget.value)}
      rows="2"
      class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500 resize-y"
      placeholder="Produk berkualitas dengan harga terjangkau"
    />
  </div>

  <!-- Panel Upload Gambar Banner / Background -->
  <div class="pt-2 border-t border-base-300 dark:border-slate-800">
    <div class="flex items-center justify-between mb-1.5">
      <label for="hero-img-uploader" class="block font-semibold text-xs text-base-content/80">Gambar Banner / Background</label>
      {#if imageUrl}
        <span class="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">Tersedia</span>
      {/if}
    </div>

    <!-- Tipe Tampilan Gambar -->
    <div class="grid grid-cols-2 gap-2 mb-3">
      <button
        type="button"
        on:click={() => handlePropChange('imageMode', 'element')}
        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all {imageMode === 'element' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-base-200/40 border-base-300 hover:bg-base-200'}"
      >
        Elemen Bebas
      </button>
      <button
        type="button"
        on:click={() => handlePropChange('imageMode', 'background')}
        class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all {imageMode === 'background' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-base-200/40 border-base-300 hover:bg-base-200'}"
      >
        Full Background
      </button>
    </div>

    {#if imageUrl}
      <div class="relative group rounded-xl overflow-hidden aspect-video bg-base-200 border border-base-300 mb-2">
        <img src={imageUrl} alt="Banner Hero" class="w-full h-full object-cover" />
        <button
          type="button"
          on:click={handleRemoveImage}
          class="btn btn-circle btn-error btn-xs absolute top-2 right-2 shadow-lg"
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
      accept="image/png,image/jpeg,image/jpg"
      class="hidden"
      on:change={handleImageUpload}
    />

    <button
      type="button"
      disabled={isUploading}
      on:click={() => fileInput?.click()}
      class="w-full py-2.5 px-3 border border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-primary transition-all cursor-pointer disabled:opacity-50"
    >
      {#if isUploading}
        <Loader2 size={16} class="animate-spin text-primary" />
        <span>Mengunggah & Mengonversi ({uploadProgress}%)...</span>
      {:else}
        <Upload size={16} />
        <span>{imageUrl ? 'Ganti Gambar (Otomatis Replace)' : 'Upload Gambar Banner (JPG/PNG)'}</span>
      {/if}
    </button>
    <p class="text-[10.5px] text-base-content/50 mt-1">Maks 5MB. Otomatis convert ke WebP ringan (&le;200KB).</p>

    {#if errorMessage}
      <p class="text-xs text-rose-500 font-semibold mt-1">{errorMessage}</p>
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div>
      <label for="cta-text" class="block font-semibold text-xs text-base-content/80 mb-1">Teks CTA</label>
      <input
        id="cta-text"
        type="text"
        value={section.props?.ctaText ?? ''}
        on:input={(e) => handlePropChange('ctaText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
        placeholder="Lihat Katalog"
      />
    </div>
    <div>
      <label for="cta-link" class="block font-semibold text-xs text-base-content/80 mb-1">Link CTA</label>
      <input
        id="cta-link"
        type="text"
        value={section.props?.ctaLink ?? ''}
        on:input={(e) => handlePropChange('ctaLink', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-md text-sm text-base-content focus:outline-none focus:border-blue-500"
        placeholder="#catalog"
      />
    </div>
  </div>

  <!-- Pengaturan Tinggi Section Canvas (8pt Grid) -->
  <div class="pt-3 border-t border-base-300 dark:border-slate-800">
    <span class="block font-semibold text-xs text-base-content/80 mb-1">Tinggi Minimum Hero (8pt Grid)</span>
    <div class="grid grid-cols-4 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      {#each [
        { label: '480px', value: '480px' },
        { label: '560px', value: '560px' },
        { label: '640px', value: '640px' },
        { label: 'Auto', value: 'auto' },
      ] as h}
        <button
          type="button"
          on:click={() => onUpdate({
            ...section,
            styles: {
              ...(section.styles || {}),
              minHeight: h.value,
            }
          })}
          class={`py-1.5 rounded font-medium transition-colors cursor-pointer text-center ${
            (section.styles?.minHeight || '560px') === h.value ? 'bg-base-100 text-blue-600 dark:text-blue-400 font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          {h.label}
        </button>
      {/each}
    </div>
  </div>
</div>