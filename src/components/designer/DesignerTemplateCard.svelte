<script lang="ts">
  import { formatCurrency, formatDate } from '@/lib/utils/format';
  import { Badge, Button } from '@/components/ui';
  import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';

  export let rowNumber: number = 1;
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
  export let isSelected: boolean = false;
  export let onToggleSelect: ((id: string) => void) | undefined = undefined;
  export let onDeleteDraft: ((template: any) => void) | undefined = undefined;
  export let onShowRejection: ((template: any) => void) | undefined = undefined;

  let isDeleting = false;
  let imageLoadError = false;

  const handleDelete = async () => {
    if (onDeleteDraft) {
      onDeleteDraft(template);
      return;
    }
    if (!confirm('Hapus draf template ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      isDeleting = true;
      const res = await fetch(`/api/designer/templates/draft?templateId=${template.id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        alert(result.error?.message || 'Gagal menghapus draf');
      }
    } catch {
      alert('Terjadi kesalahan koneksi');
    } finally {
      isDeleting = false;
    }
  };

  const handleShowRejection = () => {
    if (onShowRejection) {
      onShowRejection(template);
    }
  };

  const formatPrice = (p: number) => (p === 0 ? 'Gratis' : formatCurrency(p));

  const statusVariantMap: Record<string, 'emerald' | 'orange' | 'rose' | 'slate'> = {
    approved: 'emerald',
    pending: 'orange',
    rejected: 'rose',
    draft: 'slate',
  };

  const statusLabelMap: Record<string, string> = {
    approved: 'Disetujui',
    pending: 'Menunggu Review',
    rejected: 'Ditolak',
    draft: 'Draft',
  };

  $: variant = statusVariantMap[template.status] || 'slate';
  $: label = statusLabelMap[template.status] || 'Draft';
</script>

<div
  class={`template-card bg-card border rounded-3xl overflow-hidden shadow-xs hover:border-primary/50 transition-all duration-200 flex flex-col group relative ${
    isSelected ? 'border-primary ring-2 ring-primary/40' : 'border-light'
  }`}
  data-status={template.status}
  data-name={template.name.toLowerCase()}
>
  <!-- Thumbnail 16:9 -->
  <div class="relative w-full aspect-video bg-nested overflow-hidden border-b border-light">
    <!-- Draft Selection Checkbox (top-left) -->
    {#if template.status === 'draft' && onToggleSelect}
      <div class="absolute top-3 left-3 z-20">
        <button
          type="button"
          on:click|stopPropagation={() => onToggleSelect && onToggleSelect(template.id)}
          class={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center cursor-pointer shadow-sm ${
            isSelected
              ? 'bg-primary border-primary text-primary-content'
              : 'bg-card/90 border-border hover:border-primary text-transparent'
          }`}
          title={isSelected ? 'Batalkan pilihan' : 'Pilih draf template'}
          aria-label={isSelected ? 'Batalkan pilihan' : 'Pilih draf template'}
        >
          <span class="material-symbols-outlined text-sm font-bold">check</span>
        </button>
      </div>
    {/if}

    <!-- Sequence Number Badge -->
    <div class="absolute {template.status === 'draft' && onToggleSelect ? 'top-3 left-11' : 'top-3 left-3'} z-20">
      <span class="px-2 py-0.5 rounded-lg bg-card/90 border border-light font-mono text-2xs font-bold text-secondary shadow-xs backdrop-blur-xs">
        #{rowNumber}
      </span>
    </div>

    {#if template.thumbnailUrl && !imageLoadError}
      <img
        src={getOptimizedCloudinaryUrl(template.thumbnailUrl, 500)}
        alt={template.name}
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
        on:error={() => (imageLoadError = true)}
      />
    {:else}
      <div class="absolute inset-0 bg-nested flex flex-col items-center justify-center gap-1.5 text-muted">
        <div class="w-10 h-10 rounded-xl bg-card border border-light flex items-center justify-center text-muted shadow-2xs">
          <span class="material-symbols-outlined text-xl">palette</span>
        </div>
        <span class="text-xs font-medium text-muted">Tanpa Pratinjau</span>
      </div>
    {/if}

    <!-- Status Badge (Small, clean top-right) -->
    <div class="absolute top-3 right-3 z-10 pointer-events-none">
      <Badge {variant} size="sm" dot>
        {label}
      </Badge>
    </div>

    <!-- Sold count overlay -->
    {#if template.totalSold > 0}
      <div class="absolute bottom-3 left-3 z-10 pointer-events-none">
        <span class="text-xs font-bold text-main bg-card/90 backdrop-blur-md border border-light rounded-full px-2.5 py-1 shadow-xs flex items-center gap-1 font-mono">
          <span>{template.totalSold}× Terjual</span>
        </span>
      </div>
    {/if}
  </div>

  <!-- Card body -->
  <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <div class="flex items-start justify-between gap-2.5 mb-1.5">
        <h3 class="text-heading-md font-bold text-main break-words flex-1 min-w-0 font-heading leading-tight">{template.name}</h3>
        <span class="text-xs font-bold text-main font-mono flex-shrink-0 whitespace-nowrap bg-nested border border-light px-2.5 py-0.5 rounded-full shadow-2xs">
          {formatPrice(template.price)}
        </span>
      </div>
      <p class="text-body-sm text-secondary line-clamp-2 leading-relaxed font-sans">
        {template.description || 'Template toko online responsif dan siap pakai untuk berbagai jenis usaha UMKM.'}
      </p>
    </div>

    <!-- Footer: date + actions -->
    <div class="pt-3.5 border-t border-light flex flex-wrap items-center justify-between gap-2.5">
      <div class="flex items-center gap-1.5 text-2xs text-muted font-mono whitespace-nowrap">
        <span class="material-symbols-outlined text-xs">calendar_today</span>
        <span>{formatDate(template.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        {#if template.status === 'draft'}
          <Button
            variant="destructive"
            size="xs"
            disabled={isDeleting}
            on:click={handleDelete}
            className="font-bold whitespace-nowrap"
          >
            {isDeleting ? '...' : 'Hapus'}
          </Button>
          <Button
            href={`/builder/new?id=${template.id}`}
            variant="dark"
            size="sm"
            className="rounded-xl font-bold whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-xs">edit</span>
            <span>Edit</span>
          </Button>
        {/if}

        {#if template.status === 'rejected'}
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl font-bold whitespace-nowrap"
            on:click={handleShowRejection}
          >
            <span class="material-symbols-outlined text-xs text-rose-500">info</span>
            <span>Alasan</span>
          </Button>
          <Button
            href={`/builder/new?id=${template.id}`}
            variant="primary"
            size="sm"
            className="rounded-xl font-bold whitespace-nowrap"
          >
            Edit Ulang
          </Button>
        {/if}

        {#if template.status === 'approved' || template.status === 'pending'}
          <Button
            href={`/builder/preview/${template.id}`}
            variant="secondary"
            size="sm"
            className="rounded-xl font-bold whitespace-nowrap"
          >
            <span class="material-symbols-outlined text-xs">visibility</span>
            <span>Pratinjau</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>
</div>
