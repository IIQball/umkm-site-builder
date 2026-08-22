<script lang="ts">
  import { editorStore, activeNodeId } from '../../stores/editorStore';
  import type { HeaderAnnouncementProps } from '@/types';

  export let props: HeaderAnnouncementProps = {};
  export let sectionId: string = '';
  export let isActive: boolean = false;

  $: showAnnouncement = props.showAnnouncement ?? true;
  $: announcementText = props.announcementText ?? 'Diskon 20% khusus hari ini';
  $: align = props.announcementAlign ?? 'center';
  $: bgColor = props.announcementBgColor || '#2563eb';
  $: textColor = props.announcementTextColor || '#ffffff';
  $: paddingY = props.announcementPaddingY || '8px';

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
    nodeStyles.fontSize ? `font-size: ${nodeStyles.fontSize}` : '',
    nodeStyles.fontWeight ? `font-weight: ${nodeStyles.fontWeight}` : '',
    nodeStyles.fontFamily ? `font-family: ${nodeStyles.fontFamily}` : '',
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

{#if showAnnouncement && announcementText}
  <div
    role="button"
    tabindex="0"
    on:click={handleClick}
    on:keydown={handleKeyDown}
    style={containerStyleString}
    class={`w-full transition-all cursor-pointer box-border ${
      isNodeActive
        ? 'ring-2 ring-blue-400 ring-inset shadow-inner'
        : 'hover:opacity-95'
    }`}
  >
    <div
      class={`w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center ${
        align === 'left' ? 'justify-start text-left' : 'justify-center text-center'
      } min-w-0`}
    >
      <p
        style={textStyleString}
        class="w-full text-xs sm:text-sm font-medium truncate sm:whitespace-normal leading-none tracking-wide flex items-center justify-center m-0 p-0"
      >
        {announcementText}
      </p>
    </div>
  </div>
{/if}
