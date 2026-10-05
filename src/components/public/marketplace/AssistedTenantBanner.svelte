<script lang="ts">
  import { Handshake, CheckCircle2 } from 'lucide-svelte';
  import { Badge, SearchableSelect } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let selectedTenantId: string = '';
  export let tenantOptions: Array<{ value: string; label: string; sublabel: string }> = [];
  export let selectedTenant: { id: string; name: string; storeName: string; storeId: string } | undefined = undefined;
  export let adminServiceFee: number = 5000;
</script>

<div class="relative overflow-hidden rounded-2xl bg-card border border-light p-4 sm:p-5 shadow-xs transition-colors">
  <!-- Subtle primary accent bar -->
  <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary" aria-hidden="true"></div>

  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pl-1.5 sm:pl-2">
    <!-- Left: Info & Context -->
    <div class="flex items-start sm:items-center gap-3.5 min-w-0">
      <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
        <Handshake size={20} />
      </div>

      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-sm font-bold text-main font-heading">
            Beli untuk Merchant Binaan
          </h3>
          <Badge variant="info" size="sm">
            Jasa Pendamping
          </Badge>
        </div>
        <p class="text-xs text-secondary leading-relaxed">
          Pilih toko binaan untuk membelikan template. Harga template otomatis ditambah fee pendampingan {formatIDR(adminServiceFee)} ke tagihan.
        </p>
      </div>
    </div>

    <!-- Right: Searchable Tenant Combobox -->
    <div class="w-full lg:w-80 xl:w-96 shrink-0">
      <SearchableSelect
        id="assisted-tenant-select"
        bind:value={selectedTenantId}
        placeholder="-- Pilih Tenant Binaan --"
        searchPlaceholder="Cari nama toko atau pemilik..."
        emptyText="Tidak ada tenant binaan yang cocok"
        options={tenantOptions}
        size="md"
        class="w-full shadow-2xs"
      />

      {#if selectedTenant}
        <div class="mt-1.5 flex items-center gap-1.5 text-xs-dense text-success font-medium">
          <CheckCircle2 size={12} class="shrink-0" />
          <span class="truncate">
            Aktif: <strong class="text-main font-semibold">{selectedTenant.storeName}</strong> ({selectedTenant.name})
          </span>
        </div>
      {/if}
    </div>
  </div>
</div>
