<script lang="ts">
  import { formatCurrency } from '@/lib/utils/format';
  import { Card, Badge, Table, Modal, Button } from '@/components/ui';

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedId = text;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Disetujui', variant: 'emerald' as const, dot: true, pulse: false };
      case 'pending':
        return { label: 'Menunggu Review', variant: 'amber' as const, dot: true, pulse: true };
      case 'rejected':
        return { label: 'Perlu Revisi', variant: 'rose' as const, dot: true, pulse: false };
      default:
        return { label: 'Draft', variant: 'slate' as const, dot: true, pulse: false };
    }
  };

  const tableHeaders = [
    { label: 'Template Desain', align: 'left' as const },
    { label: 'Harga', align: 'left' as const },
    { label: 'Penjualan', align: 'left' as const },
    { label: 'Status Kurasi', align: 'left' as const },
    { label: 'Tanggal Dibuat', align: 'left' as const },
    { label: 'Aksi', align: 'right' as const },
  ];
</script>

<Card variant="bordered" padding="none" radius="xl" topBeam="indigo-500">
  <!-- Table Header & Controls -->
  <div class="px-6 md:px-7 py-5 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base">dashboard_customize</span>
        </div>
        <h3 class="text-heading-md text-main font-bold">Katalog Desain Saya</h3>
      </div>
      <p class="text-body-sm text-secondary mt-0.5 ml-10.5">Daftar seluruh draft, pengajuan review, dan template aktif yang Anda rancang</p>
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
          class="bg-nested/80 border border-light rounded-xl pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all w-48 sm:w-56"
        />
      </div>

      <!-- Segmented Status Filter -->
      <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-xl p-1 overflow-x-auto">
        <button
          type="button"
          on:click={() => activeFilter = 'all'}
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 {activeFilter === 'all' ? 'bg-card text-main shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span>Semua</span>
          <span class="text-3xs px-1.5 py-0.5 rounded-md font-extrabold {activeFilter === 'all' ? 'bg-primary/10 text-primary' : 'bg-nested text-muted'}">{counts.all}</span>
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'approved'}
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 {activeFilter === 'approved' ? 'bg-emerald-500 text-white shadow-2xs' : 'text-muted hover:text-success'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>Disetujui</span>
          <span class="text-3xs px-1.5 py-0.5 rounded-md font-extrabold {activeFilter === 'approved' ? 'bg-white/20 text-white' : 'bg-nested text-muted'}">{counts.approved}</span>
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'pending'}
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 {activeFilter === 'pending' ? 'bg-amber-500 text-white shadow-2xs' : 'text-muted hover:text-warning'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>Review</span>
          <span class="text-3xs px-1.5 py-0.5 rounded-md font-extrabold {activeFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-nested text-muted'}">{counts.pending}</span>
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'draft'}
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 {activeFilter === 'draft' ? 'bg-slate-700 text-white shadow-2xs' : 'text-muted hover:text-main'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>Draft</span>
          <span class="text-3xs px-1.5 py-0.5 rounded-md font-extrabold {activeFilter === 'draft' ? 'bg-white/20 text-white' : 'bg-nested text-muted'}">{counts.draft}</span>
        </button>

        <button
          type="button"
          on:click={() => activeFilter = 'rejected'}
          class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 {activeFilter === 'rejected' ? 'bg-rose-500 text-white shadow-2xs' : 'text-muted hover:text-error'}"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>Ditolak</span>
          <span class="text-3xs px-1.5 py-0.5 rounded-md font-extrabold {activeFilter === 'rejected' ? 'bg-white/20 text-white' : 'bg-nested text-muted'}">{counts.rejected}</span>
        </button>
      </div>

      <!-- View Switcher (Table / Grid) -->
      <div class="hidden sm:flex items-center gap-0.5 bg-nested/80 border border-light rounded-xl p-1">
        <button
          type="button"
          on:click={() => viewMode = 'table'}
          class="p-1.5 rounded-lg text-xs transition-all cursor-pointer {viewMode === 'table' ? 'bg-card text-primary shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Tabel"
        >
          <span class="material-symbols-outlined text-base">table_rows</span>
        </button>
        <button
          type="button"
          on:click={() => viewMode = 'grid'}
          class="p-1.5 rounded-lg text-xs transition-all cursor-pointer {viewMode === 'grid' ? 'bg-card text-primary shadow-2xs' : 'text-muted hover:text-main'}"
          title="Tampilan Kartu"
        >
          <span class="material-symbols-outlined text-base">grid_view</span>
        </button>
      </div>
    </div>
  </div>

  {#if filteredTemplates.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4 text-muted">
        <span class="material-symbols-outlined text-3xl">dashboard_customize</span>
      </div>
      <h4 class="text-heading-md font-bold text-main mb-1.5">Tidak Ada Template Ditemukan</h4>
      <p class="text-body-sm text-secondary max-w-xs leading-relaxed mb-4">
        {searchQuery ? 'Tidak ada template yang cocok dengan kata kunci pencarian Anda.' : 'Mulai buat tema toko online UMKM pertama Anda dengan visual builder.'}
      </p>
      {#if !searchQuery}
        <a
          href="/builder/new"
          class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-2xl px-5 py-2.5 shadow-sm transition-all"
        >
          <span class="material-symbols-outlined text-sm">add</span>
          Buat Template Sekarang
        </a>
      {/if}
    </div>
  {:else if viewMode === 'table'}
    <Table headers={tableHeaders} minWidth="min-w-[820px]">
      {#each filteredTemplates as tpl}
        {@const badge = getStatusBadge(tpl.status)}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Template Info + Thumbnail -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3.5">
              <!-- Thumbnail container with fallback -->
              <div class="w-14 h-11 rounded-xl bg-nested border border-light overflow-hidden flex-shrink-0 relative group-hover:border-primary/40 transition-colors shadow-2xs">
                {#if tpl.thumbnailUrl}
                  <img src={tpl.thumbnailUrl} alt={tpl.name} class="w-full h-full object-cover" />
                {:else}
                  <div class="w-full h-full bg-gradient-to-br from-primary/10 via-nested to-nested flex items-center justify-center text-primary/60">
                    <span class="material-symbols-outlined text-lg">storefront</span>
                  </div>
                {/if}
              </div>

              <!-- Title & Desc -->
              <div class="min-w-0 max-w-[240px]">
                <div class="flex items-center gap-2">
                  <a
                    href={`/builder/${tpl.id}`}
                    class="font-bold text-xs text-main hover:text-primary transition-colors truncate block leading-tight"
                    title="Buka di Editor"
                  >
                    {tpl.name}
                  </a>
                  <button
                    type="button"
                    on:click={() => copyToClipboard(tpl.id)}
                    class="text-3xs text-muted hover:text-primary transition-colors inline-flex items-center gap-0.5 cursor-pointer font-mono bg-nested/80 px-1.5 py-0.5 rounded border border-light"
                    title="Salin ID Template"
                  >
                    <span>#{tpl.id.slice(0, 6)}</span>
                    <span class="material-symbols-outlined text-[10px]">
                      {copiedId === tpl.id ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
                <span class="text-2xs text-muted truncate block mt-0.5 font-sans">
                  {tpl.description || 'Tema website toko online modular UMKM'}
                </span>
              </div>
            </div>
          </td>

          <!-- Price -->
          <td class="px-4 py-4 whitespace-nowrap">
            {#if tpl.price === 0}
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-2xs font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Gratis
              </span>
            {:else}
              <span class="font-mono text-xs font-extrabold text-main">
                {formatCurrency(tpl.price)}
              </span>
            {/if}
          </td>

          <!-- Total Sold -->
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 font-mono text-2xs font-semibold text-secondary bg-nested/80 border border-light px-2.5 py-1 rounded-lg">
              <span class="material-symbols-outlined text-xs text-primary">shopping_bag</span>
              <span>{tpl.totalSold} Terjual</span>
            </div>
          </td>

          <!-- Status Badge -->
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <Badge variant={badge.variant} dot={badge.dot} pulse={badge.pulse} size="sm">
                {badge.label}
              </Badge>
              {#if tpl.status === 'rejected' && tpl.rejectionReason}
                <button
                  type="button"
                  on:click={() => selectedRejection = { name: tpl.name, reason: tpl.rejectionReason || '' }}
                  class="w-6 h-6 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                  title="Lihat Alasan Penolakan"
                >
                  <span class="material-symbols-outlined text-xs">info</span>
                </button>
              {/if}
            </div>
          </td>

          <!-- Created Date -->
          <td class="px-4 py-4 text-2xs text-secondary font-medium whitespace-nowrap font-mono">
            {formatDate(tpl.createdAt)}
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-1.5">
              <a
                href={`/builder/${tpl.id}`}
                class="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                title="Buka Visual Editor"
              >
                <span class="material-symbols-outlined text-sm">edit</span>
                <span>Edit</span>
              </a>

              <a
                href={`/builder/preview/${tpl.id}`}
                target="_blank"
                rel="noreferrer"
                class="w-8 h-8 rounded-xl bg-nested hover:bg-nested/80 border border-light text-secondary hover:text-main flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="Pratinjau Live"
              >
                <span class="material-symbols-outlined text-sm">visibility</span>
              </a>
            </div>
          </td>
        </tr>
      {/each}
    </Table>
  {:else}
    <!-- Grid View Mode -->
    <div class="p-6 md:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredTemplates as tpl}
        {@const badge = getStatusBadge(tpl.status)}
        <div class="bg-card border border-light rounded-3xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all group flex flex-col justify-between">
          <!-- Thumbnail header -->
          <div class="aspect-[16/10] bg-nested relative overflow-hidden">
            {#if tpl.thumbnailUrl}
              <img src={tpl.thumbnailUrl} alt={tpl.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            {:else}
              <div class="w-full h-full bg-gradient-to-br from-primary/15 via-nested to-nested flex items-center justify-center text-primary/60">
                <span class="material-symbols-outlined text-3xl">storefront</span>
              </div>
            {/if}
            <!-- Status Badge overlay -->
            <div class="absolute top-3 right-3">
              <Badge variant={badge.variant} dot={badge.dot} pulse={badge.pulse} size="sm">
                {badge.label}
              </Badge>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="font-bold text-sm text-main group-hover:text-primary transition-colors truncate mb-1">
                {tpl.name}
              </h4>
              <p class="text-2xs text-secondary line-clamp-2 leading-relaxed mb-4">
                {tpl.description || 'Tema website toko online UMKM modular dan responsif.'}
              </p>
            </div>

            <!-- Footer info + Action buttons -->
            <div class="pt-3 border-t border-light flex items-center justify-between gap-2">
              <div>
                <span class="text-4xs text-muted uppercase tracking-wider font-bold block font-heading">Harga</span>
                <span class="font-mono text-xs font-extrabold text-main">
                  {tpl.price === 0 ? 'Gratis' : formatCurrency(tpl.price)}
                </span>
              </div>

              <div class="flex items-center gap-1.5">
                <a
                  href={`/builder/preview/${tpl.id}`}
                  target="_blank"
                  rel="noreferrer"
                  class="w-8 h-8 rounded-xl bg-nested hover:bg-nested/80 border border-light text-secondary hover:text-main flex items-center justify-center transition-colors"
                  title="Preview"
                >
                  <span class="material-symbols-outlined text-sm">visibility</span>
                </a>
                <a
                  href={`/builder/${tpl.id}`}
                  class="inline-flex items-center gap-1 text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                  <span>Edit</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</Card>

<!-- Rejection Reason Modal -->
{#if selectedRejection}
  <Modal
    open={true}
    title="Catatan Kurasi Admin"
    description={`Template: ${selectedRejection.name}`}
    on:close={() => selectedRejection = null}
  >
    <div class="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl p-5 text-xs font-medium leading-relaxed font-mono">
      <div class="flex items-start gap-2.5 mb-2">
        <span class="material-symbols-outlined text-base flex-shrink-0 text-rose-500">error</span>
        <strong class="text-rose-700 dark:text-rose-300">Alasan Penolakan / Catatan Perbaikan:</strong>
      </div>
      <p class="mt-1 whitespace-pre-wrap">{selectedRejection.reason}</p>
    </div>

    <svelte:fragment slot="footer">
      <Button variant="secondary" on:click={() => selectedRejection = null}>
        Tutup
      </Button>
    </svelte:fragment>
  </Modal>
{/if}
