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
  } from 'lucide-svelte';
  import { editorStore, canUndo, canRedo } from './stores/editorStore';

  export let templateName: string = 'Template';
  export let status: string = 'draft';
  export let viewMode: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  export let isDirty: boolean = false;
  export let saving: boolean = false;
  export let saveSuccess: boolean = false;
  export let onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  export let onSave: () => void;
  export let onSubmit: () => void;

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
        return { label: 'Draft', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'pending':
        return { label: 'Pending Review', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
      case 'approved':
        return { label: 'Approved', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      default:
        return { label: s, bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  $: badge = getStatusBadge(status);
</script>

<header class="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between flex-shrink-0 select-none">
  <!-- Left info & Editable Title -->
  <div class="flex items-center gap-3 min-w-0">
    <a
      href="/"
      class="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800"
    >
      ← Keluar
    </a>
    <div class="h-4 w-px bg-slate-800" />

    {#if isEditingName}
      <input
        type="text"
        bind:value={nameInputValue}
        on:blur={handleNameSave}
        on:keydown={(e) => e.key === 'Enter' && handleNameSave()}
        class="text-xs font-semibold text-slate-100 bg-slate-950 border border-blue-500 rounded px-2 py-1 focus:outline-none max-w-xs"
        use:focus
      />
    {:else}
      <button
        on:click={() => (isEditingName = true)}
        class="text-sm font-semibold text-slate-100 truncate hover:text-blue-400 hover:bg-slate-800/50 px-2 py-0.5 rounded transition-colors text-left"
        title="Klik untuk mengubah nama template"
      >
        {templateName}
      </button>
    {/if}

    <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border {badge.bg}">
      {badge.label}
    </span>
  </div>

  <!-- Center: Viewport Switcher & Undo/Redo -->
  <div class="flex items-center gap-3">
    <!-- Undo / Redo -->
    <div class="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
      <button
        type="button"
        on:click={() => editorStore.undo()}
        disabled={!$canUndo}
        class="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={14} />
      </button>
      <button
        type="button"
        on:click={() => editorStore.redo()}
        disabled={!$canRedo}
        class="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={14} />
      </button>
    </div>

    <!-- View Mode Switcher -->
    <div class="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
      <button
        type="button"
        on:click={() => onViewModeChange('desktop')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'desktop'
            ? 'bg-slate-800 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Desktop View (100% / max-w-5xl)"
      >
        <Monitor size={14} />
        <span>Desktop</span>
      </button>
      <button
        type="button"
        on:click={() => onViewModeChange('tablet')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'tablet'
            ? 'bg-slate-800 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Tablet View (768px)"
      >
        <Tablet size={14} />
        <span>Tablet</span>
      </button>
      <button
        type="button"
        on:click={() => onViewModeChange('mobile')}
        class={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          viewMode === 'mobile'
            ? 'bg-slate-800 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Mobile View (375px)"
      >
        <Smartphone size={14} />
        <span>Mobile</span>
      </button>
    </div>

    <!-- Canvas Margin Safe-Zone Preset -->
    <div class="hidden xl:flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
      <span class="text-[11px] text-slate-400 font-medium">Safe-Zone:</span>
      <select
        value={$editorStore.canvasMargin}
        on:change={handleMarginChange}
        class="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
      >
        <option value="16px" class="bg-slate-900 text-white">16px (Tight)</option>
        <option value="24px" class="bg-slate-900 text-white">24px (Normal)</option>
        <option value="32px" class="bg-slate-900 text-white">32px (Spacious)</option>
        <option value="48px" class="bg-slate-900 text-white">48px (Wide)</option>
      </select>
    </div>
  </div>

  <!-- Right Actions: Save Draft & Submit -->
  <div class="flex items-center gap-2">
    <!-- Save Status Message -->
    {#if saveSuccess}
      <div class="flex items-center gap-1 text-xs text-emerald-400">
        <CheckCircle2 size={14} />
        <span>Tersimpan</span>
      </div>
    {:else if isDirty}
      <span class="text-[11px] text-amber-400/80 font-medium">Perubahan belum disimpan</span>
    {/if}

    <!-- Save Button -->
    <button
      type="button"
      on:click={onSave}
      disabled={saving}
      class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
      title="Simpan Perubahan (Ctrl+S)"
    >
      {#if saving}
        <Loader2 size={13} class="animate-spin" />
        <span>Menyimpan...</span>
      {:else}
        <Save size={13} />
        <span>Simpan Draft</span>
      {/if}
    </button>

    <!-- Submit Review Button -->
    <button
      type="button"
      on:click={onSubmit}
      disabled={saving || status === 'pending'}
      class="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
    >
      <Send size={13} />
      <span>{status === 'pending' ? 'Menunggu Review' : 'Ajukan Review'}</span>
    </button>
  </div>
</header>
