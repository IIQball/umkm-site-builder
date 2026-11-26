<script lang="ts">
  import { StatCard } from '@/components/ui';

  export let views: number = 0;
  export let waClicks: number = 0;
  export let conversionRate: string = '0.0';
  export let engagementScore: number = 0;
  export let periodLabel: string = '';

  $: viewsFooter = periodLabel ? `Kunjungan pada ${periodLabel}` : 'Total kunjungan toko';
  $: clicksFooter = periodLabel ? `Interaksi WA (${periodLabel})` : 'Klik hubungi via WhatsApp';
  $: numericConversion = parseFloat(conversionRate) || 0;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    label="Total Views"
    value={views}
    rawValue={views}
    icon="visibility"
    cardTheme="dark"
    badge="Pengunjung"
    footerText={viewsFooter}
    delayClass="delay-100"
  />

  <StatCard
    label="WhatsApp Clicks"
    value={waClicks}
    rawValue={waClicks}
    icon="message"
    cardTheme="default"
    badge="Kontak"
    footerText={clicksFooter}
    delayClass="delay-150"
  />

  <StatCard
    label="Conversion Rate"
    value={`${conversionRate}%`}
    rawValue={numericConversion}
    icon="trending_up"
    cardTheme="blue"
    badge="Metrik"
    footerText="Persentase konversi pengunjung"
    delayClass="delay-200"
  />

  <StatCard
    label="Engagement Score"
    value={engagementScore}
    rawValue={engagementScore}
    icon="poll"
    cardTheme="orange"
    badge="Skor"
    valueSuffix="/ 100"
    footerText="Skor engagement toko"
    delayClass="delay-250"
  />
</div>

