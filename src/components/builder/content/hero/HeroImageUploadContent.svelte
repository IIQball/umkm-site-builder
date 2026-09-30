<script lang="ts">
  import ImageUploadDropzone from '../../inspector/ImageUploadDropzone.svelte';

  export let imageUrl: string = '';
  export let onPropChange: (key: string, value: unknown) => void;
</script>

<div class="pt-2 border-t border-base-300 text-left">
  <ImageUploadDropzone
    {imageUrl}
    onImageChange={(url) => onPropChange('imageUrl', url)}
    label="Gambar Spanduk / Ilustrasi"
    placeholderTitle="Tarik & Lepas Gambar ke Sini"
    placeholderSubtitle="pilih berkas manual"
    maxWidth={1920}
    maxHeight={1080}
    folder="templates"
  />
</div>
