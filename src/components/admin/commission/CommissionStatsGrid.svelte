<script lang="ts">
  import { StatCard } from "@/components/ui";
  import { formatIDR } from "@/lib/currency";

  export let platformFeePercentage: number = 30;
  export let designerShare: number = 70;
  export let adminServiceFee: number = 5000;
  export let settlementDelayDays: number = 7;
  export let maxStoreBranches: number = 5;
  export let maxTemplateRevisions: number = 3;
  export let samplePrice: number = 100000;
  export let samplePlatformFee: number = 30000;
</script>

<!-- 6 Stat Cards Layout (3 Kolom x 2 Baris sesuai Frame 1101) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <!-- Card 1: Potongan Fee Platform -->
  <StatCard
    label="Potongan Fee Platform"
    value="{platformFeePercentage}%"
    rawValue={platformFeePercentage}
    icon="percent"
    cardTheme="dark"
    badge="Kas Platform"
    footerText="Potongan otomatis per transaksi ({formatIDR(samplePlatformFee)} / {formatIDR(samplePrice)})"
    delayClass="delay-100"
  />

  <!-- Card 2: Bagian Desainer -->
  <StatCard
    label="Bagian Desainer"
    value="{designerShare}%"
    rawValue={designerShare}
    icon="brush"
    cardTheme="default"
    badge="Hak Desainer"
    footerText="Masuk langsung ke dompet kreator"
    delayClass="delay-150"
  />

  <!-- Card 3: Fee Pendamping Admin -->
  <StatCard
    label="Fee Pendamping Admin"
    value={formatIDR(Number(adminServiceFee || 0))}
    rawValue={adminServiceFee}
    icon="support_agent"
    cardTheme="blue"
    badge="Jasa Pendamping"
    footerText="Biaya bantuan transaksi tenant"
    delayClass="delay-200"
  />

  <!-- Card 4: Penahanan Settlement -->
  <StatCard
    label="Penahanan Settlement"
    value="{settlementDelayDays} Hari"
    rawValue={settlementDelayDays}
    icon="hourglass_top"
    cardTheme="orange"
    badge="Proteksi Fraud"
    footerText="Jeda saldo sebelum withdrawal"
    delayClass="delay-250"
  />

  <!-- Card 5: Maks Cabang Toko -->
  <StatCard
    label="Maks Cabang Toko"
    value="{maxStoreBranches} Cabang"
    rawValue={maxStoreBranches}
    icon="store"
    cardTheme="default"
    badge="Multi Cabang"
    footerText="Batas cabang onboarding & builder"
    delayClass="delay-300"
  />

  <!-- Card 6: Batas Revisi Template -->
  <StatCard
    label="Batas Revisi Template"
    value="{maxTemplateRevisions} Kali"
    rawValue={maxTemplateRevisions}
    icon="history_edu"
    cardTheme="default"
    badge="Batas Kurasi"
    footerText="Maksimal pengajuan revisi desain"
    delayClass="delay-350"
  />
</div>
