<script lang="ts">
  import { editorStore, activeNodeId } from '../../stores/editorStore';
  import type { HeaderAnnouncementProps } from '@/types';
  import { Store } from 'lucide-svelte';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: logoType = props.logoType || 'image_text';
  $: logoText = props.logoText ?? 'Toko UMKM';
  $: logoImageUrl = props.logoImageUrl || '';
  $: logoHeight = Number(props.logoImageHeight) || 40;
  $: logoTextSize = props.logoTextSize || 'lg';
  $: logoTextWeight = props.logoTextWeight || 'bold';
  $: logoTextColor = props.logoTextColor || '';

  $: nodeStyles = props?.nodeStyles?.logo || {};
  $: isNodeActive = isActive && $activeNodeId === 'logo';

  const textSizeClassMap: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const textWeightClassMap: Record<string, string> = {
    normal: 'font-normal',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  $: textClass = `${textSizeClassMap[logoTextSize] || 'text-lg'} ${textWeightClassMap[logoTextWeight] || 'font-bold'}`;

  $: textInlineStyle = [
    logoTextColor ? `color: ${logoTextColor}` : '',
    nodeStyles.color ? `color: ${nodeStyles.color}` : '',
    nodeStyles.fontFamily ? `font-family: ${nodeStyles.fontFamily}` : '',
    nodeStyles.fontSize ? `font-size: ${nodeStyles.fontSize}` : '',
    nodeStyles.fontWeight ? `font-weight: ${nodeStyles.fontWeight}` : '',
  ].filter(Boolean).join('; ');

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    editorStore.selectNode(sectionId, 'logo');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      editorStore.selectNode(sectionId, 'logo');
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeyDown}
  class={`flex items-center gap-2.5 cursor-pointer rounded-lg p-1 transition-all select-none flex-shrink-0 ${
    isNodeActive
      ? 'ring-2 ring-blue-500 bg-blue-50/30 dark:bg-blue-950/30'
      : 'hover:opacity-90 hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
  }`}
>
  {#if logoType === 'image_only' || logoType === 'image_text'}
    {@const logoShape = props.logoShape || 'square'}
    {#if logoImageUrl}
      <img
        src={logoImageUrl}
        alt={logoText || 'Logo'}
        style={`height: ${logoHeight}px; width: ${logoShape === 'circle' ? `${logoHeight}px` : 'auto'}; max-height: 80px;`}
        class={`object-cover select-none pointer-events-none ${logoShape === 'circle' ? 'rounded-full aspect-square' : 'rounded-lg'}`}
      />
    {:else}
      <div
        style={`height: ${logoHeight}px; width: ${logoHeight}px;`}
        class={`bg-blue-600/10 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200 dark:border-blue-900 ${logoShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
      >
        <Store size={Math.max(16, Math.min(32, logoHeight * 0.55))} />
      </div>
    {/if}
  {/if}

  {#if logoType === 'text_only' || logoType === 'image_text'}
    <span
      style={textInlineStyle}
      class={`${textClass} tracking-tight leading-none truncate max-w-[200px] sm:max-w-[320px]`}
    >
      {logoText || 'Nama Toko'}
    </span>
  {/if}
</div>
