<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  let containerEl: HTMLElement;
  let contentEl: HTMLElement;
  let watermarkEl: HTMLElement;
  let glowEl: HTMLElement;
  let ctx: gsap.Context | null = null;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerEl) return;

    ctx = gsap.context(() => {
      // Parallax scrub on giant background watermark
      if (watermarkEl) {
        gsap.fromTo(
          watermarkEl,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: containerEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      }

      // Breathing radiant ambient glow
      if (glowEl) {
        gsap.fromTo(
          glowEl,
          { scale: 0.85, opacity: 0.6 },
          {
            scale: 1.25,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        );
      }

      // Dual-way staggered entrance and exit for content items
      if (contentEl) {
        const children = contentEl.children;
        gsap.fromTo(
          children,
          { y: 35, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerEl,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, containerEl);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<section
  id="contact"
  bind:this={containerEl}
  class="w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-12 border-t border-neutral-200/80 dark:border-neutral-800/80 relative overflow-hidden select-none transition-colors duration-200"
>
  <!-- Atmospheric Subtle Radiant Ambient Glow with Scroll Dynamics -->
  <div
    bind:this={glowEl}
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] bg-orange/15 dark:bg-orange/20 rounded-full blur-[140px] pointer-events-none -z-0 will-change-transform"
    aria-hidden="true"
  ></div>

  <!-- Giant Background Architectural Accent Ribbon with Parallax Drift -->
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] dark:opacity-[0.06] -z-0 overflow-hidden"
    aria-hidden="true"
  >
    <span
      bind:this={watermarkEl}
      class="text-[20vw] font-black tracking-tighter text-neutral-950 dark:text-white whitespace-nowrap leading-none will-change-transform"
    >
      PINOKA
    </span>
  </div>

  <div class="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
    <div bind:this={contentEl} class="flex flex-col items-center will-change-transform">
      <!-- Top Badge with live glow dot -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange mb-5 sm:mb-6 select-none transition-transform duration-200 hover:scale-105">
        <span class="w-1.5 h-1.5 rounded-full bg-orange shadow-[0_0_8px_rgba(249,115,22,0.9)] animate-pulse"></span>
        <span class="text-xs font-mono font-semibold tracking-widest uppercase">
          Langkah Awal
        </span>
      </div>

      <h2 class="text-3xl sm:text-5xl md:text-6xl lg:text-[5vw] font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.08] max-w-4xl mb-5 sm:mb-7">
        Satu Tempat untuk Tumbuh Bersama.
      </h2>

      <p class="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-light max-w-2xl leading-relaxed mb-8 sm:mb-10">
        Buka etalase digital baru atau mulai berkontribusi sebagai perancang visual produk lokal hari ini.
      </p>

      <!-- Action Button with Emil Kowalski & Apple-grade micro-interaction -->
      <div class="flex flex-col items-center gap-6">
        <a
          href="/auth/register"
          class="inline-flex items-center gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-orange hover:bg-orange-dark text-white font-semibold text-sm sm:text-base tracking-wide shadow-xl shadow-orange/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] group cursor-pointer"
        >
          <span class="tracking-wide font-medium">Mulai Sekarang</span>
          <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </a>

        <!-- Trust Badges Underneath Button -->
        <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xs sm:text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-200/50 dark:bg-neutral-800/60 border border-neutral-300/40 dark:border-white/5">
            <span class="text-emerald-500 font-bold">&check;</span> 0% Potongan Komisi
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-200/50 dark:bg-neutral-800/60 border border-neutral-300/40 dark:border-white/5">
            <span class="text-emerald-500 font-bold">&check;</span> Pesanan Masuk ke WhatsApp
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-200/50 dark:bg-neutral-800/60 border border-neutral-300/40 dark:border-white/5">
            <span class="text-emerald-500 font-bold">&check;</span> Kurasi Desainer Banyuwangi
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
