<script lang="ts">
  import { Eye } from 'lucide-svelte';
  import { Badge, Button, Table } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';
  import {
    SOURCE_META,
    STATUS_META,
    formatBugRoleLabel,
    type BugReportListItem,
  } from './bugReports.helpers';

  export let items: BugReportListItem[] = [];
  export let currentPage = 1;
  export let pageSize = 20;
  export let onOpenDetail: (report: BugReportListItem) => void;

  const tableHeaders = [
    { label: '#', align: 'center' as const, width: 'w-12' },
    { label: 'Laporan & Rute' },
    { label: 'Sumber Aplikasi', width: 'w-40' },
    { label: 'Pelapor', width: 'w-48' },
    { label: 'Dilaporkan Pada', width: 'w-40' },
    { label: 'Status', align: 'center' as const, width: 'w-36' },
    { label: 'Aksi', align: 'right' as const, width: 'w-32' },
  ];
</script>

<Table headers={tableHeaders} minWidth="min-w-[850px]">
  {#each items as item, i (item.id)}
    {@const statusMeta = STATUS_META[item.status]}
    {@const sourceMeta = SOURCE_META[item.sourceApp]}
    {@const displayReporter = item.reporterName || item.reporterEmail || 'Anonim'}
    <tr class="hover:bg-nested/40 transition-colors group">
      <td class="px-4 py-4 text-center font-mono text-2xs text-secondary font-bold">
        {(currentPage - 1) * pageSize + i + 1}
      </td>

      <td class="px-6 py-4 max-w-sm">
        <div class="min-w-0">
          <span class="font-bold text-xs text-main block font-sans truncate">
            {item.title || 'Tanpa Judul'}
          </span>
          <span class="text-xs text-secondary line-clamp-2 font-sans mt-0.5 break-words">
            {item.description}
          </span>
          <span class="text-2xs text-muted block truncate font-mono mt-1" title={item.routeUrl}>
            {item.routeUrl}
          </span>
        </div>
      </td>

      <td class="px-4 py-4 whitespace-nowrap">
        <Badge variant={sourceMeta.variant} size="sm" dot={false}>
          {sourceMeta.label}
        </Badge>
      </td>

      <td class="px-4 py-4 max-w-[200px]">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
            {displayReporter.slice(0, 1).toUpperCase()}
          </div>
          <div class="min-w-0">
            <span class="font-bold text-xs text-main block font-sans truncate">
              {displayReporter}
            </span>
            <span class="text-2xs text-secondary block truncate font-mono mt-0.5">
              {formatBugRoleLabel(item.reporterRole)}
            </span>
          </div>
        </div>
      </td>

      <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
        {formatDate(item.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>

      <td class="px-4 py-4 text-center whitespace-nowrap">
        <div class="inline-flex items-center justify-center">
          <Badge variant={statusMeta.variant} size="sm" dot>
            {statusMeta.label}
          </Badge>
        </div>
      </td>

      <td class="px-6 py-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end">
          <Button
            variant="secondary"
            size="xs"
            class="rounded-lg font-bold"
            on:click={() => onOpenDetail(item)}
            title="Lihat detail dan kelola laporan"
          >
            <Eye size={13} />
            <span>Kelola</span>
          </Button>
        </div>
      </td>
    </tr>
  {/each}
</Table>

