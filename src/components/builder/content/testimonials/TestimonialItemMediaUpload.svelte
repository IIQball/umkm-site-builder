<script lang="ts">
  import ImageUploadDropzone from '../../inspector/ImageUploadDropzone.svelte';
  import VideoUploadDropzone from '../../inspector/VideoUploadDropzone.svelte';

  export let avatar: string = '';
  export let videoUrl: string = '';
  export let onAvatarChange: (url: string) => void;
  export let onVideoChange: (url: string) => void;
</script>

<div class="space-y-3 pt-1 border-t border-base-200 text-left">
  <!-- Avatar / Thumbnail Foto Pembeli -->
  <ImageUploadDropzone
    imageUrl={avatar}
    onImageChange={onAvatarChange}
    label="Foto Profil / Thumbnail Ulasan"
    placeholderTitle="Pilih Foto Profil / Sampul"
    folder="templates"
    compact={true}
  />

  <!-- Video Testimonial Pembeli -->
  <VideoUploadDropzone
    {videoUrl}
    onVideoChange={onVideoChange}
    label="Video Ulasan Pelanggan (Untuk Kartu Video)"
    placeholderTitle="Unggah Video Ulasan Pelanggan"
    folder="templates"
  />
</div>
