<script lang="ts">
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
    if (!confirm('Hapus draf ini?')) return;
    try {
      isDeleting = true;
      const response = await fetch(`/api/templates/draft?templateId=${template.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        alert(result.error?.message || 'Gagal menghapus draf');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      isDeleting = false;
    }
  };

  const handleShowRejection = () => {
    const modalName = document.getElementById('rejection_template_name');
    const modalReason = document.getElementById('rejection_reason_text');
    const modal = document.getElementById('rejection_modal') as HTMLDialogElement | null;
    if (modalName) modalName.textContent = template.name;
    if (modalReason) modalReason.textContent = template.rejectionReason || 'Tidak ada alasan terperinci.';
    modal?.showModal();
  };

  const formatPrice = (price: number): string => {
    if (!price || price === 0) return 'Gratis';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'pending':
        return 'Menunggu Review';
      case 'rejected':
        return 'Ditolak';
      default:
        return 'Draft';
    }
  };
</script>

<div class="template-card card bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col" data-status={template.status}>
  <!-- Card Header / Thumbnail -->
  <div class="relative h-44 w-full bg-slate-900 flex items-center justify-center overflow-hidden border-b border-base-200">
    {#if template.thumbnailUrl}
      <img src={template.thumbnailUrl} alt={template.name} class="w-full h-full object-cover" />
    {:else}
      <div class="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
        <span class="material-symbols-outlined text-3xl text-slate-500">storefront</span>
        <span class="text-[11px] font-medium text-slate-400">Preview Desain Toko</span>
      </div>
    {/if}

    <!-- Status Badge Overlay -->
    <div class="absolute top-3 right-3">
      <span class={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${getStatusBadgeClass(template.status)}`}>
        {getStatusLabel(template.status)}
      </span>
    </div>
  </div>

  <!-- Card Content Body -->
  <div class="p-5 flex-1 flex flex-col justify-between">
    <div>
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="text-sm font-bold text-base-content line-clamp-1">{template.name}</h3>
        <span class="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono flex-shrink-0">
          {formatPrice(template.price)}
        </span>
      </div>
      <p class="text-xs text-base-content/60 line-clamp-2 mb-4 leading-relaxed">
        {template.description || 'Tanpa deskripsi'}
      </p>
    </div>

    <!-- Card Footer Meta & Actions -->
    <div class="space-y-3 pt-3 border-t border-base-200">
      <div class="flex items-center justify-between text-[11px] text-base-content/60">
        <span class="font-semibold text-base-content/80">{template.totalSold}x Terjual</span>
        <span>{new Date(template.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        {#if template.status === 'draft'}
          <a href={`/builder/${template.id}`} class="btn btn-primary btn-sm rounded-xl text-xs font-bold text-white flex-1">
            Edit Builder
          </a>
          <button
            type="button"
            disabled={isDeleting}
            on:click={handleDelete}
            class="btn btn-ghost btn-sm text-rose-500 rounded-xl text-xs font-bold cursor-pointer"
          >
            Hapus
          </button>
        {/if}
        {#if template.status === 'rejected'}
          <button
            type="button"
            on:click={handleShowRejection}
            class="btn btn-warning btn-outline btn-sm rounded-xl text-xs font-bold flex-1 cursor-pointer"
          >
            Alasan
          </button>
          <a href={`/builder/${template.id}`} class="btn btn-primary btn-sm rounded-xl text-xs font-bold text-white flex-1">
            Edit Ulang
          </a>
        {/if}
        {#if template.status === 'approved' || template.status === 'pending'}
          <a href={`/builder/preview/${template.id}`} class="btn btn-outline btn-sm rounded-xl text-xs font-bold w-full">
            Pratinjau
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>
