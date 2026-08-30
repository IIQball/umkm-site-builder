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
  import {
    Palette,
    Check,
    X,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
  } from 'lucide-svelte';
  import { Card, Badge, Table, Modal, Button, Textarea, Pagination } from '@/components/ui';
  import { formatCurrency, formatDate } from '@/lib/utils';
  import { addToast } from '@/lib/toast';

  export let initialTemplatesJson: string = '[]';
  let templates: AdminTemplateItem[] = JSON.parse(initialTemplatesJson);
  let activeTab: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';
  let searchQuery = '';
  let isLoading = false;
  let selectedTemplate: AdminTemplateItem | null = null;
  let approveModalOpen = false;
  let rejectModalOpen = false;
  let rejectionReason = '';
  let actionLoading = false;
  let currentPage = 1;
  const pageSize = 10;

  const fetchTemplates = async () => {
    isLoading = true;
    try {
      const param = activeTab === 'all' ? '' : `?status=${activeTab}`;
      const res = await fetch(`/api/admin/templates${param}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        templates = result.data;
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Gagal memuat daftar template',
      });
    } finally {
      isLoading = false;
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    activeTab = tab;
    currentPage = 1;
    fetchTemplates();
  };

  const openApproveModal = (t: AdminTemplateItem) => {
    selectedTemplate = t;
    approveModalOpen = true;
  };

  const openRejectModal = (t: AdminTemplateItem) => {
    selectedTemplate = t;
    rejectionReason = '';
    rejectModalOpen = true;
  };

  const closeModal = () => {
    approveModalOpen = false;
    rejectModalOpen = false;
    selectedTemplate = null;
    rejectionReason = '';
  };

  const submitReview = async (action: 'approve' | 'reject') => {
    if (!selectedTemplate) return;
    if (action === 'reject' && rejectionReason.trim().length < 5) {
      addToast({
        type: 'error',
        message: 'Alasan penolakan minimal 5 karakter',
      });
      return;
    }
    actionLoading = true;
    try {
      const res = await fetch(`/api/admin/templates/${selectedTemplate.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejectionReason: action === 'reject' ? rejectionReason.trim() : undefined,
        }),
      });
      const result = await res.json();
      if (res.ok && (result.success || result.ok)) {
        addToast({
          type: 'success',
          message: action === 'approve' ? 'Template berhasil disetujui!' : 'Template telah ditolak',
        });
        closeModal();
        await fetchTemplates();
      } else {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal memperbarui status template',
        });
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan koneksi',
      });
    } finally {
      actionLoading = false;
    }
  };

  $: filteredTemplates = templates.filter((t) => {
    const matchesTab = activeTab === 'all' || t.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.designerName && t.designerName.toLowerCase().includes(q)) ||
      (t.designerEmail && t.designerEmail.toLowerCase().includes(q)) ||
      t.id.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  $: {
    searchQuery;
    currentPage = 1;
  }

  $: paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { variant: 'emerald' as const, label: 'Disetujui', icon: CheckCircle2 };
      case 'pending':
        return { variant: 'orange' as const, label: 'Perlu Ditinjau', icon: Clock };
      case 'rejected':
        return { variant: 'rose' as const, label: 'Ditolak', icon: XCircle };
      default:
        return { variant: 'slate' as const, label: status, icon: Clock };
    }
  };

  const tableHeaders = [
    { label: 'Template & Preview' },
    { label: 'Desainer', width: 'w-48' },
    { label: 'Harga Jual', align: 'right' as const, width: 'w-32' },
    { label: 'Tanggal Diajukan', width: 'w-36' },
    { label: 'Status', align: 'center' as const, width: 'w-36' },
    { label: 'Aksi Review', align: 'right' as const, width: 'w-48' },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Palette size={18} />
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Daftar Kurasi & Review Template
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Tinjau preview desain, verifikasi harga, dan putuskan persetujuan publikasi
        </p>
      </div>
    </div>

    <!-- Filter Tabs & Search Box -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari template / desainer..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1">
        <button
          type="button"
          on:click={() => handleTabChange('pending')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeTab === 'pending'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
          Menunggu
        </button>
        <button
          type="button"
          on:click={() => handleTabChange('approved')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeTab === 'approved'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Disetujui
        </button>
        <button
          type="button"
          on:click={() => handleTabChange('rejected')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeTab === 'rejected'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Ditolak
        </button>
        <button
          type="button"
          on:click={() => handleTabChange('all')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeTab === 'all'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({templates.length})
        </button>
      </div>
    </div>
  </div>

  <!-- Table Content -->
  {#if isLoading}
    <div class="flex justify-center items-center py-16 text-muted">
      <span class="material-symbols-outlined text-2xl animate-spin text-primary">refresh</span>
      <span class="ml-2 text-xs font-bold font-sans">Memuat data template...</span>
    </div>
  {:else if filteredTemplates.length === 0}
    <div class="py-16 px-8 text-center text-muted">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        <Palette size={24} />
      </div>
      <h4 class="font-bold text-main text-base font-heading mb-1">Tidak Ada Pengajuan Template</h4>
      <p class="text-xs text-secondary mt-1 max-w-sm mx-auto font-sans leading-relaxed">
        Belum ada template dalam kategori status ini atau sesuai dengan pencarian Anda.
      </p>
    </div>
  {:else}
    <Table headers={tableHeaders} minWidth="min-w-[860px]">
      {#each paginatedTemplates as tpl (tpl.id)}
        {@const statusMeta = getStatusBadge(tpl.status)}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Template Info + Thumbnail -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3.5">
              <div class="w-14 h-10 rounded-xl bg-nested border border-light overflow-hidden flex-shrink-0 relative shadow-2xs">
                {#if tpl.thumbnailUrl}
                  <img src={tpl.thumbnailUrl} alt={tpl.name} class="w-full h-full object-cover" />
                {:else}
                  <div class="w-full h-full bg-nested flex items-center justify-center text-muted">
                    <Palette size={16} />
                  </div>
                {/if}
              </div>
              <div class="min-w-0 max-w-xs">
                <span class="font-bold text-xs text-main block truncate font-sans">
                  {tpl.name}
                </span>
                <span class="text-3xs text-muted block uppercase font-mono mt-0.5">
                  ID: #{tpl.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </td>

          <!-- Designer Info -->
          <td class="px-4 py-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                {tpl.designerName ? tpl.designerName.charAt(0).toUpperCase() : 'D'}
              </div>
              <div class="min-w-0">
                <span class="font-bold text-xs text-main block truncate font-sans">
                  {tpl.designerName || 'Desainer Kreator'}
                </span>
                <span class="text-3xs text-secondary block truncate font-mono mt-0.5">
                  {tpl.designerEmail || '—'}
                </span>
              </div>
            </div>
          </td>

          <!-- Price -->
          <td class="px-4 py-4 text-right whitespace-nowrap">
            <span class="font-mono text-xs font-bold text-main bg-nested/80 px-2.5 py-1 rounded-xl border border-light">
              {tpl.price === 0 ? 'Gratis' : formatCurrency(tpl.price)}
            </span>
          </td>

          <!-- Created Date -->
          <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
            {formatDate(tpl.createdAt)}
          </td>

          <!-- Status Badge -->
          <td class="px-4 py-4 text-center whitespace-nowrap">
            <div class="inline-flex items-center justify-center">
              <Badge variant={statusMeta.variant} size="sm" dot>
                {statusMeta.label}
              </Badge>
            </div>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              <!-- Live Preview Button -->
              <Button
                href={`/builder/preview/${tpl.id}`}
                target="_blank"
                variant="secondary"
                size="xs"
                className="font-bold"
                title="Buka Pratinjau Live"
              >
                <Eye size={13} />
                <span>Lihat</span>
              </Button>

              {#if tpl.status === 'pending'}
                <!-- Quick Approve -->
                <Button
                  variant="primary"
                  size="xs"
                  className="font-bold !bg-emerald-600 hover:!bg-emerald-700 text-white"
                  title="Setujui Template"
                  on:click={() => openApproveModal(tpl)}
                >
                  <Check size={13} strokeWidth={3} />
                  <span>Setujui</span>
                </Button>

                <!-- Quick Reject -->
                <Button
                  variant="destructive"
                  size="xs"
                  className="font-bold"
                  title="Tolak Template"
                  on:click={() => openRejectModal(tpl)}
                >
                  <X size={13} strokeWidth={3} />
                  <span>Tolak</span>
                </Button>
              {/if}
            </div>
          </td>
        </tr>
      {/each}
    </Table>

    <!-- DaisyUI Pagination Footer -->
    <Pagination
      bind:currentPage
      totalItems={filteredTemplates.length}
      {pageSize}
    />
  {/if}
</Card>

<!-- Approve Modal -->
<Modal
  open={approveModalOpen}
  size="sm"
  on:close={closeModal}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <CheckCircle2 size={20} />
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Setujui Template Desain
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Publikasikan template ke marketplace UMKM
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if selectedTemplate}
    <div class="space-y-4 pt-1">
      <p class="text-xs text-secondary leading-relaxed font-sans">
        Apakah Anda yakin ingin menyetujui template <strong class="text-main">{selectedTemplate.name}</strong> karya <strong class="text-main">{selectedTemplate.designerName || selectedTemplate.designerEmail}</strong>? Template ini akan langsung dapat dibeli dan digunakan oleh semua tenant UMKM.
      </p>

      <div class="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={closeModal}
          disabled={actionLoading}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700"
          on:click={() => submitReview('approve')}
          disabled={actionLoading}
        >
          {actionLoading ? 'Menyetujui...' : 'Konfirmasi Setujui'}
        </Button>
      </div>
    </div>
  {/if}
</Modal>

<!-- Reject Modal -->
<Modal
  open={rejectModalOpen}
  size="md"
  on:close={closeModal}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <XCircle size={20} />
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Tolak / Minta Revisi Template
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Kirimkan catatan kurasi kepada desainer
        </p>
      </div>
    </div>
  </svelte:fragment>

  {#if selectedTemplate}
    <div class="space-y-4 pt-1">
      <p class="text-xs text-secondary leading-relaxed font-sans">
        Tuliskan alasan penolakan atau perbaikan yang perlu dilakukan oleh desainer <strong class="text-main">{selectedTemplate.name}</strong>:
      </p>

      <Textarea
        bind:value={rejectionReason}
        placeholder="Contoh: Tata letak pada section hero kurang kontras pada mobile breakpoint..."
        rows={4}
        className="text-xs font-sans"
      />

      <div class="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={closeModal}
          disabled={actionLoading}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="rounded-xl font-bold"
          on:click={() => submitReview('reject')}
          disabled={actionLoading || rejectionReason.trim().length < 5}
        >
          {actionLoading ? 'Memproses...' : 'Kirim Penolakan'}
        </Button>
      </div>
    </div>
  {/if}
</Modal>
