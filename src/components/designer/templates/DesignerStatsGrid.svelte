<script lang="ts">
  import { StatCard } from "@/components/ui";

  export let counts: {
    all: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
  } = {
    all: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  $: approvedPercentage = counts.all > 0 ? Math.round((counts.approved / counts.all) * 100) : 0;
</script>

<!-- Stat Cards Layout (1 Full di Kiri, 4 Sub di Kanan sesuai Frame 1100) -->
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
            Portofolio Desain
          </span>
          <h2 class="text-lg sm:text-xl font-bold font-heading text-white mt-0.5 leading-snug">
            Total Koleksi Template
          </h2>
        </div>
        <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg icon-filled">layers</span>
        </div>
      </div>

      <!-- Hero Value & Visualization -->
      <div class="my-5 space-y-4">
        <div class="flex items-baseline gap-2">
          <span class="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white leading-none">
            {counts.all}
          </span>
          <span class="text-xs font-semibold text-white/60 uppercase tracking-wider">
            desain dibuat
          </span>
        </div>

        <!-- Status Distribution Bar -->
        <div class="space-y-1.5">
          <div class="h-2.5 w-full bg-white/10 rounded-full overflow-hidden flex p-0.5 gap-0.5">
            {#if counts.approved > 0}
              <div
                class="h-full bg-success rounded-full transition-all duration-500"
                style="width: {(counts.approved / counts.all) * 100}%"
                title="Aktif: {counts.approved}"
              ></div>
            {/if}
            {#if counts.pending > 0}
              <div
                class="h-full bg-warning rounded-full transition-all duration-500"
                style="width: {(counts.pending / counts.all) * 100}%"
                title="Review: {counts.pending}"
              ></div>
            {/if}
            {#if counts.draft > 0}
              <div
                class="h-full bg-muted rounded-full transition-all duration-500"
                style="width: {(counts.draft / counts.all) * 100}%"
                title="Draft: {counts.draft}"
              ></div>
            {/if}
            {#if counts.rejected > 0}
              <div
                class="h-full bg-error rounded-full transition-all duration-500"
                style="width: {(counts.rejected / counts.all) * 100}%"
                title="Ditolak: {counts.rejected}"
              ></div>
            {/if}
          </div>
          <div class="flex items-center justify-between text-xs font-mono text-white/70">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
              {counts.approved} Aktif ({approvedPercentage}%)
            </span>
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-error inline-block"></span>
              {counts.rejected} Ditolak
            </span>
          </div>
        </div>

        <!-- Summary Note -->
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-2xs text-white/80 leading-relaxed font-sans">
          Koleksi aktif tayang di marketplace untuk UMKM. Perbaiki template ditolak agar dapat dipublikasikan kembali.
        </div>
      </div>

      <!-- Hero Footer -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-white/10 text-2xs text-white/70">
        <span class="inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white">
          <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
          <span>Kreator Terverifikasi</span>
        </span>
        <span class="text-white/60 font-sans">{counts.draft + counts.rejected} perlu tindakan</span>
      </div>
    </div>
  </div>

  <!-- 4 Sub Cards di Sisi Kanan (6 Kolom Grid Desktop, 2x2 Sub-grid) -->
  <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full">
    <!-- Sub 1: Disetujui -->
    <div class="h-full">
      <StatCard
        label="Disetujui"
        value={counts.approved}
        rawValue={counts.approved}
        icon="check_circle"
        cardTheme="default"
        badge="Aktif"
        footerText="Tersedia di katalog publik"
        delayClass="delay-150"
      />
    </div>

    <!-- Sub 2: Menunggu Review -->
    <div class="h-full">
      <StatCard
        label="Menunggu Review"
        value={counts.pending}
        rawValue={counts.pending}
        icon="hourglass_top"
        cardTheme="blue"
        badge="Kurasi Admin"
        footerText="Sedang diperiksa tim kurator"
        delayClass="delay-200"
      />
    </div>

    <!-- Sub 3: Draft Desain -->
    <div class="h-full">
      <StatCard
        label="Draft Desain"
        value={counts.draft}
        rawValue={counts.draft}
        icon="edit_note"
        cardTheme="orange"
        badge="Draf"
        footerText="Belum diajukan kurasi"
        delayClass="delay-250"
      />
    </div>

    <!-- Sub 4: Ditolak -->
    <div class="h-full">
      <StatCard
        label="Ditolak"
        value={counts.rejected}
        rawValue={counts.rejected}
        icon="cancel"
        cardTheme="default"
        badge="Ditolak"
        badgeCls="!bg-error/10 !text-error !border-error/20"
        iconCls="text-error"
        description="Perlu Perbaikan"
        delayClass="delay-300"
      />
    </div>
  </div>
</div>
