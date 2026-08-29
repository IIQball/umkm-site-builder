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
    User,
    Check,
    X,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
  } from 'lucide-svelte';
  import { Card, Badge, Modal, Button, Textarea } from '@/components/ui';
  import { formatCurrency, formatDate } from '@/lib/utils';
  import { toast } from '@/lib/toast';

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
      toast.error('Gagal memuat daftar template');
    } finally {
      isLoading = false;
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    activeTab = tab;
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
      toast.error('Alasan penolakan minimal 5 karakter');
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
        toast.success(action === 'approve' ? 'Template berhasil disetujui!' : 'Template telah ditolak');
        closeModal();
        await fetchTemplates();
      } else {
        toast.error(result.error?.message || 'Gagal memperbarui status template');
      }
    } catch {
      toast.error('Terjadi kesalahan koneksi');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { variant: 'emerald' as const, label: 'Disetujui', icon: CheckCircle2 };
      case 'pending':
        return { variant: 'amber' as const, label: 'Perlu Ditinjau', icon: Clock };
      case 'rejected':
        return { variant: 'rose' as const, label: 'Ditolak', icon: XCircle };
      default:
        return { variant: 'slate' as const, label: status, icon: Clock };
    }
  };
</script>

<Card variant="bordered" padding="none" radius="xl" topBeam="indigo-500">
  <!-- Table Header & Controls (matching DesignerMutationTable style) -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">palette</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Daftar Kurasi & Review Template</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">
        Tinjau preview desain, verifikasi harga, dan putuskan persetujuan publikasi
      </p>
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
          class="bg-nested/80 border border-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-xl p-1">
        <button
          type="button"
          on:click={() => handleTabChange('pending')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeTab === 'pending'
            ? 'bg-amber-500 text-white shadow-2xs'
            : 'text-muted hover:text-amber-500'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Menunggu ({templates.filter((t) => t.status === 'pending').length})
        </button>
        <button
          type="button"
          on:click={() => handleTabChange('approved')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeTab === 'approved'
            ? 'bg-emerald-500 text-white shadow-2xs'
            : 'text-muted hover:text-success'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Disetujui ({templates.filter((t) => t.status === 'approved').length})
        </button>
        <button
          type="button"
          on:click={() => handleTabChange('rejected')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 {activeTab === 'rejected'
            ? 'bg-rose-500 text-white shadow-2xs'
            : 'text-muted hover:text-rose-500'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          Ditolak ({templates.filter((t) => t.status === 'rejected').length})
        </button>
        <button
          type="button"
          on:click={() => handleTabChange('all')}
          class="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer {activeTab === 'all'
            ? 'bg-card text-main shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({templates.length})
        </button>
      </div>
    </div>
  </div>

  <!-- Table Content -->
  <div class="overflow-x-auto">
    {#if isLoading}
      <div class="flex justify-center items-center py-16 text-muted">
        <span class="material-symbols-outlined text-2xl animate-spin text-primary">refresh</span>
        <span class="ml-2 text-xs font-bold">Memuat data template...</span>
      </div>
    {:else if filteredTemplates.length === 0}
      <div class="py-16 px-8 text-center text-muted">
        <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
          <Palette size={24} />
        </div>
        <p class="font-bold text-main text-sm font-heading">Tidak Ada Pengajuan Template</p>
        <p class="text-xs text-secondary mt-1 max-w-sm mx-auto font-sans">
          Belum ada template dalam kategori status ini atau sesuai dengan pencarian Anda.
        </p>
      </div>
    {:else}
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-light bg-nested/50 text-2xs uppercase tracking-wider text-muted font-heading font-bold">
            <th class="px-6 py-4">Template & Preview</th>
            <th class="px-6 py-4">Desainer</th>
            <th class="px-6 py-4 text-right">Harga Jual</th>
            <th class="px-6 py-4">Tanggal Diajukan</th>
            <th class="px-6 py-4 text-center">Status</th>
            <th class="px-6 py-4 text-right">Aksi Review</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-border-light)] text-sm">
          {#each filteredTemplates as item (item.id)}
            {@const statusMeta = getStatusBadge(item.status)}
            <tr class="hover:bg-nested/30 transition-colors group">
              <!-- Template Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  {#if item.thumbnailUrl}
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      class="w-11 h-9 rounded-lg object-cover border border-light flex-shrink-0"
                    />
                  {:else}
                    <div class="w-11 h-9 rounded-lg bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0">
                      <Palette size={16} />
                    </div>
                  {/if}
                  <div class="min-w-0 max-w-xs">
                    <span class="font-bold text-xs text-main block truncate">
                      {item.name}
                    </span>
                    <span class="text-3xs text-secondary line-clamp-1 block">
                      {item.description || 'Tidak ada deskripsi'}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Designer Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-nested border border-light flex items-center justify-center text-secondary flex-shrink-0">
                    <User size={13} />
                  </div>
                  <div class="min-w-0 max-w-xs">
                    <span class="font-bold text-xs text-main block truncate">
                      {item.designerName || 'Desainer'}
                    </span>
                    <span class="text-3xs text-muted block truncate font-mono">
                      {item.designerEmail || '-'}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Price -->
              <td class="px-6 py-4 text-right font-mono font-bold text-xs text-main">
                {item.price === 0 ? 'Gratis' : formatCurrency(item.price)}
              </td>

              <!-- Created Date -->
              <td class="px-6 py-4 text-xs text-secondary font-sans">
                {formatDate(item.createdAt)}
              </td>

              <!-- Status Badge -->
              <td class="px-6 py-4 text-center">
                <div class="inline-flex items-center justify-center">
                  <Badge variant={statusMeta.variant} size="sm" dot>
                    {statusMeta.label}
                  </Badge>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <a
                    href={`/builder/preview/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    class="p-1.5 rounded-lg text-secondary hover:text-main hover:bg-nested border border-transparent hover:border-light transition-all cursor-pointer inline-flex items-center gap-1 text-xs"
                    title="Buka Pratinjau Live"
                  >
                    <Eye size={14} />
                    <span class="hidden sm:inline">Preview</span>
                  </a>

                  {#if item.status === 'pending'}
                    <button
                      type="button"
                      on:click={() => openApproveModal(item)}
                      class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                      title="Setujui Template"
                    >
                      <Check size={13} />
                      <span>Setujui</span>
                    </button>
                    <button
                      type="button"
                      on:click={() => openRejectModal(item)}
                      class="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                      title="Tolak Template"
                    >
                      <X size={13} />
                      <span>Tolak</span>
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</Card>

<!-- Modal Setujui Template -->
<Modal bind:open={approveModalOpen} title="Konfirmasi Persetujuan Template">
  <div class="space-y-4">
    <p class="text-sm text-secondary leading-relaxed">
      Apakah Anda yakin ingin menyetujui template <strong class="text-main">"{selectedTemplate?.name}"</strong> untuk dipublikasikan ke marketplace UMKM?
    </p>
    <p class="text-xs text-muted bg-nested p-3 rounded-xl border border-light">
      Template ini akan segera dapat dilihat dan dibeli oleh seluruh tenant di katalog publik.
    </p>
    <div class="flex items-center justify-end gap-2 pt-2 border-t border-light">
      <Button variant="secondary" size="sm" on:click={closeModal} disabled={actionLoading}>
        Batal
      </Button>
      <Button variant="primary" size="sm" on:click={() => submitReview('approve')} loading={actionLoading} disabled={actionLoading}>
        <Check size={14} class="mr-1" />
        <span>Setujui & Publikasikan</span>
      </Button>
    </div>
  </div>
</Modal>

<!-- Modal Tolak Template -->
<Modal bind:open={rejectModalOpen} title="Tolak Pengajuan Template">
  <form on:submit|preventDefault={() => submitReview('reject')} class="space-y-4">
    <p class="text-sm text-secondary">
      Berikan catatan alasan penolakan atau revisi untuk template <strong class="text-main">"{selectedTemplate?.name}"</strong>:
    </p>
    <Textarea
      id="reject-reason"
      label="Alasan Penolakan / Catatan Kurator (Wajib)"
      placeholder="Jelaskan kekurangan desain, bug visual, atau hal yang perlu diperbaiki oleh desainer..."
      bind:value={rejectionReason}
      rows={4}
      required
      disabled={actionLoading}
    />
    <div class="flex items-center justify-end gap-2 pt-2 border-t border-light">
      <Button variant="secondary" size="sm" on:click={closeModal} disabled={actionLoading}>
        Batal
      </Button>
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        loading={actionLoading}
        disabled={actionLoading || rejectionReason.trim().length < 5}
      >
        <X size={14} class="mr-1" />
        <span>Tolak Template</span>
      </Button>
    </div>
  </form>
</Modal>
