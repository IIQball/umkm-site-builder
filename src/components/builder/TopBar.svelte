<script lang="ts">
  import {
    Save,
    Send,
    Monitor,
    Tablet,
    Smartphone,
    CheckCircle2,
    Loader2,
    Undo2,
    Redo2,
    Sun,
    Moon,
    ArrowLeft,
    Grid,
    Grid2X2,
  } from 'lucide-svelte';
  import { editorStore, canvasStore, canUndo, canRedo } from './stores/editorStore';
  import SubmitReviewModal from './SubmitReviewModal.svelte';

  export let templateId: string = '';
  export let templateName: string = 'Template';
  export let templatePrice: number = 0;
  export let platformFeePercentage: number = 30;
  export let status: string = 'draft';
  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let isDirty: boolean = false;
  export let saving: boolean = false;
  export let saveSuccess: boolean = false;
  export let onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  export let onSave: () => void;
  export let onSubmit: () => Promise<boolean | void> = async () => {};

  let isSubmitModalOpen = false;
  let isEditingName = false;
  let nameInputValue = templateName;

  const focus = (el: HTMLInputElement) => el.focus();

  $: nameInputValue = templateName;

  const handleNameSave = () => {
    isEditingName = false;
    if (nameInputValue.trim() && nameInputValue !== templateName) {
      editorStore.updateTemplateName(nameInputValue.trim());
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'draft':
        return { label: 'Draft', bg: 'badge-custom-amber' };
      case 'pending':
        return { label: 'Menunggu Review', bg: 'badge-custom-sky' };
      case 'approved':
        return { label: 'Disetujui', bg: 'badge-custom-emerald' };
      case 'rejected':
        return { label: 'Ditolak', bg: 'badge-custom-rose' };
      default:
        return { label: s, bg: 'badge-custom-slate' };
    }
  };

  $: badge = getStatusBadge(status);
</script>

<header class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between flex-shrink-0 select-none text-slate-900 dark:text-slate-100 transition-colors z-30">
  <!-- Left info & Editable Title -->
  <div class="flex items-center gap-2.5 min-w-0">
    <a
      href="/designer/templates"
      class="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
      title="Kembali ke Daftar Template"
    >
      <ArrowLeft size={13} />
      <span class="hidden sm:inline">Kembali</span>
    </a>

    <div class="h-4 w-px bg-slate-200 dark:bg-slate-800" />

    {#if isEditingName}
      <input
        type="text"
        bind:value={nameInputValue}
        on:blur={handleNameSave}
        on:keydown={(e) => e.key === 'Enter' && handleNameSave()}
        class="text-xs font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-blue-500 rounded px-2 py-1 focus:outline-none max-w-xs"
        use:focus
      />
    {:else}
      <button
        on:click={() => (isEditingName = true)}
        class="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-0.5 rounded transition-colors text-left max-w-[140px] sm:max-w-[220px]"
        title="Klik untuk mengubah nama template"
      >
        {templateName}
      </button>
    {/if}

    <span class="badge-custom uppercase tracking-wider hidden md:inline-flex {badge.bg}">
      {badge.label}
    </span>
  </div>

  <!-- Center: Viewport Switcher & Grid & Undo/Redo -->
  <div class="flex items-center gap-2">
    <!-- Undo / Redo -->
    <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        on:click={() => editorStore.undo()}
        disabled={!$canUndo}
        class="p-1 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={14} />
      </button>
      <button
        type="button"
        on:click={() => editorStore.redo()}
        disabled={!$canRedo}
        class="p-1 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={14} />
      </button>
    </div>

    <!-- View Mode Switcher -->
    <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        on:click={() => onViewModeChange('desktop')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'desktop'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Desktop View (1200px)"
      >
        <Monitor size={14} />
        <span class="hidden sm:inline">Desktop</span>
      </button>
      <button
        type="button"
        on:click={() => onViewModeChange('tablet')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'tablet'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Tablet View (768px Flat Frame)"
      >
        <Tablet size={14} />
        <span class="hidden sm:inline">Tablet</span>
      </button>
      <button
        type="button"
        on:click={() => onViewModeChange('mobile')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'mobile'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Mobile View (375px Flat Frame)"
      >
        <Smartphone size={14} />
        <span class="hidden sm:inline">Mobile</span>
      </button>
    </div>

    <!-- Figma-Style Layout Grid Guides Toggle -->
    <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        on:click={() => canvasStore.toggleColumnGrid()}
        class={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          $canvasStore.showColumnGrid
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Toggle Column Grid Guides (Ctrl+G / Shift+G)"
      >
        <Grid size={13} />
        <span class="hidden md:inline text-xs">Grid</span>
      </button>
      <button
        type="button"
        on:click={() => canvasStore.togglePixelGrid()}
        class={`p-1 rounded text-xs font-medium transition-all cursor-pointer ${
          $canvasStore.showPixelGrid
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        title="Toggle 8px Pixel Grid"
      >
        <Grid2X2 size={13} />
      </button>
    </div>
  </div>

  <!-- Right Actions: Editor Theme Toggle, Save Draft, Submit & Right Sidebar Toggle -->
  <div class="flex items-center gap-2">
    <!-- Editor Chrome Theme Toggle (Light / Dark) -->
    <button
      type="button"
      on:click={() => canvasStore.toggleEditorTheme()}
      class={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
        $canvasStore.editorTheme === 'dark'
          ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
      }`}
      title={`Editor Theme: ${$canvasStore.editorTheme === 'dark' ? 'Dark' : 'Light'}`}
      aria-label="Toggle Editor Theme"
    >
      {#if $canvasStore.editorTheme === 'dark'}
        <Moon size={13} class="text-amber-400" />
        <span class="text-xs font-semibold">Dark</span>
      {:else}
        <Sun size={13} class="text-amber-500" />
        <span class="text-xs font-semibold">Light</span>
      {/if}
    </button>

    <!-- Save Status Message -->
    {#if saveSuccess}
      <div class="hidden sm:flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <CheckCircle2 size={13} />
        <span>Tersimpan</span>
      </div>
    {:else if isDirty}
      <span class="hidden sm:inline text-xs text-amber-600 dark:text-amber-400 font-medium">Belum disimpan</span>
    {/if}

    <!-- Save Button -->
    <button
      type="button"
      on:click={onSave}
      disabled={saving}
      class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-900 dark:text-slate-100 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
      title="Simpan Perubahan (Ctrl+S)"
    >
      {#if saving}
        <Loader2 size={13} class="animate-spin" />
        <span>Menyimpan...</span>
      {:else}
        <Save size={13} />
        <span>Simpan</span>
      {/if}
    </button>

    <!-- Submit Review Button -->
    <button
      type="button"
      on:click={() => (isSubmitModalOpen = true)}
      disabled={saving || status === 'pending'}
      class="btn btn-sm btn-primary text-xs font-semibold text-white transition-all flex items-center gap-1.5 cursor-pointer"
    >
      <Send size={13} />
      <span class="hidden sm:inline">{status === 'pending' ? 'Menunggu Review' : 'Ajukan Review'}</span>
    </button>
  </div>
</header>

<SubmitReviewModal
  bind:isOpen={isSubmitModalOpen}
  {templateId}
  {templateName}
  {templatePrice}
  initialPlatformFeePercentage={platformFeePercentage}
  onClose={() => (isSubmitModalOpen = false)}
  onConfirm={async () => {
    if (onSubmit) {
      await onSubmit();
    } else {
      await editorStore.submitReview();
    }
  }}
/>
