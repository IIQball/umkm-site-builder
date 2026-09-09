<script lang="ts">
  import { Card, Button, Input } from '@/components/ui';
  import { Store, ExternalLink, Settings, Package, ShoppingBag, Search } from 'lucide-svelte';

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

  export let stores: AssistedStoreItem[] = [];

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
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {stores.length} Toko
            </span>
          </div>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Daftar UMKM yang Anda dampingi dan kelola dalam program digitalisasi toko online.
          </p>
        </div>
      </div>

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
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-light/80 bg-nested/50 text-3xs uppercase tracking-wider font-bold text-secondary">
              <th class="py-3 px-5 sm:px-6">Toko & Subdomain</th>
              <th class="py-3 px-4">Pemilik / Tenant</th>
              <th class="py-3 px-4">Kategori</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-5 sm:px-6 text-right">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-light/60 text-xs">
            {#each filteredStores as store (store.id)}
              <tr class="hover:bg-nested/30 transition-colors group">
                <!-- Store Info -->
                <td class="py-4 px-5 sm:px-6">
                  <div class="font-bold text-main font-heading text-sm group-hover:text-primary transition-colors">
                    {store.name}
                  </div>
                  <a
                    href={`/storefront/${store.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-1 text-3xs text-secondary hover:text-primary transition-colors font-mono mt-0.5"
                  >
                    <span>{store.subdomain}.umkm.id</span>
                    <ExternalLink size={10} />
                  </a>
                </td>

                <!-- Owner Info -->
                <td class="py-4 px-4">
                  <div class="font-semibold text-main">
                    {store.tenantName || store.owner?.name || 'Tanpa Nama'}
                  </div>
                  <div class="text-3xs text-secondary font-mono">
                    {store.tenantEmail || store.owner?.email || '-'}
                  </div>
                </td>

                <!-- Category -->
                <td class="py-4 px-4">
                  {#if store.category?.name}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-semibold bg-nested border border-light text-secondary">
                      {store.category.name}
                    </span>
                  {:else}
                    <span class="text-muted text-3xs">Umum</span>
                  {/if}
                </td>

                <!-- Status -->
                <td class="py-4 px-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-3xs font-bold {store.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                    <span class="w-1.5 h-1.5 rounded-full {store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
                    <span>{store.status === 'active' ? 'Aktif' : store.status}</span>
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-4 px-5 sm:px-6 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <Button
                      href={`/dashboard/store-settings?storeId=${store.id}`}
                      variant="secondary"
                      size="xs"
                      className="rounded-xl font-bold gap-1"
                      title="Pengaturan Toko"
                    >
                      <Settings size={12} />
                      <span>Kelola Toko</span>
                    </Button>

                    <Button
                      href={`/dashboard/products?storeId=${store.id}`}
                      variant="ghost"
                      size="xs"
                      className="rounded-xl font-bold gap-1"
                      title="Kelola Produk Tenant"
                    >
                      <Package size={12} />
                      <span class="hidden md:inline">Produk</span>
                    </Button>

                    <Button
                      href={`/templates?tenantId=${store.userId}`}
                      variant="ghost"
                      size="xs"
                      className="rounded-xl font-bold gap-1 text-primary hover:bg-primary/10"
                      title="Beli Template untuk Toko Ini"
                    >
                      <ShoppingBag size={12} />
                      <span class="hidden lg:inline">Beli Template</span>
                    </Button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </Card>
</div>
