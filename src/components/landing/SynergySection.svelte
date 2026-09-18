<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const ROLES_DATA = [
    {
      id: 'desainer',
      tagline: 'Desainer',
      subtext: 'Rancang identitas visual produk lokal dan hasilkan royalti transparan dari bisnis riil.',
      image: '/images/showcase-designer.jpg',
      alt: 'Kolaborasi desainer visual dengan perajin lokal di Banyuwangi',
    },
    {
      id: 'umkm',
      tagline: 'Pelaku Usaha UMKM',
      subtext: 'Naikkan kelas produk ke standar nasional dengan etalase mandiri dan pesanan WhatsApp otomatis.',
      image: '/images/showcase-umkm.jpg',
      alt: 'Produk kopi otentik lereng Ijen siap dipasarkan dengan standar visual premium',
    },
    {
      id: 'konsumen',
      tagline: 'Konsumen',
      subtext: 'Jelajahi kurasi kriya otentik Banyuwangi dan belanja produk asli langsung dari perajinnya.',
      image: '/images/showcase-consumer.jpg',
      alt: 'Konsumen menikmati pengalaman belanja produk lokal di gerai Banyuwangi',
    },
  ];

  let trackElement: HTMLElement;
  let stageElement: HTMLElement;
  let parallaxTextElement: HTMLElement;
  let activeIndex = 0;
  let ctx: gsap.Context | null = null;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!trackElement || !stageElement) return;

    ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      if (parallaxTextElement) {
        gsap.fromTo(
          parallaxTextElement,
          { xPercent: 5, yPercent: -20 },
          {
            xPercent: -25,
            yPercent: 35,
            ease: 'none',
            scrollTrigger: {
              trigger: trackElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          }
        );
      }

      ScrollTrigger.create({
        trigger: trackElement,
        start: 'top top',
        end: 'bottom bottom',
        pin: stageElement,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Smooth hysteresis buffer: deliberate scrolling required to change active role,
          // preventing startling, abrupt jumps on a single scroll wheel tick.
          if (p < 0.38 && activeIndex !== 0) {
            activeIndex = 0;
          } else if (p >= 0.42 && p < 0.72 && activeIndex !== 1) {
            activeIndex = 1;
          } else if (p >= 0.76 && activeIndex !== 2) {
            activeIndex = 2;
          }
        },
      });
    }, trackElement);
  });

  onDestroy(() => {
    ctx?.revert();
  });

  $: isSwapped = activeIndex === 1;
</script>

<section
  id="synergy"
  bind:this={trackElement}
  class="relative w-full h-[320vh] bg-canvas text-main border-t border-border select-none transition-colors duration-200"
>
  <!-- Sticky Stage with GSAP Pinning -->
  <div
    bind:this={stageElement}
    class="w-full h-screen bg-canvas flex flex-col justify-center items-center px-2 sm:px-4 md:px-6 pt-16 md:pt-20 pb-2 sm:pb-3 overflow-hidden"
  >
    <div class="w-full h-full max-w-[1440px] flex flex-col justify-center items-center relative">

      <!-- Parallax Drifting Text Ribbon (Layer Z-0) -->
      <div class="w-full flex justify-center items-center pointer-events-none select-none relative z-0 -mb-6 md:-mb-10 overflow-visible" aria-hidden="true">
        <div
          bind:this={parallaxTextElement}
          class="flex whitespace-nowrap will-change-transform"
        >
          <span class="text-6xl sm:text-8xl md:text-[10vw] font-black tracking-tighter text-neutral-950/15 dark:text-white/20 px-4 leading-none select-none">
            Kenapa Pinoka? * Sinergi Tiga Sisi * Kenapa Pinoka? * Sinergi Tiga Sisi *
          </span>
          <span class="text-6xl sm:text-8xl md:text-[10vw] font-black tracking-tighter text-neutral-950/15 dark:text-white/20 px-4 leading-none select-none">
            Kenapa Pinoka? * Sinergi Tiga Sisi * Kenapa Pinoka? * Sinergi Tiga Sisi *
          </span>
        </div>
      </div>

      <!-- Twin Cards Container with Ultra-Thin Middle Gap -->
      <div
        class="w-full h-full max-h-[calc(100vh-4.5rem)] md:max-h-[calc(100vh-5.5rem)] grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-2 relative z-10"
        style="--card-gap: 0.5rem;"
      >
        <!-- Card 1: Gambar -->
        <div
          class="card-slot w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative z-20 border border-border bg-neutral-100 dark:bg-neutral-900 shadow-xl dark:shadow-2xl group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 {isSwapped
            ? 'swap-img'
            : ''}"
        >
          {#each ROLES_DATA as role, idx}
            <img
              src={role.image}
              alt={role.alt}
              class="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.02] {activeIndex === idx
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105 pointer-events-none'}"
              loading="lazy"
            />
          {/each}
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <!-- Card 2: Teks Deskripsi -->
        <div
          class="card-slot w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative z-10 p-5 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between border border-border bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-xl dark:shadow-2xl transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 {isSwapped
            ? 'swap-text'
            : ''}"
        >
          <!-- Top Area: Subtext positioned towards outer edge with compact size and tight leading -->
          <div class="w-full flex {isSwapped ? 'justify-start' : 'justify-end'} relative min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
            {#each ROLES_DATA as role, idx}
              <div
                class="absolute top-0 {idx === 1 ? 'left-0 items-start text-left' : 'right-0 items-end text-right'} max-w-md lg:max-w-lg w-full flex flex-col transition-all duration-500 ease-out {activeIndex === idx
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-3 pointer-events-none'}"
              >
                <h3 class="font-heading font-medium text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] text-neutral-950 dark:text-white tracking-tight leading-[1.16] {idx === 1 ? 'text-left' : 'text-right'}">
                  {role.subtext}
                </h3>
              </div>
            {/each}
          </div>

          <!-- Bottom Row: Indicator & Tagline mirroring position based on isSwapped -->
          <div class="w-full flex items-center justify-between gap-4 pt-3.5 sm:pt-4 border-t border-border {isSwapped ? 'flex-row-reverse' : 'flex-row'}">
            <!-- Step Indicator Pill -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-white/10 shadow-xs select-none transition-transform duration-200 hover:scale-[1.02]">
              <div class="flex items-center gap-1">
                {#each [0, 1, 2] as i}
                  <span
                    class="h-1 rounded-full transition-all duration-500 ease-out {activeIndex === i
                      ? 'w-4 bg-orange shadow-[0_0_8px_rgba(249,115,22,0.6)]'
                      : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'}"
                  ></span>
                {/each}
              </div>
              <span class="font-mono text-xs font-bold tracking-wider text-neutral-900 dark:text-white ml-0.5">
                0{activeIndex + 1}
              </span>
              <span class="text-[10px] font-mono font-medium tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
                DARI 03
              </span>
            </div>

            <!-- Tagline aligned to outer edge -->
            <div class="relative h-6 flex items-center {isSwapped ? 'justify-start text-left' : 'justify-end text-right'}">
              {#each ROLES_DATA as role, idx}
                <span
                  class="absolute {isSwapped ? 'left-0' : 'right-0'} font-sans text-xs sm:text-sm font-semibold tracking-wide text-orange transition-all duration-500 ease-out whitespace-nowrap {activeIndex === idx
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'}"
                >
                  {role.tagline}
                </span>
              {/each}
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</section>

<style>
  .card-slot {
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
  }
  @media (min-width: 768px) {
    .swap-img {
      transform: translateX(calc(100% + var(--card-gap, 0.5rem)));
    }
    .swap-text {
      transform: translateX(calc(-100% - var(--card-gap, 0.5rem)));
    }
  }
  @media (max-width: 767px) {
    .swap-img {
      transform: translateY(calc(100% + var(--card-gap, 0.5rem)));
    }
    .swap-text {
      transform: translateY(calc(-100% - var(--card-gap, 0.5rem)));
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card-slot {
      transition: none;
    }
  }
</style>
