<script lang="ts">
  import { Pagination, Badge, Select, Table, Modal, Button } from '@/components/ui';
  import { History, Filter, User, Monitor, Info } from 'lucide-svelte';
  import { formatDate } from '@/lib/utils/format';

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

  const actionOptions = [
    { value: 'all', label: 'Semua Aksi' },
    { value: 'USER_ACTIVATED', label: 'USER ACTIVATED' },
    { value: 'USER_SUSPENDED', label: 'USER SUSPENDED' },
    { value: 'Register Admin', label: 'REGISTER ADMIN' },
    { value: 'Register Merchant', label: 'REGISTER MERCHANT' },
    { value: 'Delete User', label: 'DELETE USER' }
  ];

  const roleOptions = [
    { value: 'all', label: 'Semua Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'tenant', label: 'Tenant (Merchant)' },
    { value: 'designer', label: 'Designer' },
    { value: 'superadmin', label: 'Super Admin' }
  ];

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create') || act.includes('add') || act.includes('activated')) return 'success';
    if (act.includes('delete') || act.includes('remove') || act.includes('fail') || act.includes('suspended')) return 'error';
    if (act.includes('update') || act.includes('edit')) return 'warning';
    if (act.includes('register')) return 'primary';
    return 'secondary';
  };
</script>

<div class="space-y-4">
  <!-- Filters Section -->
  <div class="bg-card rounded-2xl border border-light p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-end sm:items-center">
    <div class="flex items-center gap-2 text-main font-bold text-sm mr-2 shrink-0">
      <Filter size={16} />
      <span>Filter:</span>
    </div>
    
    <div class="w-full sm:w-48">
      <Select 
        options={actionOptions} 
        bind:value={actionFilter} 
        on:change={handleFilterChange} 
      />
    </div>
    
    <div class="w-full sm:w-48">
      <Select 
        options={roleOptions} 
        bind:value={roleFilter} 
        on:change={handleFilterChange} 
      />
    </div>
  </div>

  <div class="bg-card rounded-2xl border border-light shadow-sm overflow-hidden mt-6">
    <div class="px-6 py-5 border-b border-light flex justify-between items-center bg-nested/20">
      <h3 class="font-bold text-main text-sm leading-none pt-2.5">Daftar Log Aktivitas</h3>
      <span class="badge badge-sm badge-outline text-xs font-semibold">{total} Aktivitas</span>
    </div>

    {#if logs.length === 0}
      <div class="py-16 flex flex-col items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-nested/50 text-muted flex items-center justify-center mb-4 ring-8 ring-nested/30">
          <History size={32} strokeWidth={1.5} />
        </div>
        <h3 class="font-bold text-main mb-1">Tidak Ada Aktivitas</h3>
        <p class="text-xs text-secondary max-w-sm text-center leading-relaxed">
          Belum ada aktivitas sistem yang sesuai dengan filter.
        </p>
      </div>
    {:else}
      <Table
        headers={[
          { label: 'Pengguna & Toko' },
          { label: 'Aksi' },
          { label: 'Tanggal' },
          { label: 'Detail Payload', align: 'center' }
        ]}
        minWidth="min-w-[900px]"
      >
      {#each logs as log (log.id)}
        <tr>
          <!-- Column: Pengguna -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-2xs border border-light/50 {log.user ? 'bg-primary/10 text-primary' : 'bg-nested/60 text-muted'}">
                {#if log.user}
                  <User size={18} strokeWidth={2.5} />
                {:else}
                  <Monitor size={18} strokeWidth={2.5} />
                {/if}
              </div>
              <div class="flex flex-col">
                <div class="font-bold text-main font-heading text-sm">
                  {log.user ? log.user.name : 'Sistem'}
                </div>
                {#if log.user}
                  <div class="text-xs text-secondary mt-0.5">
                    {log.user.email} {log.store ? `• Toko: ${log.store.name}` : ''}
                  </div>
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
          <td class="px-6 py-4 text-secondary text-sm">
            {formatDate(log.createdAt)}
          </td>

          <!-- Column: Detail Payload -->
          <td class="px-6 py-4 text-center">
            {#if log.details && Object.keys(log.details).length > 0}
              <Button
                variant="secondary"
                size="xs"
                on:click={() => openDetailModal(log)}
                title="Lihat Detail Payload"
              >
                <Info size={14} class="mr-1" />
                Detail
              </Button>
            {:else}
              <span class="text-xs text-muted font-medium">-</span>
            {/if}
          </td>
        </tr>
      {/each}
      </Table>
    {/if}
  </div>

    <div class="pt-4 flex justify-center">
      <Pagination 
        {currentPage} 
        totalItems={total}
        pageSize={10}
        on:pageChange={(e) => {
          const params = new URLSearchParams(window.location.search);
          params.set('page', e.detail.toString());
          window.location.href = `?${params.toString()}`;
        }} 
      />
    </div>
</div>

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
