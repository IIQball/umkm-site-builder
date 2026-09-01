<script lang="ts">
  import {
    Save,
    Send,
    CheckCircle2,
    Loader2,
    ArrowLeft,
  } from 'lucide-svelte';
  import { editorStore } from './stores/editorStore';
  import SubmitReviewModal from './SubmitReviewModal.svelte';
  import TopBarViewportControls from './topbar/TopBarViewportControls.svelte';
  import { Badge } from '@/components/ui';

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

  $: nameInputValue = templateName;

  const focus = (el: HTMLInputElement) => el.focus();

  const handleNameSave = () => {
    isEditingName = false;
    if (nameInputValue.trim() && nameInputValue.trim() !== templateName) {
      editorStore.updateTemplateName(nameInputValue.trim());
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'draft':
        return { label: 'Draft', variant: 'amber' as const };
      case 'pending':
        return { label: 'Menunggu Review', variant: 'sky' as const };
      case 'approved':
        return { label: 'Disetujui', variant: 'emerald' as const };
      case 'rejected':
        return { label: 'Ditolak', variant: 'rose' as const };
      default:
        return { label: s, variant: 'slate' as const };
    }
  };

  $: badge = getStatusBadge(status);
</script>

<header class="h-14 bg-card border-b border-light px-4 flex items-center justify-between flex-shrink-0 select-none text-main transition-colors z-30">
  <!-- Left info & Editable Title -->
  <div class="flex items-center gap-2.5 min-w-0">
    <a
      href="/designer/templates"
      class="text-xs font-semibold text-secondary hover:text-main transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-nested hover:bg-nested/80 border border-light"
      title="Kembali ke Template"
    >
      <ArrowLeft size={13} />
      <span class="hidden sm:inline">Kembali</span>
    </a>

    <div class="h-4 w-px bg-nested border-r border-light" />

    {#if isEditingName}
      <input
        type="text"
        bind:value={nameInputValue}
        on:blur={handleNameSave}
        on:keydown={(e) => e.key === 'Enter' && handleNameSave()}
        class="text-xs font-semibold text-main bg-nested border border-primary rounded px-2 py-1 focus:outline-none max-w-xs"
        use:focus
      />
    {:else}
      <button
        on:click={() => (isEditingName = true)}
        class="text-xs sm:text-sm font-semibold text-main truncate hover:text-primary hover:bg-nested px-2 py-0.5 rounded transition-colors text-left max-w-[140px] sm:max-w-[220px]"
        title="Klik untuk mengubah nama template"
      >
        {templateName}
      </button>
    {/if}

    <Badge variant={badge.variant} size="sm" className="hidden sm:inline-flex capitalize">
      {badge.label}
    </Badge>
  </div>

  <!-- Center: Viewport Controls & Grid Guides -->
  <TopBarViewportControls
    {viewMode}
    {onViewModeChange}
  />

  <!-- Right actions -->
  <div class="flex items-center gap-2">
    <!-- Save Status / Button -->
    <button
      on:click={onSave}
      disabled={saving}
      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all {saveSuccess ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : isDirty ? 'bg-primary text-white border-transparent hover:bg-primary/90 shadow-xs' : 'bg-nested text-secondary hover:text-main border-light'}"
      title={isDirty ? 'Ada perubahan belum disimpan (Ctrl+S)' : 'Semua perubahan tersimpan'}
    >
      {#if saving}
        <Loader2 size={13} class="animate-spin" />
        <span class="hidden sm:inline">Menyimpan...</span>
      {:else if saveSuccess}
        <CheckCircle2 size={13} />
        <span class="hidden sm:inline">Tersimpan</span>
      {:else}
        <Save size={13} />
        <span class="hidden sm:inline">{isDirty ? 'Simpan' : 'Tersimpan'}</span>
      {/if}
    </button>

    <!-- Ajukan Kurasi (Review) Button -->
    {#if status === 'draft' || status === 'rejected'}
      <button
        on:click={() => (isSubmitModalOpen = true)}
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 transition-all shadow-xs"
        title="Ajukan template ke admin untuk ditinjau"
      >
        <Send size={13} />
        <span class="hidden sm:inline">Ajukan Review</span>
      </button>
    {/if}
  </div>
</header>

<SubmitReviewModal
  isOpen={isSubmitModalOpen}
  {templateId}
  {templateName}
  {templatePrice}
  initialPlatformFeePercentage={platformFeePercentage}
  onClose={() => (isSubmitModalOpen = false)}
  onConfirm={async () => {
    const res = await onSubmit();
    isSubmitModalOpen = false;
    return res;
  }}
/>
