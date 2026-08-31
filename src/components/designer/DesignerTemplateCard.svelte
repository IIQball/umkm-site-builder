<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import { Badge, Button } from '@/components/ui';

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

  let isDeleting = false;

  const handleDelete = async () => {
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
    const nameEl = document.getElementById('rejection_template_name');
    const reasonEl = document.getElementById('rejection_reason_text');
    const modal = document.getElementById('rejection_modal') as HTMLDialogElement | null;
    if (nameEl) nameEl.textContent = template.name;
    if (reasonEl) reasonEl.textContent = template.rejectionReason || 'Tidak ada alasan terperinci.';
    modal?.showModal();
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
  class="template-card bg-card border border-light rounded-3xl overflow-hidden shadow-xs
         hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col group relative"
  data-status={template.status}
  data-name={template.name.toLowerCase()}
>
  <!-- Thumbnail 16:9 -->
  <div class="relative w-full aspect-video bg-nested overflow-hidden border-b border-light">
    {#if template.thumbnailUrl}
      <img
        src={template.thumbnailUrl}
        alt={template.name}
        class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
      />
    {:else}
      <div class="absolute inset-0 bg-nested flex flex-col items-center justify-center gap-1.5 text-muted">
        <div class="w-10 h-10 rounded-xl bg-card border border-light flex items-center justify-center text-muted shadow-2xs">
          <span class="material-symbols-outlined text-xl">palette</span>
        </div>
        <span class="text-3xs font-medium text-muted">Tanpa Pratinjau</span>
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
        <span class="text-3xs font-bold text-main bg-card/90 dark:bg-slate-900/90 backdrop-blur-md border border-light rounded-full px-2.5 py-1 shadow-xs flex items-center gap-1 font-mono">
          <span>{template.totalSold}× Terjual</span>
        </span>
      </div>
    {/if}
  </div>

  <!-- Card body -->
  <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <h3 class="text-heading-md font-bold text-main line-clamp-1 flex-1 font-heading">{template.name}</h3>
        <span class="text-xs font-bold text-main font-mono flex-shrink-0 bg-nested border border-light px-2.5 py-0.5 rounded-full">
          {formatPrice(template.price)}
        </span>
      </div>
      <p class="text-body-sm text-secondary line-clamp-2 leading-relaxed font-sans">
        {template.description || 'Template toko online responsif dan siap pakai untuk berbagai jenis usaha UMKM.'}
      </p>
    </div>

    <!-- Footer: date + actions -->
    <div class="pt-3.5 border-t border-light flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 text-2xs text-muted font-mono">
        <span class="material-symbols-outlined text-xs">calendar_today</span>
        <span>{new Date(template.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        {#if template.status === 'draft'}
          <Button
            variant="destructive"
            size="xs"
            disabled={isDeleting}
            on:click={handleDelete}
            className="font-bold"
          >
            {isDeleting ? '...' : 'Hapus'}
          </Button>
          <Button
            href={`/builder/${template.id}`}
            variant="dark"
            size="sm"
            className="rounded-xl font-bold"
          >
            <span class="material-symbols-outlined text-xs">edit</span>
            <span>Edit</span>
          </Button>
        {/if}

        {#if template.status === 'rejected'}
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl font-bold"
            on:click={handleShowRejection}
          >
            <span class="material-symbols-outlined text-xs text-rose-500">info</span>
            <span>Alasan</span>
          </Button>
          <Button
            href={`/builder/${template.id}`}
            variant="primary"
            size="sm"
            className="rounded-xl font-bold"
          >
            Edit Ulang
          </Button>
        {/if}

        {#if template.status === 'approved' || template.status === 'pending'}
          <Button
            href={`/builder/preview/${template.id}`}
            variant="secondary"
            size="sm"
            className="rounded-xl font-bold"
          >
            <span class="material-symbols-outlined text-xs">visibility</span>
            <span>Pratinjau</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>
</div>
