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

  const statusVariantMap: Record<string, 'emerald' | 'amber' | 'rose' | 'slate'> = {
    approved: 'emerald',
    pending: 'amber',
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
         hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col group relative"
  data-status={template.status}
  data-name={template.name.toLowerCase()}
>
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
        <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted">
          <span class="material-symbols-outlined text-2xl">palette</span>
        </div>
        <span class="text-2xs font-semibold text-secondary">Pratinjau Belum Tersedia</span>
      </div>
    {/if}

    <!-- Status Badge -->
    <div class="absolute top-3 left-3 z-10">
      <Badge {variant} dot pulse={template.status === 'pending'} size="sm">
        {label}
      </Badge>
    </div>

    <!-- Sold count overlay -->
    {#if template.totalSold > 0}
      <div class="absolute top-3 right-3 z-10">
        <span class="text-3xs font-bold text-white bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-xs text-amber-400">local_fire_department</span>
          <span>{template.totalSold}× Terjual</span>
        </span>
      </div>
    {/if}
  </div>

  <!-- Card body -->
  <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <h3 class="text-heading-md font-bold text-main line-clamp-1 flex-1">{template.name}</h3>
        <span class="text-sm font-extrabold text-primary font-mono flex-shrink-0 bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg">
          {formatPrice(template.price)}
        </span>
      </div>
      <p class="text-body-sm text-secondary line-clamp-2 leading-relaxed">
        {template.description || 'Template toko online responsif dan siap pakai untuk berbagai jenis usaha UMKM.'}
      </p>
    </div>

    <!-- Footer: date + actions -->
    <div class="pt-3.5 border-t border-light flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 text-2xs text-muted font-medium">
        <span class="material-symbols-outlined text-xs">calendar_today</span>
        <span>{new Date(template.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        {#if template.status === 'draft'}
          <button
            type="button"
            disabled={isDeleting}
            on:click={handleDelete}
            class="text-2xs font-bold text-muted hover:text-error hover:bg-error/10 rounded-xl px-2.5 py-1.5 transition-colors cursor-pointer"
          >
            {isDeleting ? '...' : 'Hapus'}
          </button>
          <Button
            href={`/builder/${template.id}`}
            variant="primary"
            size="sm"
          >
            <span class="material-symbols-outlined text-xs">edit</span>
            <span>Edit</span>
          </Button>
        {/if}

        {#if template.status === 'rejected'}
          <Button
            variant="secondary"
            size="sm"
            on:click={handleShowRejection}
          >
            <span class="material-symbols-outlined text-xs">info</span>
            <span>Alasan</span>
          </Button>
          <Button
            href={`/builder/${template.id}`}
            variant="primary"
            size="sm"
          >
            Edit Ulang
          </Button>
        {/if}

        {#if template.status === 'approved' || template.status === 'pending'}
          <Button
            href={`/builder/preview/${template.id}`}
            variant="secondary"
            size="sm"
          >
            <span class="material-symbols-outlined text-xs">visibility</span>
            <span>Pratinjau</span>
          </Button>
        {/if}
      </div>
    </div>
  </div>
</div>

