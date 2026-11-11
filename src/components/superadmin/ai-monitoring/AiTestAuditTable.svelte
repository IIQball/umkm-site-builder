<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Table, Pagination, Button, Input, Select } from '@/components/ui';
  import { apiFetch } from '@/lib/api/parse-response';
  import { toast } from '@/lib/toast';
  import type {
    AiAuditLogItem,
    AiLogsPaginationMeta,
  } from '@/types/admin/ai-monitoring.types';
  import {
    formatAuditCost,
    formatAuditDate,
    formatAuditTokens,
    formatResolution,
    getFeatureLabel,
    getQualityBadge,
  } from './aiAudit.helpers';
  import AiTestAuditDetailModal from './AiTestAuditDetailModal.svelte';
  import { Search, RotateCw, Eye, Sparkles, Layers, Cpu } from 'lucide-svelte';

  export let initialLogs: AiAuditLogItem[] = [];
  export let initialPagination: AiLogsPaginationMeta | undefined = undefined;
  export let defaultIsTesting: 'true' | 'false' | 'all' = 'true';

  let logs: AiAuditLogItem[] = initialLogs;
  let pagination: AiLogsPaginationMeta = initialPagination || {
    total: initialLogs.length,
    page: 1,
    limit: 10,
    totalPages: Math.max(1, Math.ceil(initialLogs.length / 10)),
  };

  let isTestingFilter: 'true' | 'false' | 'all' = defaultIsTesting;
  let statusFilter: 'all' | 'success' | 'pending' | 'failed' = 'all';
  let searchQuery = '';
  let isLoading = false;

  let selectedLog: AiAuditLogItem | null = null;
  let isDetailModalOpen = false;

  const tableHeaders = [
    { label: 'Waktu Pengujian', width: '16%' },
    { label: 'Fitur & Model', width: '20%' },
    { label: 'Resolusi', width: '12%' },
    { label: 'Kualitas', width: '10%' },
    { label: 'Input Tokens', align: 'right' as const, width: '11%' },
    { label: 'Output Tokens', align: 'right' as const, width: '11%' },
    { label: 'Biaya Riil', align: 'right' as const, width: '12%' },
    { label: 'Aksi', align: 'center' as const, width: '8%' },
  ];

  async function fetchAuditLogs(page = 1) {
    isLoading = true;
    try {
      const params = new URLSearchParams();
      if (isTestingFilter !== 'all') params.set('isTesting', isTestingFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('page', String(page));
      params.set('limit', String(pagination.limit || 10));

      const res = await apiFetch<{ logs?: AiAuditLogItem[]; pagination?: AiLogsPaginationMeta }>(
        `/api/admin/ai/logs?${params.toString()}`,
        { fallbackError: 'Gagal memuat data log audit.' }
      );
      if (res.success && res.data) {
        logs = res.data.logs || [];
        pagination = res.data.pagination || { total: logs.length, page, limit: 10, totalPages: 1 };
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error('[AiTestAuditTable] Gagal memuat data log audit:', err);
      toast.error('Koneksi bermasalah saat memuat data log audit.');
    } finally {
      isLoading = false;
    }
  }

  function handleFilterChange() {
    fetchAuditLogs(1);
  }

  function handlePageChange(event: CustomEvent<number>) {
    fetchAuditLogs(event.detail);
  }

  function openDetailModal(log: AiAuditLogItem) {
    selectedLog = log;
    isDetailModalOpen = true;
  }

  const STATUS_FILTER_OPTIONS = [
    { value: 'all', label: 'Semua Status' },
    { value: 'success', label: 'Sukses' },
    { value: 'failed', label: 'Gagal' },
    { value: 'pending', label: 'Menunggu / Proses' },
  ];

  const handleStatusSelect = (event: CustomEvent<Event>) => {
    const el = (event.detail.currentTarget ?? event.detail.target) as HTMLSelectElement | null;
    if (!el) return;
    statusFilter = el.value as typeof statusFilter;
    handleFilterChange();
  };

  onMount(() => {
    if (initialLogs.length === 0) fetchAuditLogs(1);
  });
</script>

<Card class="space-y-6">
  <!-- Header: Title, Description, and Refresh -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-light pb-4">
    <div>
      <h2 class="text-heading-md font-bold text-main flex items-center gap-2">
        <Sparkles size={20} class="text-primary" />
        <span>Tabel Audit Pengujian AI</span>
      </h2>
      <p class="text-xs text-secondary mt-1">
        Audit transparan rincian pengujian model, pemakaian token, resolusi, dan biaya riil Rupiah.
      </p>
    </div>

    <Button
      variant="secondary"
      size="sm"
      loading={isLoading}
      on:click={() => fetchAuditLogs(pagination.page)}
      class="gap-1.5 self-start sm:self-auto"
    >
      <RotateCw size={14} class={isLoading ? 'animate-spin' : ''} />
      <span>Segarkan</span>
    </Button>
  </div>

  <!-- Filter Toolbar: isTesting segmented tabs, status select, and search -->
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-1 p-1 bg-nested/80 border border-light rounded-xl self-start">
      <Button
        type="button"
        size="xs"
        variant={isTestingFilter === 'true' ? 'dark' : 'ghost'}
        class="!rounded-lg font-semibold {isTestingFilter === 'true' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
        on:click={() => { isTestingFilter = 'true'; handleFilterChange(); }}
      >
        Hanya Pengujian (Test)
      </Button>
      <Button
        type="button"
        size="xs"
        variant={isTestingFilter === 'false' ? 'dark' : 'ghost'}
        class="!rounded-lg font-semibold {isTestingFilter === 'false' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
        on:click={() => { isTestingFilter = 'false'; handleFilterChange(); }}
      >
        Produksi Saja
      </Button>
      <Button
        type="button"
        size="xs"
        variant={isTestingFilter === 'all' ? 'dark' : 'ghost'}
        class="!rounded-lg font-semibold {isTestingFilter === 'all' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
        on:click={() => { isTestingFilter = 'all'; handleFilterChange(); }}
      >
        Semua Log
      </Button>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <Select
        aria-label="Filter status log AI"
        size="sm"
        fullWidth={false}
        options={STATUS_FILTER_OPTIONS}
        value={statusFilter}
        on:change={handleStatusSelect}
      />

      <div class="flex-1 sm:w-64">
        <Input
          type="search"
          size="sm"
          placeholder="Cari model, ID, prompt..."
          bind:value={searchQuery}
          on:keydown={(e) => e.detail.key === 'Enter' && handleFilterChange()}
        >
          <Search size={14} slot="prefix" />
        </Input>
      </div>
    </div>
  </div>

  <!-- Audit Table -->
  <Table headers={tableHeaders} responsive minWidth="min-w-[900px]">
    {#if logs.length > 0}
      {#each logs as log (log.id)}
        <tr class="transition-colors hover:bg-nested/40">
          <!-- Waktu Pengujian -->
          <td class="px-6 py-3.5 text-xs text-secondary whitespace-nowrap">
            <div class="font-medium text-main">{formatAuditDate(log.createdAt)}</div>
            <div class="text-2xs text-muted font-mono mt-0.5">#{log.id.slice(0, 10)}...</div>
          </td>

          <!-- Fitur & Model -->
          <td class="px-6 py-3.5 text-xs">
            <div class="font-semibold text-main flex items-center gap-1.5">
              <Cpu size={13} class="text-muted shrink-0" />
              <span class="truncate max-w-[140px] font-mono text-2xs" title={log.modelUsed}>
                {log.modelUsed}
              </span>
            </div>
            <div class="text-2xs text-muted mt-0.5 flex items-center gap-1">
              <span>{getFeatureLabel(log.featureType)}</span>
              {#if log.isTesting}
                <span class="px-1.5 py-0.2 text-3xs font-semibold rounded bg-warning/10 text-warning border border-warning/20">TEST</span>
              {/if}
            </div>
          </td>

          <!-- Resolusi -->
          <td class="px-6 py-3.5 text-xs whitespace-nowrap">
            <span class="font-mono text-2xs font-medium text-main bg-nested px-2 py-0.5 rounded border border-light">
              {formatResolution(log.sizeRatio)}
            </span>
          </td>

          <!-- Kualitas -->
          <td class="px-6 py-3.5 text-xs whitespace-nowrap">
            <span class="px-2 py-0.5 text-2xs font-semibold rounded-full border {getQualityBadge(log.qualityTier).cls}">
              {getQualityBadge(log.qualityTier).label}
            </span>
          </td>

          <!-- Input Tokens -->
          <td class="px-6 py-3.5 text-xs text-right whitespace-nowrap font-mono text-secondary">
            {formatAuditTokens(log.inputTokens)}
          </td>

          <!-- Output Tokens -->
          <td class="px-6 py-3.5 text-xs text-right whitespace-nowrap font-mono text-secondary">
            {formatAuditTokens(log.outputTokens)}
          </td>

          <!-- Biaya Riil Rupiah -->
          <td class="px-6 py-3.5 text-xs text-right whitespace-nowrap">
            <div class="font-bold text-main">{formatAuditCost(log.costIdr)}</div>
            <div class="text-3xs text-muted font-mono mt-0.5">${log.costUsd.toFixed(4)}</div>
          </td>

          <!-- Aksi (Detail Modal) -->
          <td class="px-6 py-3.5 text-center whitespace-nowrap">
            <button
              type="button"
              class="p-1.5 text-secondary hover:text-primary hover:bg-nested rounded-lg transition-colors"
              title="Lihat detail audit"
              on:click={() => openDetailModal(log)}
            >
              <Eye size={15} />
            </button>
          </td>
        </tr>
      {/each}
    {:else}
      <tr>
        <td colspan={tableHeaders.length} class="py-12 text-center">
          <div class="flex flex-col items-center justify-center space-y-2 text-muted">
            <Layers size={32} class="stroke-1 opacity-50" />
            <p class="text-sm font-medium text-secondary">Tidak ada data audit yang sesuai.</p>
            <p class="text-xs">Coba sesuaikan filter status, mode pengujian, atau kata kunci pencarian.</p>
          </div>
        </td>
      </tr>
    {/if}
  </Table>

  <!-- Pagination Controls -->
  {#if pagination.total > 0}
    <div class="pt-2 border-t border-light flex flex-col sm:flex-row items-center justify-between gap-3">
      <span class="text-xs text-muted">
        Total <strong>{pagination.total}</strong> log audit ({pagination.page} dari {pagination.totalPages} halaman)
      </span>
      <Pagination
        currentPage={pagination.page}
        totalItems={pagination.total}
        pageSize={pagination.limit}
        autoUpdateUrl={false}
        on:pageChange={handlePageChange}
      />
    </div>
  {/if}
</Card>

<!-- Detail Modal -->
<AiTestAuditDetailModal
  open={isDetailModalOpen}
  log={selectedLog}
  on:close={() => { isDetailModalOpen = false; }}
/>
