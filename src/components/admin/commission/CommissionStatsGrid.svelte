<script lang="ts">
  import { StatCard } from "@/components/ui";
  import { formatIDR } from "@/lib/currency";

  export let platformFeePercentage: number = 30;
  export let designerShare: number = 70;
  export let adminServiceFee: number = 5000;
  export let settlementDelayDays: number = 7;
  export let maxStoreBranches: number = 5;
  export let samplePrice: number = 100000;
  export let samplePlatformFee: number = 30000;
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
  <!-- 1 Card Full (Hero) di Sisi Kiri (6 Kolom Grid Desktop) -->
  <div class="lg:col-span-6 h-full">
    <div
      class="bg-main text-canvas dark:bg-nested dark:text-white border border-border/80 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-sm transition-all flex flex-col justify-between h-full min-h-[300px] animate-fade-in-up delay-100"
    >
      <!-- Hero Header -->
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-white/70 font-heading">
            Parameter Utama SaaS
          </span>
          <h2 class="text-lg sm:text-xl font-bold font-heading text-white mt-0.5 leading-snug">
            Potongan Fee Platform
          </h2>
        </div>
        <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg icon-filled">percent</span>
        </div>
      </div>

      <!-- Hero Value & Visualization -->
      <div class="my-5 space-y-4">
        <div class="flex items-baseline gap-2">
          <span class="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white leading-none">
            {platformFeePercentage}%
          </span>
          <span class="text-xs font-semibold text-white/60 uppercase tracking-wider">
            dari total transaksi
          </span>
        </div>

        <!-- Ratio Split Bar -->
        <div class="space-y-1.5">
          <div class="h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex p-0.5 gap-0.5">
            <div
              class="h-full bg-primary rounded-full transition-all duration-500"
              style="width: {platformFeePercentage}%"
              title="Kas Platform: {platformFeePercentage}%"
            ></div>
            <div
              class="h-full bg-success/80 rounded-full transition-all duration-500"
              style="width: {designerShare}%"
              title="Hak Kreator: {designerShare}%"
            ></div>
          </div>
          <div class="flex items-center justify-between text-3xs font-mono text-white/70">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              Kas Platform ({platformFeePercentage}%)
            </span>
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
              Kreator ({designerShare}%)
            </span>
          </div>
        </div>

        <!-- Simulation Note -->
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-2xs text-white/80 leading-relaxed font-sans">
          Simulasi penjualan template <strong>{formatIDR(samplePrice)}</strong> menyetor 
          <strong class="text-primary-content bg-primary/40 px-1 py-0.5 rounded font-mono">{formatIDR(samplePlatformFee)}</strong> ke kas platform SaaS.
        </div>
      </div>

      <!-- Hero Footer -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-white/10 text-2xs text-white/70">
        <span class="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white">
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Kas Platform SaaS Aktif</span>
        </span>
        <span class="text-white/60 font-sans">Potongan otomatis per transaksi</span>
      </div>
    </div>
  </div>

  <!-- 4 Sub Cards di Sisi Kanan (6 Kolom Grid Desktop, 2x2 Sub-grid) -->
  <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full">
    <!-- Sub 1: Hak Kreator / Bagian Desainer -->
    <div class="h-full">
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
    </div>

    <!-- Sub 2: Fee Pendampingan Admin -->
    <div class="h-full">
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
    </div>

    <!-- Sub 3: Penahanan Settlement -->
    <div class="h-full">
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
    </div>

    <!-- Sub 4: Maksimal Cabang Toko -->
    <div class="h-full">
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
    </div>
  </div>
</div>
