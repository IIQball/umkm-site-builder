<script lang="ts">
  import StatCard from '../ui/StatCard.svelte';
  import { formatIDR } from '@/lib/utils/format';

  export let balance: number;
  export let availableBalance: number;
  export let totalNetIncome: number;
  export let totalTemplatesSold: number;
  export let settlementDelayDays = 7;

  $: pendingSettlement = Math.max(0, balance - availableBalance);

  $: cards = [
    {
      label: 'Total Saldo',
      value: formatIDR(balance),
      badge: pendingSettlement > 0 ? 'Menunggu Masa Hold' : 'Siap Ditarik',
      badgeCls: pendingSettlement > 0 ? 'badge-custom-warning' : 'badge-custom-emerald',
      iconCls: 'icon-wrapper-indigo',
      icon: 'account_balance_wallet',
      borderAccent: 'border-t-2 border-t-indigo-400',
    },
    {
      label: 'Saldo Siap Tarik',
      value: formatIDR(availableBalance),
      badge: availableBalance > 0 ? 'Siap Ditarik' : 'Saldo Nihil',
      badgeCls: availableBalance > 0 ? 'badge-custom-emerald' : 'badge-custom-sky',
      iconCls: 'icon-wrapper-emerald',
      icon: 'check_circle',
      borderAccent: 'border-t-2 border-t-emerald-400',
    },
    {
      label: 'Dana Mengendap',
      value: formatIDR(pendingSettlement),
      badge: pendingSettlement > 0 ? `Hold ${settlementDelayDays} Hari` : 'Nihil',
      badgeCls: pendingSettlement > 0 ? 'badge-custom-warning' : 'badge-custom-sky',
      iconCls: 'icon-wrapper-indigo',
      icon: 'hourglass_empty',
      borderAccent: 'border-t-2 border-t-amber-400',
      description: pendingSettlement > 0 ? `Dana hasil transaksi belum melewati batas waktu penahanan (${settlementDelayDays} hari) sesuai kebijakan.` : '',
    },
    {
      label: 'Total Pendapatan Bersih',
      value: formatIDR(totalNetIncome),
      badge: '80% Bagian Bersih',
      badgeCls: 'badge-custom-violet',
      iconCls: 'icon-wrapper-emerald',
      icon: 'payments',
      borderAccent: 'border-t-2 border-t-violet-400',
    },
    {
      label: 'Total Template Terjual',
      value: `${totalTemplatesSold}`,
      badge: 'Unit Terjual',
      badgeCls: 'badge-custom-sky',
      iconCls: 'icon-wrapper-violet',
      icon: 'sell',
      borderAccent: 'border-t-2 border-t-sky-400',
      valueSuffix: 'Template',
    },
  ];
</script>

<div class="space-y-4">
  <!-- Row 1: Wallet status cards (Total Saldo, Saldo Siap Tarik, Dana Mengendap) -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each cards.slice(0, 3) as card}
      <StatCard {...card} />
    {/each}
  </div>

  <!-- Row 2: Performance stats (Total Pendapatan Bersih, Total Template Terjual) -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each cards.slice(3) as card}
      <StatCard {...card} />
    {/each}
  </div>
</div>
