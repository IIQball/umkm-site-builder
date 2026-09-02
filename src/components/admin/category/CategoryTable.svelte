<script lang="ts">
  import { Trash2, Edit2 } from 'lucide-svelte';
  import { Badge, Table, Button } from '@/components/ui';
  import { formatDate } from '@/lib/utils';

  export let paginatedCategories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    createdAt?: string | Date;
  }> = [];
  export let onEdit: (cat: any) => void;
  export let onDelete: (cat: any) => void;

  const tableHeaders = [
    { label: 'Kategori Bisnis' },
    { label: 'Slug URL', width: 'w-48' },
    { label: 'Ikon UI', align: 'center' as const, width: 'w-28' },
    { label: 'Tanggal Dibuat', width: 'w-40' },
    { label: 'Aksi', align: 'right' as const, width: 'w-36' },
  ];
</script>

<Table headers={tableHeaders} minWidth="min-w-[700px]">
  {#each paginatedCategories as cat (cat.id)}
    <tr class="hover:bg-nested/40 transition-colors group">
      <!-- Name + Description -->
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 shadow-2xs">
            <span class="material-symbols-outlined text-base">{cat.icon || 'folder'}</span>
          </div>
          <div class="min-w-0">
            <span class="font-bold text-xs text-main block font-sans">
              {cat.name}
            </span>
            {#if cat.description}
              <span class="text-3xs text-secondary block truncate font-sans max-w-xs mt-0.5">
                {cat.description}
              </span>
            {/if}
          </div>
        </div>
      </td>

      <!-- Slug URL -->
      <td class="px-4 py-4">
        <span class="font-mono text-2xs font-bold text-secondary bg-nested/80 px-2 py-1 rounded-lg border border-light">
          {cat.slug}
        </span>
      </td>

      <!-- Icon Badge -->
      <td class="px-4 py-4 text-center">
        <Badge variant="primary" size="sm">
          {cat.icon || 'folder'}
        </Badge>
      </td>

      <!-- Created Date -->
      <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
        {cat.createdAt ? formatDate(cat.createdAt) : '—'}
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1.5">
          <Button
            variant="secondary"
            size="icon"
            on:click={() => onEdit(cat)}
            title="Edit Kategori"
          >
            <Edit2 size={13} />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
            on:click={() => onDelete(cat)}
            title="Hapus Kategori"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  {/each}
</Table>
