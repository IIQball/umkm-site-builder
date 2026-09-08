<script lang="ts">
  import { onMount } from 'svelte';
  import { PanelLeft, PanelRight, Sliders } from 'lucide-svelte';
  import TopBar from './TopBar.svelte';
  import LayerPanel from './LayerPanel.svelte';
  import Canvas from './Canvas.svelte';
  import PropertyInspector from './PropertyInspector.svelte';
  import { editorStore, canvasStore, activeSection } from './stores/editorStore';

  export let templateId: string;
  export let platformFeePercentage: number = 30;

  let loading = true;
  let fetchError: string | null = null;

  $: if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', $canvasStore.editorTheme);
    if ($canvasStore.editorTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

  onMount(() => {
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
  class={`builder-root h-screen w-full flex flex-col transition-colors overflow-hidden ${
    $canvasStore.editorTheme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
  }`}
  style="font-family: var(--font-ui-sans, 'Poppins', system-ui, -apple-system, sans-serif);"
>
  {#if loading}
    <div class="flex flex-col items-center justify-center h-full w-full gap-4">
      <div class="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Memuat workspace template...</p>
    </div>
  {:else if fetchError || $editorStore.error && !$editorStore.template}
    <div class="flex flex-col items-center justify-center h-full w-full gap-4 p-8 text-center">
      <div class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl font-bold">
        !
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-900 dark:text-slate-100">Gagal Memuat Template</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">{fetchError || $editorStore.error}</p>
      </div>
      <button
        on:click={fetchTemplate}
        class="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>
  {:else if $editorStore.template}
    <!-- Top Bar -->
    <TopBar
      templateId={$editorStore.template.id}
      templateName={$editorStore.template.name}
      templatePrice={$editorStore.template.price}
      {platformFeePercentage}
      status={$editorStore.template.status}
      viewMode={$canvasStore.viewMode}
      isDirty={$editorStore.isDirty}
      saving={$editorStore.isSaving}
      saveSuccess={$editorStore.saveSuccess}
      onViewModeChange={(mode) => canvasStore.setViewMode(mode)}
      onSave={() => editorStore.save()}
      onSubmit={() => editorStore.submitReview()}
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
        <button
          type="button"
          on:click={() => canvasStore.toggleLeftSidebar()}
          class="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer text-xs font-semibold"
          title="Buka Sidebar Kiri (Layers Tree) - Ctrl+\"
          aria-label="Buka Sidebar Kiri"
        >
          <PanelLeft size={14} class="text-blue-500" />
          <span class="hidden sm:inline">Layers</span>
        </button>
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
        <button
          type="button"
          on:click={() => canvasStore.toggleRightSidebar()}
          class="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md transition-all cursor-pointer text-xs font-semibold"
          title="Buka Sidebar Kanan (Inspector) - Ctrl+/"
          aria-label="Buka Sidebar Kanan"
        >
          <Sliders size={14} class="text-blue-500" />
          <span class="hidden sm:inline">Inspector</span>
          <PanelRight size={14} />
        </button>
      {/if}
    </div>
  {/if}
</div>
