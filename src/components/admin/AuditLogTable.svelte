<script lang="ts">
  import { Pagination, Badge, Select, Table, Modal, Button, Card, SearchableSelect } from '@/components/ui';
  import { User, Monitor, Info } from 'lucide-svelte';
  import { formatDate } from '@/lib/utils/format';
  import { DEFAULT_AUDIT_ACTIONS } from '@/services/audit.constants';

  export let initialLogs: Array<{
    id: string;
    action: string;
    details: any;
    createdAt: string;
    user?: {
      id: string;
      name: string;
      email: string;
    } | null;
    store?: {
      id: string;
      name: string;
    } | null;
  }> = [];

  export let total: number = 0;
  export let currentPage: number = 1;
  export let initialActionFilter: string = 'all';
  export let initialRoleFilter: string = 'all';
  export let availableActions: string[] = [];

  let logs = initialLogs;
  let actionFilter = initialActionFilter;
  let roleFilter = initialRoleFilter;

  let selectedLog: any = null;
  const openDetailModal = (log: any) => { selectedLog = log; };
  const closeDetailModal = () => { selectedLog = null; };

  const handleFilterChange = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('action', actionFilter);
    params.set('role', roleFilter);
    params.set('page', '1'); // Reset to page 1 on filter change
    window.location.href = `?${params.toString()}`;
  };

  const handleActionChange = (e: CustomEvent<{ value: string | number }>) => {
    actionFilter = String(e.detail.value || 'all');
    handleFilterChange();
  };

  $: actions = availableActions && availableActions.length > 0 ? availableActions : DEFAULT_AUDIT_ACTIONS;

  $: actionOptions = [
    { value: 'all', label: 'Semua Aksi' },
    ...actions.map((action) => ({
      value: action,
      label: action.replace(/_/g, ' ').toUpperCase(),
    })),
  ];

  const roleOptions = [
    { value: 'all', label: 'Semua Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'tenant', label: 'Merchant' },
    { value: 'designer', label: 'Designer' },
    { value: 'superadmin', label: 'Super Admin' }
  ];

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create') || act.includes('add') || act.includes('activated') || act.includes('approve') || act.includes('apply')) return 'success';
    if (act.includes('delete') || act.includes('remove') || act.includes('fail') || act.includes('suspended') || act.includes('reject')) return 'error';
    if (act.includes('update') || act.includes('edit') || act.includes('save') || act.includes('stock') || act.includes('quota')) return 'warning';
    if (act.includes('purchase') || act.includes('download') || act.includes('order') || act.includes('payout')) return 'primary';
    if (act.includes('register') || act.includes('submit')) return 'primary';
    return 'secondary';
  };
</script>

<Card variant="bordered" padding="none" radius="2xl" class="shadow-xs overflow-hidden">
  <!-- Card Header with integrated filters -->
  <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested dark:text-main flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">history</span>
      </div>
      <div>
        <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
          Daftar Log Aktivitas
        </h3>
        <p class="text-body-sm text-secondary mt-0.5 font-sans">
          Jejak aktivitas pengguna dan sistem secara kronologis
        </p>
      </div>
    </div>

    <!-- Filters & Badge on the right -->
    <div class="flex flex-wrap items-center gap-2.5">
      <div class="w-52 sm:w-60">
        <SearchableSelect 
          options={actionOptions} 
          bind:value={actionFilter} 
          placeholder="Semua Aksi"
          searchPlaceholder="Cari aksi..."
          clearable={false}
          on:change={handleActionChange} 
        />
      </div>
      
      <div class="w-36 sm:w-40">
        <Select 
          options={roleOptions} 
          bind:value={roleFilter} 
          on:change={handleFilterChange} 
        />
      </div>

    </div>
  </div>

  {#if logs.length === 0}
    <div class="py-16 px-8 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-3 shadow-2xs">
        <span class="material-symbols-outlined text-2xl">history</span>
      </div>
      <h4 class="font-bold text-main text-base font-heading mb-1">Tidak Ada Aktivitas</h4>
      <p class="text-xs text-secondary max-w-sm mx-auto font-sans leading-relaxed">
        Belum ada aktivitas sistem yang sesuai dengan filter.
      </p>
    </div>
  {:else}
    <Table
      headers={[
        { label: '#', align: 'center' as const, width: 'w-12' },
        { label: 'Pengguna & Toko' },
        { label: 'Aksi' },
        { label: 'Tanggal', width: 'w-48' },
        { label: 'Detail Payload', align: 'center' as const, width: 'w-36' }
      ]}
      minWidth="min-w-[900px]"
    >
      {#each logs as log, i (log.id)}
        <tr class="hover:bg-nested/40 transition-colors group">
          <!-- Sequence Number (#) -->
          <td class="px-4 py-4 text-center font-mono text-2xs text-secondary font-bold">
            {(currentPage - 1) * 10 + i + 1}
          </td>

          <!-- Column: Pengguna -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs {log.user ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-nested/60 border border-light/50 text-muted'}">
                {#if log.user}
                  <User size={16} />
                {:else}
                  <Monitor size={16} />
                {/if}
              </div>
              <div class="min-w-0">
                <span class="font-bold text-xs text-main block font-sans truncate">
                  {log.user ? log.user.name : 'Sistem'}
                </span>
                {#if log.user}
                  <span class="text-3xs text-secondary block truncate font-sans max-w-xs mt-0.5">
                    {log.user.email} {log.store ? `• Toko: ${log.store.name}` : ''}
                  </span>
                {/if}
              </div>
            </div>
          </td>

          <!-- Column: Aksi -->
          <td class="px-6 py-4">
            <Badge variant={getActionColor(log.action)} class="font-bold tracking-wide uppercase px-2 py-0.5 text-[10px] shadow-xs">
              {log.action.replace(/_/g, ' ')}
            </Badge>
          </td>

          <!-- Column: Tanggal -->
          <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
            {formatDate(log.createdAt)}
          </td>

          <!-- Column: Detail Payload -->
          <td class="px-4 py-4 text-center">
            {#if log.details && Object.keys(log.details).length > 0}
              <Button
                variant="secondary"
                size="icon"
                on:click={() => openDetailModal(log)}
                title="Lihat Detail Payload"
              >
                <Info size={13} />
              </Button>
            {:else}
              <span class="text-xs text-muted font-medium">-</span>
            {/if}
          </td>
        </tr>
      {/each}
    </Table>

    <Pagination 
      bind:currentPage 
      totalItems={total}
      pageSize={10}
    />
  {/if}
</Card>

<Modal
  open={!!selectedLog}
  title="Detail Payload Aktivitas"
  description="Data teknis lengkap dari aktivitas yang direkam oleh sistem."
  size="md"
  on:close={closeDetailModal}
>
  {#if selectedLog}
    <div class="mt-4 rounded-xl bg-nested border border-light shadow-inner p-4 overflow-x-auto custom-scrollbar max-h-[400px]">
      <pre class="text-xs text-main font-mono leading-relaxed"><code>{JSON.stringify(selectedLog.details, null, 2)}</code></pre>
    </div>
  {/if}
  
  <svelte:fragment slot="footer">
    <div class="flex justify-end w-full">
      <Button variant="secondary" size="md" class="font-bold px-6" on:click={closeDetailModal}>
        Tutup
      </Button>
    </div>
  </svelte:fragment>
</Modal>
