<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import ImageUpload from '@/components/shared/ImageUpload.svelte';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void;

  $: logoType = section.props?.logoType || 'image_text';
  $: logoImageUrl = (section.props?.logoImageUrl as string) || '';
</script>

<div class="space-y-3">
  <div>
    <span class="block font-semibold text-base-content/80 mb-1">Mode Tampilan Logo</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      <button
        type="button"
        on:click={() => onPropChange('logoType', 'image_only')}
        class={`py-1 rounded font-medium transition-colors cursor-pointer ${
          logoType === 'image_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Gambar
      </button>
      <button
        type="button"
        on:click={() => onPropChange('logoType', 'text_only')}
        class={`py-1 rounded font-medium transition-colors cursor-pointer ${
          logoType === 'text_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Teks
      </button>
      <button
        type="button"
        on:click={() => onPropChange('logoType', 'image_text')}
        class={`py-1 rounded font-medium transition-colors cursor-pointer ${
          logoType === 'image_text' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Kombinasi
      </button>
    </div>
  </div>

  {#if logoType === 'text_only' || logoType === 'image_text'}
    <div>
      <label for="node-logo-text" class="block font-semibold text-base-content/80 mb-1">Nama Toko / Brand</label>
      <input
        id="node-logo-text"
        type="text"
        value={section.props?.logoText ?? ''}
        on:input={(e) => onPropChange('logoText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
        placeholder="Nama Brand UMKM"
      />
    </div>
  {/if}

  {#if logoType === 'image_only' || logoType === 'image_text'}
    <div class="space-y-1">
      <span class="block font-semibold text-base-content/80 mb-1">Gambar Logo Toko</span>
      <ImageUpload
        value={logoImageUrl}
        maxFiles={1}
        folder="templates"
        compact={true}
        label="File Gambar Logo"
        onSingleUpload={(url) => onPropChange('logoImageUrl', url)}
      />
    </div>
  {/if}
</div>
