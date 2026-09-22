<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import gsap from 'gsap'

  let containerRef: HTMLElement
  let tl: gsap.core.Timeline | null = null
  let observer: IntersectionObserver | null = null

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!containerRef) return

    if (prefersReducedMotion) {
      gsap.set(['.line-inner', '.desc-col'], { yPercent: 0, opacity: 1 })
      return
    }

    tl = gsap.timeline({ paused: true })

    tl.fromTo(
      '.line-inner',
      { yPercent: 125, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power4.out',
        stagger: 0.12
      }
    )
    .fromTo(
      '.desc-col',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1
      },
      '-=0.45'
    )

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tl?.restart()
          } else {
            tl?.pause(0)
          }
        })
      },
      {
        threshold: 0.15
      }
    )

    observer.observe(containerRef)
  })

  onDestroy(() => {
    if (observer) observer.disconnect()
    if (tl) tl.kill()
  })
</script>

<section
  bind:this={containerRef}
  id="manifesto-statement"
  class="relative z-20 w-full py-28 sm:py-36 md:py-44 bg-canvas text-main border-y border-border/40 select-none overflow-hidden transition-colors duration-300"
>
  <div class="max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center">
    <!-- Judul 2 Baris Masked Reveal (Host Grotesk, Rapat, Ekstra Tebal) -->
    <h2 class="heading-statement text-main mb-12 sm:mb-16">
      <div class="overflow-hidden py-1">
        <span class="line-inner block">Kualitas Otentik</span>
      </div>
      <div class="overflow-hidden py-1">
        <span class="line-inner block">& Desain Berkelas</span>
      </div>
    </h2>

    <!-- Dua Kolom Deskripsi Editorial di Bawah Judul -->
    <div class="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 text-left">
      <div class="desc-col space-y-2">
        <p class="desc-statement text-secondary">
          Mendongkrak daya saing visual produk lokal Banyuwangi. Menghadirkan etalase digital siap pakai yang setara dengan jenama nasional tanpa mengorbankan akar tradisi.
        </p>
      </div>
      <div class="desc-col space-y-2">
        <p class="desc-statement text-secondary">
          Menjembatani pelaku UMKM daerah dengan sentuhan kurasi desainer profesional untuk menciptakan pertumbuhan usaha mandiri yang berkelanjutan.
        </p>
      </div>
    </div>
  </div>
</section>