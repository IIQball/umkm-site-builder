<script lang="ts">
  import { Handshake, CheckCircle2, X, Store } from 'lucide-svelte';
  import { Badge, SearchableSelect } from '@/components/ui';
  import { formatIDR } from '@/lib/currency';

  export let selectedTenantId: string = '';
  export let tenantOptions: Array<{ value: string; label: string; sublabel: string }> = [];
  export let selectedTenant: { id: string; name: string; storeName: string; storeId: string } | undefined = undefined;
  export let adminServiceFee: number = 50000;
</script>

<div
  class="relative z-30 rounded-2xl bg-card border transition-all duration-200 p-4 sm:p-5 shadow-xs {selectedTenant
    ? 'border-primary/40 ring-1 ring-primary/20 shadow-sm'
    : 'border-light'}"
>
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
    <!-- Left: Info & Context -->
    <div class="flex items-start sm:items-center gap-3.5 min-w-0">
      <div
        class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0"
      >
        <Handshake size={20} />
      </div>

      <div class="min-w-0 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-sm sm:text-base font-bold text-main font-heading leading-tight">
            Beli untuk Merchant Binaan
          </h3>
          <Badge variant="primary" size="sm" class="font-semibold text-2xs">
            Mode Pendamping
          </Badge>
          {#if selectedTenant}
            <span
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              Aktif Terhubung
            </span>
          {/if}
        </div>
        <p class="text-xs text-secondary leading-relaxed">
          Pilih toko binaan untuk membelikan template. Tagihan otomatis ditambah fee pendampingan
          <span class="font-semibold text-main">{formatIDR(adminServiceFee)}</span>.
        </p>
      </div>
    </div>

    <!-- Right: Searchable Tenant Combobox & Active Chip -->
    <div class="w-full lg:w-80 xl:w-96 shrink-0">
      <SearchableSelect
        id="assisted-tenant-select"
        bind:value={selectedTenantId}
        placeholder="Pilih Merchant Binaan..."
        searchPlaceholder="Cari nama toko atau pemilik..."
        emptyText="Tidak ada toko binaan yang cocok"
        options={tenantOptions}
        align="right"
        size="md"
        class="w-full shadow-2xs"
      />

      {#if selectedTenant}
        <div
          class="mt-2 p-2 sm:p-2.5 rounded-xl bg-nested/80 border border-light flex items-center justify-between gap-2 text-xs animate-in fade-in duration-200"
        >
          <div class="flex items-center gap-2 min-w-0">
            <div
              class="w-6 h-6 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0"
            >
              <CheckCircle2 size={13} />
            </div>
            <div class="min-w-0">
              <p class="font-bold text-main truncate leading-tight font-sans text-xs">
                {selectedTenant.storeName}
              </p>
              <p class="text-xs text-secondary truncate leading-tight">
                Pemilik: {selectedTenant.name}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <span
              class="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md"
            >
              +{formatIDR(adminServiceFee)}
            </span>
            <button
              type="button"
              on:click={() => (selectedTenantId = '')}
              class="p-1 text-muted hover:text-error hover:bg-card rounded-md transition-colors cursor-pointer"
              title="Batalkan pilihan merchant"
              aria-label="Batalkan pilihan merchant"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      {:else}
        <div class="mt-1.5 flex items-center gap-1.5 text-xs text-muted font-sans px-1">
          <Store size={11} class="shrink-0" />
          <span>Pilih merchant untuk membelikan/memasangkan template langsung.</span>
        </div>
      {/if}
    </div>
  </div>
</div>
