<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import ImageUpload from '@/components/shared/ImageUpload.svelte';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void;

  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageMode = (section.props?.imageMode as 'element' | 'background') ?? 'element';
</script>

<div class="space-y-3">
  <div>
    <span class="block font-semibold text-base-content/80 mb-1">Tipe Penempatan Banner</span>
    <div class="grid grid-cols-2 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      <button
        type="button"
        on:click={() => onPropChange('imageMode', 'element')}
        class="py-1.5 px-2 rounded-lg text-xs font-bold border transition-all {imageMode === 'element' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-base-200/50 border-base-300'}"
      >
        Elemen Bebas
      </button>
      <button
        type="button"
        on:click={() => onPropChange('imageMode', 'background')}
        class="py-1.5 px-2 rounded-lg text-xs font-bold border transition-all {imageMode === 'background' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-base-200/50 border-base-300'}"
      >
        Full Background
      </button>
    </div>
  </div>

  <div class="space-y-1">
    <span class="block font-semibold text-base-content/80 mb-1">File Gambar Banner</span>
    <ImageUpload
      value={imageUrl}
      maxFiles={1}
      folder="templates"
      onSingleUpload={(url) => onPropChange('imageUrl', url)}
    />
  </div>
</div>
