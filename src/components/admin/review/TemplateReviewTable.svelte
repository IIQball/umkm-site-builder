<script lang="ts">
  import { Eye, Check, X } from 'lucide-svelte';
  import { Badge, Table, Button } from '@/components/ui';
  import { formatCurrency, formatDate } from '@/lib/utils';
  import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
  import type { AdminTemplateItem } from './review.types';

  export let paginatedTemplates: AdminTemplateItem[] = [];
  export let currentPage: number = 1;
  export let pageSize: number = 10;
  export let onApprove: (t: AdminTemplateItem) => void;
  export let onReject: (t: AdminTemplateItem) => void;
  export let onViewRevisionNotes: (t: AdminTemplateItem) => void = () => {};

  const tableHeaders = [
    { label: '#', align: 'center' as const, width: 'w-12' },
    { label: 'Informasi Template' },
    { label: 'Kreator Desainer', width: 'w-48' },
    { label: 'Harga Jual', align: 'right' as const, width: 'w-36' },
    { label: 'Diajukan Pada', width: 'w-40' },
    { label: 'Status Kurasi', align: 'center' as const, width: 'w-36' },
    { label: 'Aksi Review', align: 'right' as const, width: 'w-48' },
  ];

  const getStatusBadge = (status: AdminTemplateItem['status']) => {
    switch (status) {
      case 'approved':
        return { label: 'Disetujui', variant: 'emerald' as const };
      case 'rejected':
        return { label: 'Ditolak', variant: 'rose' as const };
      case 'pending':
        return { label: 'Menunggu Review', variant: 'amber' as const };
      default:
        return { label: 'Draft', variant: 'slate' as const };
    }
  };
</script>

<Table headers={tableHeaders} minWidth="min-w-[850px]">
  {#each paginatedTemplates as tpl, i (tpl.id)}
    {@const statusMeta = getStatusBadge(tpl.status)}
    <tr class="hover:bg-nested/40 transition-colors group">
      <!-- Sequence Number (#) -->
      <td class="px-4 py-4 text-center font-mono text-2xs text-secondary font-bold">
        {(currentPage - 1) * pageSize + i + 1}
      </td>
      <!-- Thumbnail & Name -->
      <td class="px-6 py-4">
        <div class="flex items-center gap-3.5">
          {#if tpl.thumbnailUrl}
            <img
              src={getOptimizedCloudinaryUrl(tpl.thumbnailUrl, 160)}
              alt={tpl.name}
              class="w-12 h-8 rounded-lg object-cover border border-light flex-shrink-0 shadow-2xs"
              loading="lazy"
            />
          {:else}
            <div class="w-12 h-8 rounded-lg bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0">
              <span class="material-symbols-outlined text-sm">dashboard</span>
            </div>
          {/if}
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-main block font-sans truncate max-w-xs">
                {tpl.name}
              </span>
              {#if tpl.revisionCount && tpl.revisionCount > 0}
                <span class="inline-flex items-center gap-1 font-mono text-xs font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex-shrink-0">
                  <span class="material-symbols-outlined text-[10px]">history_edu</span>
                  <span>Revisi #{tpl.revisionCount}</span>
                </span>
              {/if}
            </div>
            {#if tpl.description}
              <span class="text-xs text-secondary block truncate font-sans max-w-xs mt-0.5">
                {tpl.description}
              </span>
            {/if}
          </div>
        </div>
      </td>

      <!-- Designer Info -->
      <td class="px-4 py-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
            {(tpl.designerName || tpl.designerEmail || 'D').slice(0, 1).toUpperCase()}
          </div>
          <div class="min-w-0">
            <span class="font-bold text-xs text-main block font-sans truncate">
              {tpl.designerName || 'Desainer Kreator'}
            </span>
            <span class="text-xs text-secondary block truncate font-mono mt-0.5">
              {tpl.designerEmail || '—'}
            </span>
          </div>
        </div>
      </td>

      <!-- Price -->
      <td class="px-4 py-4 text-right whitespace-nowrap">
        <span class="font-mono text-xs font-bold text-main bg-nested/80 px-2.5 py-1 rounded-xl border border-light">
          {tpl.price === 0 ? 'Gratis' : formatCurrency(tpl.price)}
        </span>
      </td>

      <!-- Created Date -->
      <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
        {formatDate(tpl.createdAt)}
      </td>

      <!-- Status Badge -->
      <td class="px-4 py-4 text-center whitespace-nowrap">
        <div class="inline-flex items-center justify-center">
          <Badge variant={statusMeta.variant} size="sm" dot>
            {statusMeta.label}
          </Badge>
        </div>
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1.5">
          <Button
            href={`/builder/preview/${tpl.id}`}
            variant="secondary"
            size="xs"
            className="rounded-lg font-bold"
            title="Pratinjau Template"
          >
            <Eye size={13} />
            <span>Demo</span>
          </Button>

          {#if tpl.revisionNotes || (tpl.revisionCount && tpl.revisionCount > 0)}
            <Button
              variant="outline"
              size="xs"
              className="rounded-lg font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
              title="Lihat Catatan & Balasan Revisi"
              on:click={() => onViewRevisionNotes(tpl)}
            >
              <span class="material-symbols-outlined text-[13px]">notes</span>
              <span>Catatan</span>
            </Button>
          {/if}

          {#if tpl.status === 'pending'}
            <Button
              variant="primary"
              size="xs"
              className="rounded-lg font-bold"
              title="Setujui Template"
              on:click={() => onApprove(tpl)}
            >
              <Check size={13} />
              <span>Setujui</span>
            </Button>
            <Button
              variant="destructive"
              size="xs"
              className="rounded-lg font-bold"
              title="Tolak Template"
              on:click={() => onReject(tpl)}
            >
              <X size={13} />
              <span>Tolak</span>
            </Button>
          {/if}
        </div>
      </td>
    </tr>
  {/each}
</Table>
