<script lang="ts">
  import ImageUploadDropzone from '../../inspector/ImageUploadDropzone.svelte';

  export let avatarUrl: string = '';
  export let index: number = 0;
  export let onAvatarChange: (url: string) => void;
</script>

<ImageUploadDropzone
  imageUrl={avatarUrl}
  onImageChange={onAvatarChange}
  label={`Foto Profil #${index + 1}`}
  placeholderTitle="Unggah Avatar"
  placeholderSubtitle="pilih foto avatar"
  maxWidth={256}
  maxHeight={256}
  folder="templates"
  compact={true}
/>
