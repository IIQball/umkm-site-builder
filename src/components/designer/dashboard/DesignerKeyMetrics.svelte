<script lang="ts">
  import { StatCard } from '@/components/ui';
  import { formatSmartIDR } from '@/lib/currency';

  export let totalTemplatesCount = 0;
  export let activeTemplatesCount = 0;
  export let draftTemplatesCount = 0;
  export let reviewTemplatesCount = 0;
  export let totalSalesCount = 0;
  export let totalNetIncome = 0;
  export let availableBalance = 0;

  $: templateBreakdown = `${activeTemplatesCount} Publik · ${draftTemplatesCount} Draft · ${reviewTemplatesCount} Review`;
  $: formattedTotalIncome = formatSmartIDR(totalNetIncome);
  $: formattedBalance = formatSmartIDR(availableBalance);
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    label="Total Template Dibuat"
    value={totalTemplatesCount}
    rawValue={totalTemplatesCount}
    icon="palette"
    cardTheme="dark"
    badge={totalTemplatesCount > 0 ? `${activeTemplatesCount} Publik` : "Nihil"}
    footerText={templateBreakdown}
    delayClass="delay-100"
  />

  <StatCard
    label="Template Terjual"
    value={totalSalesCount}
    rawValue={totalSalesCount}
    icon="shopping_bag"
    cardTheme="default"
    badge={totalSalesCount > 0 ? "Terjual" : "Belum Ada"}
    footerText="Total pembelian oleh merchant"
    delayClass="delay-150"
  />

  <StatCard
    label="Total Pendapatan Bersih"
    value={formattedTotalIncome}
    rawValue={totalNetIncome}
    icon="payments"
    cardTheme="blue"
    badge="Komisi 70%"
    footerText="Akumulasi komisi penjualan"
    delayClass="delay-200"
  />

  <StatCard
    label="Saldo Siap Tarik"
    value={formattedBalance}
    rawValue={availableBalance}
    icon="account_balance_wallet"
    cardTheme="orange"
    badge="Dompet"
    footerText="Tersedia dicairkan ke bank"
    delayClass="delay-250"
  />
</div>
