<script lang="ts">
  import { editorStore, activeNodeId } from '../../stores/editorStore';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: showAnnouncement = props.showAnnouncement ?? true;
  $: announcementText = props.announcementText ?? 'Diskon 20% khusus pesanan hari ini';
  $: freeShippingText = props.freeShippingText ?? '';
  $: align = props.announcementAlign ?? 'center';
  $: bgColor = (props.announcementBgColor as string) || 'var(--theme-primary, var(--color-primary))';
  $: textColor = (props.announcementTextColor as string) || 'var(--theme-btn-primary-text, currentColor)';
  $: paddingY = (props.announcementPaddingY as string) || '8px';

  $: nodeStyles = props?.nodeStyles?.announcement || {};
  $: isNodeActive = isActive && $activeNodeId === 'announcement';

  $: containerStyleString = [
    `background-color: ${bgColor}`,
    `padding-top: ${paddingY}`,
    `padding-bottom: ${paddingY}`,
  ].join('; ');

  $: textStyleString = [
    `color: ${textColor}`,
    `text-align: ${align === 'left' ? 'left' : 'center'}`,
    nodeStyles.fontSize ? `font-size: ${nodeStyles.fontSize}` : 'font-size: var(--theme-text-caption, var(--text-caption-size, 12px))',
    nodeStyles.fontWeight ? `font-weight: ${nodeStyles.fontWeight}` : 'font-weight: var(--text-body-weight, 500)',
    nodeStyles.fontFamily ? `font-family: ${nodeStyles.fontFamily}` : 'font-family: var(--theme-font-body, var(--font-family, inherit))',
  ].filter(Boolean).join('; ');

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    editorStore.selectNode(sectionId, 'announcement');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      editorStore.selectNode(sectionId, 'announcement');
    }
  };
</script>

{#if showAnnouncement && (announcementText || freeShippingText)}
  <div
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={handleKeyDown}
    style={containerStyleString}
    class={`w-full transition-all cursor-pointer box-border ${
      isNodeActive
        ? 'ring-2 ring-[var(--theme-primary,var(--color-primary))] ring-inset shadow-inner'
        : 'hover:opacity-95'
    }`}
  >
    <div
      class={`announcement-inner-container w-full mx-auto flex items-center ${
        align === 'left' ? 'justify-start text-left' : 'justify-center text-center'
      } min-w-0 box-border`}
      style="max-width: var(--theme-max-width, var(--active-max-width, 1200px)); padding-left: var(--active-safe-zone, var(--active-margin, 24px)); padding-right: var(--active-safe-zone, var(--active-margin, 24px));"
    >
      <p
        style={textStyleString}
        class={`w-full truncate sm:whitespace-normal leading-normal tracking-wide flex items-center ${
          align === 'left' ? 'justify-start' : 'justify-center'
        } gap-2 m-0 p-0`}
      >
        <span>{announcementText}</span>
        {#if freeShippingText}
          <span class="opacity-85 font-normal">| {freeShippingText}</span>
        {/if}
      </p>
    </div>
  </div>
{/if}
