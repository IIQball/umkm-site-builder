<script lang="ts">
  import ImageUploadDropzone from '../../inspector/ImageUploadDropzone.svelte';

  export let logoImageUrl: string = '';
  export let onLogoChange: (url: string) => void;
  export let label: string = 'Unggah Berkas Logo';
</script>

<ImageUploadDropzone
  imageUrl={logoImageUrl}
  onImageChange={onLogoChange}
  {label}
  placeholderTitle="Tarik & Lepas Logo ke Sini"
  placeholderSubtitle="pilih berkas logo manual"
  maxWidth={800}
  maxHeight={800}
  folder="templates"
/>
