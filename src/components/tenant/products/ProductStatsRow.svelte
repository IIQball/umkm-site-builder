<script lang="ts">
  import { StatCard } from "@/components/ui";

  export let totalProducts = 0;
  export let activeProducts = 0;
  export let categoryCount = 0;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {#key totalProducts}
    <StatCard
      label="Total Produk"
      value={totalProducts}
      rawValue={totalProducts}
      icon="shopping_bag"
      cardTheme="dark"
      badge="Katalog"
      footerText="Jumlah produk dibuat"
      delayClass="delay-100"
    />
  {/key}
  {#key activeProducts}
    <StatCard
      label="Produk Aktif"
      value={activeProducts}
      rawValue={activeProducts}
      icon="check_circle"
      cardTheme="default"
      badge="Aktif"
      footerText="Tersedia untuk dijual"
      delayClass="delay-150"
    />
  {/key}
  <StatCard
    label="Stok Terbatas"
    value={0}
    rawValue={0}
    icon="warning"
    cardTheme="orange"
    badge="Perhatian"
    footerText="Produk dengan stok < 5"
    delayClass="delay-200"
  />
  {#key categoryCount}
    <StatCard
      label="Kategori"
      value={categoryCount}
      rawValue={categoryCount}
      icon="layers"
      cardTheme="blue"
      badge="Organisir"
      footerText="Kategori produk toko"
      delayClass="delay-250"
    />
  {/key}
</div>

