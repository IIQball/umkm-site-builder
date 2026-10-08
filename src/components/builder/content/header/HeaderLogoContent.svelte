<script lang="ts">
  import { Image as ImageIcon } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import type { TemplateSection } from '@/schemas';
  import HeaderLogoUpload from './HeaderLogoUpload.svelte';

  export let section: TemplateSection;
  export let handlePropChange: (key: string, value: unknown) => void;

  $: logoType = section.props?.logoType || 'image_text';
  $: logoShape = section.props?.logoShape || 'square';
</script>

<div class="space-y-3 p-3 bg-base-200/40 rounded-xl border border-base-200">
  <div class="flex items-center gap-1.5 text-xs font-semibold text-base-content">
    <ImageIcon size={14} class="text-blue-500" />
    <span>Logo Brand & Toko</span>
  </div>

  <div>
    <span class="block font-medium text-[11px] text-base-content/70 mb-1">Bentuk Tampilan Logo</span>
    <div class="grid grid-cols-3 gap-1 bg-base-200/80 p-1 rounded-lg border border-base-300 text-[11px]">
      <Button
        type="button"
        size="xs"
        variant={logoType === 'image_only' ? 'primary' : 'ghost'}
        on:click={() => handlePropChange('logoType', 'image_only')}
        class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
          logoType === 'image_only' ? 'font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Gambar
      </Button>
      <Button
        type="button"
        size="xs"
        variant={logoType === 'text_only' ? 'primary' : 'ghost'}
        on:click={() => handlePropChange('logoType', 'text_only')}
        class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
          logoType === 'text_only' ? 'font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Teks
      </Button>
      <Button
        type="button"
        size="xs"
        variant={logoType === 'image_text' ? 'primary' : 'ghost'}
        on:click={() => handlePropChange('logoType', 'image_text')}
        class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
          logoType === 'image_text' ? 'font-bold shadow-sm' : 'text-base-content/60'
        }`}
      >
        Kombinasi
      </Button>
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
      <div class="grid grid-cols-2 gap-1.5 bg-base-200/80 p-1 rounded-lg border border-base-300 text-[11px]">
        <Button
          type="button"
          size="xs"
          variant={logoShape === 'square' ? 'primary' : 'ghost'}
          on:click={() => handlePropChange('logoShape', 'square')}
          class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
            logoShape === 'square' ? 'font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Persegi / Kotak
        </Button>
        <Button
          type="button"
          size="xs"
          variant={logoShape === 'circle' ? 'primary' : 'ghost'}
          on:click={() => handlePropChange('logoShape', 'circle')}
          class={`!py-1 !h-auto !min-h-0 rounded font-medium text-center ${
            logoShape === 'circle' ? 'font-bold shadow-sm' : 'text-base-content/60'
          }`}
        >
          Lingkaran / Bulat
        </Button>
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
