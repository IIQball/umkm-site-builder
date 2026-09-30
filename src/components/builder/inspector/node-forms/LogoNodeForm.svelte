<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import HeaderLogoUpload from '../../content/header/HeaderLogoUpload.svelte';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: logoType = section.props?.logoType || 'image_text';
  $: logoImageUrl = (section.props?.logoImageUrl as string) || '';
</script>

<div class="space-y-3">
  <div class="space-y-1">
    <label class="font-semibold text-base-content" for="logo-type-select">Tipe Tampilan Logo</label>
    <select
      id="logo-type-select"
      value={logoType}
      on:change={(e) => onPropChange('logoType', e.currentTarget.value)}
      class="w-full px-2 py-1.5 bg-base-200/50 border border-base-300 rounded-lg text-xs cursor-pointer"
    >
      <option value="image_text">Icon Gambar & Teks</option>
      <option value="text_only">Hanya Teks Toko</option>
      <option value="image_only">Hanya Gambar Logo</option>
    </select>
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-base-content" for="logo-text-input">Nama Toko (Teks Brand)</label>
    <input
      id="logo-text-input"
      type="text"
      value={section.props?.logoText || ''}
      on:input={(e) => onPropChange('logoText', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 border border-base-300 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Nama Toko Anda"
    />
  </div>

  {#if logoType !== 'text_only'}
    <HeaderLogoUpload
      {logoImageUrl}
      onLogoChange={(url) => onPropChange('logoImageUrl', url)}
    />
  {/if}
</div>
