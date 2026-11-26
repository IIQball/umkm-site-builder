<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { AlertCircle, Bug, CheckCircle2, Clock, RefreshCw, Search } from 'lucide-svelte';
  import { Button, Card, Input, Pagination, Select } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import BugReportDetailModal from './BugReportDetailModal.svelte';
  import BugReportStatsGrid from './BugReportStatsGrid.svelte';
  import BugReportsTable from './BugReportsTable.svelte';
  import {
    STATUS_TABS,
    type BugReportListItem,
    type BugReportPagination,
    type BugReportStatusCounts,
  } from './bugReports.helpers';
  import type { BugReportSource, BugReportStatus } from '@/schemas/bug-report.schema';

  type StatusFilter = 'all' | BugReportStatus;
  type SourceFilter = 'all' | BugReportSource;

  export let initialItems: BugReportListItem[] | undefined = undefined;
  export let initialCounts: BugReportStatusCounts | undefined = undefined;
  export let initialPagination: BugReportPagination | undefined = undefined;
  export let ssrFailed = false;

  let items: BugReportListItem[] = initialItems ?? [];
  let counts: BugReportStatusCounts = initialCounts ?? {
    all: 0,
    unresolved: 0,
    in_progress: 0,
    resolved: 0,
  };
  let pagination: BugReportPagination = initialPagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  let statusFilter: StatusFilter = 'all';
  let sourceFilter: SourceFilter = 'all';
  let searchQuery = '';
  let page = pagination.page;
  let isLoading = ssrFailed || initialItems === undefined;
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let activeAbortController: AbortController | null = null;
  let requestSeq = 0;

  let selectedReport: BugReportListItem | null = null;
  let detailOpen = false;

  async function fetchReports(targetPage = page) {
    activeAbortController?.abort();
    const controller = new AbortController();
    activeAbortController = controller;
    const seq = ++requestSeq;
    isLoading = true;

    try {
      const params = new URLSearchParams({
        status: statusFilter,
        sourceApp: sourceFilter,
        page: String(targetPage),
        limit: String(pagination.limit),
      });
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }

      const result = await apiFetch<BugReportListItem[]>(
        `/api/superadmin/bug-reports?${params.toString()}`,
        {
          signal: controller.signal,
          fallbackError: 'Gagal memuat daftar laporan bug.',
        }
      );

      if (seq !== requestSeq || result.errorCode === 'ABORTED') return;

      if (result.success) {
        items = Array.isArray(result.data) ? result.data : [];
        const meta = result.meta as
          | { counts?: BugReportStatusCounts; pagination?: BugReportPagination }
          | undefined;
        if (meta?.counts) counts = meta.counts;
        if (meta?.pagination) {
          pagination = meta.pagination;
          page = meta.pagination.page;
        }
      } else {
        toast.error(result.message, 'Gagal Memuat Data');
      }
    } catch {
      if (seq === requestSeq) {
        toast.error('Koneksi bermasalah saat mengambil data laporan bug.');
      }
    } finally {
      if (seq === requestSeq) {
        isLoading = false;
      }
    }
  }

  const SOURCE_OPTIONS = [
    { value: 'all', label: 'Semua Sumber' },
    { value: 'site_builder', label: 'Site Builder' },
    { value: 'landing_page', label: 'Landing Page' },
  ];

  function handleStatusTab(nextStatus: StatusFilter) {
    statusFilter = nextStatus;
    page = 1;
    void fetchReports(1);
  }

  function handleSourceChange(event: CustomEvent<Event>) {
    const target = (event.detail.currentTarget ?? event.detail.target) as HTMLSelectElement | null;
    if (!target) return;
    sourceFilter = target.value as SourceFilter;
    page = 1;
    void fetchReports(1);
  }

  function handleSearchInput() {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      page = 1;
      void fetchReports(1);
    }, 300);
  }

  function handlePageChange(event: CustomEvent<number>) {
    page = event.detail;
    void fetchReports(event.detail);
  }

  function openDetail(report: BugReportListItem) {
    selectedReport = report;
    detailOpen = true;
  }

  function handleReportUpdated(event: CustomEvent<BugReportListItem>) {
    const updated = event.detail;
    items = items.map((row) => (row.id === updated.id ? updated : row));
    void fetchReports(page);
  }

  onMount(() => {
    if (ssrFailed || initialItems === undefined) {
      void fetchReports(page);
    }
  });

  onDestroy(() => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    activeAbortController?.abort();
  });
</script>

<div class="space-y-8 md:space-y-10 min-w-0">
  <BugReportStatsGrid {counts} />

  <!-- Interactive Filter Panel & Table -->
  <div class="animate-fade-in-up delay-300">
    <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
      <div class="p-5 sm:p-6 border-b border-light flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Bug size={20} />
          </div>
          <div class="min-w-0">
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Antrean &amp; Daftar Laporan Bug
            </h3>
            <p class="text-body-sm text-secondary mt-0.5 font-sans">
              Telusuri kendala, rute halaman, serta perbarui status penanganan secara terpusat
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex-1 sm:flex-initial sm:w-56">
            <Input
              type="search"
              size="sm"
              bind:value={searchQuery}
              on:input={handleSearchInput}
              placeholder="Cari judul, deskripsi, atau rute..."
              class="!rounded-full !bg-nested/80"
            >
              <Search size={14} slot="prefix" />
            </Input>
          </div>

          <Select
            aria-label="Filter sumber aplikasi"
            size="sm"
            fullWidth={false}
            value={sourceFilter}
            options={SOURCE_OPTIONS}
            on:change={handleSourceChange}
            class="!rounded-full !bg-nested/80 font-semibold"
          />

          <div class="flex flex-wrap items-center gap-1 bg-nested/80 border border-light rounded-2xl sm:rounded-full p-1">
            {#each STATUS_TABS as tab}
              <Button
                size="xs"
                variant={statusFilter === tab.id ? 'dark' : 'ghost'}
                class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {statusFilter === tab.id ? 'shadow-2xs' : 'text-muted hover:text-main'}"
                on:click={() => handleStatusTab(tab.id)}
              >
                {#if tab.dotClass}
                  <span class="w-1.5 h-1.5 rounded-full {tab.dotClass}"></span>
                {/if}
                <span>{tab.label}</span>
                {#if tab.id === 'all' || counts[tab.id] > 0}
                  <span class="opacity-80 font-mono text-xs">({counts[tab.id]})</span>
                {/if}
              </Button>
            {/each}
          </div>

          <Button
            variant="secondary"
            size="xs"
            class="!rounded-full font-bold"
            on:click={() => fetchReports(page)}
            disabled={isLoading}
            title="Muat ulang daftar laporan"
          >
            <RefreshCw size={13} class={isLoading ? 'animate-spin' : ''} />
            <span>Muat Ulang</span>
          </Button>
        </div>
      </div>

      {#if isLoading}
        <div class="py-16 flex flex-col items-center justify-center gap-2">
          <div class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p class="text-xs text-secondary font-medium">Memuat data laporan bug...</p>
        </div>
      {:else if items.length === 0}
        <div class="py-16 px-8 flex flex-col items-center text-center">
          <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
            {#if statusFilter === 'unresolved'}
              <AlertCircle size={24} />
            {:else if statusFilter === 'in_progress'}
              <Clock size={24} />
            {:else if statusFilter === 'resolved'}
              <CheckCircle2 size={24} />
            {:else}
              <Bug size={24} />
            {/if}
          </div>
          <h4 class="font-bold text-main text-base font-heading mb-1">
            Tidak Ada Laporan {statusFilter === 'unresolved' ? 'yang Belum Ditangani' : statusFilter === 'in_progress' ? 'yang Sedang Diproses' : statusFilter === 'resolved' ? 'yang Selesai' : ''}
          </h4>
          <p class="text-xs text-secondary max-w-sm mx-auto font-sans leading-relaxed">
            {searchQuery.trim() || sourceFilter !== 'all'
              ? 'Tidak ada laporan bug yang cocok dengan kata kunci atau filter sumber saat ini.'
              : 'Seluruh antrean laporan bug pada kategori ini dalam keadaan bersih.'}
          </p>
        </div>
      {:else}
        <BugReportsTable
          {items}
          currentPage={page}
          pageSize={pagination.limit}
          onOpenDetail={openDetail}
        />

        <Pagination
          currentPage={page}
          totalItems={pagination.total}
          pageSize={pagination.limit}
          autoUpdateUrl={false}
          on:pageChange={handlePageChange}
        />
      {/if}
    </Card>
  </div>
</div>

<BugReportDetailModal
  bind:open={detailOpen}
  report={selectedReport}
  on:updated={handleReportUpdated}
/>
