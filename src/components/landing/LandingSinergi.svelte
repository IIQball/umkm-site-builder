<script lang="ts">
  import { TrendingUp, Users, Store, MapPin, BarChart3, Award, ShieldCheck, Database, ExternalLink, Sparkles } from 'lucide-svelte';
  import { BANYUWANGI_POPULAR_DISTRICTS } from '@/components/directory/directoryDistricts';
  import { reveal } from './scrollReveal';

  const STATS = [
    { icon: Store, label: 'UMKM Terdaftar', value: '12,847', color: 'var(--lp-cyan)', desc: 'Total usaha lokal' },
    { icon: Users, label: 'Pelaku Usaha Aktif', value: '8,234', color: 'var(--lp-purple)', desc: 'Aktif berjualan' },
    { icon: MapPin, label: 'Kecamatan Tercakup', value: '25', color: 'var(--lp-magenta)', desc: '100% Wilayah BWI' },
    { icon: TrendingUp, label: 'Pertumbuhan Digital', value: '+42%', color: 'var(--lp-amber)', desc: 'Tahun 2024-2025' },
  ];

  const DASHBOARD_BARS = [
    { label: 'Jan', h: 42, count: '6.2k' },
    { label: 'Feb', h: 52, count: '7.1k' },
    { label: 'Mar', h: 48, count: '7.8k' },
    { label: 'Apr', h: 68, count: '9.2k' },
    { label: 'Mei', h: 62, count: '10.1k' },
    { label: 'Jun', h: 78, count: '11.4k' },
    { label: 'Jul', h: 84, count: '12.0k' },
    { label: 'Agu', h: 96, count: '12.8k' },
  ];
</script>

<section id="sinergi" class="relative py-24 sm:py-32 px-4 overflow-hidden">
  <!-- Topography Background Asset with Opacity -->
  <div class="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay" aria-hidden="true">
    <img src="/landing/topo-bg.jpg" alt="" class="w-full h-full object-cover" />
  </div>

  <div class="relative max-w-6xl mx-auto z-10">
    <!-- Header -->
    <div use:reveal class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--lp-magenta)]/30 bg-[var(--lp-magenta)]/10 text-[var(--lp-magenta)] text-xs font-bold mb-3">
        <Sparkles size={13} />
        <span>Sinergi Pemkab Banyuwangi</span>
      </div>
      <h2 class="text-heading-lg text-white mt-1">
        Integration & Satu Data UMKM
      </h2>
      <p class="text-body-base text-[var(--lp-text-secondary)] mt-3 max-w-2xl mx-auto leading-relaxed">
        Terintegrasi dengan ekosistem data Pemerintah Kabupaten Banyuwangi. Mendukung pembuatan kebijakan berbasis data dan kemudahan perizinan usaha.
      </p>
    </div>

    <!-- Stat Cards 4-grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {#each STATS as stat, i}
        <div
          use:reveal={{ delay: 100 + i * 60 }}
          class="group p-5 rounded-3xl border border-[var(--lp-card-border)] bg-[var(--lp-card)] backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style="background: {stat.color}15; color: {stat.color};">
              <svelte:component this={stat.icon} size={20} />
            </div>
            <span class="text-3xs text-[var(--lp-text-muted)] font-mono">{stat.desc}</span>
          </div>

          <div class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight" style="font-family: var(--font-heading);">
            {stat.value}
          </div>
          <div class="text-xs text-[var(--lp-text-secondary)] font-semibold mt-1">
            {stat.label}
          </div>
        </div>
      {/each}
    </div>

    <!-- Dashboard Analytics & Top Districts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left (7-col): Interactive Growth Chart Mockup -->
      <div use:reveal={{ delay: 200 }} class="lg:col-span-7 rounded-3xl border border-[var(--lp-card-border)] bg-[var(--lp-card)] backdrop-blur-xl p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-[var(--lp-cyan)]/15 text-[var(--lp-cyan)] flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Tren Pertumbuhan UMKM Digital</h3>
                <p class="text-3xs text-[var(--lp-text-muted)]">Data Aktual Kabupaten Banyuwangi</p>
              </div>
            </div>

            <div class="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <TrendingUp size={14} />
              <span>+42% YoY</span>
            </div>
          </div>

          <!-- Bar Chart Visualization -->
          <div class="flex items-end justify-between gap-3 h-48 pt-6 pb-2 px-2 border-b border-white/5">
            {#each DASHBOARD_BARS as bar, i}
              <div class="flex-1 flex flex-col items-center gap-2 group/bar">
                <div class="text-4xs text-[var(--lp-text-muted)] group-hover/bar:text-white transition-colors font-mono opacity-0 group-hover/bar:opacity-100">
                  {bar.count}
                </div>
                <div class="w-full relative flex items-end h-full">
                  <div
                    class="w-full rounded-t-xl transition-all duration-700 ease-out group-hover/bar:brightness-125 animate-bar-grow"
                    style="height: {bar.h}%; background: linear-gradient(to top, var(--lp-cyan), var(--lp-purple)); animation-delay: {i * 100}ms;"
                  ></div>
                </div>
                <span class="text-3xs font-semibold text-[var(--lp-text-muted)] group-hover/bar:text-[var(--lp-cyan)] transition-colors">{bar.label}</span>
              </div>
            {/each}
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between text-xs text-[var(--lp-text-muted)]">
          <div class="flex items-center gap-2">
            <Database size={14} class="text-[var(--lp-cyan)]" />
            <span>Terhubung API Satu Data Banyuwangi</span>
          </div>
          <span class="font-mono text-3xs">Updated 2025</span>
        </div>
      </div>

      <!-- Right (5-col): Top Districts Ranking -->
      <div use:reveal={{ delay: 250 }} class="lg:col-span-5 rounded-3xl border border-[var(--lp-card-border)] bg-[var(--lp-card)] backdrop-blur-xl p-6">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2">
            <Award size={18} class="text-[var(--lp-amber)]" />
            <h3 class="text-sm font-bold text-white">Top Kecamatan Digital</h3>
          </div>
          <span class="text-3xs font-bold text-[var(--lp-text-muted)] uppercase tracking-wider">Aktivitas UMKM</span>
        </div>

        <div class="space-y-3.5">
          {#each BANYUWANGI_POPULAR_DISTRICTS as district, i}
            <div class="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/5">
              <span
                class="w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0"
                style="background: {i < 3 ? 'var(--lp-amber)' : 'rgba(255,255,255,0.05)'}; color: {i < 3 ? '#0E131F' : 'var(--lp-text-muted)'};"
              >
                {i + 1}
              </span>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold text-white truncate">{district.name}</span>
                  <span class="text-3xs font-mono text-[var(--lp-cyan)]">{920 - i * 110} UMKM</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-700"
                    style="width: {92 - i * 11}%; background: linear-gradient(to right, var(--lp-cyan), var(--lp-purple));"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <div class="mt-5 pt-4 border-t border-white/5 text-center">
          <a
            href="/umkm"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--lp-cyan)] hover:underline cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Lihat Semua Data Kecamatan</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
