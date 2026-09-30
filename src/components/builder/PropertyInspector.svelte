<script lang="ts">
  import { Sliders, Type, LayoutGrid, ChevronRight, PanelRightClose } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import ContentTab from './ContentTab.svelte';
  import LayoutTab from './LayoutTab.svelte';
  import StylesTab from './StylesTab.svelte';
  import NodeStylesTab from './NodeStylesTab.svelte';
  import NodeContentForm from './inspector/NodeContentForm.svelte';
  import GlobalThemeInspector from './inspector/GlobalThemeInspector.svelte';
  import HeaderAnnouncementPanel from './inspector/header/HeaderAnnouncementPanel.svelte';
  import HeaderLogoPanel from './inspector/header/HeaderLogoPanel.svelte';
  import HeaderNavPanel from './inspector/header/HeaderNavPanel.svelte';
  import { getNodeLabel } from './inspector/nodeContent.constants';
  import { sectionTypeLabels } from './layer/layerPanel.helpers';
  import type { TemplateSection } from '@/schemas';
  import { editorStore, canvasStore, activeNodeId } from './stores/editorStore';

  export let section: TemplateSection | undefined = undefined;
  export let onSectionUpdate: (section: TemplateSection) => void;

  let activeTab: 'layout' | 'content' | 'styles' = 'layout';
  let nodeTab: 'content' | 'styles' = 'styles';

  const handlePropChange = (key: string, value: unknown) => {
    if (!section) return;
    const updated: TemplateSection = {
      ...section,
      props: {
        ...(section.props || {}),
        [key]: value,
      },
    };
    onSectionUpdate(updated);
  };
</script>

<aside class="w-80 flex-shrink-0 bg-base-100 border-l border-base-300 flex flex-col h-full overflow-hidden text-base-content transition-colors">
  {#if !section}
    <div class="relative flex-1 flex flex-col overflow-hidden">
      <!-- Close button overlay for Global Theme Inspector -->
      <Button
        type="button"
        size="xs"
        variant="ghost"
        on:click={() => canvasStore.toggleRightSidebar()}
        class="!absolute top-2.5 right-2.5 z-20 !p-1.5 !h-7 !w-7 !min-h-0 !min-w-0 rounded-md text-base-content/60 hover:text-base-content hover:bg-base-200/80"
        title="Tutup Inspector (Ctrl+/)"
      >
        <PanelRightClose size={15} />
      </Button>
      <GlobalThemeInspector />
    </div>
  {:else}
    <!-- Section & Node Breadcrumb Header -->
    <div class="px-4 py-3 border-b border-base-200 flex items-start justify-between gap-2 bg-base-100">
      <div class="flex flex-col gap-1 min-w-0 flex-1">
        <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
          <button
            type="button"
            on:click={() => editorStore.selectNode(section.id, null)}
            class="text-left font-semibold text-xs leading-snug transition-colors hover:text-primary hover:underline cursor-pointer {!$activeNodeId ? 'text-primary font-bold' : 'text-base-content/70'}"
            title={sectionTypeLabels[section.type] || section.type}
          >
            {sectionTypeLabels[section.type] || section.type.replace('_', ' ')}
          </button>

          {#if $activeNodeId}
            <ChevronRight size={12} class="text-base-content/40 flex-shrink-0" />
            <span
              class="text-primary font-bold text-xs leading-snug break-words"
              title={getNodeLabel($activeNodeId, section?.type, (section?.layoutPreset || section?.props?.layoutPreset || 'grid_3_cards') as string)}
            >
              {getNodeLabel($activeNodeId, section?.type, (section?.layoutPreset || section?.props?.layoutPreset || 'grid_3_cards') as string)}
            </span>
          {/if}
        </nav>
        <p class="text-3xs text-base-content/40 font-mono">
          {section.id}{#if $activeNodeId} &bull; {$activeNodeId}{/if}
        </p>
      </div>

      <!-- Close Inspector Button -->
      <Button
        type="button"
        size="xs"
        variant="ghost"
        on:click={() => canvasStore.toggleRightSidebar()}
        class="!p-1 !h-7 !w-7 !min-h-0 !min-w-0 rounded-md text-base-content/60 hover:text-base-content hover:bg-base-200 flex-shrink-0"
        title="Tutup Inspector (Ctrl+/)"
      >
        <PanelRightClose size={15} />
      </Button>
    </div>

    <!-- Contextual Node Inspector (when a specific sub-element is selected) -->
    {#if $activeNodeId}
      <!-- Node Level Tab Switcher -->
      <div class="grid grid-cols-2 border-b border-base-200 bg-base-200/50 p-1 gap-1">
        <Button
          type="button"
          size="xs"
          variant={nodeTab === 'styles' ? 'secondary' : 'ghost'}
          on:click={() => (nodeTab = 'styles')}
          class={`!flex !items-center !justify-center !gap-1.5 !py-1.5 !h-auto !min-h-0 rounded-md text-xs font-medium transition-all ${
            nodeTab === 'styles'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Sliders size={13} />
          <span>Styles Node</span>
        </Button>
        <Button
          type="button"
          size="xs"
          variant={nodeTab === 'content' ? 'secondary' : 'ghost'}
          on:click={() => (nodeTab = 'content')}
          class={`!flex !items-center !justify-center !gap-1.5 !py-1.5 !h-auto !min-h-0 rounded-md text-xs font-medium transition-all ${
            nodeTab === 'content'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Type size={13} />
          <span>Konten Node</span>
        </Button>
      </div>

      <div class="flex-1 overflow-y-auto">
        {#if nodeTab === 'styles'}
          {#if section.type === 'header_announcement' && $activeNodeId === 'announcement'}
            <div class="p-4 space-y-4 text-xs text-base-content/80">
              <HeaderAnnouncementPanel {section} onConfigChange={handlePropChange} />
            </div>
          {:else if section.type === 'header_announcement' && $activeNodeId === 'logo'}
            <div class="p-4 space-y-4 text-xs text-base-content/80">
              <HeaderLogoPanel {section} onConfigChange={handlePropChange} />
            </div>
          {:else if section.type === 'header_announcement' && ($activeNodeId === 'nav_links' || $activeNodeId.startsWith('nav_'))}
            <div class="p-4 space-y-4 text-xs text-base-content/80">
              <HeaderNavPanel {section} onConfigChange={handlePropChange} />
            </div>
          {:else}
            <NodeStylesTab {section} nodeId={$activeNodeId} onUpdate={onSectionUpdate} />
          {/if}
        {:else}
          <NodeContentForm
            {section}
            nodeId={$activeNodeId}
            onPropChange={handlePropChange}
            {onSectionUpdate}
          />
        {/if}
      </div>
    {:else}
      <!-- Standard Full Section Tab Bar -->
      <div class="grid grid-cols-3 border-b border-base-200 bg-base-200/50 p-1 gap-1">
        <Button
          type="button"
          size="xs"
          variant={activeTab === 'layout' ? 'secondary' : 'ghost'}
          on:click={() => (activeTab = 'layout')}
          class={`!flex !items-center !justify-center !gap-1.5 !py-1.5 !h-auto !min-h-0 rounded-md text-xs font-medium transition-all ${
            activeTab === 'layout'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <LayoutGrid size={13} />
          <span>Tata Letak</span>
        </Button>
        <Button
          type="button"
          size="xs"
          variant={activeTab === 'content' ? 'secondary' : 'ghost'}
          on:click={() => (activeTab = 'content')}
          class={`!flex !items-center !justify-center !gap-1.5 !py-1.5 !h-auto !min-h-0 rounded-md text-xs font-medium transition-all ${
            activeTab === 'content'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Type size={13} />
          <span>Content</span>
        </Button>
        <Button
          type="button"
          size="xs"
          variant={activeTab === 'styles' ? 'secondary' : 'ghost'}
          on:click={() => (activeTab = 'styles')}
          class={`!flex !items-center !justify-center !gap-1.5 !py-1.5 !h-auto !min-h-0 rounded-md text-xs font-medium transition-all ${
            activeTab === 'styles'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Sliders size={13} />
          <span>Styles</span>
        </Button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto">
        {#if activeTab === 'layout'}
          <LayoutTab {section} />
        {:else if activeTab === 'content'}
          <ContentTab {section} onUpdate={onSectionUpdate} />
        {:else}
          <StylesTab {section} onUpdate={onSectionUpdate} />
        {/if}
      </div>
    {/if}
  {/if}
</aside>
