<script lang="ts">
  import { UserX, AlertCircle, FileText, CheckCircle, Ban, CheckCircle2 } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Badge, Button, Table } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';

  export let users: AdminUserItem[] = [];
  export let onSuspend: (user: AdminUserItem) => void;
  export let onUnsuspend: (user: AdminUserItem) => void;
  export let onShowDetail: (user: AdminUserItem) => void;

  const tableHeaders = [
    { key: 'name', label: 'PENGGUNA' },
    { key: 'role', label: 'PERAN' },
    { key: 'email', label: 'EMAIL' },
    { key: 'createdAt', label: 'TANGGAL' },
    { key: 'status', label: 'STATUS' },
    { key: 'actions', label: 'AKSI', align: 'right' as const }
  ];
</script>

{#if users.length === 0}
  <div class="py-16 px-8 flex flex-col items-center text-center">
    <div class="w-14 h-14 rounded-2xl bg-nested flex items-center justify-center mb-4 text-muted">
      <UserX size={28} />
    </div>
    <h4 class="text-sm font-bold text-main mb-1.5">Tidak Ada Pengguna</h4>
    <p class="text-xs text-secondary max-w-xs leading-relaxed">
      Belum ada pengguna yang sesuai dengan pencarian atau filter Anda.
    </p>
  </div>
{:else}
  <Table headers={tableHeaders} minWidth="min-w-[640px]">
    {#each users as item (item.id)}
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-nested/80 text-secondary flex items-center justify-center shrink-0 border border-light/50">
              <span class="font-bold text-xs uppercase">{item.name.charAt(0)}</span>
            </div>
            <span class="font-medium text-main text-sm">{item.name}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-nested border border-light uppercase tracking-wider text-secondary">
            {item.role === 'designer' ? 'Desainer' : item.role === 'tenant' ? 'Merchant' : item.role === 'admin' ? 'Admin' : item.role}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary">
          {item.email}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-muted">
          {item.createdAt ? formatDate(item.createdAt, { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            {#if item.status === 'active'}
              <Badge variant="emerald" size="sm" class="justify-center shadow-xs">
                <CheckCircle size={12} strokeWidth={3} class="mr-1 inline" />
                Aktif
              </Badge>
            {:else if item.status === 'pending'}
              <Badge variant="amber" size="sm" class="justify-center shadow-xs">
                <AlertCircle size={12} strokeWidth={3} class="mr-1 inline" />
                Menunggu
              </Badge>
            {:else}
              <Badge variant="rose" size="sm" class="justify-center shadow-xs">
                <Ban size={12} strokeWidth={3} class="mr-1 inline" />
                Ditangguhkan
              </Badge>
            {/if}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
          <div class="flex items-center justify-end gap-1.5">
            {#if item.status === 'active'}
              <Button 
                size="sm"
                variant="destructive"
                on:click={() => onSuspend(item)}
                title="Tangguhkan Pengguna"
                className="h-8 px-3 rounded-xl font-bold text-xs hover:scale-105 transition-all"
              >
                <AlertCircle size={13} class="mr-1" />
                <span>Suspend</span>
              </Button>
            {:else if item.status === 'suspended'}
              {#if item.suspendReason}
                <Button 
                  size="sm"
                  variant="ghost"
                  title="Lihat Alasan"
                  on:click={() => onShowDetail(item)}
                  className="h-8 w-8 p-0 rounded-xl text-secondary hover:bg-nested hover:scale-105 transition-all"
                >
                  <FileText size={14} />
                </Button>
              {/if}
              <Button 
                size="sm"
                variant="primary"
                on:click={() => onUnsuspend(item)}
                title="Aktifkan Pengguna"
                className="h-8 px-3 rounded-xl font-bold text-xs hover:scale-105 transition-all"
              >
                <CheckCircle2 size={13} class="mr-1" />
                <span>Unsuspend</span>
              </Button>
            {/if}
          </div>
        </td>
      </tr>
    {/each}
  </Table>
{/if}
