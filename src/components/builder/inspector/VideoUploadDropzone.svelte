<script lang="ts">
  import { Video, X, Loader2, Play } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import {
    uploadVideoToCloudinary,
    deleteOldImage,
    validateVideoFile,
  } from './imageUpload.helpers';

  export let videoUrl: string = '';
  export let onVideoChange: (url: string) => void;
  export let label: string = 'Unggah Video';
  export let placeholderTitle: string = 'Tarik & Lepas Video ke Sini';
  export let placeholderSubtitle: string = 'atau klik untuk memilih berkas';
  export let folder: string = 'templates';

  let isUploading = false;
  let uploadProgress = 0;
  let errorMessage = '';
  let fileInput: HTMLInputElement;
  let isDragging = false;

  async function processFile(file: File) {
    if (!file) return;

    errorMessage = '';
    const valError = validateVideoFile(file);
    if (valError) {
      errorMessage = valError;
      return;
    }

    try {
      isUploading = true;
      uploadProgress = 10;
      const url = await uploadVideoToCloudinary(file, folder, (pct) => {
        uploadProgress = pct;
      });

      const oldUrl = videoUrl;
      if (oldUrl && oldUrl !== url) {
        await deleteOldImage(oldUrl);
      }

      onVideoChange(url);
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Unggah video gagal';
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

  async function handleRemoveVideo() {
    const oldUrl = videoUrl;
    onVideoChange('');
    if (oldUrl) {
      await deleteOldImage(oldUrl);
    }
  }
</script>

<div class="space-y-1.5 text-left">
  {#if label}
    <div class="flex items-center justify-between">
      <span class="block text-xs font-semibold text-base-content/80">
        {label}
      </span>
      <span class="text-[10px] text-base-content/50 font-mono">
        Maks 30MB • Auto WebM
      </span>
    </div>
  {/if}

  <input
    bind:this={fileInput}
    type="file"
    accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-m4v,.mp4,.mov,.webm,.mkv,.m4v"
    class="hidden"
    on:change={handleFileInputChange}
  />

  {#if videoUrl}
    <!-- Video Preview & Actions Container -->
    <div class="relative rounded-xl overflow-hidden border border-base-300 bg-nested group shadow-xs">
      <video
        src={videoUrl}
        controls
        playsinline
        preload="metadata"
        class="w-full aspect-video object-cover max-h-48 rounded-lg bg-black"
      >
        <track kind="captions" />
      </video>

      <div class="p-2.5 bg-base-100 flex items-center justify-between gap-2 border-t border-base-300">
        <div class="flex items-center gap-1.5 min-w-0">
          <Play size={13} class="text-primary shrink-0" />
          <span class="text-2xs font-mono text-base-content/70 truncate">
            {videoUrl.split('/').pop() || 'video-file'}
          </span>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            size="xs"
            variant="ghost"
            on:click={() => fileInput?.click()}
            disabled={isUploading}
            class="!text-xs !py-1 !px-2 text-primary hover:bg-primary/10"
          >
            Ganti Video
          </Button>
          <Button
            type="button"
            size="xs"
            variant="ghost"
            on:click={handleRemoveVideo}
            disabled={isUploading}
            class="!text-xs !py-1 !px-2 text-error hover:bg-error/10"
          >
            <X size={12} class="mr-1" />
            Hapus
          </Button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Dropzone Area -->
    <div
      role="button"
      tabindex="0"
      on:click={() => !isUploading && fileInput?.click()}
      on:keydown={handleKeydown}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
      class={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 outline-none ${
        isDragging
          ? 'border-primary bg-primary/5 scale-[0.99]'
          : 'border-base-300 hover:border-primary/50 bg-base-200/40 hover:bg-base-200/70'
      } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {#if isUploading}
        <Loader2 size={24} class="animate-spin text-primary mb-2" />
        <span class="text-xs font-semibold text-base-content">
          Mengunggah & Mengonversi ke WebM...
        </span>
        <div class="w-full bg-base-300 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            class="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={`width: ${uploadProgress}%`}
          ></div>
        </div>
        <span class="text-[10px] text-base-content/60 font-mono mt-1">
          {uploadProgress}%
        </span>
      {:else}
        <div class="w-9 h-9 rounded-full bg-base-100 flex items-center justify-center text-base-content/60 mb-2 shadow-2xs border border-base-300">
          <Video size={18} />
        </div>
        <span class="text-xs font-semibold text-base-content block">
          {placeholderTitle}
        </span>
        <span class="text-[11px] text-base-content/60 block mt-0.5">
          {placeholderSubtitle}
        </span>
        <span class="text-[10px] text-base-content/40 font-mono mt-1.5">
          MP4, MOV, WEBM, MKV (Maks 30MB)
        </span>
      {/if}
    </div>
  {/if}

  {#if errorMessage}
    <div class="text-xs text-error bg-error/10 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
      <span>{errorMessage}</span>
      <button
        type="button"
        on:click={() => (errorMessage = '')}
        class="hover:opacity-70 ml-2"
        aria-label="Tutup pesan error"
      >
        <X size={12} />
      </button>
    </div>
  {/if}
</div>
