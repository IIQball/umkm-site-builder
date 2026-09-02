<script lang="ts">
  import { Palette } from 'lucide-svelte';
  import { Badge } from '@/components/ui';
  import { formatCurrency, formatDate } from '@/lib/utils';

  export let order: any;
  export let statusMeta: { variant: any; label: string };
  export let designerShare: number;
  export let displayId: string;
  export let copiedId: string | null;
  export let onCopyId: (id: string) => void;
</script>

<tr class="hover:bg-nested/40 transition-colors group">
  <!-- Invoice ID & Created At -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-2.5">
      <button
        type="button"
        on:click={() => onCopyId(displayId)}
        class="inline-flex items-center gap-1.5 font-mono text-2xs font-bold text-main bg-nested/80 border border-light hover:border-slate-400 dark:hover:border-slate-500 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
        title="Salin ID Tagihan"
      >
        <span class="truncate max-w-[110px]">{displayId}</span>
        <span class="material-symbols-outlined text-xs flex-shrink-0 {copiedId === displayId ? 'text-emerald-500' : 'text-muted'}">
          {copiedId === displayId ? 'check' : 'content_copy'}
        </span>
      </button>
    </div>
    <span class="text-3xs text-secondary mt-1 block font-mono">
      {formatDate(order.createdAt)}
    </span>
  </td>

  <!-- Template Details -->
  <td class="px-4 py-4">
    <div class="flex items-center gap-3">
      {#if order.template?.thumbnailUrl}
        <img
          src={order.template.thumbnailUrl}
          alt={order.template.name}
          class="w-12 h-9 rounded-xl object-cover border border-light flex-shrink-0 shadow-2xs"
        />
      {:else}
        <div class="w-12 h-9 rounded-xl bg-nested border border-light flex items-center justify-center text-muted flex-shrink-0 shadow-2xs">
          <Palette size={16} />
        </div>
      {/if}
      <div class="min-w-0 max-w-xs">
        <span class="font-bold text-xs text-main block truncate font-sans">
          {order.template?.name || 'Template Desain Toko'}
        </span>
        <span class="text-3xs text-muted block uppercase font-mono mt-0.5">
          ID: #{order.template?.id ? order.template.id.slice(0, 8) : '—'}
        </span>
      </div>
    </div>
  </td>

  <!-- Buyer (Tenant) -->
  <td class="px-4 py-4">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
        {order.user?.name ? order.user.name.charAt(0).toUpperCase() : order.user?.email.charAt(0).toUpperCase()}
      </div>
      <div class="min-w-0">
        <span class="font-bold text-xs text-main block truncate font-sans">
          {order.user?.name || 'Tenant UMKM'}
        </span>
        <span class="text-3xs text-secondary block truncate font-mono mt-0.5">
          {order.user?.email}
        </span>
      </div>
    </div>
  </td>

  <!-- Gross Sale Price -->
  <td class="px-4 py-4 text-right whitespace-nowrap">
    <span class="font-mono text-xs font-bold text-secondary">
      {formatCurrency(order.amount)}
    </span>
  </td>

  <!-- Net Designer Commission -->
  <td class="px-4 py-4 text-right whitespace-nowrap">
    <span class="inline-flex items-center font-mono text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
      +{formatCurrency(designerShare)}
    </span>
  </td>

  <!-- Status Badge -->
  <td class="px-6 py-4 text-center whitespace-nowrap">
    <div class="inline-flex items-center justify-center">
      <Badge variant={statusMeta.variant} size="sm" dot>
        {statusMeta.label}
      </Badge>
    </div>
  </td>
</tr>
