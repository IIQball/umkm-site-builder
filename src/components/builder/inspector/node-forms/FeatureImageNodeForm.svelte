<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import ImageUploadDropzone from '../ImageUploadDropzone.svelte';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: mainImageUrl = (section.props?.mainImageUrl as string) || '';
</script>

<div class="space-y-4 text-left">
  <ImageUploadDropzone
    imageUrl={mainImageUrl}
    onImageChange={(url) => onPropChange('mainImageUrl', url)}
    label="Gambar Utama / Ilustrasi Showcase"
    placeholderTitle="Tarik & Lepas Gambar ke Sini"
    placeholderSubtitle="pilih berkas gambar manual"
    maxWidth={1600}
    maxHeight={1200}
  />
</div>
