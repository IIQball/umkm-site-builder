<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import { Card, Badge, Table, Modal, Button, Pagination } from '@/components/ui';
  import DesignerTemplateCard from './DesignerTemplateCard.svelte';
  import { addToast } from '@/lib/toast';

  export let templates: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnailUrl: string | null;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | string;
    rejectionReason: string | null;
    createdAt: Date | string;
    totalSold: number;
  }> = [];

  let searchQuery = '';
  let activeFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' = 'all';
  let viewMode: 'table' | 'grid' = 'table';
  let selectedRejection: { name: string; reason: string } | null = null;
  let copiedId: string | null = null;
  let currentPage = 1;
  const pageSize = 10;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
      addToast({
        type: 'success',
        message: `ID Template #${text.slice(0, 8)} disalin!`,
      });
      setTimeout(() => { copiedId = null; }, 1800);
    } catch {
      // clipboard unavailable
    }
  };

  const formatDate = (d: Date | string): string =>
    new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  $: counts = {
    all: templates.length,
    draft: templates.filter(t => t.status === 'draft').length,
    pending: templates.filter(t => t.status === 'pending').length,
    approved: templates.filter(t => t.status === 'approved').length,
    rejected: templates.filter(t => t.status === 'rejected').length,
  };

  $: filteredTemplates = templates.filter(t => {
    const matchesFilter = activeFilter === 'all' || t.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  $: {
    searchQuery;
    activeFilter;
    currentPage = 1;
  }

  $: paginatedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Disetujui', variant: 'emerald' as const, dot: true, pulse: false };
      case 'pending':
        return { label: 'Menunggu Review', variant: 'orange' as const, dot: true, pulse: true };
      case 'rejected':
        return { label: 'Perlu Revisi', variant: 'rose' as const, dot: true, pulse: false };
      default:
        return { label: 'Draft', variant: 'slate' as const, dot: true, pulse: false };
    }
  };

  const tableHeaders = [
    { label: 'Template Desain', align: 'left' as const },
    { label: 'Harga Jual', align: 'left' as const, width: 'w-32' },
    { label: 'Penjualan', align: 'left' as const, width: 'w-28' },
    { label: 'Status Kurasi', align: 'left' as const, width: 'w-36' },
    { label: 'Tanggal Dibuat', align: 'left' as const, width: 'w-36' },
    { label: 'Aksi', align: 'right' as const, width: 'w-44' },
  ];
</script>

<Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
  <!-- Table Header & Controls -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">dashboard_customize</span>
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Katalog Desain Saya
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Daftar seluruh draft, pengajuan review, dan template aktif yang Anda rancang
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
          placeholder="Cari nama template..."
          class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-blue-500 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
        <button
          type="button"
          on:click={() => activeFilter = 'all'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {activeFilter === 'all' ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          Semua ({counts.all})
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'approved'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'approved' ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Disetujui
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'pending'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'pending' ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-orange"></span>
          Review
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'draft'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'draft' ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Draft
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'rejected'}
          class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {activeFilter === 'rejected' ? 'bg-slate-900 text-white dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          Ditolak
        </button>
      </div>

      <!-- View Switcher (Table / Grid) -->
      <div class="hidden sm:flex items-center gap-0.5 bg-nested/80 border border-light rounded-full p-1">
        <button
          type="button"
          on:click={() => viewMode = 'table'}
          class="p-1.5 rounded-full text-xs transition-all cursor-pointer {viewMode === 'table' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Tabel"
        >
          <span class="material-symbols-outlined text-base">table_rows</span>
        </button>
        <button
          type="button"
          on:click={() => viewMode = 'grid'}
          class="p-1.5 rounded-full text-xs transition-all cursor-pointer {viewMode === 'grid' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Kartu"
        >
          <span class="material-symbols-outlined text-base">grid_view</span>
        </button>
      </div>
    </div>
  </div>

  {#if filteredTemplates.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4 text-muted shadow-2xs">
        <span class="material-symbols-outlined text-3xl">dashboard_customize</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5 font-heading">Tidak Ada Template Ditemukan</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4 font-sans">
        {searchQuery ? 'Tidak ada template yang cocok dengan kata kunci pencarian Anda.' : 'Mulai buat tema toko online UMKM pertama Anda dengan visual builder.'}
      </p>
      {#if !searchQuery}
        <a
          href="/builder/new"
          class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-2xl px-5 py-2.5 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Buat Template Sekarang
        </a>
      {/if}
    </div>
  {:else if viewMode === 'table'}
    <Table headers={tableHeaders} minWidth="min-w-[820px]">
      {#each paginatedTemplates as tpl}
        {@const badge = getStatusBadge(tpl.status)}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Template Info + Thumbnail -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3.5">
              <div class="w-14 h-9 rounded-xl bg-nested border border-light overflow-hidden flex-shrink-0 relative shadow-2xs">
                {#if tpl.thumbnailUrl}
                  <img src={tpl.thumbnailUrl} alt={tpl.name} class="w-full h-full object-cover" />
                {:else}
                  <div class="w-full h-full bg-nested flex items-center justify-center text-muted">
                    <span class="material-symbols-outlined text-base">palette</span>
                  </div>
                {/if}
              </div>

              <!-- Title & Desc -->
              <div class="min-w-0 max-w-[240px]">
                <div class="flex items-center gap-2">
                  <a
                    href={`/builder/${tpl.id}`}
                    class="font-bold text-xs text-main hover:text-primary transition-colors truncate block leading-tight font-sans"
                    title="Buka di Editor"
                  >
                    {tpl.name}
                  </a>
                  <button
                    type="button"
                    on:click={() => copyToClipboard(tpl.id)}
                    class="text-3xs text-muted hover:text-primary transition-colors inline-flex items-center gap-0.5 cursor-pointer font-mono bg-nested/80 px-1.5 py-0.5 rounded-md border border-light active:scale-95"
                    title="Salin ID Template"
                  >
                    <span>#{tpl.id.slice(0, 6)}</span>
                    <span class="material-symbols-outlined text-[10px]">
                      {copiedId === tpl.id ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
                <span class="text-2xs text-muted truncate block mt-0.5 font-sans">
                  {tpl.description || 'Tanpa deskripsi template'}
                </span>
              </div>
            </div>
          </td>

          <!-- Price -->
          <td class="px-4 py-4 whitespace-nowrap">
            <span class="font-mono text-xs font-bold text-main bg-nested/80 px-2.5 py-1 rounded-xl border border-light">
              {tpl.price === 0 ? 'Gratis' : formatCurrency(tpl.price)}
            </span>
          </td>

          <!-- Sales -->
          <td class="px-4 py-4 whitespace-nowrap">
            <span class="font-mono text-xs font-bold text-secondary">
              {tpl.totalSold}× Terjual
            </span>
          </td>

          <!-- Status Badge -->
          <td class="px-4 py-4 whitespace-nowrap">
            <Badge variant={badge.variant} dot={badge.dot} pulse={badge.pulse} size="sm">
              {badge.label}
            </Badge>
          </td>

          <!-- Date -->
          <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
            {formatDate(tpl.createdAt)}
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-2">
              {#if tpl.status === 'draft'}
                <Button
                  href={`/builder/${tpl.id}`}
                  variant="dark"
                  size="sm"
                  className="rounded-xl font-bold"
                >
                  <span class="material-symbols-outlined text-xs">edit</span>
                  <span>Edit</span>
                </Button>
              {/if}

              {#if tpl.status === 'rejected'}
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl font-bold"
                  on:click={() => selectedRejection = { name: tpl.name, reason: tpl.rejectionReason || 'Tidak ada alasan terperinci.' }}
                >
                  <span class="material-symbols-outlined text-xs text-rose-500">info</span>
                  <span>Alasan</span>
                </Button>
                <Button
                  href={`/builder/${tpl.id}`}
                  variant="primary"
                  size="sm"
                  className="rounded-xl font-bold"
                >
                  Edit Ulang
                </Button>
              {/if}

              {#if tpl.status === 'approved' || tpl.status === 'pending'}
                <Button
                  href={`/builder/preview/${tpl.id}`}
                  variant="secondary"
                  size="sm"
                  className="rounded-xl font-bold"
                >
                  <span class="material-symbols-outlined text-xs">visibility</span>
                  <span>Pratinjau</span>
                </Button>
              {/if}
            </div>
          </td>
        </tr>
      {/each}
    </Table>
  {:else}
    <!-- Grid Mode -->
    <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each paginatedTemplates as tpl (tpl.id)}
        <DesignerTemplateCard template={tpl} />
      {/each}
    </div>
  {/if}

  {#if filteredTemplates.length > 0}
    <Pagination
      bind:currentPage
      totalItems={filteredTemplates.length}
      {pageSize}
    />
  {/if}
</Card>

<!-- Rejection Reason Modal -->
<Modal
  open={!!selectedRejection}
  size="sm"
  on:close={() => selectedRejection = null}
>
  <svelte:fragment slot="header">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">feedback</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Catatan Kurasi Admin
        </h3>
        <p class="text-2xs text-muted mt-0.5 truncate max-w-[200px]">
          {selectedRejection?.name}
        </p>
      </div>
    </div>
  </svelte:fragment>

  <div class="space-y-4 pt-1">
    <div class="p-4 rounded-2xl bg-nested border border-light text-xs text-main leading-relaxed font-sans whitespace-pre-wrap">
      {selectedRejection?.reason}
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button
        variant="secondary"
        size="sm"
        className="rounded-xl font-bold"
        on:click={() => selectedRejection = null}
      >
        Tutup
      </Button>
    </div>
  </div>
</Modal>
