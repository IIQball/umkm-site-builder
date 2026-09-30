<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import HeroImageUploadContent from '../../content/hero/HeroImageUploadContent.svelte';
  import HeroImageStyleSettings from '../../content/hero/HeroImageStyleSettings.svelte';
  import { isHeroNonBackgroundImage } from '../../sections/hero/heroLayout.helpers';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: activePreset =
    (section.props?.layoutPreset as string) ||
    (section.styles?.layoutPreset as string) ||
    section.layoutPreset ||
    'split_left_text';

  $: imageUrl = (section.props?.imageUrl as string) ?? '';
  $: imageFrame = (section.props?.imageFrame as string) ?? 'none';
  $: imageShape = (section.props?.imageShape as string) ?? 'rounded';
  $: isNonBg = isHeroNonBackgroundImage(activePreset);
</script>

<div class="space-y-3">
  <HeroImageUploadContent {imageUrl} {onPropChange} />
  {#if isNonBg}
    <HeroImageStyleSettings {imageFrame} {imageShape} {onPropChange} />
  {/if}
</div>
