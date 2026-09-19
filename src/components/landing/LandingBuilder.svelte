<script lang="ts">
  import { Camera, Palette, Globe, Check, ArrowRight, Monitor, Smartphone, MessageCircle, Sparkles } from 'lucide-svelte';
  import { reveal } from './scrollReveal';

  let activeStep = 0;
  let viewportMode: 'desktop' | 'mobile' = 'desktop';

  const STEPS = [
    {
      icon: Camera,
      stepNum: '01',
      title: 'Isi Data & Foto Usaha',
      desc: 'Masukkan nama UMKM, deskripsi singkat, unggah foto produk unggulan, dan sambungkan nomor WhatsApp bisnis.',
      color: 'var(--lp-cyan)',
      tag: 'Input Instan',
    },
    {
      icon: Palette,
      stepNum: '02',
      title: 'Pilih & Kustomisasi Tema',
      desc: 'Pilih template khas daerah dari koleksi. Sesuaikan skema warna, font, dan susunan seksi hanya dengan klik.',
      color: 'var(--lp-purple)',
      tag: 'Live Editor',
    },
    {
      icon: Globe,
      stepNum: '03',
      title: 'Terbit Domain & Tombol WhatsApp',
      desc: 'Website langsung online dengan subdomain gratis (misal: warung-osing.umkm.bwi.id) & tombol checkout otomatis.',
      color: 'var(--lp-amber)',
      tag: 'Instant Live',
    },
  ];

  const MOCK_DATA = [
    {
      title: 'Warung Osing Mbak Yuni',
      tagline: 'Kuliner Khas Banyuwangi',
      badge: 'Langkah 1: Mengisi Data Produk & Foto',
      accent: 'var(--lp-cyan)',
      products: ['Nasi Tempong', 'Rujak Soto', 'Ayam Kesrut'],
    },
    {
      title: 'Warung Osing Mbak Yuni',
      tagline: 'Tema: Osing Modern Blue',
      badge: 'Langkah 2: Menyesuaikan Gaya & Tema',
      accent: 'var(--lp-purple)',
      products: ['Nasi Tempong', 'Rujak Soto', 'Ayam Kesrut'],
    },
    {
      title: 'warung-osing.umkm.bwi.id',
      tagline: 'Domain Aktif & Siap Jualan',
      badge: 'Langkah 3: Dipublikasi 100% Online',
      accent: 'var(--lp-amber)',
      products: ['Nasi Tempong', 'Rujak Soto', 'Ayam Kesrut'],
    },
  ];

  $: currentMock = MOCK_DATA[activeStep];
</script>

<section id="builder" class="relative py-24 sm:py-32 px-4 overflow-hidden">
  <!-- Background Glow Orbs -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div class="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[140px]" style="background: var(--lp-purple);"></div>
  </div>

  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div use:reveal class="text-center mb-16">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--lp-purple)]/30 bg-[var(--lp-purple)]/10 text-[var(--lp-purple)] text-xs font-bold mb-3">
        <Sparkles size={13} />
        <span>No-Code Builder</span>
      </div>
      <h2 class="text-heading-lg text-white">Rakit Websitemu Sendiri</h2>
      <p class="text-body-base text-[var(--lp-text-secondary)] mt-3 max-w-xl mx-auto leading-relaxed">
        Tiga langkah sederhana. Tanpa koding. Tanpa biaya. Website toko online UMKM-mu siap dalam hitungan menit.
      </p>
    </div>

    <!-- Stepper Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <!-- Left Column: Interactive Stepper Buttons -->
      <div class="lg:col-span-5 space-y-4">
        {#each STEPS as step, i}
          <div use:reveal={{ delay: 100 + i * 80 }}>
            <button
              type="button"
              on:click={() => (activeStep = i)}
              class="w-full flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300 cursor-pointer text-left group relative overflow-hidden {activeStep === i
                ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-white/20 shadow-xl'
                : 'bg-transparent border-[var(--lp-card-border)] hover:bg-white/[0.03] hover:border-white/10'}"
            >
              <!-- Active Step Vertical Accent Bar -->
              {#if activeStep === i}
                <div class="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full" style="background: {step.color};"></div>
              {/if}

              <!-- Icon Avatar -->
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                style="background: {activeStep === i ? step.color + '20' : 'rgba(255,255,255,0.05)'}; color: {activeStep === i ? step.color : 'var(--lp-text-muted)'}; border: 1px solid {activeStep === i ? step.color + '40' : 'transparent'};"
              >
                {#if i < activeStep}
                  <Check size={20} class="stroke-[3]" />
                {:else}
                  <svelte:component this={step.icon} size={20} />
                {/if}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md" style="background: {step.color}15; color: {step.color};">
                    {step.tag}
                  </span>
                  <span class="text-xs font-mono font-bold text-[var(--lp-text-muted)]">
                    {step.stepNum}
                  </span>
                </div>

                <h3 class="text-sm font-bold text-white group-hover:text-[var(--lp-cyan)] transition-colors">
                  {step.title}
                </h3>

                {#if activeStep === i}
                  <p class="text-xs text-[var(--lp-text-secondary)] mt-2 leading-relaxed lp-slide-up">
                    {step.desc}
                  </p>
                {/if}
              </div>
            </button>
          </div>
        {/each}

        <!-- CTA Button -->
        <div use:reveal={{ delay: 350 }} class="pt-2">
          <a
            href="/auth/login?mode=register"
            class="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl shadow-[var(--lp-purple)]/25 hover:shadow-[var(--lp-purple)]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer w-full justify-center sm:w-auto"
            style="background: linear-gradient(135deg, var(--lp-cyan), var(--lp-purple));"
          >
            <span>Coba Builder Sekarang</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <!-- Right Column: Interactive Mockup Showcase -->
      <div use:reveal={{ scale: true, delay: 200 }} class="lg:col-span-7">
        <div class="rounded-3xl border border-[var(--lp-glass-border)] bg-[var(--lp-bg-deep)]/90 overflow-hidden shadow-2xl backdrop-blur-xl">
          <!-- Mockup Header Bar -->
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-[var(--lp-card-border)] bg-white/[0.02]">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-rose-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-amber-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-emerald-500/70"></div>
            </div>

            <!-- Address Bar Mockup -->
            <div class="px-4 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[var(--lp-text-secondary)] truncate max-w-xs flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" style="background: {currentMock.accent};"></span>
              <span>{currentMock.title}</span>
            </div>

            <!-- Viewport Switcher -->
            <div class="flex items-center gap-1">
              <button
                type="button"
                on:click={() => (viewportMode = 'desktop')}
                class="p-1.5 rounded-lg text-xs transition-colors cursor-pointer {viewportMode === 'desktop' ? 'bg-white/10 text-white' : 'text-[var(--lp-text-muted)] hover:text-white'}"
                title="Desktop view"
              >
                <Monitor size={15} />
              </button>
              <button
                type="button"
                on:click={() => (viewportMode = 'mobile')}
                class="p-1.5 rounded-lg text-xs transition-colors cursor-pointer {viewportMode === 'mobile' ? 'bg-white/10 text-white' : 'text-[var(--lp-text-muted)] hover:text-white'}"
                title="Mobile view"
              >
                <Smartphone size={15} />
              </button>
            </div>
          </div>

          <!-- Mockup Canvas Body -->
          <div class="p-6 transition-all duration-500" class:max-w-sm={viewportMode === 'mobile'} class:mx-auto={viewportMode === 'mobile'}>
            <!-- Badge indicator -->
            <div class="inline-block px-3 py-1 rounded-full text-3xs font-bold text-white mb-4 border border-white/10" style="background: {currentMock.accent}20; color: {currentMock.accent};">
              {currentMock.badge}
            </div>

            <!-- Hero Store Banner Preview -->
            <div class="p-6 rounded-2xl border border-white/10 transition-all duration-500 relative overflow-hidden mb-6" style="background: linear-gradient(135deg, {currentMock.accent}15, transparent);">
              <h4 class="text-lg font-bold text-white">{currentMock.title}</h4>
              <p class="text-xs text-[var(--lp-text-secondary)] mt-1">{currentMock.tagline}</p>
              <div class="mt-4 flex items-center gap-2">
                <span class="px-3 py-1.5 rounded-xl text-3xs font-bold text-white" style="background: {currentMock.accent};">
                  {activeStep === 2 ? 'Domain Terverifikasi' : 'Buka 08:00 - 21:00'}
                </span>
                <span class="text-3xs text-[var(--lp-text-muted)]">Kecamatan Glagah</span>
              </div>
            </div>

            <!-- Product Grid Cards Preview -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              {#each currentMock.products as pName, pIdx}
                <div class="p-3 rounded-xl border border-white/5 bg-white/[0.02] text-center space-y-2 hover:border-white/20 transition-all">
                  <div class="w-full aspect-square rounded-lg flex items-center justify-center text-xl" style="background: {currentMock.accent}{15 + pIdx * 10};">
                    🍲
                  </div>
                  <p class="text-3xs font-bold text-white truncate">{pName}</p>
                  <p class="text-4xs text-[var(--lp-cyan)] font-mono">Rp 15.000</p>
                </div>
              {/each}
            </div>

            <!-- Bottom Interactive Action Bar -->
            <div class="flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/5">
              <div class="flex items-center gap-2">
                <MessageCircle size={16} class="text-emerald-400" />
                <span class="text-xs font-bold text-white">Pesanan via WhatsApp</span>
              </div>

              <a
                href="/auth/login?mode=register"
                class="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:scale-105 transition-transform cursor-pointer"
                style="background: {currentMock.accent};"
              >
                {activeStep === 2 ? 'Terbitkan Sekarang' : 'Uji Coba Editor'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
