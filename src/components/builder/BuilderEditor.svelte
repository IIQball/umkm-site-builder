<script lang="ts">
  import { onMount } from 'svelte';
  import { PanelLeft, PanelRight, Sliders } from 'lucide-svelte';
  import TopBar from './TopBar.svelte';
  import LayerPanel from './LayerPanel.svelte';
  import Canvas from './Canvas.svelte';
  import PropertyInspector from './PropertyInspector.svelte';
  import { Button } from '@/components/ui';
  import { editorStore, canvasStore, activeSection, maxStoreBranchesStore } from './stores/editorStore';
  import { applyTheme } from '@/lib/utils/theme';

  export let templateId: string;
  export let platformFeePercentage: number = 30;
  export let maxStoreBranches: number = 5;

  $: if (maxStoreBranches) {
    maxStoreBranchesStore.set(maxStoreBranches);
  }

  let loading = true;
  let fetchError: string | null = null;

  $: if (typeof document !== 'undefined') {
    applyTheme($canvasStore.editorTheme);
  }

  const fetchTemplate = async () => {
    loading = true;
    fetchError = null;
    try {
      const response = await fetch(`/api/designer/templates/draft?templateId=${encodeURIComponent(templateId)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.ok || !result.data) {
        throw new Error(result.error?.message || 'Invalid response from server');
      }

      editorStore.init(result.data);
    } catch (err) {
      fetchError = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('[Builder] Error loading template:', err);
    } finally {
      loading = false;
    }
  };

  onMount(async () => {
    canvasStore.initEditorTheme();
    maxStoreBranchesStore.set(maxStoreBranches);
    try {
      const res = await fetch('/api/public/platform-settings');
      const result = await res.json();
      if (result.ok && result.data && typeof result.data.maxStoreBranches === 'number') {
        maxStoreBranches = result.data.maxStoreBranches;
        maxStoreBranchesStore.set(result.data.maxStoreBranches);
      }
    } catch {
      // Keep prop value
    }
    fetchTemplate();
  });

  const handleSelectSection = (id: string | null) => {
    canvasStore.selectSection(id);
  };

  const handleSelectNode = (secId: string, nodeId: string | null) => {
    canvasStore.selectNode(secId, nodeId);
  };

  const handleAddSection = (type: import('@/schemas').TemplateSection['type']) => {
    editorStore.addSection(type);
  };

  const handleDeleteSection = (id: string) => {
    editorStore.deleteSection(id);
  };

  const handleReorderSection = (id: string, dir: 'up' | 'down') => {
    editorStore.reorderSection(id, dir);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        editorStore.redo();
      } else {
        e.preventDefault();
        editorStore.undo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      editorStore.redo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      editorStore.save();
    } else if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') || (e.shiftKey && e.key.toLowerCase() === 'g')) {
      if (!isInput) {
        e.preventDefault();
        canvasStore.toggleColumnGrid();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
      if (!isInput) {
        e.preventDefault();
        canvasStore.toggleLeftSidebar();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      if (!isInput) {
        e.preventDefault();
        canvasStore.toggleRightSidebar();
      }
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div
  data-theme={$canvasStore.editorTheme}
  data-builder-shell
  class={`builder-root h-screen w-full flex flex-col font-sans transition-colors overflow-hidden ${
    $canvasStore.editorTheme === 'dark' ? 'dark bg-canvas text-main' : 'bg-canvas text-main'
  }`}
>
  {#if loading}
    <div class="flex flex-col items-center justify-center h-full w-full gap-4">
      <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs font-medium text-secondary">Memuat workspace template...</p>
    </div>
  {:else if fetchError || $editorStore.error && !$editorStore.template}
    <div class="flex flex-col items-center justify-center h-full w-full gap-4 p-8 text-center">
      <div class="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center text-xl font-bold">
        !
      </div>
      <div>
        <h2 class="text-base font-bold text-main">Gagal Memuat Template</h2>
        <p class="text-xs text-secondary mt-1 max-w-md">{fetchError || $editorStore.error}</p>
      </div>
      <Button
        variant="primary"
        size="sm"
        on:click={fetchTemplate}
      >
        Coba Lagi
      </Button>
    </div>
  {:else if $editorStore.template}
    <!-- Top Bar -->
    <TopBar
      templateId={$editorStore.template.id}
      templateName={$editorStore.template.name}
      templatePrice={$editorStore.template.price}
      {platformFeePercentage}
      status={$editorStore.template.status}
      rejectionReason={$editorStore.template.rejectionReason}
      revisionCount={$editorStore.template.revisionCount ?? 0}
      viewMode={$canvasStore.viewMode}
      isDirty={$editorStore.isDirty}
      saving={$editorStore.isSaving}
      saveSuccess={$editorStore.saveSuccess}
      onViewModeChange={(mode) => canvasStore.setViewMode(mode)}
      onSave={() => editorStore.save()}
      onSubmit={(notes) => editorStore.submitReview(notes)}
    />

    <!-- Main Workspace: Left Sidebar, Canvas, Right Sidebar -->
    <div class="flex flex-1 w-full overflow-hidden relative">
      <!-- Left Panel: Layers / Sections -->
      {#if $canvasStore.leftSidebarOpen}
        <LayerPanel
          sections={$editorStore.template.config.sections}
          selectedSectionId={$canvasStore.selectedSectionId}
          selectedNodeId={$canvasStore.selectedNodeId}
          onSelectNode={handleSelectNode}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
          onReorderSection={handleReorderSection}
        />
      {:else}
        <!-- Floating Button to Open Left Sidebar -->
        <Button
          type="button"
          variant="secondary"
          size="xs"
          on:click={() => canvasStore.toggleLeftSidebar()}
          class="!absolute top-3 left-3 z-30 shadow-md bg-card hover:bg-nested border border-light"
          title="Buka Sidebar Kiri (Layers Tree) - Ctrl+\"
        >
          <PanelLeft size={14} class="text-primary" />
          <span class="hidden sm:inline">Layers</span>
        </Button>
      {/if}

      <!-- Middle Panel: Canvas Preview -->
      <Canvas
        sections={$editorStore.template.config.sections}
        selectedSectionId={$canvasStore.selectedSectionId}
        viewMode={$canvasStore.viewMode}
        onSelectSection={handleSelectSection}
      />

      <!-- Right Panel: Property Inspector -->
      {#if $canvasStore.rightSidebarOpen}
        <PropertyInspector
          section={$activeSection}
          onSectionUpdate={(section) => editorStore.updateSection(section)}
        />
      {:else}
        <!-- Floating Button to Open Right Sidebar -->
        <Button
          type="button"
          variant="secondary"
          size="xs"
          on:click={() => canvasStore.toggleRightSidebar()}
          class="!absolute top-3 right-3 z-30 shadow-md bg-card hover:bg-nested border border-light"
          title="Buka Sidebar Kanan (Inspector) - Ctrl+/"
        >
          <Sliders size={14} class="text-primary" />
          <span class="hidden sm:inline">Inspector</span>
          <PanelRight size={14} />
        </Button>
      {/if}
    </div>
  {/if}
</div>
