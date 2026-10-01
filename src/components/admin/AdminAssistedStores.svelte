<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Button, Input } from '@/components/ui';
  import { Store, ExternalLink, Settings, Package, ShoppingBag, Search } from 'lucide-svelte';
  import { getStoreDirectUrl, getMainDomain } from '@/lib/domain';

  let mainDomain = 'localhost:4321';
  onMount(() => {
    mainDomain = getMainDomain();
  });

  interface AssistedStoreItem {
    id: string;
    name: string;
    subdomain: string;
    status: string;
    userId: string;
    totalWaClicks?: number;
    totalViews?: number;
    tenantName?: string | null;
    tenantEmail?: string | null;
    owner?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
    category?: {
      id: string;
      name: string;
    } | null;
  }

  export let stores: AssistedStoreItem[] = []

  let searchQuery = '';

  $: filteredStores = stores.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const ownerName = (s.tenantName || s.owner?.name || '').toLowerCase();
    const ownerEmail = (s.tenantEmail || s.owner?.email || '').toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.subdomain.toLowerCase().includes(q) ||
      ownerName.includes(q) ||
      ownerEmail.includes(q)
    );
  });
</script>

<div class="space-y-4">
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
    <!-- Header -->
    <div class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Store size={20} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Toko Binaan Saya
            </h3>
            <span class="badge badge-primary badge-outline font-bold text-xs">
              {stores.length} Toko
            </span>
          </div>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Daftar UMKM yang Anda dampingi dan kelola dalam program digitalisasi toko online.
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        {#if stores.length > 0}
          <div class="w-full sm:w-64">
            <Input
              id="search-stores"
              placeholder="Cari toko / tenant..."
              bind:value={searchQuery}
              className="text-xs"
            >
              <span slot="prefix" class="text-muted">
                <Search size={14} />
              </span>
            </Input>
          </div>
        {/if}
      </div>
    </div>

    <!-- Content -->
    {#if stores.length === 0}
      <div class="p-12 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto shadow-2xs">
          <Store size={28} />
        </div>
        <div class="max-w-md mx-auto">
          <h4 class="text-heading-sm font-bold text-main font-heading">Belum Ada Toko Binaan</h4>
          <p class="text-body-xs text-secondary mt-1">
            Anda belum memiliki toko UMKM binaan yang terdaftar. Bantu tenant baru dengan mendaftarkan tokonya melalui sistem.
          </p>
        </div>
      </div>
    {:else if filteredStores.length === 0}
      <div class="p-8 text-center text-secondary text-sm">
        Tidak ditemukan toko yang sesuai dengan kata kunci pencarian "{searchQuery}".
      </div>
    {:else}
      <div class="flex flex-col gap-3 p-4 sm:p-5 bg-card-base/50">
        {#each filteredStores as store (store.userId)}
          <div class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-card-base rounded-2xl border border-light/60 shadow-xs hover:shadow-sm hover:border-light transition-all duration-300">
            <!-- Left: Info -->
            <div class="flex-1 min-w-0 flex items-start gap-4">
              <!-- Avatar / Icon -->
              <div class="w-11 h-11 rounded-2xl bg-nested/50 text-secondary flex items-center justify-center shrink-0 border border-light/50 group-hover:scale-105 transition-transform">
                <Store size={20} strokeWidth={2} class={store.id ? 'text-indigo-600' : 'text-muted'} />
              </div>
              
              <!-- Text Info -->
              <div class="flex flex-col gap-1 w-full">
                <!-- Row 1: Toko Name & Category -->
                <div class="flex flex-wrap items-center gap-2">
                  <div class="font-bold text-main font-heading text-[15px] group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-xs">
                    {store.name || 'Belum Membuat Toko'}
                  </div>
                  {#if store.category?.name}
                    <span class="badge badge-ghost badge-sm text-[10px] font-semibold tracking-wide">
                      {store.category.name}
                    </span>
                  {/if}
                  {#if !store.id}
                    <span class="badge badge-warning badge-outline badge-sm text-[10px] font-bold gap-1 shadow-xs bg-warning/5">
                      Menunggu Setup
                    </span>
                  {/if}
                </div>

                <!-- Row 2: Subdomain -->
                {#if store.subdomain}
                  <a
                    href={getStoreDirectUrl(store.subdomain)}
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-1 text-[11px] text-secondary hover:text-primary transition-colors font-mono"
                  >
                    <span>{store.subdomain}.{mainDomain}</span>
                    <ExternalLink size={10} />
                  </a>
                {/if}

                <!-- Row 3: Tenant Name & Email -->
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[11px] font-medium text-secondary">
                    {store.tenantName || store.owner?.name || 'Tanpa Nama'}
                  </span>
                  <span class="text-[10px] text-muted">•</span>
                  <span class="text-[11px] text-muted font-mono">
                    {store.tenantEmail || store.owner?.email || '-'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right: Status & Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <!-- Status Badge -->
              {#if store.id}
                <div class="shrink-0 w-24">
                  <span class="badge {store.status === 'active' ? 'badge-success' : 'badge-warning'} badge-outline badge-sm text-[10px] font-bold w-full justify-center shadow-xs">
                    <span class="w-1.5 h-1.5 rounded-full mr-1.5 {store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
                    <span>{store.status === 'active' ? 'Aktif' : store.status}</span>
                  </span>
                </div>
              {/if}

              <!-- Actions -->
              <div class="flex items-center justify-end gap-1.5 border-t sm:border-t-0 sm:border-l border-light/60 pt-3 sm:pt-0 sm:pl-6 shrink-0">
                {#if store.id}
                  <Button
                    href={`/dashboard/store-settings?storeId=${store.id}`}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-xl text-secondary hover:bg-nested hover:scale-105 transition-all"
                    title="Pengaturan Toko"
                  >
                    <Settings size={16} />
                  </Button>

                  <Button
                    href={`/dashboard/products?storeId=${store.id}`}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-xl text-secondary hover:bg-nested hover:scale-105 transition-all"
                    title="Kelola Produk Tenant"
                  >
                    <Package size={16} />
                  </Button>
                {/if}

                <Button
                  href={`/templates?tenantId=${store.userId}`}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 rounded-xl font-bold text-xs text-primary hover:bg-primary/10 hover:scale-105 transition-all"
                  title="Beli Template untuk Toko Ini"
                >
                  <ShoppingBag size={14} class="mr-1.5" />
                  Beli Template
                </Button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </Card>
</div>
