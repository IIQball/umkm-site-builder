<script lang="ts">
  import { Badge, Button } from '@/components/ui';
  import { getStoreDirectUrl } from '@/lib/domain';
  import type { AssistedStoreItem } from '@/types/admin';

  export let rowNumber: number = 1;
  export let store: AssistedStoreItem;
  export let mainDomain: string = 'localhost:4321';
  export let copiedId: string | null = null;
  export let onCopyId: (id: string) => void;
  export let formatDate: (d: Date | string) => string;

  const isStoreActive = (status: string | null | undefined) =>
    status === 'published' || status === 'active';

  $: badge = !store.id
    ? { label: 'Belum Setup', variant: 'warning' as const, dot: true, pulse: false }
    : isStoreActive(store.status)
    ? { label: 'Publik / Aktif', variant: 'success' as const, dot: true, pulse: false }
    : { label: 'Draf Toko', variant: 'info' as const, dot: true, pulse: false };
</script>

<tr class="transition-colors group hover:bg-nested/40">
  <!-- Sequence Number (#) -->
  <td class="px-3 py-4 text-center font-mono text-2xs text-secondary font-bold">
    {rowNumber}
  </td>
  <!-- Store & Merchant Info -->
  <td class="px-6 py-4">
    <div class="flex items-center gap-3.5">
      <div class="w-10 h-10 rounded-xl bg-nested border border-light flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg {store.id ? 'text-primary' : 'text-muted'}">storefront</span>
      </div>

      <div class="min-w-0 max-w-[280px]">
        <div class="flex items-center gap-2">
          <span class="font-bold text-xs text-main truncate block leading-tight font-heading">
            {store.name || 'Belum Membuat Toko'}
          </span>
          <button
            type="button"
            on:click={() => onCopyId(store.userId)}
            class="text-xs text-muted hover:text-primary transition-colors inline-flex items-center gap-0.5 cursor-pointer font-mono bg-nested/80 px-1.5 py-0.5 rounded-md border border-light active:scale-95 flex-shrink-0"
            title="Salin ID Tenant"
          >
            <span>#{store.userId.slice(0, 6)}</span>
            <span class="material-symbols-outlined text-[10px]">
              {copiedId === store.userId ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>
        <div class="flex items-center gap-1.5 mt-0.5">
          <span class="text-2xs text-secondary font-medium truncate max-w-[120px] font-sans">
            {store.tenantName || store.owner?.name || 'Tanpa Nama'}
          </span>
          <span class="text-xs text-muted">•</span>
          <span class="text-2xs text-muted font-mono truncate max-w-[140px]">
            {store.tenantEmail || store.owner?.email || '-'}
          </span>
        </div>
      </div>
    </div>
  </td>

  <!-- Subdomain / URL -->
  <td class="px-4 py-4 whitespace-nowrap">
    {#if store.subdomain}
      <a
        href={getStoreDirectUrl(store.subdomain)}
        target="_blank"
        rel="noreferrer"
        class="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-secondary hover:text-primary bg-nested/80 hover:bg-card px-2.5 py-1 rounded-xl border border-light transition-all shadow-2xs"
      >
        <span>{store.subdomain}.{mainDomain}</span>
        <span class="material-symbols-outlined text-xs">open_in_new</span>
      </a>
    {:else}
      <span class="text-xs font-mono text-muted bg-nested/50 px-2 py-0.5 rounded-md border border-light/60">
        Belum Ada Subdomain
      </span>
    {/if}
  </td>

  <!-- Status Badge -->
  <td class="px-4 py-4 whitespace-nowrap">
    <Badge variant={badge.variant} dot={badge.dot} pulse={badge.pulse} size="sm">
      {badge.label}
    </Badge>
  </td>

  <!-- Registered Date -->
  <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
    {formatDate(store.createdAt)}
  </td>

  <!-- Actions -->
  <td class="px-6 py-4 text-right whitespace-nowrap">
    <div class="flex items-center justify-end gap-2">
      {#if !store.id}
        <!-- Belum Setup: Primary Setup Toko, Secondary Beli Template -->
        <Button
          href={`/onboarding?tenantId=${store.userId}`}
          variant="primary"
          size="sm"
          className="rounded-xl font-bold text-xs"
          title="Setup Toko Baru"
        >
          <span class="material-symbols-outlined text-xs">storefront</span>
          <span>Setup Toko</span>
        </Button>
        <Button
          href={`/templates?tenantId=${store.userId}`}
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold text-xs"
          title="Beli Template untuk Toko Ini"
        >
          <span class="material-symbols-outlined text-xs">shopping_bag</span>
          <span>Beli Template</span>
        </Button>
      {:else if isStoreActive(store.status)}
        <!-- Aktif: Primary Kelola Toko, Secondary Beli Template -->
        <Button
          href={`/onboarding?storeId=${store.id}`}
          variant="primary"
          size="sm"
          className="rounded-xl font-bold text-xs"
          title="Kelola Data Toko"
        >
          <span class="material-symbols-outlined text-xs">tune</span>
          <span>Kelola Toko</span>
        </Button>
        <Button
          href={`/templates?tenantId=${store.userId}`}
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold text-xs"
          title="Beli Template untuk Toko Ini"
        >
          <span class="material-symbols-outlined text-xs">shopping_bag</span>
          <span>Beli Template</span>
        </Button>
      {:else}
        <!-- Draft: Primary Kelola Toko, Secondary Beli Template -->
        <Button
          href={`/onboarding?storeId=${store.id}`}
          variant="primary"
          size="sm"
          className="rounded-xl font-bold text-xs"
          title="Kelola Data Toko"
        >
          <span class="material-symbols-outlined text-xs">tune</span>
          <span>Kelola Toko</span>
        </Button>
        <Button
          href={`/templates?tenantId=${store.userId}`}
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold text-xs"
          title="Beli Template untuk Toko Ini"
        >
          <span class="material-symbols-outlined text-xs">shopping_bag</span>
          <span>Beli Template</span>
        </Button>
      {/if}
    </div>
  </td>
</tr>
