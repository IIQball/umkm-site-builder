<script lang="ts">
  import { editorStore, canvasStore, activeNodeId } from '../../stores/editorStore';
  import type { HeaderAnnouncementProps } from '@/types';
  import { Store } from 'lucide-svelte';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;
  export let hideTextOnMobile: boolean = false;

  $: viewMode = $canvasStore?.viewMode || 'desktop';
  $: isMobile = viewMode === 'mobile';

  $: logoType = props.logoType || 'image_text';
  $: logoText = props.logoText ?? 'Toko UMKM';
  $: logoImageUrl = props.logoImageUrl || '';
  $: logoHeight = Number(props.logoImageHeight) || 40;
  $: logoTextColor = (props.logoTextColor as string) || 'var(--theme-text-primary, #0f172a)';
  $: logoTypographyToken = (props.logoTypographyToken as string) || 'h3';

  $: nodeStyles = props?.nodeStyles?.logo || {};
  $: isNodeActive = isActive && $activeNodeId === 'logo';

  const typoTokenMap: Record<string, string> = {
    h2: 'var(--theme-text-h2, 26px)',
    h3: 'var(--theme-text-h3, 20px)',
    body: 'var(--theme-text-body, 16px)',
  };

  $: textInlineStyle = [
    `color: ${nodeStyles.color || logoTextColor}`,
    `font-size: ${nodeStyles.fontSize || typoTokenMap[logoTypographyToken] || 'var(--theme-text-h3, 20px)'}`,
    `font-weight: ${nodeStyles.fontWeight || '700'}`,
    nodeStyles.fontFamily ? `font-family: ${nodeStyles.fontFamily}` : 'font-family: var(--theme-font-heading, inherit)',
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
  class={`flex items-center gap-2.5 cursor-pointer rounded-lg transition-all select-none flex-shrink-0 ${
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
      class={`font-heading font-bold text-lg text-[var(--color-text-main,#0f172a)] tracking-tight leading-none truncate max-w-[200px] sm:max-w-[320px] ${
        hideTextOnMobile && isMobile ? 'hidden' : 'inline-block'
      }`}
    >
      {logoText || 'Nama Toko'}
    </span>
  {/if}
</div>
