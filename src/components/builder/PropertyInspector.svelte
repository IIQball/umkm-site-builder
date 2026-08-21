<script lang="ts">
  import { Sliders, Type, ChevronRight } from 'lucide-svelte';
  import ContentTab from './ContentTab.svelte';
  import StylesTab from './StylesTab.svelte';
  import NodeStylesTab from './NodeStylesTab.svelte';
  import NodeContentForm from './inspector/NodeContentForm.svelte';
  import GlobalThemeInspector from './inspector/GlobalThemeInspector.svelte';
  import HeaderAnnouncementPanel from './inspector/header/HeaderAnnouncementPanel.svelte';
  import HeaderLogoPanel from './inspector/header/HeaderLogoPanel.svelte';
  import HeaderNavPanel from './inspector/header/HeaderNavPanel.svelte';
  import type { TemplateSection } from '@/schemas';
  import { editorStore, activeNodeId } from './stores/editorStore';

  export let section: TemplateSection | undefined = undefined;
  export let onSectionUpdate: (section: TemplateSection) => void;

  let activeTab: 'content' | 'styles' = 'content';
  let nodeTab: 'content' | 'styles' = 'styles';

  const getNodeLabel = (nodeId: string): string => {
    switch (nodeId) {
      case 'badge': return 'Promo Badge';
      case 'title': return 'Heading Title';
      case 'subtitle': return 'Subtitle Description';
      case 'image': return 'Banner Image';
      case 'cta': return 'CTA Button';
      case 'announcement': return 'Announcement Bar';
      case 'logo': return 'Logo & Brand';
      case 'nav_links': return 'Navigation Menu';
      case 'header': return 'Section Header';
      case 'items': return 'Card Items';
      case 'whatsapp': return 'WhatsApp Contact';
      case 'address': return 'Store Location';
      case 'info': return 'Information Links';
      case 'copyright': return 'Copyright Text';
      default: return nodeId.startsWith('nav_') ? 'Navigation Menu' : nodeId;
    }
  };

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

<aside class="w-80 flex-shrink-0 bg-base-100 border-l border-base-200 dark:border-slate-800 flex flex-col h-full overflow-hidden text-base-content transition-colors">
  {#if !section}
    <GlobalThemeInspector />
  {:else}
    <!-- Section & Node Breadcrumb Header -->
    <div class="px-4 py-3 border-b border-base-200 dark:border-slate-800 flex flex-col gap-1 bg-base-100">
      <div class="flex items-center gap-1.5 text-xs text-base-content/60">
        <button
          type="button"
          on:click={() => editorStore.selectNode(section.id, null)}
          class={`font-semibold hover:text-base-content transition-colors uppercase tracking-wider cursor-pointer ${
            !$activeNodeId ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-base-content/60 hover:underline'
          }`}
        >
          {section.type.replace('_', ' ')}
        </button>

        {#if $activeNodeId}
          <ChevronRight size={13} class="text-base-content/40" />
          <span class="text-blue-600 dark:text-blue-400 font-semibold truncate">
            {getNodeLabel($activeNodeId)}
          </span>
        {/if}
      </div>
      <p class="text-[10px] text-base-content/40 font-mono">{section.id}</p>
    </div>

    <!-- Contextual Node Inspector (when a specific sub-element is selected) -->
    {#if $activeNodeId}
      <!-- Node Level Tab Switcher -->
      <div class="grid grid-cols-2 border-b border-base-200 dark:border-slate-800 bg-base-200/50 p-1 gap-1">
        <button
          type="button"
          on:click={() => (nodeTab = 'styles')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            nodeTab === 'styles'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Sliders size={13} />
          <span>Styles Node</span>
        </button>
        <button
          type="button"
          on:click={() => (nodeTab = 'content')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            nodeTab === 'content'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Type size={13} />
          <span>Konten Node</span>
        </button>
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
      <div class="grid grid-cols-2 border-b border-base-200 dark:border-slate-800 bg-base-200/50 p-1 gap-1">
        <button
          type="button"
          on:click={() => (activeTab = 'content')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Type size={13} />
          <span>Content</span>
        </button>
        <button
          type="button"
          on:click={() => (activeTab = 'styles')}
          class={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'styles'
              ? 'bg-base-100 text-base-content font-semibold shadow-sm'
              : 'text-base-content/60 hover:text-base-content'
          }`}
        >
          <Sliders size={13} />
          <span>Styles</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto">
        {#if activeTab === 'content'}
          <ContentTab {section} onUpdate={onSectionUpdate} />
        {:else}
          <StylesTab {section} onUpdate={onSectionUpdate} />
        {/if}
      </div>
    {/if}
  {/if}
</aside>
