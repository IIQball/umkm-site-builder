<script lang="ts">
  import { Badge, Button } from '@/components/ui';
  import { formatCurrency } from '@/lib/utils/format';

  export let tpl: any;
  export let copiedId: string | null = null;
  export let badge: { label: string; variant: any; dot: boolean; pulse: boolean };
  export let formatDate: (d: Date | string) => string;
  export let onCopyId: (id: string) => void;
  export let onShowRejection: (tpl: any) => void;
  export let isSelected: boolean = false;
  export let onToggleSelect: ((id: string) => void) | undefined = undefined;
  export let onDeleteDraft: ((tpl: any) => void) | undefined = undefined;
</script>

<tr class={`transition-colors group ${isSelected ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'hover:bg-nested/40'}`}>
  <!-- Checkbox Column -->
  <td class="pl-5 pr-1 py-4 w-10 text-center">
    {#if tpl.status === 'draft' && onToggleSelect}
      <button
        type="button"
        on:click|stopPropagation={() => onToggleSelect && onToggleSelect(tpl.id)}
        class={`w-5 h-5 rounded-md border transition-all flex items-center justify-center cursor-pointer mx-auto ${
          isSelected
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'bg-card border-slate-300 dark:border-slate-700 hover:border-blue-500 text-transparent'
        }`}
        title={isSelected ? 'Batalkan pilihan' : 'Pilih draf template'}
        aria-label={isSelected ? 'Batalkan pilihan' : 'Pilih draf template'}
      >
        <span class="material-symbols-outlined text-xs font-bold">check</span>
      </button>
    {:else}
      <span class="w-5 h-5 block"></span>
    {/if}
  </td>

  <!-- Template Info + Thumbnail -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-3.5">
      <div class="w-14 h-9 rounded-xl bg-nested border border-light overflow-hidden flex-shrink-0 relative shadow-2xs">
        {#if tpl.thumbnailUrl}
          <img src={tpl.thumbnailUrl} alt={tpl.name} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full bg-nested flex items-center justify-center text-muted">
            <span class="material-symbols-outlined text-base">palette</span>
          </div>
        {/if}
      </div>

      <!-- Title & Desc -->
      <div class="min-w-0 max-w-[240px]">
        <div class="flex items-center gap-2">
          <a
            href={`/builder/${tpl.id}`}
            class="font-bold text-xs text-main hover:text-primary transition-colors truncate block leading-tight font-sans"
            title="Buka di Editor"
          >
            {tpl.name}
          </a>
          <button
            type="button"
            on:click={() => onCopyId(tpl.id)}
            class="text-3xs text-muted hover:text-primary transition-colors inline-flex items-center gap-0.5 cursor-pointer font-mono bg-nested/80 px-1.5 py-0.5 rounded-md border border-light active:scale-95"
            title="Salin ID Template"
          >
            <span>#{tpl.id.slice(0, 6)}</span>
            <span class="material-symbols-outlined text-[10px]">
              {copiedId === tpl.id ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>
        <span class="text-2xs text-muted truncate block mt-0.5 font-sans">
          {tpl.description || 'Tanpa deskripsi template'}
        </span>
      </div>
    </div>
  </td>

  <!-- Price -->
  <td class="px-4 py-4 whitespace-nowrap">
    <span class="font-mono text-xs font-bold text-main bg-nested/80 px-2.5 py-1 rounded-xl border border-light">
      {tpl.price === 0 ? 'Gratis' : formatCurrency(tpl.price)}
    </span>
  </td>

  <!-- Sales -->
  <td class="px-4 py-4 whitespace-nowrap">
    <span class="font-mono text-xs font-bold text-secondary">
      {tpl.totalSold}× Terjual
    </span>
  </td>

  <!-- Status Badge -->
  <td class="px-4 py-4 whitespace-nowrap">
    <Badge variant={badge.variant} dot={badge.dot} pulse={badge.pulse} size="sm">
      {badge.label}
    </Badge>
  </td>

  <!-- Date -->
  <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
    {formatDate(tpl.createdAt)}
  </td>

  <!-- Actions -->
  <td class="px-6 py-4 text-right whitespace-nowrap">
    <div class="flex items-center justify-end gap-2">
      {#if tpl.status === 'draft'}
        <Button
          variant="destructive"
          size="xs"
          className="rounded-xl font-bold"
          on:click={() => onDeleteDraft && onDeleteDraft(tpl)}
        >
          <span class="material-symbols-outlined text-xs">delete</span>
          <span>Hapus</span>
        </Button>
        <Button
          href={`/builder/${tpl.id}`}
          variant="dark"
          size="sm"
          className="rounded-xl font-bold"
        >
          <span class="material-symbols-outlined text-xs">edit</span>
          <span>Edit</span>
        </Button>
      {/if}

      {#if tpl.status === 'rejected'}
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
          on:click={() => onShowRejection(tpl)}
        >
          <span class="material-symbols-outlined text-xs text-rose-500">info</span>
          <span>Alasan</span>
        </Button>
        <Button
          href={`/builder/${tpl.id}`}
          variant="primary"
          size="sm"
          className="rounded-xl font-bold"
        >
          Edit Ulang
        </Button>
      {/if}

      {#if tpl.status === 'approved' || tpl.status === 'pending'}
        <Button
          href={`/builder/preview/${tpl.id}`}
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold"
        >
          <span class="material-symbols-outlined text-xs">visibility</span>
          <span>Pratinjau</span>
        </Button>
      {/if}
    </div>
  </td>
</tr>
