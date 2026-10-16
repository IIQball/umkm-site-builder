<script lang="ts">
  import { Trash2, Edit2 } from 'lucide-svelte';
  import { Table, Button, Badge } from '@/components/ui';
  import { formatDate } from '@/lib/utils';

  export let paginatedCategories: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    createdAt?: string | Date;
  }> = [];
  export let currentPage: number = 1;
  export let pageSize: number = 10;
  export let onEdit: (cat: (typeof paginatedCategories)[0]) => void;
  export let onDelete: (cat: (typeof paginatedCategories)[0]) => void;
  export let categoryLabel: string = 'Kategori';

  $: tableHeaders = [
    { label: '#', align: 'center' as const, width: 'w-12' },
    { label: categoryLabel },
    { label: 'Tanggal Dibuat', width: 'w-40' },
    { label: 'Aksi', align: 'right' as const, width: 'w-48' },
  ];
</script>

<Table headers={tableHeaders} minWidth="min-w-[650px]">
  {#each paginatedCategories as cat, i (cat.id)}
    <tr class="hover:bg-nested/40 transition-colors group">
      <!-- Sequence Number (#) -->
      <td class="px-4 py-4 text-center font-mono text-2xs text-secondary font-bold">
        {(currentPage - 1) * pageSize + i + 1}
      </td>
      <!-- Name + Slug Badge + Description -->
      <td class="px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 shadow-2xs">
            <span class="material-symbols-outlined text-base">{cat.icon || 'folder'}</span>
          </div>
          <div class="min-w-0">
            <span class="font-heading font-bold text-xs text-main block">
              {cat.name}
            </span>
            <div class="mt-0.5">
              <Badge variant="slate" size="sm" dot={false} class="font-mono text-3xs py-0 px-1.5 h-auto">
                /{cat.slug}
              </Badge>
            </div>
            {#if cat.description}
              <span class="text-xs text-secondary block truncate max-w-xs mt-0.5">
                {cat.description}
              </span>
            {/if}
          </div>
        </div>
      </td>

      <!-- Created Date -->
      <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
        {cat.createdAt ? formatDate(cat.createdAt) : '—'}
      </td>

      <!-- Actions -->
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            on:click={() => onEdit(cat)}
            title="Edit Kategori"
          >
            <Edit2 size={13} />
            <span>Edit</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            on:click={() => onDelete(cat)}
            title="Hapus Kategori"
          >
            <Trash2 size={13} />
            <span>Hapus</span>
          </Button>
        </div>
      </td>
    </tr>
  {/each}
</Table>
