<script lang="ts">
  import { StatCard } from '@/components/ui';
  import { formatSmartIDR } from '@/lib/currency';

  export let totalMerchantsCount = 0;
  export let activeStoresCount = 0;
  export let needsSetupCount = 0;
  export let totalEarnedCommission = 0;
  export let availableBalance = 0;

  $: activeBreakdown = `${activeStoresCount} Aktif · ${needsSetupCount} Belum Setup`;
  $: formattedTotalCommission = formatSmartIDR(totalEarnedCommission);
  $: formattedBalance = formatSmartIDR(availableBalance);
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    label="Total Merchant Binaan"
    value={totalMerchantsCount}
    rawValue={totalMerchantsCount}
    icon="groups"
    cardTheme="dark"
    badge={totalMerchantsCount > 0 ? "Binaan" : "Nihil"}
    footerText={activeBreakdown}
    delayClass="delay-100"
  />

  <StatCard
    label="Total Komisi Didapat"
    value={formattedTotalCommission}
    rawValue={totalEarnedCommission}
    icon="payments"
    cardTheme="default"
    badge="Lifetime Earning"
    footerText="Akumulasi fee pendampingan"
    delayClass="delay-150"
  />

  <StatCard
    label="Saldo Siap Tarik"
    value={formattedBalance}
    rawValue={availableBalance}
    icon="account_balance_wallet"
    cardTheme="blue"
    badge="Dompet"
    footerText="Tersedia dicairkan ke bank"
    delayClass="delay-200"
  />

  <StatCard
    label="Butuh Bantuan Setup"
    value={needsSetupCount}
    rawValue={needsSetupCount}
    icon="support_agent"
    cardTheme="orange"
    badge={needsSetupCount > 0 ? "Prioritas" : "Optimal"}
    footerText={needsSetupCount > 0 ? "Merchant belum memiliki toko" : "Semua merchant telah memiliki toko"}
    delayClass="delay-250"
  />
</div>
