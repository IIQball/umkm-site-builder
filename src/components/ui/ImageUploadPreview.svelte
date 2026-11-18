<script lang="ts">
  import { Upload, X, Sparkles, ArrowRight, Star } from 'lucide-svelte';

  export let activeUrl: string;
  export let activeImageIndex: number = 0;
  export let totalImages: number = 0;
  export let maxFiles: number = 5;
  export let allowGalleryPicker: boolean = false;
  export let isUploading: boolean = false;

  export let onUploadManual: () => void;
  export let onPickGallery: () => void;
  export let onRemove: () => void;
  export let onSetPrimary: () => void;
</script>

<div class="p-3 sm:p-3.5 rounded-2xl bg-card border border-light shadow-2xs space-y-3 font-sans">
  <div class="flex items-center justify-between text-2xs font-sans">
    <div class="flex items-center gap-1.5">
      <span class="font-bold text-main font-heading">Preview Gambar Terkini</span>
      {#if activeImageIndex === 0}
        <span class="px-2 py-0.5 rounded-full text-4xs font-bold bg-primary text-white shadow-2xs">
          Gambar Utama
        </span>
      {:else}
        <span class="px-2 py-0.5 rounded-full text-4xs font-bold bg-nested text-muted border border-light">
          Gambar {activeImageIndex + 1}
        </span>
      {/if}
    </div>
    <span class="text-3xs text-muted font-mono font-semibold">
      {totalImages}/{maxFiles} Gambar
    </span>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
    <!-- Active Preview Image -->
    <div class="sm:col-span-5 relative rounded-xl overflow-hidden aspect-square bg-nested border border-light flex items-center justify-center shadow-2xs">
      <img src={activeUrl} alt="Preview gambar terkini" class="w-full h-full object-cover" />
      <button
        type="button"
        class="w-6 h-6 rounded-full bg-error text-white flex items-center justify-center absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
        on:click={onRemove}
        title="Hapus gambar ini"
      >
        <X size={12} />
      </button>
    </div>

    <!-- Controls: Upload Manual or Galeri Desain AI -->
    <div class="sm:col-span-7 flex flex-col justify-between h-full space-y-2">
      <div>
        <p class="text-xs font-bold text-main leading-tight font-heading">Ubah / Ganti Gambar Ini</p>
        <p class="text-3xs text-muted font-sans mt-0.5">Pilih sumber untuk memperbarui foto yang tampil:</p>
      </div>

      <div class="grid grid-cols-1 gap-2">
        <button
          type="button"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border border-light/90 bg-nested hover:bg-nested/80 text-main transition-all cursor-pointer shadow-2xs group"
          on:click={onUploadManual}
          disabled={isUploading}
        >
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-card border border-light flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-2xs">
              <Upload size={14} />
            </div>
            <div class="text-left">
              <span class="block text-xs font-bold leading-tight">Upload Manual</span>
              <span class="block text-4xs text-muted">Dari komputer / HP</span>
            </div>
          </div>
          <ArrowRight size={12} class="text-primary group-hover:translate-x-0.5 transition-transform" />
        </button>

        {#if allowGalleryPicker}
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary transition-all cursor-pointer shadow-2xs group"
            on:click={onPickGallery}
            disabled={isUploading}
          >
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                <Sparkles size={14} />
              </div>
              <div class="text-left">
                <span class="block text-xs font-bold leading-tight">Galeri Desain AI</span>
                <span class="block text-4xs text-primary/70">Pilih mockup / poster AI</span>
              </div>
            </div>
            <ArrowRight size={12} class="text-primary group-hover:translate-x-0.5 transition-transform" />
          </button>
        {/if}
      </div>

      {#if activeImageIndex !== 0}
        <button
          type="button"
          class="inline-flex items-center gap-1 text-left text-3xs font-bold text-primary hover:underline cursor-pointer pt-0.5"
          on:click={onSetPrimary}
        >
          <Star size={11} class="fill-primary" />
          <span>Jadikan Gambar Utama</span>
        </button>
      {/if}
    </div>
  </div>
</div>
