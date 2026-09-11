<script lang="ts">
  import StatCard from '../ui/StatCard.svelte';
  import { formatIDR } from '@/lib/utils/format';

  export let totalNetIncome: number;
  export let totalTemplatesSold: number;

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

<div class="flex flex-col gap-6 h-full justify-between">
  <div class="flex-1">
    <StatCard {...incomeCard} />
  </div>
  <div class="flex-1">
    <StatCard {...soldCard} />
  </div>
</div>
