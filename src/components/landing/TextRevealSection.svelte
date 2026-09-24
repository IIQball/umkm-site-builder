<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  let containerRef: HTMLElement
  let ctx: gsap.Context | null = null

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!containerRef) return

    if (prefersReducedMotion) {
      gsap.set(['.reveal-wd', '.reveal-desc'], { yPercent: 0, opacity: 1 })
      return
    }

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })

      // Masked word-by-word reveal ala Kononenko Group
      tl.fromTo(
        '.reveal-wd',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.0,
          ease: 'power4.out',
          stagger: 0.08,
          force3D: true
        }
      )
      // Masked description columns sliding up in sequence
      .fromTo(
        '.reveal-desc',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          force3D: true
        },
        '-=0.6'
      )
    }, containerRef)

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => clearTimeout(refreshTimer)
  })

  onDestroy(() => {
    ctx?.revert()
  })
</script>

<section
  bind:this={containerRef}
  id="manifesto-statement"
  class="relative z-20 w-full py-28 sm:py-36 md:py-44 bg-canvas text-main border-y border-border/40 select-none overflow-hidden transition-colors duration-300"
>
  <div class="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center">
    <!-- Judul 2 Baris Masked Word-by-Word Reveal (Kononenko Group Style) -->
    <h2 class="heading-statement text-main mb-6 sm:mb-8 select-none" aria-label="Kualitas Otentik & Desain Berkelas">
      <!-- Line 1 -->
      <div class="overflow-hidden py-1 sm:py-1.5 flex justify-center items-center flex-wrap gap-x-[0.25em]">
        <span class="reveal-wd inline-block will-change-transform">Kualitas</span>
        <span class="reveal-wd inline-block will-change-transform">Otentik</span>
      </div>
      <!-- Line 2 -->
      <div class="overflow-hidden py-1 sm:py-1.5 flex justify-center items-center flex-wrap gap-x-[0.25em]">
        <span class="reveal-wd inline-block will-change-transform">&amp;</span>
        <span class="reveal-wd inline-block will-change-transform">Desain</span>
        <span class="reveal-wd inline-block will-change-transform">Berkelas</span>
      </div>
    </h2>

    <!-- Dua Kolom Deskripsi Editorial Masked Reveal di Bawah Judul -->
    <div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 text-left">
      <div class="overflow-hidden">
        <div class="reveal-desc space-y-2 will-change-transform">
          <p class="desc-statement text-secondary">
            Mendongkrak daya saing visual produk lokal Banyuwangi. Menghadirkan etalase digital siap pakai yang setara dengan jenama nasional tanpa mengorbankan akar tradisi.
          </p>
        </div>
      </div>
      <div class="overflow-hidden">
        <div class="reveal-desc space-y-2 will-change-transform">
          <p class="desc-statement text-secondary">
            Menjembatani pelaku UMKM daerah dengan sentuhan kurasi desainer profesional untuk menciptakan pertumbuhan usaha mandiri yang berkelanjutan.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>