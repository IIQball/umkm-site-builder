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
    { label: 'Pengguna' },
    { label: 'Peran', width: '120px' },
    { label: 'Tanggal Daftar', width: '160px' },
    { label: 'Status', width: '140px' },
    { label: 'Aksi', align: 'right' as const, width: '200px' },
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
      <tr class="hover:bg-nested/40 transition-colors">
        <td class="px-6 py-4">
          <p class="font-bold text-xs text-main">{item.name}</p>
          <p class="text-xs text-muted truncate max-w-[200px]">{item.email}</p>
        </td>
        <td class="px-4 py-4">
          <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-nested border border-light uppercase tracking-wider text-secondary">
            {item.role === 'designer' ? 'Desainer' : item.role === 'tenant' ? 'Tenant' : item.role}
          </span>
        </td>
        <td class="px-4 py-4 text-xs text-muted">
          {item.createdAt ? formatDate(item.createdAt, { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </td>
        <td class="px-4 py-4">
          {#if item.status === 'active'}
            <Badge variant="emerald" size="sm">
              <CheckCircle size={12} strokeWidth={3} class="mr-1 inline" />
              Aktif
            </Badge>
          {:else}
            <Badge variant="rose" size="sm">
              <Ban size={12} strokeWidth={3} class="mr-1 inline" />
              Ditangguhkan
            </Badge>
          {/if}
        </td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            {#if item.status === 'active'}
              <Button 
                size="xs"
                variant="destructive"
                on:click={() => onSuspend(item)}
                title="Tangguhkan Pengguna"
              >
                <AlertCircle size={13} class="mr-1" />
                <span>Tangguhkan</span>
              </Button>
            {:else}
              {#if item.suspendReason}
                <Button 
                  size="xs"
                  variant="secondary"
                  title="Lihat Alasan"
                  on:click={() => onShowDetail(item)}
                >
                  <FileText size={13} class="mr-1" />
                  <span>Alasan</span>
                </Button>
              {/if}
              <Button 
                size="xs"
                variant="primary"
                on:click={() => onUnsuspend(item)}
                title="Aktifkan Pengguna"
              >
                <CheckCircle2 size={13} class="mr-1" />
                <span>Aktifkan</span>
              </Button>
            {/if}
          </div>
        </td>
      </tr>
    {/each}
  </Table>
{/if}
