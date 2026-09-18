<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Badge from '@/components/ui/Badge.svelte'
  import Button from '@/components/ui/Button.svelte'

  const PHASES = [
    {
      category: 'Transformasi Visual & Etalase',
      headline: 'Eksplorasi potensi <br /> karya lokal.',
      items: [
        { title: 'Katalog Interaktif', desc: 'Penerbitan instan tanpa kode' },
        { title: 'Identitas Visual', desc: 'Kurasi desainer profesional' },
      ],
      narrative: 'Memastikan setiap produk unggulan Banyuwangi mendapatkan representasi visual terbaik. Menghubungkan tradisi lokal dengan standar estetika digital modern agar berdaya saing tinggi.',
      ctaText: 'Lihat Direktori Usaha',
      ctaHref: '/templates',
    },
    {
      category: 'Kemandirian Transaksi & Royalti',
      headline: 'Kemandirian transaksi <br /> tanpa perantara.',
      items: [
        { title: 'Jalur Transaksi', desc: 'WhatsApp langsung 0% komisi' },
        { title: 'Bagi Hasil Terbuka', desc: 'Royalti transparan untuk perajin & desainer' },
      ],
      narrative: 'Memberikan kendali penuh bagi pelaku usaha lokal mengelola pesanan mandiri. Tanpa potongan komisi perantara, margin keuntungan maksimal kembali ke perajin Banyuwangi.',
      ctaText: 'Mulai Kolaborasi',
      ctaHref: '/auth/register',
    },
  ];

  let trackElement: HTMLElement;
  let stageElement: HTMLElement;
  let activeIndex = 0;
  let selectedItemIndex = 0;
  let ctx: gsap.Context | null = null;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !trackElement || !stageElement) return;

    ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackElement,
        start: 'top top',
        end: 'bottom bottom',
        pin: stageElement,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Smooth hysteresis buffer: requires deliberate scrolling to switch phases,
          // avoiding unexpected or abrupt switches on a single scroll wheel tick.
          if (p > 0.52 && activeIndex !== 1) {
            activeIndex = 1;
            selectedItemIndex = 0;
          } else if (p < 0.44 && activeIndex !== 0) {
            activeIndex = 0;
            selectedItemIndex = 0;
          }
        },
      });
    }, trackElement);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<section
  id="value-matrix"
  bind:this={trackElement}
  class="relative w-full h-[220vh] bg-canvas text-main border-t border-border select-none transition-colors duration-200"
>
  <!-- Sticky Viewport Stage -->
  <div
    bind:this={stageElement}
    class="w-full h-screen bg-canvas flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 pt-16 md:pt-20 overflow-hidden"
  >
    <div
      class="w-full max-w-7xl mx-auto flex flex-col justify-center"
    >
      <!-- Top Zone: Massive Headline with crossfade -->
      <div class="relative min-h-[90px] sm:min-h-[120px] lg:min-h-[150px] mb-6 sm:mb-8 md:mb-10">
        {#each PHASES as phase, pIdx}
          <h2
            class="absolute top-0 left-0 text-4xl sm:text-6xl lg:text-[6.5vw] font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.05] transition-opacity duration-500 ease-out {activeIndex === pIdx
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'}"
          >
            {@html phase.headline}
          </h2>
        {/each}
      </div>

      <!-- Bottom Zone: Asymmetric Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <!-- Left Column: Interactive Hairline Rows (col-span-7) -->
        <div class="lg:col-span-7 flex flex-col">
          <!-- Category Header & Stepper Indicator -->
          <div class="flex items-center justify-between gap-4 mb-4">
            <span class="text-xs font-mono text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
              {PHASES[activeIndex].category}
            </span>
            <Badge variant={activeIndex === 0 ? 'orange' : 'secondary'} dot={true} class="font-mono text-xs">
              <span>0{activeIndex + 1} DARI 02</span>
            </Badge>
          </div>

          <!-- Hairline Rows with Smooth Opacity Crossfade -->
          <div class="border-t border-neutral-200 dark:border-white/10 relative min-h-[160px] sm:min-h-[180px]">
            {#each PHASES as phase, pIdx}
              <div
                class="transition-opacity duration-500 ease-out {activeIndex === pIdx
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none absolute inset-0'}"
              >
                {#each phase.items as item, itemIdx}
                  <div
                    role="button"
                    tabindex="0"
                    on:click={() => selectedItemIndex = itemIdx}
                    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { selectedItemIndex = itemIdx; e.preventDefault(); } }}
                    on:mouseenter={() => selectedItemIndex = itemIdx}
                    class="hairline-row border-b border-neutral-200 dark:border-white/10 px-4 -mx-4 rounded-xl py-4 sm:py-5 flex items-center justify-between cursor-pointer group transition-colors duration-200 {selectedItemIndex === itemIdx ? 'bg-neutral-100 dark:bg-white/[0.04] border-neutral-300 dark:border-white/30' : 'hover:bg-neutral-50 dark:hover:bg-white/[0.02]'}"
                  >
                    <div class="flex items-center gap-3 transition-transform duration-200 {selectedItemIndex === itemIdx ? 'translate-x-1.5' : 'group-hover:translate-x-1'}">
                      <span
                        class="w-1.5 h-1.5 rounded-full transition-all duration-200 {selectedItemIndex === itemIdx
                          ? 'bg-orange scale-100 opacity-100 shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                          : 'bg-neutral-300 dark:bg-white/30 scale-75 opacity-0 group-hover:opacity-60'}"
                      ></span>
                      <span class="font-heading font-medium text-base sm:text-xl transition-colors duration-200 {selectedItemIndex === itemIdx ? 'text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'}">
                        {item.title}
                      </span>
                    </div>
                    <span class="font-sans text-xs sm:text-sm transition-colors duration-200 text-right {selectedItemIndex === itemIdx ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-400'}">
                      {item.desc}
                    </span>
                  </div>
                {/each}
              </div>
            {/each}
          </div>
        </div>

        <!-- Right Column: Editorial Narrative & Action (col-span-5) -->
        <div class="lg:col-span-5 flex flex-col justify-between h-full pt-1 md:pl-4 relative min-h-[160px]">
          {#each PHASES as phase, pIdx}
            <div
              class="flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/10 backdrop-blur-xs transition-opacity duration-500 ease-out hover:border-neutral-300 dark:hover:border-white/20 {activeIndex === pIdx
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none absolute inset-0'}"
            >
              <p class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-6">
                {phase.narrative}
              </p>

              <Button
                href={phase.ctaHref}
                variant="dark"
                size="sm"
                class="!rounded-full !px-5 !py-2.5 !bg-neutral-900 hover:!bg-neutral-800 text-white dark:!bg-white/10 dark:hover:!bg-white/20 dark:!text-white border border-neutral-800 dark:border-white/15 text-xs w-fit group active:scale-[0.97] shadow-sm gap-2"
              >
                <span>{phase.ctaText}</span>
                <span class="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </Button>
            </div>
          {/each}
        </div>

      </div>

    </div>
  </div>
</section>
