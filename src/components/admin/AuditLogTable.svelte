<script lang="ts">
  import Pagination from '@/components/ui/Pagination.svelte';
  import Badge from '@/components/ui/Badge.svelte';
  import Select from '@/components/ui/Select.svelte';
  import Table from '@/components/ui/Table.svelte';
  import { History, Filter, ChevronDown, User, Monitor } from 'lucide-svelte';

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
  export let totalPages: number = 1;
  export let initialActionFilter: string = 'all';
  export let initialRoleFilter: string = 'all';

  let logs = initialLogs;
  let actionFilter = initialActionFilter;
  let roleFilter = initialRoleFilter;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
  <div class="bg-card-base rounded-2xl border border-light p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-end sm:items-center">
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

  {#if logs.length === 0}
    <div class="py-24 flex flex-col items-center justify-center bg-card-base rounded-3xl border border-light/50 shadow-sm">
      <div class="w-20 h-20 rounded-full bg-nested/50 text-muted flex items-center justify-center mb-5 ring-[12px] ring-nested/30">
        <History size={40} strokeWidth={1.5} />
      </div>
      <h3 class="text-heading-sm font-bold text-main mb-2">Tidak Ada Aktivitas</h3>
      <p class="text-body-sm text-secondary max-w-sm text-center leading-relaxed">
        Belum ada aktivitas sistem yang tercatat untuk saat ini.
      </p>
    </div>
  {:else}
    <Table
      headers={[
        { label: 'PENGGUNA & TOKO' },
        { label: 'AKSI' },
        { label: 'TANGGAL' },
        { label: 'DETAIL PAYLOAD' }
      ]}
      minWidth="min-w-[900px]"
    >
      {#each logs as log (log.id)}
        <tr>
          <!-- Column: Pengguna -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs border border-light/50 {log.user ? 'bg-indigo-600 text-white' : 'bg-nested/60 text-muted'}">
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
          <td class="px-6 py-4">
            {#if log.details && Object.keys(log.details).length > 0}
              <details class="group/details w-full max-w-sm">
                <summary class="flex items-center gap-1.5 cursor-pointer list-none text-[11px] font-bold tracking-wider text-muted hover:text-primary uppercase py-1 select-none">
                  <span>Lihat Payload</span>
                  <ChevronDown size={14} class="transition-transform duration-200 group-open/details:rotate-180" />
                </summary>
                <div class="mt-2 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-inner p-3 overflow-x-auto custom-scrollbar">
                  <pre class="text-xs text-slate-300 font-mono leading-relaxed"><code>{JSON.stringify(log.details, null, 2)}</code></pre>
                </div>
              </details>
            {:else}
              <span class="text-xs text-muted">-</span>
            {/if}
          </td>
        </tr>
      {/each}
    </Table>
  {/if}

  {#if total > 10}
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
  {/if}
</div>
