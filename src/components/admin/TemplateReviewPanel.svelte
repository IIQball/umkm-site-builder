<script context="module" lang="ts">
  export type AdminTemplateItem = {
    id: string;
    name: string;
    description: string | null;
    thumbnailUrl: string | null;
    price: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    rejectionReason: string | null;
    createdAt: string;
    designerId: string;
    designerName: string | null;
    designerEmail: string | null;
  };
</script>

<script lang="ts">
  export let initialTemplatesJson: string = '[]';
  let templates: AdminTemplateItem[] = JSON.parse(initialTemplatesJson);
  const statusTabs: Array<'pending' | 'approved' | 'rejected' | 'all'> = ['pending', 'approved', 'rejected', 'all'];
  let activeTab: 'pending' | 'approved' | 'rejected' | 'all' = 'pending';
  let isLoading = false;
  let selectedTemplate: AdminTemplateItem | null = null;
  let approveModalOpen = false;
  let rejectModalOpen = false;
  let rejectionReason = '';
  let actionLoading = false;
  let toast: { message: string; type: 'success' | 'error' } | null = null;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast = { message, type };
    setTimeout(() => { if (toast?.message === message) toast = null; }, 4000);
  };

  const fetchTemplates = async () => {
    isLoading = true;
    try {
      const param = activeTab === 'all' ? '' : `?status=${activeTab}`;
      const res = await fetch(`/api/admin/templates${param}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) templates = result.data;
    } catch {
      showToast('Gagal memuat daftar template', 'error');
    } finally {
      isLoading = false;
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    activeTab = tab;
    fetchTemplates();
  };

  const openApproveModal = (t: AdminTemplateItem) => { selectedTemplate = t; approveModalOpen = true; };
  const openRejectModal = (t: AdminTemplateItem) => { selectedTemplate = t; rejectionReason = ''; rejectModalOpen = true; };
  const closeModal = () => { approveModalOpen = false; rejectModalOpen = false; selectedTemplate = null; rejectionReason = ''; };

  const submitReview = async (action: 'approve' | 'reject') => {
    if (!selectedTemplate) return;
    if (action === 'reject' && rejectionReason.trim().length < 5) {
      showToast('Alasan penolakan minimal 5 karakter', 'error');
      return;
    }
    actionLoading = true;
    try {
      const res = await fetch(`/api/admin/templates/${selectedTemplate.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionReason: action === 'reject' ? rejectionReason : undefined }),
      });
      const result = await res.json();
      if (res.ok && (result.success || result.ok)) {
        showToast(action === 'approve' ? 'Template berhasil disetujui!' : 'Template telah ditolak', 'success');
        closeModal();
        await fetchTemplates();
      } else {
        showToast(result.error?.message || 'Gagal memperbarui status template', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi', 'error');
    } finally {
      actionLoading = false;
    }
  };

  const formatIdr = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };
  const formatDate = (d: string): string => {
    return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
  };

  $: filteredTemplates = templates.filter((t) => activeTab === 'all' || t.status === activeTab);
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content tracking-tight">Kurasi & Review Template</h1>
      <p class="text-xs text-base-content/60 mt-1">Tinjau dan berikan persetujuan untuk template desainer</p>
    </div>
  </div>

  <div class="tabs tabs-boxed bg-base-100 p-1.5 border border-base-200 shadow-sm rounded-xl inline-flex flex-wrap gap-1">
    {#each statusTabs as tab}
      <button
        type="button"
        on:click={() => handleTabChange(tab)}
        class="tab text-xs font-medium rounded-lg transition-all {activeTab === tab ? 'tab-active bg-primary text-primary-content shadow-sm' : ''}"
      >
        {tab === 'pending' ? 'Perlu Ditinjau' : tab === 'approved' ? 'Disetujui' : tab === 'rejected' ? 'Ditolak' : 'Semua'}
      </button>
    {/each}
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center py-16 bg-base-100 rounded-2xl border border-base-200">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  {:else if filteredTemplates.length === 0}
    <div class="text-center py-16 bg-base-100 rounded-2xl border border-base-200 p-6">
      <span class="material-symbols-outlined text-4xl text-base-content/30 mb-2">inbox</span>
      <p class="text-sm font-semibold text-base-content">Tidak Ada Template</p>
      <p class="text-xs text-base-content/50 mt-1">Belum ada template dalam kategori status ini.</p>
    </div>
  {:else}
    <div class="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      <table class="table w-full text-xs">
        <thead>
          <tr class="bg-base-200/50 border-b border-base-200">
            <th class="py-3 px-4 font-semibold">Template</th>
            <th class="py-3 px-4 font-semibold">Desainer</th>
            <th class="py-3 px-4 font-semibold">Harga</th>
            <th class="py-3 px-4 font-semibold">Tanggal Pengajuan</th>
            <th class="py-3 px-4 font-semibold">Status</th>
            <th class="py-3 px-4 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-base-200/60">
          {#each filteredTemplates as item (item.id)}
            <tr class="hover:bg-base-200/30 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-base-200 overflow-hidden flex-shrink-0 border border-base-200">
                    {#if item.thumbnailUrl}
                      <img src={item.thumbnailUrl} alt={item.name} class="w-full h-full object-cover" />
                    {:else}
                      <div class="w-full h-full flex items-center justify-center text-base-content/30">
                        <span class="material-symbols-outlined text-lg">palette</span>
                      </div>
                    {/if}
                  </div>
                  <div>
                    <p class="font-bold text-xs text-base-content">{item.name}</p>
                    <p class="text-[10px] text-base-content/60 line-clamp-1">{item.description || 'Tidak ada deskripsi'}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <p class="font-semibold text-base-content">{item.designerName || 'Desainer'}</p>
                <p class="text-[10px] text-base-content/50">{item.designerEmail || '-'}</p>
              </td>
              <td class="py-3 px-4 font-semibold">{item.price === 0 ? 'Gratis' : formatIdr(item.price)}</td>
              <td class="py-3 px-4 text-base-content/70">{formatDate(item.createdAt)}</td>
              <td class="py-3 px-4">
                <span class="badge badge-{item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'success' : 'error'} text-[10px] font-bold uppercase">
                  {item.status}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <a href={`/builder/preview/${item.id}`} target="_blank" rel="noreferrer" class="btn btn-ghost btn-xs gap-1">
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                    <span class="hidden sm:inline">Pratinjau</span>
                  </a>
                  {#if item.status === 'pending'}
                    <button type="button" on:click={() => openApproveModal(item)} class="btn btn-success btn-xs text-white">Setujui</button>
                    <button type="button" on:click={() => openRejectModal(item)} class="btn btn-error btn-xs text-white">Tolak</button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if approveModalOpen && selectedTemplate}
  <div class="modal modal-open z-50">
    <div class="modal-box rounded-2xl max-w-md">
      <h3 class="font-bold text-lg">Konfirmasi Persetujuan</h3>
      <p class="py-3 text-xs text-base-content/70">Setujui template <strong>{selectedTemplate.name}</strong> untuk dipublikasikan ke marketplace?</p>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost btn-sm" on:click={closeModal} disabled={actionLoading}>Batal</button>
        <button type="button" class="btn btn-success btn-sm text-white" on:click={() => submitReview('approve')} disabled={actionLoading}>
          {actionLoading ? 'Memproses...' : 'Setujui Template'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if rejectModalOpen && selectedTemplate}
  <div class="modal modal-open z-50">
    <div class="modal-box rounded-2xl max-w-md">
      <h3 class="font-bold text-lg">Tolak Template</h3>
      <p class="py-2 text-xs text-base-content/70">Alasan penolakan template <strong>{selectedTemplate.name}</strong>:</p>
      <textarea bind:value={rejectionReason} placeholder="Alasan penolakan (min 5 karakter)..." class="textarea textarea-bordered w-full h-24 text-xs my-2 rounded-xl"></textarea>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost btn-sm" on:click={closeModal} disabled={actionLoading}>Batal</button>
        <button type="button" class="btn btn-error btn-sm text-white" on:click={() => submitReview('reject')} disabled={actionLoading || rejectionReason.trim().length < 5}>
          {actionLoading ? 'Memproses...' : 'Tolak Template'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if toast}
  <div class="toast toast-end toast-bottom z-50">
    <div class="alert alert-{toast.type === 'success' ? 'success' : 'error'} text-white shadow-lg text-xs rounded-xl">
      <span>{toast.message}</span>
    </div>
  </div>
{/if}
