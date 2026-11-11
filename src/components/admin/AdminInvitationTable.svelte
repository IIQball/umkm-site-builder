<script lang="ts">
  import { Badge, Button, Pagination, Table } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';
  import type { AdminInvitationItem } from './adminInvitation.types';

  export let invitations: AdminInvitationItem[] = [];
  export let currentPage = 1;
  export let pageSize = 10;
  export let isExtending: string | null = null;
  export let isDeleting: string | null = null;
  export let onExtend: (id: string) => void;
  export let onDelete: (id: string) => void;

  $: paginatedInvitations = invitations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const isExpired = (inv: AdminInvitationItem) => new Date(inv.expiresAt) < new Date();
</script>

<Table
  headers={[
    { label: '#', align: 'center', width: '40px' },
    { label: 'Nama & Email', align: 'left' },
    { label: 'Status', align: 'left', width: 'w-36' },
    { label: 'Tanggal Kedaluwarsa', align: 'left', width: 'w-48' },
    { label: 'Aksi', align: 'right', width: 'w-64' },
  ]}
  minWidth="min-w-[760px]"
>
  {#each paginatedInvitations as inv, i (inv.id)}
    {@const expired = isExpired(inv)}
    <tr class="hover:bg-nested/40 transition-colors group">
      <td class="px-3 py-4 text-center font-mono text-2xs text-secondary font-bold">
        {(currentPage - 1) * pageSize + i + 1}
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-nested border border-light flex items-center justify-center flex-shrink-0 shadow-2xs">
            <span class="material-symbols-outlined text-lg text-primary">mail</span>
          </div>
          <div class="min-w-0 max-w-[280px]">
            <div class="font-bold text-xs text-main truncate block leading-tight font-heading">{inv.name}</div>
            <div class="text-xs text-secondary mt-0.5 truncate max-w-[200px] font-sans">{inv.email}</div>
          </div>
        </div>
      </td>
      <td class="px-4 py-4 whitespace-nowrap">
        <Badge variant={expired ? 'error' : 'warning'} dot={true} size="sm">
          {expired ? 'Kedaluwarsa' : 'Menunggu Aktivasi'}
        </Badge>
      </td>
      <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
        {formatDate(inv.expiresAt, { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl font-bold text-xs"
            title={(inv.extensionCount ?? 0) >= 3 ? 'Batas maksimal 3x perpanjangan telah tercapai' : 'Perpanjang Masa Aktif 24 Jam'}
            on:click={() => onExtend(inv.id)}
            disabled={isExtending === inv.id || isDeleting === inv.id || (inv.extensionCount ?? 0) >= 3}
            loading={isExtending === inv.id}
          >
            <span class="material-symbols-outlined text-xs">refresh</span>
            <span>Perpanjang{#if (inv.extensionCount ?? 0) > 0} <span class="text-3xs opacity-80 font-mono">({inv.extensionCount}/3)</span>{/if}</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-xl font-bold text-xs !bg-nested hover:!bg-error/10 !border-light hover:!border-error/20 !text-secondary hover:!text-error shadow-2xs"
            title="Hapus Undangan"
            on:click={() => onDelete(inv.id)}
            disabled={isExtending === inv.id || isDeleting === inv.id}
            loading={isDeleting === inv.id}
          >
            <span class="material-symbols-outlined text-xs">delete</span>
            <span>Hapus</span>
          </Button>
        </div>
      </td>
    </tr>
  {/each}
</Table>

{#if invitations.length > 0}
  <Pagination bind:currentPage totalItems={invitations.length} {pageSize} />
{/if}

