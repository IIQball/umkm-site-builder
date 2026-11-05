<script lang="ts">
  import VideoUploadDropzone from '../../inspector/VideoUploadDropzone.svelte';

  export let videoUrl: string = '';
  export let onPropChange: (key: string, value: unknown) => void;
</script>

<div class="pt-2 border-t border-base-300 text-left">
  <VideoUploadDropzone
    {videoUrl}
    onVideoChange={(url) => onPropChange('videoUrl', url)}
    label="Video Latar Belakang Hero (Loop)"
    placeholderTitle="Tarik & Lepas Video Hero ke Sini"
    placeholderSubtitle="atau pilih berkas manual"
    folder="templates"
  />
</div>
