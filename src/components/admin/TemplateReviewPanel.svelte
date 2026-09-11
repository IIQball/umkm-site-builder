<script context="module" lang="ts">
  export type { AdminTemplateItem } from './review/review.types';
</script>

<script lang="ts">
  import {
    Palette,
    CheckCircle2,
    Clock,
    XCircle,
  } from 'lucide-svelte';
  import { Card, Pagination } from '@/components/ui';
  import { addToast } from '@/lib/toast';
  import type { AdminTemplateItem } from './review/review.types';
  import TemplateReviewTable from './review/TemplateReviewTable.svelte';
  import TemplateReviewModals from './review/TemplateReviewModals.svelte';

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
      if (result.ok && Array.isArray(result.data)) {
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

      if (res.ok && result.ok) {
        addToast({
          type: 'success',
          message:
            action === 'approve'
              ? `Template "${selectedTemplate.name}" berhasil disetujui!`
              : `Template "${selectedTemplate.name}" telah ditolak.`,
        });
        closeModal();
        await fetchTemplates();
      } else {
        addToast({
          type: 'error',
          message: result.error?.message || 'Gagal memproses review template',
        });
      }
    } catch {
      addToast({
        type: 'error',
        message: 'Terjadi kesalahan jaringan saat memproses review',
      });
    } finally {
      actionLoading = false;
    }
  };

  $: filteredTemplates = templates.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.designerName && t.designerName.toLowerCase().includes(q)) ||
      (t.designerEmail && t.designerEmail.toLowerCase().includes(q))
    );
  });

  $: paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  $: countPending = templates.filter((t) => t.status === 'pending').length;
  $: countApproved = templates.filter((t) => t.status === 'approved').length;
  $: countRejected = templates.filter((t) => t.status === 'rejected').length;
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <Palette size={20} />
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Review & Kurasi Template
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Verifikasi standar mutu desain sebelum dipublikasikan ke marketplace UMKM
        </p>
      </div>
    </div>

    <!-- Actions & Filter Pills -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Search Input Capsule -->
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari nama template / desainer..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-52 sm:w-60"
        />
      </div>

      <!-- Segmented Status Filter (Exact matching style from OrderHistoryTable) -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1">
        <button
          type="button"
          on:click={() => handleTabChange('all')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeTab === 'all'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          Semua ({templates.length})
        </button>

        <button
          type="button"
          on:click={() => handleTabChange('pending')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeTab === 'pending'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
          <span>Menunggu</span>
          {#if countPending > 0}
            <span class="opacity-80 font-mono text-3xs">({countPending})</span>
          {/if}
        </button>

        <button
          type="button"
          on:click={() => handleTabChange('approved')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeTab === 'approved'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Disetujui</span>
          {#if countApproved > 0}
            <span class="opacity-80 font-mono text-3xs">({countApproved})</span>
          {/if}
        </button>

        <button
          type="button"
          on:click={() => handleTabChange('rejected')}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeTab === 'rejected'
            ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs'
            : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>Ditolak</span>
          {#if countRejected > 0}
            <span class="opacity-80 font-mono text-3xs">({countRejected})</span>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Content / Table -->
  {#if isLoading}
    <div class="py-16 flex flex-col items-center justify-center gap-2">
      <div class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      <p class="text-xs text-secondary font-medium">Memuat data template...</p>
    </div>
  {:else if filteredTemplates.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        {#if activeTab === 'pending'}
          <Clock size={24} />
        {:else if activeTab === 'approved'}
          <CheckCircle2 size={24} />
        {:else if activeTab === 'rejected'}
          <XCircle size={24} />
        {:else}
          <Palette size={24} />
        {/if}
      </div>
      <h4 class="font-bold text-main text-base font-heading mb-1">
        Tidak Ada Template {activeTab === 'pending' ? 'yang Menunggu Review' : activeTab === 'approved' ? 'yang Disetujui' : activeTab === 'rejected' ? 'yang Ditolak' : ''}
      </h4>
      <p class="text-xs text-secondary max-w-sm mx-auto font-sans leading-relaxed">
        {searchQuery ? 'Tidak ada hasil yang sesuai dengan kueri pencarian Anda.' : 'Seluruh antrean kurasi template bersih.'}
      </p>
    </div>
  {:else}
    <TemplateReviewTable
      {paginatedTemplates}
      onApprove={openApproveModal}
      onReject={openRejectModal}
    />

    <Pagination
      bind:currentPage
      totalItems={filteredTemplates.length}
      {pageSize}
    />
  {/if}
</Card>

<TemplateReviewModals
  bind:approveModalOpen
  bind:rejectModalOpen
  {selectedTemplate}
  bind:rejectionReason
  {actionLoading}
  onClose={closeModal}
  onSubmitReview={submitReview}
/>
