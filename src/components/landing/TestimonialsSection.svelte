<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { COL_1, COL_2, COL_3 } from './testimonials.data'

  let containerEl: HTMLElement
  let headerEl: HTMLElement
  let gridEl: HTMLElement
  let col1El: HTMLElement
  let col2El: HTMLElement
  let col3El: HTMLElement
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
              once: true
            },
            onComplete: () => {
              gsap.set(headerEl, { clearProps: 'all' })
            }
          }
        )
      }

      if (gridEl && col1El && col2El && col3El) {
        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
        const spreadX = isDesktop ? 90 : 0
        const rotY = isDesktop ? 32 : 0
        const rotZ = isDesktop ? 5 : 0
        const rotX = isDesktop ? 15 : 3
        const startY = isDesktop ? 140 : 20
        const startY2 = isDesktop ? 180 : 30

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gridEl,
            start: isDesktop ? 'top 95%' : 'top 92%',
            end: isDesktop ? 'center 48%' : 'top 70%',
            scrub: 0.6
          }
        })

        tl.fromTo(
          col1El,
          {
            x: -spreadX,
            y: startY,
            rotateY: rotY,
            rotateZ: -rotZ,
            rotateX: rotX,
            scale: isDesktop ? 0.88 : 0.97,
            opacity: 0.4,
            transformOrigin: 'center center'
          },
          { x: 0, y: 0, rotateY: 0, rotateZ: 0, rotateX: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )

        tl.fromTo(
          col2El,
          {
            y: startY2,
            rotateX: rotX * 1.5,
            scale: isDesktop ? 0.84 : 0.97,
            opacity: 0.4,
            transformOrigin: 'center center'
          },
          { y: 0, rotateX: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )

        tl.fromTo(
          col3El,
          {
            x: spreadX,
            y: startY,
            rotateY: -rotY,
            rotateZ: rotZ,
            rotateX: rotX,
            scale: isDesktop ? 0.88 : 0.97,
            opacity: 0.4,
            transformOrigin: 'center center'
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
  class="w-full text-main pt-28 sm:pt-32 md:pt-28 pb-12 sm:pb-20 md:pb-24 px-5 sm:px-8 md:px-12 border-t border-border relative overflow-hidden select-none transition-colors duration-200 scroll-mt-24 sm:scroll-mt-28"
>
  <div class="max-w-7xl mx-auto">
    <!-- Header Section: Jarak rapat di mobile (mb-6) agar menyatu erat dengan card pertama -->
    <div bind:this={headerEl} class="max-w-2xl mx-auto text-center mb-6 sm:mb-10 md:mb-14">
      <h2 class="heading-section text-neutral-950 dark:text-white text-center">
        Dipercaya Wirausaha & Desainer Lokal
      </h2>
      <p class="desc-section text-neutral-600 dark:text-neutral-400 mt-2 sm:mt-3 text-center">
        Cerita nyata mereka yang bertumbuh bersama ekosistem digital Pinoka.
      </p>
    </div>

    <!-- 3-Column Asymmetric Bento Grid (7 Cards, No Photos) with 3D Perspective -->
    <div
      bind:this={gridEl}
      class="testimonials-grid grid grid-cols-1 lg:grid-cols-3 gap-3 w-full items-stretch"
    >
      <!-- Column 1 (2 cards: flex-7 & flex-3) -->
      <div bind:this={col1El} class="flex flex-col gap-3 h-full will-change-transform">
        {#each COL_1 as card}
          <div
            class="feedback-card group {card.flexClass} flex flex-col justify-between relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl {card.theme === 'orange'
              ? 'bg-neutral-950 dark:bg-neutral-900 text-white border border-white/10 shadow-lg shadow-black/20'
              : 'bg-neutral-50/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white border border-border hover:border-neutral-300 dark:hover:border-neutral-700'}"
          >
            {#if card.isPattern}
              <div class="absolute inset-0 bg-[radial-gradient(rgba(var(--color-text-main),0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-0"></div>
            {/if}

            <p class="font-normal leading-relaxed mb-6 relative z-10 transition-colors duration-200 {card.theme === 'orange' ? 'body-sm text-white/90' : 'body-base text-neutral-700 dark:text-neutral-200'}">
              &ldquo;{card.quote}&rdquo;
            </p>

            <div class="flex items-center gap-3 relative z-10 pt-4 border-t {card.theme === 'orange' ? 'border-white/10' : 'border-border'}">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center font-heading text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-105 {card.theme === 'orange' ? 'bg-white/10 text-white border border-white/20 shadow-xs' : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/40 dark:border-neutral-700/50'}">
                {card.initials}
              </div>
              <div class="min-w-0">
                <p class="font-heading font-semibold text-sm leading-tight tracking-tight {card.theme === 'orange' ? 'text-white' : 'text-neutral-950 dark:text-white'}">
                  {card.author}
                </p>
                <p class="text-xs font-sans font-medium mt-1 truncate {card.theme === 'orange' ? 'text-orange-400' : 'text-neutral-500 dark:text-neutral-400'}">
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
            class="feedback-card group flex-1 flex flex-col justify-between relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-neutral-50/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white border border-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <p class="body-sm font-normal leading-relaxed text-neutral-700 dark:text-neutral-200 mb-4 transition-colors duration-200">
              &ldquo;{card.quote}&rdquo;
            </p>

            <div class="flex items-center gap-3 pt-3.5 border-t border-border">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center font-heading text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-105 bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/40 dark:border-neutral-700/50">
                {card.initials}
              </div>
              <div class="min-w-0">
                <p class="font-heading font-semibold text-xs leading-tight tracking-tight text-neutral-950 dark:text-white">
                  {card.author}
                </p>
                <p class="text-xs font-sans font-medium text-neutral-500 dark:text-neutral-400 mt-1 truncate">
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
            class="feedback-card group {card.flexClass} flex flex-col justify-between relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl {card.theme === 'dark'
              ? 'bg-neutral-950 dark:bg-neutral-900 text-white border border-white/10 shadow-lg shadow-black/20'
              : 'bg-neutral-50/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white border border-border hover:border-neutral-300 dark:hover:border-neutral-700'}"
          >
            {#if card.isPattern}
              <div class="absolute inset-0 bg-[radial-gradient(rgba(var(--color-text-main),0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-0"></div>
            {/if}

            <p class="font-normal leading-relaxed mb-6 relative z-10 transition-colors duration-200 {card.theme === 'dark' ? 'body-sm text-white/90' : 'body-base text-neutral-700 dark:text-neutral-200'}">
              &ldquo;{card.quote}&rdquo;
            </p>

            <div class="flex items-center gap-3 relative z-10 pt-4 border-t {card.theme === 'dark' ? 'border-white/10' : 'border-border'}">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center font-heading text-xs font-bold shrink-0 transition-transform duration-300 group-hover:scale-105 {card.theme === 'dark' ? 'bg-white/10 text-white border border-white/20 shadow-xs' : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/40 dark:border-neutral-700/50'}">
                {card.initials}
              </div>
              <div class="min-w-0">
                <p class="font-heading font-semibold text-sm leading-tight tracking-tight {card.theme === 'dark' ? 'text-white' : 'text-neutral-950 dark:text-white'}">
                  {card.author}
                </p>
                <p class="text-xs font-sans font-medium mt-1 truncate {card.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'}">
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

<style>
  .testimonials-grid {
    perspective: 1200px
  }
  .testimonials-grid {
    transform-style: preserve-3d
  }
</style>
