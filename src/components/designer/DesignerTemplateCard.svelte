<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { CheckSquare, Square, Trash2, Edit3, Eye, AlertCircle } from 'lucide-svelte';
  import type { TemplateItem } from '@/types/templates';

  export let template: TemplateItem;
  export let isSelectionMode = false;
  export let isSelected = false;
  export let isDeleting = false;
  export let onToggleSelect: (() => void) | undefined = undefined;
  export let onDelete: (() => void) | undefined = undefined;
  export let onViewRejection: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher<{
    deleteSingle: { template: TemplateItem };
    toggleSelect: { templateId: string };
    showRejection: { template: TemplateItem };
  }>();

  const handleCardClick = (e: MouseEvent) => {
    if (isSelectionMode && isSelectable) {
      // Don't toggle if clicking on direct interactive link or action button
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) return;
      if (onToggleSelect) onToggleSelect();
      dispatch('toggleSelect', { templateId: template.id });
    }
  };

  const handleCheckboxClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (isSelectable) {
      if (onToggleSelect) onToggleSelect();
      dispatch('toggleSelect', { templateId: template.id });
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) onDelete();
    dispatch('deleteSingle', { template });
  };

  const handleShowRejection = () => {
    if (onViewRejection) onViewRejection();
    dispatch('showRejection', { template });
  };

  $: isSelectable = template.status === 'draft' || template.status === 'rejected';

  const formatPrice = (p: number) => (p === 0 ? 'Gratis' : formatIDR(p));

  const statusMap: Record<string, { label: string; cls: string }> = {
    approved: { label: 'Disetujui',       cls: 'badge-custom-emerald' },
    pending:  { label: 'Menunggu Review', cls: 'badge-custom-amber' },
    rejected: { label: 'Ditolak',         cls: 'badge-custom-rose' },
    draft:    { label: 'Draft',           cls: 'badge-custom-slate' },
  };
  $: statusInfo = statusMap[template.status] ?? statusMap.draft;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={handleCardClick}
  class={`template-card bg-card border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col group relative ${
    isSelected
      ? 'border-rose-500 ring-2 ring-rose-400/40 shadow-md bg-rose-50/5 dark:bg-rose-950/10'
      : 'border-main hover:shadow-md hover:border-main'
  } ${isSelectionMode && isSelectable ? 'cursor-pointer' : ''}`}
  data-status={template.status}
>
  <!-- Bulk Select Checkbox overlay (Top-Left) -->
  {#if isSelectionMode}
    <div class="absolute top-3 left-3 z-20">
      {#if isSelectable}
        <button
          type="button"
          on:click={handleCheckboxClick}
          class={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md ${
            isSelected
              ? 'bg-rose-600 text-white ring-2 ring-rose-400/50'
              : 'bg-card/90 text-secondary hover:text-main hover:bg-card border border-light backdrop-blur-md'
          }`}
          aria-label={isSelected ? 'Batalkan pilihan' : 'Pilih template'}
        >
          {#if isSelected}
            <CheckSquare size={16} class="text-white" />
          {:else}
            <Square size={16} />
          {/if}
        </button>
      {:else}
        <div
          class="w-7 h-7 rounded-lg bg-card/60 border border-light/60 flex items-center justify-center text-muted cursor-not-allowed opacity-60 backdrop-blur-sm"
          title="Hanya template draft atau ditolak yang dapat dihapus"
        >
          <Square size={16} />
        </div>
      {/if}
    </div>
  {/if}

  <!-- Thumbnail container (16:9) -->
  <div class="relative w-full aspect-video bg-nested overflow-hidden flex items-center justify-center flex-shrink-0">
    {#if template.thumbnailUrl}
      <img
        src={template.thumbnailUrl}
        alt={template.name}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    {:else}
      <div class="flex flex-col items-center gap-2 text-muted select-none">
        <span class="text-3xl font-black opacity-20 tracking-tighter">PREVIEW</span>
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Belum ada thumbnail</span>
      </div>
    {/if}

    <!-- Status badge on thumbnail top-right -->
    <div class="absolute top-3 right-3 z-10">
      <span class={`badge-custom ${statusInfo.cls}`}>
        {statusInfo.label}
      </span>
    </div>

    <!-- Rejection button if rejected -->
    {#if template.status === 'rejected' && template.rejectionReason}
      <div class="absolute bottom-3 left-3 right-3 z-10">
        <button
          type="button"
          on:click|stopPropagation={handleShowRejection}
          class="w-full py-1.5 px-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-md transition-all cursor-pointer"
        >
          <AlertCircle size={13} />
          <span>Lihat Alasan Penolakan</span>
        </button>
      </div>
    {/if}
  </div>

  <!-- Card Body -->
  <div class="p-4 flex flex-col flex-1 gap-2.5 justify-between">
    <div>
      <div class="flex items-start justify-between gap-2">
        <h3 class="font-bold text-sm text-main line-clamp-1 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        <span class="text-xs font-extrabold text-main whitespace-nowrap">
          {formatPrice(template.price)}
        </span>
      </div>

      {#if template.description}
        <p class="text-xs text-secondary line-clamp-2 mt-1 leading-relaxed">
          {template.description}
        </p>
      {/if}
    </div>

    <!-- Metadata & Action Footer -->
    <div class="pt-2 border-t border-light flex items-center justify-between gap-2 mt-auto">
      <span class="text-xs text-muted font-medium">
        {template.totalSold ?? 0} Toko Memakai
      </span>

      <div class="flex items-center gap-1.5">
        <!-- Preview live button -->
        <a
          href={`/builder/preview/${template.id}`}
          class="p-2 text-secondary hover:text-main hover:bg-nested border border-transparent hover:border-light rounded-lg transition-all cursor-pointer"
          title="Pratinjau Template"
          aria-label="Pratinjau Template"
        >
          <Eye size={15} />
        </a>

        <!-- Edit in builder button -->
        {#if template.status === 'draft' || template.status === 'rejected'}
          <a
            href={`/builder/${template.id}`}
            class="p-2 text-primary hover:text-white hover:bg-primary rounded-lg transition-all shadow-xs cursor-pointer"
            title="Edit di Visual Builder"
            aria-label="Edit Template"
          >
            <Edit3 size={15} />
          </a>
        {/if}

        <!-- Single Delete Action button -->
        {#if isSelectable && !isSelectionMode}
          <button
            type="button"
            disabled={isDeleting}
            on:click|stopPropagation={handleDeleteClick}
            class="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Hapus Permanen"
            aria-label="Hapus Template"
          >
            <Trash2 size={15} />
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
