<script lang="ts">
  import { UserX, AlertCircle, FileText, CheckCircle, Ban, CheckCircle2, Database } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Badge, Button, Table } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';

  export let users: AdminUserItem[] = [];
  export let startIndex: number = 0;
  export let onSuspend: (user: AdminUserItem) => void;
  export let onUnsuspend: (user: AdminUserItem) => void;
  export let onShowDetail: (user: AdminUserItem) => void;
  export let onManageQuota: (user: AdminUserItem) => void;

  const tableHeaders = [
    { label: '#', align: 'center' as const, width: 'w-12' },
    { label: 'Pengguna' },
    { label: 'Peran', width: 'w-32' },
    { label: 'Email', width: 'w-48' },
    { label: 'Tanggal Daftar', width: 'w-40' },
    { label: 'Status', align: 'center' as const, width: 'w-32' },
    { label: 'Aksi', align: 'right' as const, width: 'w-32' }
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
  <Table headers={tableHeaders} minWidth="min-w-[700px]">
    {#each users as item, i (item.id)}
      <tr class="hover:bg-nested/40 transition-colors group">
        <!-- Sequence Number (#) -->
        <td class="px-4 py-4 text-center font-mono text-2xs text-secondary font-bold">
          {startIndex + i + 1}
        </td>

        <!-- Name -->
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 shadow-2xs font-bold font-sans uppercase">
              {item.name.charAt(0)}
            </div>
            <div class="min-w-0">
              <span class="font-bold text-xs text-main block font-sans truncate">
                {item.name}
              </span>
            </div>
          </div>
        </td>

        <!-- Role -->
        <td class="px-4 py-4">
          <span class="font-mono text-2xs font-bold text-secondary bg-nested/80 px-2 py-1 rounded-lg border border-light uppercase">
            {item.role === 'designer' ? 'Desainer' : item.role === 'tenant' ? 'Merchant' : item.role === 'admin' ? 'Admin' : item.role}
          </span>
        </td>

        <!-- Email -->
        <td class="px-4 py-4">
          <span class="font-sans text-xs text-secondary truncate block max-w-xs">{item.email}</span>
        </td>

        <!-- Created Date -->
        <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
          {item.createdAt ? formatDate(item.createdAt, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        </td>

        <!-- Status -->
        <td class="px-4 py-4 text-center">
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

        <!-- Actions -->
        <td class="px-6 py-4 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            {#if item.status === 'active'}
              <Button
                variant="destructive"
                size="icon"
                className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                on:click={() => onSuspend(item)}
                title="Tangguhkan Pengguna"
              >
                <AlertCircle size={13} />
              </Button>
              {#if item.role === 'tenant' && item.hasStore}
                <Button
                  variant="secondary"
                  size="icon"
                  title="Kelola Kuota"
                  on:click={() => onManageQuota(item)}
                >
                  <Database size={13} />
                </Button>
              {/if}
            {:else if item.status === 'suspended'}
              {#if item.suspendReason}
                <Button
                  variant="secondary"
                  size="icon"
                  title="Lihat Alasan"
                  on:click={() => onShowDetail(item)}
                >
                  <FileText size={13} />
                </Button>
              {/if}
              <Button
                variant="primary"
                size="icon"
                on:click={() => onUnsuspend(item)}
                title="Aktifkan Pengguna"
              >
                <CheckCircle2 size={13} />
              </Button>
            {/if}
          </div>
        </td>
      </tr>
    {/each}
  </Table>
{/if}

