<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { COL_1, COL_2, COL_3 } from './testimonials.data'

  let containerEl: HTMLElement, headerEl: HTMLElement, gridEl: HTMLElement
  let col1El: HTMLElement, col2El: HTMLElement, col3El: HTMLElement
  let ctx: gsap.Context | null = null

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !containerEl) return

    ctx = gsap.context(() => {
      if (headerEl) {
        gsap.fromTo(
          headerEl,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerEl,
              start: 'top 85%',
              once: true,
            },
            onComplete: () => {
              gsap.set(headerEl, { clearProps: 'all' });
            },
          }
        )
      }

      if (gridEl && col1El && col2El && col3El) {
        gridEl.style.perspective = '1800px'
        gridEl.style.transformStyle = 'preserve-3d'

        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
        const spreadX = isDesktop ? 90 : 25
        const rotY = isDesktop ? 32 : 12
        const rotZ = isDesktop ? 5 : 2
        const rotX = isDesktop ? 15 : 6

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 95%',
            end: 'center 48%',
            scrub: 0.6,
          }
        })

        tl.fromTo(
          col1El,
          {
            x: -spreadX,
            y: 140,
            rotateY: rotY,
            rotateZ: -rotZ,
            rotateX: rotX,
            scale: 0.88,
            opacity: 0.3,
            transformOrigin: 'right center'
          },
          { x: 0, y: 0, rotateY: 0, rotateZ: 0, rotateX: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )

        tl.fromTo(
          col2El,
          {
            y: 180,
            rotateX: rotX * 1.5,
            scale: 0.84,
            opacity: 0.25,
            transformOrigin: 'center center'
          },
          { y: 0, rotateX: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )

        tl.fromTo(
          col3El,
          {
            x: spreadX,
            y: 140,
            rotateY: -rotY,
            rotateZ: rotZ,
            rotateX: rotX,
            scale: 0.88,
            opacity: 0.3,
            transformOrigin: 'left center'
          },
          { x: 0, y: 0, rotateY: 0, rotateZ: 0, rotateX: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )
      }
    }, containerEl)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => clearTimeout(timer)
  })

  onDestroy(() => {
    ctx?.revert()
  })
</script>

<section
  id="testimonials"
  bind:this={containerEl}
  class="w-full text-main py-16 sm:py-24 px-6 sm:px-8 md:px-12 border-t border-border relative overflow-hidden select-none transition-colors duration-200"
>
  <div class="max-w-7xl mx-auto">
    <!-- Header Section -->
    <div bind:this={headerEl} class="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
      <h2 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.12]">
        Dipercaya Wirausaha & Desainer Lokal
      </h2>
      <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-light mt-3">
        Cerita nyata mereka yang bertumbuh bersama ekosistem digital Pinoka.
      </p>
    </div>

    <!-- 3-Column Asymmetric Bento Grid (7 Cards, No Photos) with 3D Perspective -->
    <div
      bind:this={gridEl}
      class="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full items-stretch"
      style="perspective: 1200px; transform-style: preserve-3d;"
    >
      <!-- Column 1 (2 cards: flex-7 & flex-3) -->
      <div bind:this={col1El} class="flex flex-col gap-3 h-full will-change-transform">
        {#each COL_1 as card}
          <div
            class="feedback-card group {card.flexClass} flex flex-col justify-between relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 {card.theme === 'orange'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border border-orange/40 shadow-xl shadow-orange/10'
              : 'bg-neutral-50 dark:bg-neutral-900/60 text-neutral-900 dark:text-white border border-border'}"
          >
            {#if card.isPattern}
              <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-0"></div>
            {/if}

            <p class="text-sm sm:text-base font-light leading-relaxed mb-6 relative z-10 transition-colors duration-200 {card.theme === 'orange' ? 'text-white/95 dark:text-neutral-900' : 'text-neutral-700 dark:text-neutral-200'}">
              &ldquo;{card.quote}&rdquo;
            </p>

            <div class="flex items-center gap-3 relative z-10 pt-4 border-t {card.theme === 'orange' ? 'border-orange/20 dark:border-neutral-200' : 'border-border'}">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-110 {card.theme === 'orange' ? 'bg-white text-neutral-950 font-bold ring-2 ring-orange/60 shadow-xs' : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}">
                {card.initials}
              </div>
              <div>
                <h3 class="font-heading font-semibold text-sm leading-tight {card.theme === 'orange' ? 'text-white dark:text-neutral-950' : 'text-neutral-950 dark:text-white'}">
                  {card.author}
                </h3>
                <p class="text-xs font-mono font-medium mt-0.5 {card.theme === 'orange' ? 'text-orange-400 dark:text-orange-600' : 'text-neutral-500 dark:text-neutral-400'}">
                  {card.role}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Column 2 (3 stacked cards) -->
      <div bind:this={col2El} class="flex flex-col gap-3 h-full will-change-transform">
        {#each COL_2 as card}
          <div
            class="feedback-card group flex-1 flex flex-col justify-between relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-900/60 text-neutral-900 dark:text-white border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <p class="text-xs sm:text-sm font-light leading-relaxed text-neutral-700 dark:text-neutral-200 mb-4 transition-colors duration-200">
              &ldquo;{card.quote}&rdquo;
            </p>

            <div class="flex items-center gap-3 pt-3.5 border-t border-border">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-110 bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {card.initials}
              </div>
              <div>
                <h3 class="font-heading font-semibold text-xs leading-tight text-neutral-950 dark:text-white">
                  {card.author}
                </h3>
                <p class="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {card.role}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Column 3 (2 cards: flex-3 & flex-7) -->
      <div bind:this={col3El} class="flex flex-col gap-3 h-full will-change-transform">
        {#each COL_3 as card}
          <div
            class="feedback-card group {card.flexClass} flex flex-col justify-between relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 {card.theme === 'dark'
              ? 'bg-neutral-900 dark:bg-neutral-800 text-white border border-neutral-800 dark:border-neutral-700 shadow-md'
              : 'bg-neutral-50 dark:bg-neutral-900/60 text-neutral-900 dark:text-white border border-border'}"
          >
            {#if card.isPattern}
              <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-0"></div>
            {/if}

            <p class="text-sm sm:text-base font-light leading-relaxed mb-6 relative z-10 transition-colors duration-200 {card.theme === 'dark' ? 'text-white/95' : 'text-neutral-700 dark:text-neutral-200'}">
              &ldquo;{card.quote}&rdquo;
            </p>

            <div class="flex items-center gap-3 relative z-10 pt-4 border-t {card.theme === 'dark' ? 'border-white/15' : 'border-border'}">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-110 {card.theme === 'dark' ? 'bg-white/15 text-white' : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'}">
                {card.initials}
              </div>
              <div>
                <h3 class="font-heading font-semibold text-sm leading-tight {card.theme === 'dark' ? 'text-white' : 'text-neutral-950 dark:text-white'}">
                  {card.author}
                </h3>
                <p class="text-xs font-mono font-medium mt-0.5 {card.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'}">
                  {card.role}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
