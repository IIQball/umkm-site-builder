<script lang="ts">
  import { StatCard } from '@/components/ui';
  import type { BugReportStatusCounts } from './bugReports.helpers';

  export let counts: BugReportStatusCounts;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
  <StatCard
    label="Total Laporan"
    value={counts.all}
    rawValue={counts.all}
    icon="bug_report"
    cardTheme="dark"
    badge="Tercatat"
    footerText="Seluruh laporan bug masuk"
    delayClass="delay-100"
  />
  <StatCard
    label="Selesai"
    value={counts.resolved}
    rawValue={counts.resolved}
    icon="check_circle"
    cardTheme="default"
    badge="Tuntas"
    footerText="Kendala telah diperbaiki"
    delayClass="delay-150"
  />
  <StatCard
    label="Sedang Diproses"
    value={counts.in_progress}
    rawValue={counts.in_progress}
    icon="hourglass_top"
    cardTheme="blue"
    badge="Investigasi"
    footerText="Dalam penanganan tim teknis"
    delayClass="delay-200"
  />
  <StatCard
    label="Belum Ditangani"
    value={counts.unresolved}
    rawValue={counts.unresolved}
    icon="error"
    cardTheme="orange"
    badge="Antrean"
    footerText="Memerlukan tindak lanjut segera"
    delayClass="delay-250"
  />
</div>

