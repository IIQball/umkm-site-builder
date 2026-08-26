<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formatIDR } from '@/lib/utils/format';
  import { CheckSquare, Square, Trash2, Edit3, Eye, AlertCircle } from 'lucide-svelte';

  export let template: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnailUrl: string | null;
    status: string;
    rejectionReason: string | null;
    createdAt: Date | string;
    totalSold: number;
  };

  export let isSelectionMode = false;
  export let isSelected = false;
  export let isDeleting = false;

  const dispatch = createEventDispatcher<{
    deleteSingle: { template: typeof template };
    toggleSelect: { templateId: string };
    showRejection: { template: typeof template };
  }>();

  const handleCardClick = (e: MouseEvent) => {
    if (isSelectionMode && isSelectable) {
      // Don't toggle if clicking on direct interactive link or action button
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button')) return;
      dispatch('toggleSelect', { templateId: template.id });
    }
  };

  const handleCheckboxClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (isSelectable) {
      dispatch('toggleSelect', { templateId: template.id });
    }
  };

  const handleDeleteClick = () => {
    dispatch('deleteSingle', { template });
  };

  const handleShowRejection = () => {
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
            <CheckSquare size={18} class="stroke-[2.5]" />
          {:else}
            <Square size={18} />
          {/if}
        </button>
      {:else}
        <span
          class="w-7 h-7 rounded-lg bg-base-300/80 dark:bg-slate-800/80 text-muted flex items-center justify-center shadow-sm cursor-not-allowed opacity-60"
          title="Hanya template draft atau ditolak yang dapat dihapus"
        >
          <Square size={16} />
        </span>
      {/if}
    </div>
  {/if}

  <!-- Thumbnail 16:9 -->
  <div class="relative w-full aspect-video bg-nested overflow-hidden">
    {#if template.thumbnailUrl}
      <img
        src={template.thumbnailUrl}
        alt={template.name}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    {:else}
      <div class="absolute inset-0 bg-nested flex flex-col items-center justify-center gap-2">
        <span class="material-symbols-outlined icon-filled text-4xl text-muted">storefront</span>
        <span class="text-xs font-medium text-secondary">Preview Belum Tersedia</span>
      </div>
    {/if}

    <!-- Status badge (shifted if selection mode is on) -->
    <div class={`absolute top-3 ${isSelectionMode ? 'left-12' : 'left-3'} transition-all`}>
      <span class="badge-custom backdrop-blur-sm bg-card/85 {statusInfo.cls}">
        {statusInfo.label}
      </span>
    </div>

    <!-- Sold count overlay -->
    {#if template.totalSold > 0}
      <div class="absolute top-3 right-3">
        <span class="text-xs font-bold text-white bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
          {template.totalSold}× terjual
        </span>
      </div>
    {/if}
  </div>

  <!-- Card body -->
  <div class="p-4 flex-1 flex flex-col">
    <div class="flex items-start justify-between gap-2 mb-1">
      <h3 class="text-sm font-bold text-main line-clamp-1 flex-1">{template.name}</h3>
      <span class="text-xs font-extrabold text-primary font-mono flex-shrink-0">
        {formatPrice(template.price)}
      </span>
    </div>
    <p class="text-xs text-secondary line-clamp-2 leading-relaxed flex-1">
      {template.description || 'Tanpa deskripsi'}
    </p>

    <!-- Footer: date + actions -->
    <div class="pt-3 mt-3 border-t border-light flex items-center justify-between gap-2">
      <span class="text-xs text-muted">
        {new Date(template.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>

      <!-- Actions -->
      <div class="flex items-center gap-1.5">
        {#if template.status === 'draft'}
          <a
            href={`/builder/${template.id}`}
            class="btn btn-xs btn-primary text-xs font-bold text-white rounded-lg px-3 py-1.5 transition-all flex items-center gap-1"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </a>
          <button
            type="button"
            disabled={isDeleting}
            on:click={handleDeleteClick}
            class="inline-flex items-center text-xs font-medium text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
            title="Hapus template permanen"
          >
            <Trash2 size={13} class="mr-1" />
            <span>Hapus</span>
          </button>
        {/if}

        {#if template.status === 'rejected'}
          <button
            type="button"
            on:click={handleShowRejection}
            class="badge-custom badge-custom-amber hover:bg-amber-500/20 px-2.5 py-1.5 transition-all cursor-pointer font-bold text-xs flex items-center gap-1"
          >
            <AlertCircle size={13} />
            <span>Alasan</span>
          </button>
          <a
            href={`/builder/${template.id}`}
            class="btn btn-xs btn-primary text-xs font-bold text-white rounded-lg px-3 py-1.5 transition-all flex items-center gap-1"
          >
            <Edit3 size={13} />
            <span>Edit Ulang</span>
          </a>
          <button
            type="button"
            disabled={isDeleting}
            on:click={handleDeleteClick}
            class="inline-flex items-center text-xs font-medium text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
            title="Hapus template permanen"
          >
            <Trash2 size={13} class="mr-1" />
            <span>Hapus</span>
          </button>
        {/if}

        {#if template.status === 'approved' || template.status === 'pending'}
          <a
            href={`/builder/preview/${template.id}`}
            class="btn btn-xs btn-outline border-light hover:border-main hover:bg-nested text-xs text-secondary font-semibold rounded-lg px-3 py-1.5 transition-all flex items-center gap-1"
          >
            <Eye size={13} />
            <span>Pratinjau</span>
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>
