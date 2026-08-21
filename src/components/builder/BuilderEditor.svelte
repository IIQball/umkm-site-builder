<script lang="ts">
  import { onMount } from 'svelte';
  import TopBar from './TopBar.svelte';
  import LayerPanel from './LayerPanel.svelte';
  import Canvas from './Canvas.svelte';
  import PropertyInspector from './PropertyInspector.svelte';
  import { editorStore, activeSection } from './stores/editorStore';

  export let templateId: string;
  export let platformFeePercentage: number = 30;

  let loading = true;
  let fetchError: string | null = null;


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
      console.log('[Builder] Template loaded successfully:', result.data.id);
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
    console.log('[Builder] Selected section:', id);
    editorStore.selectSection(id);
  };

  const handleKeydown = (e: KeyboardEvent) => {
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
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        editorStore.toggleColumnGrid();
      }
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col h-full w-full bg-base-100 text-base-content overflow-hidden transition-colors">
  {#if loading}
    <div class="flex flex-col items-center justify-center h-full w-full gap-4">
      <div class="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      <p class="text-xs font-medium text-base-content/60">Memuat workspace template...</p>
    </div>
  {:else if fetchError || $editorStore.error && !$editorStore.template}
    <div class="flex flex-col items-center justify-center h-full w-full gap-4 p-8 text-center">
      <div class="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl font-bold">
        !
      </div>
      <div>
        <h2 class="text-base font-bold text-base-content">Gagal Memuat Template</h2>
        <p class="text-xs text-base-content/60 mt-1 max-w-md">{fetchError || $editorStore.error}</p>
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
      viewMode={$editorStore.viewMode}
      isDirty={$editorStore.isDirty}
      saving={$editorStore.isSaving}
      saveSuccess={$editorStore.saveSuccess}
      onViewModeChange={(mode) => editorStore.setViewMode(mode)}
      onSave={() => editorStore.save()}
      onSubmit={() => editorStore.submitReview()}
    />

    <!-- Main Workspace: 3 Columns -->
    <div class="flex flex-1 w-full overflow-hidden bg-base-100">
      <!-- Left Panel: Layers / Sections -->
      <LayerPanel
        sections={$editorStore.template.config.sections}
        selectedSectionId={$editorStore.selectedSectionId}
        selectedNodeId={$editorStore.selectedNodeId}
        onSelectNode={(secId, nodeId) => editorStore.selectNode(secId, nodeId)}
        onAddSection={(type) => editorStore.addSection(type)}
        onDeleteSection={(id) => editorStore.deleteSection(id)}
        onReorderSection={(id, dir) => editorStore.reorderSection(id, dir)}
      />

      <!-- Middle Panel: Canvas Preview -->
      <Canvas
        sections={$editorStore.template.config.sections}
        selectedSectionId={$editorStore.selectedSectionId}
        viewMode={$editorStore.viewMode}
        onSelectSection={handleSelectSection}
      />

      <!-- Right Panel: Property Inspector -->
      <PropertyInspector
        section={$activeSection}
        onSectionUpdate={(section) => editorStore.updateSection(section)}
      />
    </div>
  {/if}
</div>
