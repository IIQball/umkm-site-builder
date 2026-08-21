<script lang="ts">
  import StatCard from './StatCard.svelte';
  import { formatIDR } from '@/lib/utils/format';

  export let balance: number;
  export let totalNetIncome: number;
  export let totalTemplatesSold: number;

  $: cards = [
    {
      label: 'Saldo Aktif',
      value: formatIDR(balance),
      badge: '+ Siap Tarik',
      badgeCls: 'badge-custom-emerald',
      iconCls: 'icon-wrapper-indigo',
      icon: 'account_balance_wallet',
      borderAccent: 'border-t-2 border-t-indigo-400',
    },
    {
      label: 'Total Pendapatan Bersih',
      value: formatIDR(totalNetIncome),
      badge: '80% Bagian Bersih',
      badgeCls: 'badge-custom-violet',
      iconCls: 'icon-wrapper-emerald',
      icon: 'payments',
      borderAccent: 'border-t-2 border-t-emerald-400',
    },
    {
      label: 'Total Template Terjual',
      value: `${totalTemplatesSold}`,
      badge: 'Unit Terjual',
      badgeCls: 'badge-custom-sky',
      iconCls: 'icon-wrapper-violet',
      icon: 'sell',
      borderAccent: 'border-t-2 border-t-violet-400',
      valueSuffix: 'Template',
    },
  ];
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  {#each cards as card}
    <StatCard {...card} />
  {/each}
</div>

