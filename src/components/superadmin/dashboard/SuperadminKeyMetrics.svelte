<script lang="ts">
  import { StatCard } from '@/components/ui';
  import { formatSmartIDR } from '@/lib/currency';

  export let totalRevenue: number = 0;
  export let totalVolume: number = 0;
  export let totalUsers: number = 0;
  export let pendingTemplatesCount: number = 0;

  $: formattedRevenue = formatSmartIDR(totalRevenue);
  $: formattedVolume = formatSmartIDR(totalVolume);

  $: revenueCard = {
    label: 'Pendapatan Fee Platform',
    value: formattedRevenue,
    rawValue: totalRevenue,
    badge: 'Fee Bersih',
    icon: 'account_balance_wallet',
    cardTheme: 'dark' as const,
    footerText: `Gross Volume: ${formattedVolume}`,
    delayClass: 'delay-100',
  };

  $: volumeCard = {
    label: 'Total Perputaran Omzet',
    value: formattedVolume,
    rawValue: totalVolume,
    badge: 'Gross Volume',
    icon: 'payments',
    cardTheme: 'orange' as const,
    footerText: 'Total omzet transaksi platform',
    delayClass: 'delay-150',
  };

  $: userCard = {
    label: 'Pengguna Terdaftar',
    value: `${totalUsers}`,
    rawValue: totalUsers,
    badge: 'Seluruh Sistem',
    icon: 'group',
    cardTheme: 'blue' as const,
    footerText: 'Merchants, Desainer & Admin',
    delayClass: 'delay-200',
  };

  $: templateCard = {
    label: 'Kurasi Template Pending',
    value: `${pendingTemplatesCount}`,
    rawValue: pendingTemplatesCount,
    badge: pendingTemplatesCount > 0 ? 'Perlu Review' : 'Terkurasi',
    icon: 'palette',
    cardTheme: 'default' as const,
    footerText: 'Antrean verifikasi template',
    delayClass: 'delay-250',
  };
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  <div class="w-full h-full">
    <StatCard {...revenueCard} />
  </div>
  <div class="w-full h-full">
    <StatCard {...volumeCard} />
  </div>
  <div class="w-full h-full">
    <StatCard {...userCard} />
  </div>
  <div class="w-full h-full">
    <StatCard {...templateCard} />
  </div>
</div>
