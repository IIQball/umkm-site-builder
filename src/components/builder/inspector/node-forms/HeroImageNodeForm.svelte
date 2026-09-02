<script lang="ts">
  import { Upload, X, Loader2 } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import { compressToWebP, uploadToCloudinary, deleteOldImage } from '../imageUpload.helpers';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';

  let isUploading = false;
  let errorMessage = '';
  let fileInput: HTMLInputElement;

  async function handleImageFileChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    errorMessage = '';
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      errorMessage = 'Format file wajib JPG, JPEG, atau PNG';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorMessage = 'Ukuran maksimal file sebelum dikompresi adalah 5MB';
      return;
    }

    try {
      isUploading = true;
      const webpBlob = await compressToWebP(file, 1920, 1080);
      const url = await uploadToCloudinary(webpBlob, 'templates', `${Date.now()}_banner.webp`);
      
      const oldUrl = (section.props?.imageUrl as string) || '';
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }
      onPropChange('imageUrl', url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Upload gagal';
    } finally {
      isUploading = false;
      if (fileInput) fileInput.value = '';
    }
  }

  async function handleRemoveNodeImage() {
    const oldUrl = (section.props?.imageUrl as string) || '';
    onPropChange('imageUrl', '');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-3">
  <div class="space-y-1.5">
    <label class="font-semibold text-base-content" for="hero-img-upload">Banner / Media Gambar</label>
    {#if imageUrl}
      <div class="relative group rounded-xl overflow-hidden border border-base-300 dark:border-slate-800 bg-base-200/50 p-2 flex items-center gap-3">
        <img src={imageUrl} alt="Banner Preview" class="w-16 h-12 object-cover bg-white dark:bg-slate-900 rounded-lg border border-base-300" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold truncate text-base-content">Banner Hero</p>
          <p class="text-[10px] text-base-content/60">Terunggah ke Cloudinary (WebP)</p>
        </div>
        <button
          type="button"
          on:click={handleRemoveNodeImage}
          class="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
          title="Hapus Gambar"
        >
          <X size={14} />
        </button>
      </div>
    {:else}
      <button
        type="button"
        on:click={() => fileInput?.click()}
        disabled={isUploading}
        class="w-full border-2 border-dashed border-base-300 dark:border-slate-800 hover:border-primary/50 rounded-xl p-5 text-center cursor-pointer transition-colors bg-base-200/30 flex flex-col items-center gap-1.5"
      >
        {#if isUploading}
          <Loader2 size={18} class="animate-spin text-primary" />
          <span class="text-xs text-primary font-medium">Mengunggah gambar...</span>
        {:else}
          <Upload size={18} class="text-base-content/50" />
          <span class="text-xs font-medium text-base-content">Pilih Banner Gambar (PNG / JPG)</span>
          <span class="text-[10px] text-base-content/60">Otomatis kompres WebP &lt; 200KB</span>
        {/if}
      </button>
    {/if}
    <input
      id="hero-img-upload"
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      bind:this={fileInput}
      on:change={handleImageFileChange}
      class="hidden"
    />
    {#if errorMessage}
      <p class="text-[11px] text-error font-medium">{errorMessage}</p>
    {/if}
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-base-content" for="img-mode-select">Mode Penempatan Gambar</label>
    <select
      id="img-mode-select"
      value={imageMode}
      on:change={(e) => onPropChange('imageMode', e.currentTarget.value)}
      class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
    >
      <option value="element">Elemen Sejajar Teks (Split View)</option>
      <option value="background">Background Penuh (Full Bleed)</option>
    </select>
  </div>
</div>
