<script lang="ts">
  import { Image as ImageIcon } from 'lucide-svelte';
  import type { TemplateSection } from '@/schemas';
  import HeaderLogoUpload from './HeaderLogoUpload.svelte';

  export let section: TemplateSection;
  export let handlePropChange: (key: string, value: unknown) => void;

  $: logoType = section.props?.logoType || 'image_text';
  $: logoShape = section.props?.logoShape || 'square';
</script>

<div class="space-y-3 p-3 bg-base-200/40 dark:bg-slate-900/40 rounded-xl border border-base-200 dark:border-slate-800">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
    <ImageIcon size={14} class="text-blue-500" />
    <span>Logo Brand & Toko</span>
  </div>

  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Bentuk Tampilan Logo</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
      <button
        type="button"
        on:click={() => handlePropChange('logoType', 'image_only')}
        class={`py-1 rounded font-medium transition-colors cursor-pointer ${
          logoType === 'image_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Gambar
      </button>
      <button
        type="button"
        on:click={() => handlePropChange('logoType', 'text_only')}
        class={`py-1 rounded font-medium transition-colors cursor-pointer ${
          logoType === 'text_only' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Teks
      </button>
      <button
        type="button"
        on:click={() => handlePropChange('logoType', 'image_text')}
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
      <label for="logo-text" class="block font-medium text-[11px] text-base-content/70 mb-1">
        Nama Toko / Brand
      </label>
      <input
        id="logo-text"
        type="text"
        value={section.props?.logoText ?? ''}
        on:input={(e) => handlePropChange('logoText', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Nama Brand UMKM"
      />
    </div>
  {/if}

  {#if logoType === 'image_only' || logoType === 'image_text'}
    <div>
      <span class="block font-medium text-[11px] text-base-content/70 mb-1">Bentuk Bingkai Logo</span>
      <div class="grid grid-cols-2 gap-1.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800 text-[11px]">
        <button
          type="button"
          on:click={() => handlePropChange('logoShape', 'square')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoShape === 'square' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Persegi / Kotak
        </button>
        <button
          type="button"
          on:click={() => handlePropChange('logoShape', 'circle')}
          class={`py-1 rounded font-medium transition-colors cursor-pointer ${
            logoShape === 'circle' ? 'bg-base-100 text-base-content font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Lingkaran / Bulat
        </button>
      </div>
    </div>

    <div class="pt-1">
      <HeaderLogoUpload
        logoImageUrl={(section.props?.logoImageUrl as string) || ''}
        onLogoChange={(url) => handlePropChange('logoImageUrl', url)}
      />
    </div>
  {/if}
</div>
