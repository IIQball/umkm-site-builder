<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import Button from '@/components/ui/Button.svelte'

  let footerEl: HTMLElement
  let wordmarkEl: HTMLElement
  let contentEl: HTMLElement
  let ctx: gsap.Context | null = null

  const socialLinks = [
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Email', href: 'mailto:halo@pinoka.id' }
  ]

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !footerEl || !wordmarkEl) return

    ctx = gsap.context(() => {
      // Smooth slow emergence of the giant PINOKA wordmark anchored to bottom
      gsap.fromTo(
        wordmarkEl,
        { yPercent: 30, opacity: 0.3 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerEl,
            start: 'top 85%',
            end: 'bottom bottom',
            scrub: 1.2
          }
        }
      )

      // Gentle rise for headline and CTA buttons
      if (contentEl) {
        gsap.fromTo(
          contentEl.children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        )
      }
    }, footerEl)
  })

  onDestroy(() => {
    ctx?.revert()
  })
</script>

<footer
  id="contact"
  bind:this={footerEl}
  class="w-full relative overflow-hidden flex flex-col justify-between min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] bg-canvas text-main border-t border-border select-none box-border pt-4 sm:pt-6 pb-0 scroll-mt-16 md:scroll-mt-20 transition-colors duration-300"
>
  <!-- Ambient Top Down Radiant Curtain -->
  <div
    class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[340px] bg-gradient-to-b from-white via-neutral-100/30 to-transparent dark:from-white/[0.06] dark:via-white/[0.015] dark:to-transparent rounded-full blur-[90px] pointer-events-none z-0"
    aria-hidden="true"
  ></div>

  <!-- Center Stage: Elevated CTA Content with tight coupling -->
  <div
    bind:this={contentEl}
    class="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-20 pt-2 sm:pt-4"
  >
    <!-- Main Headline pushed close to top boundary -->
    <h2
      class="font-heading font-medium sm:font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] tracking-tight text-neutral-950 dark:text-white leading-[1.05]"
    >
      Siap untuk Bergabung?
    </h2>

    <!-- CTA Button tightly coupled with heading as single unit -->
    <Button
      href="/auth/login?mode=register"
      variant="dark"
      size="md"
      class="mt-3 sm:mt-4 !rounded-full !px-7 sm:!px-8 !py-3 sm:!py-3.5 !bg-neutral-900 hover:!bg-neutral-800 dark:!bg-white dark:hover:!bg-neutral-100 !text-white dark:!text-neutral-950 font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-black/10 dark:shadow-white/5 hover:shadow-xl hover:scale-105 active:scale-[0.98] transition-all duration-300 group cursor-pointer"
    >
      <span>Daftar Sekarang</span>
    </Button>

    <!-- Social Links with clean spacing below button -->
    <nav aria-label="Social and Contact Links" class="flex flex-wrap items-center justify-center gap-6 sm:gap-9 mt-6 sm:mt-8">
      {#each socialLinks as item}
        <a
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          class="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors underline underline-offset-8 decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-current"
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>

  <!-- Giant Typographic Anchor: PINOKA anchored to bottom baseline -->
  <div
    bind:this={wordmarkEl}
    class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center leading-none pointer-events-none select-none z-0 will-change-transform pb-0"
  >
    <span
      class="font-heading font-black text-[16vw] tracking-tighter text-neutral-200/90 dark:text-white/20 uppercase block text-center leading-none"
    >
      Pinoka
    </span>
  </div>

  <!-- Atmospheric Bottom Fog Layer covering at most 50 percent of watermark -->
  <div
    class="absolute inset-x-0 bottom-0 pointer-events-none z-10 h-20 sm:h-28 md:h-36 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 dark:to-transparent"
    aria-hidden="true"
  ></div>

  <!-- Copyright and Legal Bar directly on top of lower edge above fog baseline -->
  <div
    class="relative z-20 pb-4 px-6 md:px-12 flex items-center justify-between text-xs text-muted w-full max-w-7xl mx-auto"
  >
    <p>© 2026 Pinoka Banyuwangi. Hak cipta dilindungi.</p>
    <div class="flex items-center gap-4">
      <a href="/privacy" class="hover:text-main transition-colors">Kebijakan Privasi</a>
      <span>•</span>
      <a href="/terms" class="hover:text-main transition-colors">Syarat & Ketentuan</a>
    </div>
  </div>
</footer>
