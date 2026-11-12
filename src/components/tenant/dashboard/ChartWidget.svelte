<script lang="ts">
  import MerchantOverviewDashboard from './MerchantOverviewDashboard.svelte';
  import type { TrafficPoint } from './chartWidget.helpers';

  export let allHistory: TrafficPoint[] = [];
  export let userCreatedYear: number = new Date().getFullYear();
  export let totalViews: number = 0;
  export let totalClicks: number = 0;
  export let isOnboarded: boolean = true;
  export let initialPoints: TrafficPoint[] = [];
  export let initialFailed: boolean = false;
  void initialFailed;

  $: effectiveHistory = (allHistory && allHistory.length > 0) ? allHistory : initialPoints;
</script>

<MerchantOverviewDashboard
  allHistory={effectiveHistory}
  {userCreatedYear}
  {totalViews}
  {totalClicks}
  {isOnboarded}
/>
