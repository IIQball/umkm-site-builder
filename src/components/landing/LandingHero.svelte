<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, MapPin, ArrowRight, Sparkles, Building2, Store, ShoppingBag } from 'lucide-svelte';
  import { BANYUWANGI_POPULAR_DISTRICTS } from '@/components/directory/directoryDistricts';
  import { reveal } from './scrollReveal';

  let searchQuery = '';
  let showSuggestions = false;

  // Parallax offsets on mouse move
  let mouseX = 0;
  let mouseY = 0;

  const handleMouseMove = (e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    mouseX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    mouseY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
  };

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  $: filtered = searchQuery.length > 0
    ? BANYUWANGI_POPULAR_DISTRICTS.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : BANYUWANGI_POPULAR_DISTRICTS;

  const selectDistrict = (name: string) => {
    searchQuery = name;
    showSuggestions = false;
  };
</script>

<section class="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-20 px-4">
  <!-- Topography Background Asset with Overlay -->
  <div class="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay" aria-hidden="true">
    <img src="/landing/topo-bg.jpg" alt="" class="w-full h-full object-cover" />
  </div>

  <!-- Ambient Glow Orbs -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div
      class="absolute top-1/4 left-1/6 w-[600px] h-[600px] rounded-full opacity-25 blur-[140px] lp-pulse-glow"
      style="background: var(--lp-cyan); transform: translate({mouseX * -20}px, {mouseY * -20}px);"
    ></div>
    <div
      class="absolute bottom-1/4 right-1/6 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] lp-pulse-glow"
      style="background: var(--lp-purple); animation-delay: 2s; transform: translate({mouseX * 25}px, {mouseY * 25}px);"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full opacity-15 blur-[100px]"
      style="background: var(--lp-magenta);"
    ></div>
  </div>

  <div class="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <!-- Left Column: Copy & Search -->
    <div class="lg:col-span-7 text-center lg:text-left space-y-7">
      <div use:reveal={{ delay: 50 }}>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--lp-cyan)]/30 bg-[var(--lp-cyan)]/10 text-[var(--lp-cyan)] text-xs font-bold shadow-lg shadow-[var(--lp-cyan)]/10">
          <Sparkles size={14} class="animate-pulse" />
          <span>Inisiatif Digitalisasi UMKM Banyuwangi</span>
        </div>
      </div>

      <h1 use:reveal={{ delay: 100 }} class="text-heading-xl text-white tracking-tight">
        Temukan yang Menarik di Sekitarmu.
        <br />
        <span class="bg-gradient-to-r from-[var(--lp-cyan)] via-[var(--lp-purple)] to-[var(--lp-magenta)] bg-clip-text text-transparent">
          Bangun Website Usahamu Tanpa Koding.
        </span>
      </h1>

      <p use:reveal={{ delay: 150 }} class="text-body-base text-[var(--lp-text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
        Kawasan Digital Warga — platform gratis untuk UMKM Banyuwangi. Temukan UMKM terdekat, buat toko online WhatsApp instan, dan terintegrasi langsung dengan ekosistem Pemkab.
      </p>

      <!-- Search Input with Dropdown -->
      <div use:reveal={{ delay: 200 }} class="relative max-w-lg mx-auto lg:mx-0">
        <div class="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] backdrop-blur-xl shadow-2xl transition-all focus-within:border-[var(--lp-cyan)]/50 focus-within:shadow-[var(--lp-cyan)]/15">
          <div class="w-10 h-10 rounded-xl bg-[var(--lp-cyan)]/10 text-[var(--lp-cyan)] flex items-center justify-center shrink-0">
            <Search size={18} />
          </div>
          <input
            type="text"
            bind:value={searchQuery}
            on:focus={() => (showSuggestions = true)}
            on:blur={() => setTimeout(() => (showSuggestions = false), 200)}
            placeholder="Cari kecamatan... (Genteng, Rogojampi, Songgon...)"
            class="flex-1 bg-transparent text-sm text-white placeholder:text-[var(--lp-text-muted)] outline-none border-none px-1"
          />
          <button
            type="button"
            on:click={() => (showSuggestions = !showSuggestions)}
            class="p-2 text-[var(--lp-text-muted)] hover:text-[var(--lp-cyan)] transition-colors cursor-pointer"
            aria-label="Filter Kecamatan"
          >
            <MapPin size={18} />
          </button>
        </div>

        {#if showSuggestions && filtered.length > 0}
          <div class="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-[var(--lp-glass-border)] bg-[#0E131F]/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-30 max-h-64 overflow-y-auto lp-slide-up">
            <div class="p-2 border-b border-white/5 text-3xs font-bold text-[var(--lp-text-muted)] uppercase tracking-wider px-3">
              Kecamatan di Banyuwangi
            </div>
            {#each filtered as district}
              <button
                type="button"
                on:mousedown={() => selectDistrict(district.name)}
                class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div class="flex items-center gap-3">
                  <MapPin size={14} class="text-[var(--lp-cyan)] group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <span class="text-sm font-semibold text-white group-hover:text-[var(--lp-cyan)] transition-colors">{district.name}</span>
                    {#if district.description}
                      <span class="text-xs text-[var(--lp-text-muted)] block">{district.description}</span>
                    {/if}
                  </div>
                </div>
                {#if district.popular}
                  <span class="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-[var(--lp-amber)]/15 text-[var(--lp-amber)] border border-[var(--lp-amber)]/30">
                    Populer
                  </span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div use:reveal={{ delay: 250 }} class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
        <a
          href="/auth/login?mode=register"
          class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl shadow-[var(--lp-cyan)]/25 hover:shadow-[var(--lp-cyan)]/45 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          style="background: linear-gradient(135deg, var(--lp-cyan), var(--lp-purple));"
        >
          <span>Mulai Buat Website (Gratis)</span>
          <ArrowRight size={16} />
        </a>
        <a
          href="/umkm"
          class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white border border-[var(--lp-glass-border)] bg-[var(--lp-glass)] backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
        >
          <MapPin size={16} class="text-[var(--lp-cyan)]" />
          <span>Cari UMKM Terdekat</span>
        </a>
      </div>
    </div>

    <!-- Right Column: Interactive Isometric Micro-Town Visual -->
    <div use:reveal={{ scale: true, delay: 200 }} class="lg:col-span-5 relative">
      <div
        class="relative mx-auto max-w-md lg:max-w-none transition-transform duration-500 ease-out"
        style="transform: perspective(1000px) rotateY({mouseX * 6}deg) rotateX({mouseY * -6}deg);"
      >
        <!-- Card Container with Glass Backplate -->
        <div class="relative rounded-3xl border border-[var(--lp-glass-border)] bg-gradient-to-b from-white/10 via-white/5 to-transparent p-4 sm:p-6 backdrop-blur-2xl shadow-2xl overflow-hidden group">
          <!-- Floating Badge 1: Live Stats -->
          <div
            class="absolute top-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-[var(--lp-glass-border)] bg-[#0E131F]/90 backdrop-blur-xl shadow-lg lp-float"
          >
            <div class="w-8 h-8 rounded-xl bg-[var(--lp-cyan)]/15 text-[var(--lp-cyan)] flex items-center justify-center font-bold text-xs">
              <Store size={16} />
            </div>
            <div>
              <p class="text-3xs text-[var(--lp-text-muted)] font-medium">UMKM Digital</p>
              <p class="text-xs font-extrabold text-white">12,847+ Terdaftar</p>
            </div>
          </div>

          <!-- Floating Badge 2: Kecamatan Active -->
          <div
            class="absolute bottom-6 right-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-[var(--lp-glass-border)] bg-[#0E131F]/90 backdrop-blur-xl shadow-lg lp-float-delay"
          >
            <div class="w-8 h-8 rounded-xl bg-[var(--lp-purple)]/15 text-[var(--lp-purple)] flex items-center justify-center font-bold text-xs">
              <Building2 size={16} />
            </div>
            <div>
              <p class="text-3xs text-[var(--lp-text-muted)] font-medium">Kawasan Warga</p>
              <p class="text-xs font-extrabold text-white">25 Kecamatan</p>
            </div>
          </div>

          <!-- Main Isometric Town Artwork Asset -->
          <div class="relative z-10 rounded-2xl overflow-hidden bg-[var(--lp-bg-deep)]/40 p-2 border border-white/5">
            <img
              src="/landing/isometric-town.jpg"
              alt="Isometric Micro-Town Kawasan Digital Warga Banyuwangi"
              class="w-full h-auto rounded-xl object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            <!-- Subtle Shimmer Overlay -->
            <div class="absolute inset-0 bg-gradient-to-tr from-[var(--lp-cyan)]/10 via-transparent to-[var(--lp-purple)]/10 pointer-events-none"></div>
          </div>

          <!-- Quick interactive hotspot tags overlaid on image -->
          <div class="absolute top-1/2 left-1/3 z-20 -translate-x-1/2 -translate-y-1/2 group/tag cursor-pointer">
            <div class="relative flex items-center justify-center">
              <span class="absolute w-6 h-6 rounded-full bg-[var(--lp-cyan)] opacity-75 animate-ping"></span>
              <span class="w-3.5 h-3.5 rounded-full bg-[var(--lp-cyan)] border-2 border-white shadow-md"></span>
            </div>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tag:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0E131F] border border-[var(--lp-cyan)]/40 text-xs font-bold text-white shadow-xl whitespace-nowrap">
              <ShoppingBag size={12} class="text-[var(--lp-cyan)]" />
              <span>Warung Osing Glagah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
