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
  import { editorStore, canUndo, canRedo } from './stores/editorStore';
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

  const handleMarginChange = (e: Event) => {
    const target = e.currentTarget as HTMLSelectElement;
    editorStore.setCanvasMargin(target.value as '16px' | '24px' | '32px' | '48px');
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'draft':
        return { label: 'Draft', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'pending':
        return { label: 'Menunggu Review', bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
      case 'approved':
        return { label: 'Disetujui', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'rejected':
        return { label: 'Ditolak', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
      default:
        return { label: s, bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
    }
  };

  $: badge = getStatusBadge(status);
</script>

<header class="h-14 bg-base-100 border-b border-base-200 dark:border-slate-800 px-4 flex items-center justify-between flex-shrink-0 select-none text-base-content transition-colors">
  <!-- Left info & Editable Title -->
  <div class="flex items-center gap-3 min-w-0">
    <a
      href="/"
      class="text-xs font-semibold text-base-content/70 hover:text-base-content transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-base-200 hover:bg-base-300 border border-base-300 dark:border-slate-800"
    >
      <ArrowLeft size={13} />
      <span>Keluar</span>
    </a>
    <div class="h-4 w-px bg-base-300 dark:bg-slate-800" />

    {#if isEditingName}
      <input
        type="text"
        bind:value={nameInputValue}
        on:blur={handleNameSave}
        on:keydown={(e) => e.key === 'Enter' && handleNameSave()}
        class="text-xs font-semibold text-base-content bg-base-200 border border-blue-500 rounded px-2 py-1 focus:outline-none max-w-xs"
        use:focus
      />
    {:else}
      <button
        on:click={() => (isEditingName = true)}
        class="text-xs sm:text-sm font-semibold text-base-content truncate hover:text-blue-500 hover:bg-base-200/60 px-2 py-0.5 rounded transition-colors text-left"
        title="Klik untuk mengubah nama template"
      >
        {templateName}
      </button>
    {/if}

    <span class="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border {badge.bg}">
      {badge.label}
    </span>
  </div>

  <!-- Center: Viewport Switcher & Grid & Undo/Redo -->
  <div class="flex items-center gap-2">
    <!-- Undo / Redo -->
    <div class="flex items-center gap-0.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      <button
        type="button"
        on:click={() => editorStore.undo()}
        disabled={!$canUndo}
        class="p-1 rounded text-base-content/70 hover:text-base-content hover:bg-base-100 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={14} />
      </button>
      <button
        type="button"
        on:click={() => editorStore.redo()}
        disabled={!$canRedo}
        class="p-1 rounded text-base-content/70 hover:text-base-content hover:bg-base-100 disabled:opacity-25 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={14} />
      </button>
    </div>

    <!-- View Mode Switcher -->
    <div class="flex items-center gap-0.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      <button
        type="button"
        on:click={() => onViewModeChange('desktop')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'desktop'
            ? 'bg-base-100 text-base-content font-semibold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
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
            ? 'bg-base-100 text-base-content font-semibold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
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
            ? 'bg-base-100 text-base-content font-semibold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        title="Mobile View (375px Flat Frame)"
      >
        <Smartphone size={14} />
        <span class="hidden sm:inline">Mobile</span>
      </button>
    </div>

    <!-- Figma-Style Layout Grid Guides Toggle -->
    <div class="flex items-center gap-0.5 bg-base-200/80 p-1 rounded-lg border border-base-300 dark:border-slate-800">
      <button
        type="button"
        on:click={() => editorStore.toggleColumnGrid()}
        class={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          $editorStore.showColumnGrid
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        title="Toggle Column Grid Guides (Ctrl+G / Shift+G)"
      >
        <Grid size={13} />
        <span class="hidden md:inline text-[11px]">Grid</span>
      </button>
      <button
        type="button"
        on:click={() => editorStore.togglePixelGrid()}
        class={`p-1 rounded text-xs font-medium transition-all cursor-pointer ${
          $editorStore.showPixelGrid
            ? 'bg-indigo-600 text-white font-semibold shadow-sm'
            : 'text-base-content/60 hover:text-base-content'
        }`}
        title="Toggle 8px Pixel Grid"
      >
        <Grid2X2 size={13} />
      </button>
    </div>

    <!-- Canvas Margin Safe-Zone Preset -->
    <div class="hidden xl:flex items-center gap-1.5 bg-base-200/80 px-2.5 py-1 rounded-lg border border-base-300 dark:border-slate-800 text-xs">
      <span class="text-[11px] text-base-content/60 font-medium">Margin:</span>
      <select
        value={$editorStore.canvasMargin}
        on:change={handleMarginChange}
        class="bg-transparent text-base-content text-xs font-semibold focus:outline-none cursor-pointer"
      >
        <option value="16px" class="bg-base-100 text-base-content">16px (Tight)</option>
        <option value="24px" class="bg-base-100 text-base-content">24px (Normal)</option>
        <option value="32px" class="bg-base-100 text-base-content">32px (Spacious)</option>
        <option value="48px" class="bg-base-100 text-base-content">48px (Wide)</option>
      </select>
    </div>
  </div>

  <!-- Right Actions: Theme Preview Toggle, Save Draft & Submit -->
  <div class="flex items-center gap-2">
    <!-- Canvas Preview Theme Mode (Light / Dark) -->
    <button
      type="button"
      on:click={() => editorStore.togglePreviewTheme()}
      class={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-base-300 dark:border-slate-800 text-xs font-medium transition-colors cursor-pointer ${
        $editorStore.previewTheme === 'dark'
          ? 'bg-slate-800 text-amber-400 border-slate-700'
          : 'bg-base-200 text-slate-700 hover:bg-base-300'
      }`}
      title="Preview Canvas Mode: Light / Dark"
    >
      {#if $editorStore.previewTheme === 'dark'}
        <Moon size={13} class="text-amber-400" />
        <span class="text-[11px] font-semibold">Dark</span>
      {:else}
        <Sun size={13} class="text-amber-500" />
        <span class="text-[11px] font-semibold">Light</span>
      {/if}
    </button>

    <!-- Save Status Message -->
    {#if saveSuccess}
      <div class="hidden sm:flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 size={13} />
        <span>Tersimpan</span>
      </div>
    {:else if isDirty}
      <span class="hidden sm:inline text-[10px] text-amber-600 dark:text-amber-400 font-medium">Belum disimpan</span>
    {/if}

    <!-- Save Button -->
    <button
      type="button"
      on:click={onSave}
      disabled={saving}
      class="flex items-center gap-1.5 px-3 py-1.5 bg-base-200 hover:bg-base-300 disabled:opacity-50 text-base-content rounded-lg text-xs font-semibold border border-base-300 dark:border-slate-800 transition-colors cursor-pointer"
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
      class="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
    >
      <Send size={13} />
      <span>{status === 'pending' ? 'Menunggu Review' : 'Ajukan Review'}</span>
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
