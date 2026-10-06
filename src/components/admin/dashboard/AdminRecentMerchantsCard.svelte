<script lang="ts">
  import { ArrowUpRight, Mail, Store, User } from 'lucide-svelte';
  import { Card, Table, Badge, Pagination } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';

  export let merchants: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: string | Date;
    storeName?: string | null;
    storeStatus?: string | null;
    storeId?: string | null;
  }> = [];
  export let currentPage: number = 1;
  export let totalItems: number = merchants.length;
  export let pageSize: number = 10;
  export let pageParam: string = 'merchantPage';

  const tableHeaders = [
    { label: '#', align: 'center' as const, width: '40px' },
    { label: 'Tenant & Toko', align: 'left' as const, width: '30%' },
    { label: 'Email Merchant', align: 'left' as const, width: '28%' },
    { label: 'Tanggal Daftar', align: 'left' as const, width: '22%' },
    { label: 'Status Setup', align: 'center' as const, width: '20%' },
  ];
</script>

<Card
  variant="bordered"
  padding="none"
  radius="2xl"
  class="shadow-xs overflow-hidden h-full flex flex-col justify-between"
>
  <!-- Card Header -->
  <div class="p-5 sm:p-6 border-b border-light flex items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">storefront</span>
      </div>
      <div>
        <h3 class="text-heading-sm text-main font-bold font-heading leading-tight">
          Merchant Terbaru
        </h3>
        <p class="text-2xs text-secondary mt-0.5 font-sans">
          5 tenant binaan yang baru didaftarkan
        </p>
      </div>
    </div>

    <a
      href="/admin/merchants"
      class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-focus transition-colors cursor-pointer"
    >
      <span>Kelola Merchant</span>
      <ArrowUpRight size={14} />
    </a>
  </div>

  <!-- Content Table using canonical Table.svelte -->
  <div class="flex-1 overflow-x-auto">
    {#if merchants.length === 0}
      <div class="py-12 px-6 flex flex-col items-center text-center">
        <div class="w-12 h-12 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto mb-2 shadow-2xs">
          <span class="material-symbols-outlined text-xl">groups</span>
        </div>
        <p class="text-xs font-bold text-main font-heading">Belum Ada Merchant</p>
        <p class="text-2xs text-secondary mt-0.5 font-sans">
          Belum ada merchant binaan yang terdaftar pada sistem.
        </p>
      </div>
    {:else}
      <Table headers={tableHeaders} minWidth="min-w-[600px]" dense>
        {#each merchants as m, idx (m.id)}
          <tr class="hover:bg-nested/40 transition-colors group">
            <!-- Sequence Number (#) -->
            <td class="px-3 py-3.5 text-center font-mono text-2xs text-secondary font-bold">
              {(currentPage - 1) * pageSize + idx + 1}
            </td>
            <!-- Tenant & Toko -->
            <td class="px-5 py-3.5">
              <div class="space-y-0.5">
                <div class="flex items-center gap-1.5 font-bold text-xs text-main">
                  <User size={13} class="text-primary flex-shrink-0" />
                  <span class="truncate max-w-[130px] font-sans">{m.name || 'Tenant UMKM'}</span>
                </div>
                <div class="flex items-center gap-1.5 text-3xs text-secondary">
                  <Store size={12} class="flex-shrink-0" />
                  <span class="truncate max-w-[130px] font-sans">{m.storeName || 'Belum Buat Toko'}</span>
                </div>
              </div>
            </td>

            <!-- Email Merchant -->
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5 text-xs text-secondary font-mono">
                <Mail size={12} class="text-muted flex-shrink-0" />
                <span class="truncate max-w-[150px]">{m.email}</span>
              </div>
            </td>

            <!-- Tanggal Daftar -->
            <td class="px-4 py-3.5 whitespace-nowrap">
              <span class="text-xs text-secondary font-mono">
                {formatDate(m.createdAt)}
              </span>
            </td>

            <!-- Status Setup Badge -->
            <td class="px-4 py-3.5 text-center whitespace-nowrap">
              {#if m.storeStatus === 'published' || m.storeStatus === 'active'}
                <Badge variant="success" size="sm" dot>Toko Aktif</Badge>
              {:else if m.storeStatus === 'draft'}
                <Badge variant="warning" size="sm" dot>Draft</Badge>
              {:else}
                <Badge variant="error" size="sm" dot>Belum Setup</Badge>
              {/if}
            </td>
          </tr>
        {/each}
      </Table>
    {/if}
  </div>

  {#if totalItems > pageSize}
    <Pagination
      bind:currentPage
      {totalItems}
      {pageSize}
      {pageParam}
      size="xs"
      showInfo={false}
      class="px-4 py-2.5"
    />
  {/if}

  <!-- Card Footer -->
  <div class="px-5 py-3 sm:px-6 bg-nested/50 border-t border-light flex items-center justify-between text-2xs text-secondary">
    <span>Data sinkron langsung dari sistem onboarding</span>
    <span class="font-mono font-bold text-main">{totalItems} Total Merchant</span>
  </div>
</Card>
