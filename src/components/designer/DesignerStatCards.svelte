<script lang="ts">
  import { StatCard } from "@/components/ui";
  import { formatSmartIDR } from "@/lib/currency";

  export let balance: number;
  export let availableBalance: number;
  export let settlementDelayDays = 7;
  export let accountType: 'designer' | 'admin' = 'designer';
  export let totalEarnedCommission = 0;

  type CardTheme = "default" | "dark" | "orange" | "blue";

  $: pendingSettlement = Math.max(0, balance - availableBalance);

  $: commissionCard = {
    label: "Total Komisi Didapat",
    value: formatSmartIDR(totalEarnedCommission),
    rawValue: totalEarnedCommission,
    badge: "Lifetime Earning",
    icon: "payments",
    cardTheme: "dark" as CardTheme,
    footerText: "Akumulasi fee pendampingan",
    delayClass: "delay-100",
  };

  $: heroCard = {
    label: "Total Saldo Dompet",
    value: formatSmartIDR(balance),
    rawValue: balance,
    badge: pendingSettlement > 0 ? "Ada Dana Hold" : "Siap Ditarik",
    icon: "account_balance_wallet",
    cardTheme: (accountType === 'admin' ? "default" : "dark") as CardTheme,
    footerText: accountType === 'admin' ? "Saldo aktif akun admin" : "Saldo aktif akun desainer",
    delayClass: accountType === 'admin' ? "delay-150" : "delay-100",
  };

  $: readyCard = {
    label: "Saldo Siap Tarik",
    value: formatSmartIDR(availableBalance),
    rawValue: availableBalance,
    badge: availableBalance > 0 ? "Siap Cair" : "Saldo Nihil",
    icon: "check_circle",
    cardTheme: (accountType === 'admin' ? "blue" : "default") as CardTheme,
    footerText: "Dapat dicairkan ke bank",
    delayClass: accountType === 'admin' ? "delay-200" : "delay-150",
  };

  $: holdCard = {
    label: "Dana Mengendap",
    value: formatSmartIDR(pendingSettlement),
    rawValue: pendingSettlement,
    badge:
      pendingSettlement > 0 ? `Hold ${settlementDelayDays || 0} Hari` : "Nihil",
    icon: "hourglass_top",
    cardTheme: (accountType === 'admin' ? "orange" : "blue") as CardTheme,
    footerText: `Masa hold ${settlementDelayDays || 0} hari`,
    delayClass: accountType === 'admin' ? "delay-250" : "delay-200",
  };
</script>

{#if accountType === 'admin'}
  <!-- Row 1: 4 Statcards Seragam (dark, default, blue, orange) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="w-full">
      <StatCard {...commissionCard} />
    </div>
    <div class="w-full">
      <StatCard {...heroCard} />
    </div>
    <div class="w-full">
      <StatCard {...readyCard} />
    </div>
    <div class="w-full">
      <StatCard {...holdCard} />
    </div>
  </div>
{:else}
  <!-- Row 1: Saldo Status Cards (3-col responsive grid for designer) -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="w-full">
      <StatCard {...heroCard} />
    </div>
    <div class="w-full">
      <StatCard {...readyCard} />
    </div>
    <div class="w-full md:col-span-2 lg:col-span-1">
      <StatCard {...holdCard} />
    </div>
  </div>
{/if}
