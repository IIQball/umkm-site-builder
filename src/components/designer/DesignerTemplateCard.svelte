<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';

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

  const statusMap: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
    approved: { label: 'Disetujui', bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/25', dot: 'bg-emerald-500' },
    pending:  { label: 'Menunggu Review', bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/25', dot: 'bg-amber-500 animate-pulse' },
    rejected: { label: 'Ditolak', bg: 'bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/25', dot: 'bg-rose-500' },
    draft:    { label: 'Draft', bg: 'bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/25', dot: 'bg-slate-500' },
  };
  const statusInfo = statusMap[template.status] ?? statusMap.draft;
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
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-bold uppercase tracking-wider backdrop-blur-md bg-card/90 border {statusInfo.border} {statusInfo.text} shadow-2xs">
        <span class="w-1.5 h-1.5 rounded-full {statusInfo.dot}"></span>
        {statusInfo.label}
      </span>
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
          <a
            href={`/builder/${template.id}`}
            class="btn btn-xs text-2xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl px-3 py-1.5 transition-all flex items-center gap-1 shadow-2xs"
          >
            <span class="material-symbols-outlined text-xs">edit</span>
            Edit
          </a>
        {/if}

        {#if template.status === 'rejected'}
          <button
            type="button"
            on:click={handleShowRejection}
            class="text-2xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-xs">info</span>
            Alasan
          </button>
          <a
            href={`/builder/${template.id}`}
            class="btn btn-xs text-2xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl px-3 py-1.5 transition-all flex items-center gap-1 shadow-2xs"
          >
            Edit Ulang
          </a>
        {/if}

        {#if template.status === 'approved' || template.status === 'pending'}
          <a
            href={`/builder/preview/${template.id}`}
            class="btn btn-xs text-2xs font-bold text-main bg-nested hover:bg-nested/80 border border-light rounded-xl px-3 py-1.5 transition-all flex items-center gap-1 shadow-2xs"
          >
            <span class="material-symbols-outlined text-xs">visibility</span>
            Pratinjau
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>
