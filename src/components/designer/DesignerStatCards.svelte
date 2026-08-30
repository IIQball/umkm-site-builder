<script lang="ts">
  import StatCard from '../ui/StatCard.svelte';
  import { formatIDR } from '@/lib/utils/format';

  export let balance: number;
  export let availableBalance: number;
  export let totalNetIncome: number;
  export let totalTemplatesSold: number;
  export let settlementDelayDays = 7;

  $: pendingSettlement = Math.max(0, balance - availableBalance);

  $: heroCard = {
    label: 'Total Saldo Dompet',
    value: formatIDR(balance),
    rawValue: balance,
    badge: pendingSettlement > 0 ? 'Ada Dana Hold' : 'Siap Ditarik',
    icon: 'account_balance_wallet',
    cardTheme: 'dark' as const,
    footerText: 'Saldo aktif akun desainer',
    delayClass: 'delay-100',
  };

  $: readyCard = {
    label: 'Saldo Siap Tarik',
    value: formatIDR(availableBalance),
    rawValue: availableBalance,
    badge: availableBalance > 0 ? 'Siap Cair' : 'Saldo Nihil',
    icon: 'check_circle',
    cardTheme: 'orange' as const,
    footerText: 'Dapat dicairkan ke bank',
    delayClass: 'delay-150',
  };

  $: holdCard = {
    label: 'Dana Mengendap',
    value: formatIDR(pendingSettlement),
    rawValue: pendingSettlement,
    badge: pendingSettlement > 0 ? `Hold ${settlementDelayDays || 0} Hari` : 'Nihil',
    icon: 'hourglass_top',
    cardTheme: 'default' as const,
    footerText: `Masa hold ${settlementDelayDays || 0} hari`,
    delayClass: 'delay-200',
  };

  $: incomeCard = {
    label: 'Total Pendapatan Bersih',
    value: formatIDR(totalNetIncome),
    rawValue: totalNetIncome,
    badge: 'Sepanjang Waktu',
    icon: 'payments',
    cardTheme: 'blue' as const,
    footerText: 'Akumulasi seluruh komisi',
    delayClass: 'delay-250',
  };

  $: soldCard = {
    label: 'Total Template Terjual',
    value: `${totalTemplatesSold}`,
    rawValue: totalTemplatesSold,
    badge: 'Unit Terjual',
    icon: 'sell',
    valueSuffix: 'Template',
    cardTheme: 'default' as const,
    footerText: 'Total transaksi sukses',
    delayClass: 'delay-300',
  };
</script>

<div class="space-y-6">
  <!-- Row 1: Saldo Status Cards (Spacious 3-col grid with Hero Card, never cuts off long numbers) -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <div class="w-full">
      <StatCard {...heroCard} />
    </div>
    <div class="w-full">
      <StatCard {...readyCard} />
    </div>
    <div class="w-full md:col-span-2 xl:col-span-1">
      <StatCard {...holdCard} />
    </div>
  </div>

  <!-- Row 2: Performance Stats (Spacious 2-col grid) -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="w-full">
      <StatCard {...incomeCard} />
    </div>
    <div class="w-full">
      <StatCard {...soldCard} />
    </div>
  </div>
</div>
