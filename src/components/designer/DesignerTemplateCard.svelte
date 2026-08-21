<script lang="ts">
  import { formatIDR } from '@/lib/utils/format';

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
    if (!confirm('Hapus draf ini? Tindakan tidak dapat dibatalkan.')) return;
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

  const formatPrice = (p: number) => (p === 0 ? 'Gratis' : formatIDR(p));

  const statusMap: Record<string, { label: string; cls: string }> = {
    approved: { label: 'Disetujui',       cls: 'badge-custom-emerald' },
    pending:  { label: 'Menunggu Review', cls: 'badge-custom-amber' },
    rejected: { label: 'Ditolak',         cls: 'badge-custom-rose' },
    draft:    { label: 'Draft',           cls: 'badge-custom-slate' },
  };
  const statusInfo = statusMap[template.status] ?? statusMap.draft;
</script>

<div
  class="template-card bg-card border border-main rounded-2xl overflow-hidden shadow-sm
         hover:shadow-md hover:border-main transition-all duration-200 flex flex-col group"
  data-status={template.status}
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
        <span class="material-symbols-outlined icon-filled text-[36px] text-muted">storefront</span>
        <span class="text-[11px] font-medium text-secondary">Preview Belum Tersedia</span>
      </div>
    {/if}

    <div class="absolute top-3 left-3">
      <span class="badge-custom backdrop-blur-sm bg-card/85 {statusInfo.cls}">
        {statusInfo.label}
      </span>
    </div>

    <!-- Sold count overlay -->
    {#if template.totalSold > 0}
      <div class="absolute top-3 right-3">
        <span class="text-[10px] font-bold text-white bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
          {template.totalSold}× terjual
        </span>
      </div>
    {/if}
  </div>

  <!-- Card body -->
  <div class="p-4 flex-1 flex flex-col">
    <div class="flex items-start justify-between gap-2 mb-1">
      <h3 class="text-[13px] font-bold text-main line-clamp-1 flex-1">{template.name}</h3>
      <span class="text-[12px] font-extrabold text-indigo-600 dark:text-indigo-400 font-mono flex-shrink-0">
        {formatPrice(template.price)}
      </span>
    </div>
    <p class="text-[11px] text-secondary line-clamp-2 leading-relaxed flex-1">
      {template.description || 'Tanpa deskripsi'}
    </p>

    <!-- Footer: date + actions -->
    <div class="pt-3 mt-3 border-t border-light flex items-center justify-between gap-2">
      <span class="text-[11px] text-muted">
        {new Date(template.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>

      <!-- Actions -->
      <div class="flex items-center gap-1.5">
        {#if template.status === 'draft'}
          <a
            href={`/builder/${template.id}`}
            class="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-indigo-600
                   hover:bg-indigo-700 rounded-lg px-3 py-1.5 transition-colors active:scale-95"
          >
            <span class="material-symbols-outlined text-[13px]">edit</span>
            Edit
          </a>
          <button
            type="button"
            disabled={isDeleting}
            on:click={handleDelete}
            class="inline-flex items-center text-[11px] font-medium text-muted
                   hover:text-rose-500 hover:bg-rose-50/10 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            {isDeleting ? '…' : 'Hapus'}
          </button>
        {/if}

        {#if template.status === 'rejected'}
          <button
            type="button"
            on:click={handleShowRejection}
            class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400
                   bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg px-2.5 py-1.5 transition-colors"
          >
            <span class="material-symbols-outlined text-[13px]">info</span>
            Alasan
          </button>
          <a
            href={`/builder/${template.id}`}
            class="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-indigo-600
                   hover:bg-indigo-700 rounded-lg px-3 py-1.5 transition-colors active:scale-95"
          >
            Edit Ulang
          </a>
        {/if}

        {#if template.status === 'approved' || template.status === 'pending'}
          <a
            href={`/builder/preview/${template.id}`}
            class="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary
                   border border-light hover:border-main hover:bg-nested rounded-lg px-3 py-1.5 transition-colors"
          >
            <span class="material-symbols-outlined text-[13px]">visibility</span>
            Pratinjau
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

