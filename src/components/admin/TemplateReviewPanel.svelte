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
      <h1 class="text-heading-md text-main">Kurasi & Review Template</h1>
      <p class="text-body-base text-secondary mt-0.5">Tinjau dan berikan persetujuan untuk template desainer</p>
    </div>
  </div>

  <div class="flex items-center gap-1 bg-nested border border-light rounded-xl p-1 overflow-x-auto max-w-max flex-shrink-0">
    {#each statusTabs as tab}
      <button
        type="button"
        on:click={() => handleTabChange(tab)}
        class="px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer {activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-main hover:bg-card'}"
      >
        {tab === 'pending' ? 'Perlu Ditinjau' : tab === 'approved' ? 'Disetujui' : tab === 'rejected' ? 'Ditolak' : 'Semua'}
      </button>
    {/each}
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center py-16 bg-card rounded-2xl border border-light shadow-sm">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  {:else if filteredTemplates.length === 0}
    <div class="bg-card border border-light rounded-2xl py-16 px-8 flex flex-col items-center text-center shadow-sm">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-muted">inbox</span>
      </div>
      <h4 class="text-sm font-bold text-main mb-1.5">Tidak Ada Template</h4>
      <p class="text-xs text-secondary max-w-xs leading-relaxed">Belum ada template dalam kategori status ini.</p>
    </div>
  {:else}
    <div class="overflow-x-auto bg-card rounded-2xl border border-light shadow-sm">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr class="bg-nested/60 border-b border-light">
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Template</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Desainer</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Harga</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Tanggal Pengajuan</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Status</th>
            <th class="text-right text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light/50">
          {#each filteredTemplates as item (item.id)}
            <tr class="hover:bg-nested/40 transition-colors">
              <td class="px-6 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-nested overflow-hidden flex-shrink-0 border border-light">
                    {#if item.thumbnailUrl}
                      <img src={item.thumbnailUrl} alt={item.name} class="w-full h-full object-cover" />
                    {:else}
                      <div class="w-full h-full flex items-center justify-center text-muted">
                        <span class="material-symbols-outlined text-lg">palette</span>
                      </div>
                    {/if}
                  </div>
                  <div>
                    <p class="font-bold text-xs text-main">{item.name}</p>
                    <p class="text-xs text-muted line-clamp-1 max-w-[200px]">{item.description || 'Tidak ada deskripsi'}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5 text-xs">
                <p class="font-semibold text-main">{item.designerName || 'Desainer'}</p>
                <p class="text-xs text-muted">{item.designerEmail || '-'}</p>
              </td>
              <td class="px-4 py-3.5 font-mono text-xs font-bold text-main">
                {item.price === 0 ? 'Gratis' : formatIdr(item.price)}
              </td>
              <td class="px-4 py-3.5 text-xs text-muted">
                {formatDate(item.createdAt)}
              </td>
              <td class="px-4 py-3.5">
                {#if item.status === 'pending'}
                  <span class="badge-custom badge-custom-amber text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0"></span>
                    PENDING
                  </span>
                {:else if item.status === 'approved'}
                  <span class="badge-custom badge-custom-emerald text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0"></span>
                    APPROVED
                  </span>
                {:else}
                  <span class="badge-custom badge-custom-rose text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0"></span>
                    REJECTED
                  </span>
                {/if}
              </td>
              <td class="px-6 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <a 
                    href={`/builder/preview/${item.id}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-sm">visibility</span>
                    <span>Pratinjau</span>
                  </a>
                  {#if item.status === 'pending'}
                    <button 
                      type="button" 
                      on:click={() => openApproveModal(item)} 
                      class="btn btn-xs bg-success border-none text-white font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Setujui
                    </button>
                    <button 
                      type="button" 
                      on:click={() => openRejectModal(item)} 
                      class="btn btn-xs bg-error border-none text-white font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Tolak
                    </button>
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
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 animate-fade-in">
      <h3 class="font-bold text-sm text-main">Konfirmasi Persetujuan</h3>
      <p class="text-xs text-secondary leading-relaxed">Setujui template <strong>{selectedTemplate.name}</strong> untuk dipublikasikan ke marketplace?</p>
      <div class="flex items-center justify-end gap-2 pt-2">
        <button type="button" class="inline-flex items-center justify-center text-xs font-bold text-secondary hover:text-main hover:bg-nested rounded-xl px-4 py-2.5 transition-colors cursor-pointer" on:click={closeModal} disabled={actionLoading}>Batal</button>
        <button type="button" class="btn btn-sm btn-primary text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer" on:click={() => submitReview('approve')} disabled={actionLoading}>
          {actionLoading ? 'Memproses...' : 'Setujui Template'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if rejectModalOpen && selectedTemplate}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 animate-fade-in">
      <h3 class="font-bold text-sm text-main">Tolak Template</h3>
      <p class="text-xs text-secondary leading-relaxed">Alasan penolakan template <strong>{selectedTemplate.name}</strong>:</p>
      <textarea bind:value={rejectionReason} placeholder="Alasan penolakan (min 5 karakter)..." class="w-full px-3 py-2 bg-nested/40 text-main border border-light focus:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-colors h-24"></textarea>
      <div class="flex items-center justify-end gap-2 pt-2">
        <button type="button" class="inline-flex items-center justify-center text-xs font-bold text-secondary hover:text-main hover:bg-nested rounded-xl px-4 py-2.5 transition-colors cursor-pointer" on:click={closeModal} disabled={actionLoading}>Batal</button>
        <button type="button" class="btn btn-sm bg-error border-none text-white text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer" on:click={() => submitReview('reject')} disabled={actionLoading || rejectionReason.trim().length < 5}>
          {actionLoading ? 'Memproses...' : 'Tolak Template'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if toast}
  <div class="fixed bottom-4 right-4 z-50 transition-all animate-fade-in">
    <div 
      class="alert text-xs rounded-xl flex items-center gap-2 px-4 py-3 shadow-lg {toast.type === 'success' ? 'alert-success' : 'alert-error'}"
    >
      <span class="material-symbols-outlined text-base flex-shrink-0">
        {toast.type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span class="font-bold">{toast.message}</span>
    </div>
  </div>
{/if}
