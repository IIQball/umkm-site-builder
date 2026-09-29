<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import HeroImageUploadContent from '../../content/hero/HeroImageUploadContent.svelte';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: imageUrl = (section.props?.imageUrl as string) ?? '';
</script>

<div class="space-y-3">
  <HeroImageUploadContent {imageUrl} {onPropChange} />
</div>
