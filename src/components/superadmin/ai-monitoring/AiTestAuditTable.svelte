<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Table, Pagination, Button } from '@/components/ui';
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

      const res = await fetch(`/api/admin/ai/logs?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          logs = json.data.logs || [];
          pagination = json.data.pagination || { total: logs.length, page, limit: 10, totalPages: 1 };
        }
      }
    } catch (err) {
      console.error('[AiTestAuditTable] Gagal memuat data log audit:', err);
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
    <div class="flex items-center gap-1.5 p-1 bg-nested/80 border border-light rounded-xl self-start">
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all {isTestingFilter === 'true' ? 'bg-canvas text-main shadow-xs border border-light' : 'text-muted hover:text-main'}"
        on:click={() => { isTestingFilter = 'true'; handleFilterChange(); }}
      >
        Hanya Pengujian (Test)
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all {isTestingFilter === 'false' ? 'bg-canvas text-main shadow-xs border border-light' : 'text-muted hover:text-main'}"
        on:click={() => { isTestingFilter = 'false'; handleFilterChange(); }}
      >
        Produksi Saja
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all {isTestingFilter === 'all' ? 'bg-canvas text-main shadow-xs border border-light' : 'text-muted hover:text-main'}"
        on:click={() => { isTestingFilter = 'all'; handleFilterChange(); }}
      >
        Semua Log
      </button>
    </div>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <select
        bind:value={statusFilter}
        on:change={handleFilterChange}
        class="px-3 py-2 text-xs bg-canvas border border-light rounded-xl text-main focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="all">Semua Status</option>
        <option value="success">Sukses</option>
        <option value="failed">Gagal</option>
        <option value="pending">Menunggu / Proses</option>
      </select>

      <div class="relative flex-1 sm:w-64">
        <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Cari model, ID, prompt..."
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && handleFilterChange()}
          class="w-full pl-9 pr-3 py-2 text-xs bg-canvas border border-light rounded-xl text-main placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
        />
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
                <span class="px-1.5 py-0.2 text-3xs font-semibold rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">TEST</span>
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
