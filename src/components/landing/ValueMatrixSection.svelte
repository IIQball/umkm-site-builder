<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  const VALUES_DATA = [
    {
      id: 'langkah-01',
      tagline: 'LANGKAH 01',
      title: 'Pilih Desain Siap Pakai',
      description: 'Tentukan tampilan katalog buatan desainer profesional yang sesuai dengan produk Anda tanpa perlu merancang dari awal.',
      image: '/images/showcase-umkm.webp',
      alt: 'Pilih desain siap pakai'
    },
    {
      id: 'langkah-02',
      tagline: 'LANGKAH 02',
      title: 'Unggah Produk dan Nomor WhatsApp',
      description: 'Masukkan foto barang, tentukan harga, dan tautkan nomor WhatsApp usaha Anda melalui formulir yang praktis.',
      image: '/images/showcase-consumer.webp',
      alt: 'Unggah produk dan nomor WhatsApp'
    },
    {
      id: 'langkah-03',
      tagline: 'LANGKAH 03',
      title: 'Terima Pesanan Tanpa Biaya Komisi',
      description: 'Website toko langsung aktif seketika dan setiap pesanan pembeli terkirim utuh ke WhatsApp dengan keuntungan penuh 100%.',
      image: '/images/showcase-designer.webp',
      alt: 'Terima pesanan tanpa biaya komisi'
    }
  ]

  let trackElement: HTMLElement
  let stageElement: HTMLElement
  let parallaxTextElement: HTMLElement
  let activeIndex = 0
  let isDesktop = false
  let ctx: any = null

  onMount(async () => {
    isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
    if (!isDesktop) return

    if (!trackElement || !stageElement) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const [gsapMod, stMod] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ])
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod
    const ScrollTrigger = stMod.ScrollTrigger || stMod.default || stMod
    gsap.registerPlugin(ScrollTrigger)

    ctx = gsap.context(() => {
      if (prefersReducedMotion) return

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
              scrub: 0.8
            }
          }
        )
      }

      ScrollTrigger.create({
        trigger: trackElement,
        start: 'top top',
        end: 'bottom bottom',
        pin: stageElement,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          if (p < 0.38 && activeIndex !== 0) {
            activeIndex = 0
          } else if (p >= 0.42 && p < 0.72 && activeIndex !== 1) {
            activeIndex = 1
          } else if (p >= 0.76 && activeIndex !== 2) {
            activeIndex = 2
          }
        }
      })
    }, trackElement)
  })

  onDestroy(() => {
    ctx?.revert()
  })

  $: isSwapped = activeIndex === 1
</script>

<section
  id="value-matrix"
  bind:this={trackElement}
  class="relative w-full {isDesktop ? 'h-[320vh]' : 'h-auto py-12'} text-main border-t border-border select-none transition-colors duration-200"
>
  <!-- Sticky Stage with GSAP Pinning -->
  <div
    bind:this={stageElement}
    class="w-full {isDesktop ? 'h-screen' : 'h-auto'} flex flex-col justify-center items-center px-2 sm:px-4 md:px-6 pt-20 md:pt-24 pb-6 overflow-hidden"
  >
    <div class="w-full h-full max-w-[1440px] flex flex-col justify-center items-center relative">

      <h2 class="sr-only">Keunggulan Platform Pinoka untuk Ekosistem UMKM dan Desainer</h2>

      <!-- Parallax Drifting Text Ribbon (Layer Z-0) -->
      <div class="w-full flex justify-center items-center pointer-events-none select-none relative z-0 -mb-2 sm:-mb-3 md:-mb-4 py-4 overflow-visible" aria-hidden="true">
        <div
          bind:this={parallaxTextElement}
          class="flex items-center gap-12 whitespace-nowrap will-change-transform font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-normal tracking-tight text-main/15 uppercase select-none"
        >
          <span>Kenapa Pinoka? • Nilai Keunggulan Platform •</span>
          <span>Kenapa Pinoka? • Nilai Keunggulan Platform •</span>
          <span>Kenapa Pinoka? • Nilai Keunggulan Platform •</span>
        </div>
      </div>

      <!-- Twin Cards Container with Ultra-Thin Middle Gap -->
      <div
        class="w-full h-full max-h-[calc(100vh-11rem)] grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-2 relative z-10"
        style="--card-gap: 0.5rem"
      >
        <!-- Card 1: Gambar -->
        <div
          class="card-slot w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative z-20 border border-border bg-nested shadow-xl dark:shadow-2xl group transition-all duration-300 hover:border-main/20 {isSwapped
            ? 'swap-img'
            : ''}"
        >
          <img
            src={VALUES_DATA[activeIndex].image}
            alt={VALUES_DATA[activeIndex].alt}
            class="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out opacity-100 scale-100"
            loading="lazy"
            decoding="async"
            width="1000"
            height="842"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <!-- Card 2: Teks Deskripsi -->
        <div
          class="card-slot w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative z-10 p-5 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between border border-border bg-card/95 backdrop-blur-md shadow-xl dark:shadow-2xl transition-all duration-300 hover:border-main/20 {isSwapped
            ? 'swap-text'
            : ''}"
        >
          <!-- Top Area: Heading dan Deskripsi langkah -->
          <div class="w-full flex {isSwapped ? 'justify-start' : 'justify-end'} relative min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
            {#each VALUES_DATA as item, idx}
              <div
                class="absolute top-0 {idx === 1 ? 'left-0 items-start text-left' : 'right-0 items-end text-right'} max-w-md lg:max-w-lg w-full flex flex-col transition-all duration-500 ease-out {activeIndex === idx
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-3 pointer-events-none'}"
              >
                <h3 class="heading-3 text-main {idx === 1 ? 'text-left' : 'text-right'}">
                  {item.title}
                </h3>
                <p class="desc-section text-secondary mt-2.5 sm:mt-3 {idx === 1 ? 'text-left' : 'text-right'}">
                  {item.description}
                </p>
              </div>
            {/each}
          </div>

          <!-- Bottom Row: Indicator & Tagline mirroring position based on isSwapped -->
          <div class="w-full flex items-center justify-between gap-4 pt-3.5 sm:pt-4 border-t border-border {isSwapped ? 'flex-row-reverse' : 'flex-row'}">
            <!-- Step Indicator (Clean inline row, no nested card) -->
            <div class="inline-flex items-center gap-2 select-none">
              <div class="flex items-center gap-1">
                {#each [0, 1, 2] as i}
                  <span
                    class="h-1 rounded-full transition-all duration-500 ease-out {activeIndex === i
                      ? 'w-4 bg-orange'
                      : 'w-1.5 bg-border'}"
                  ></span>
                {/each}
              </div>
              <span class="label-caps text-main ml-0.5">
                0{activeIndex + 1}
              </span>
              <span class="label-caps text-muted">
                DARI 03
              </span>
            </div>

            <!-- Tagline aligned to outer edge -->
            <div class="relative h-6 flex items-center {isSwapped ? 'justify-start text-left' : 'justify-end text-right'}">
              {#each VALUES_DATA as item, idx}
                <span
                  class="absolute {isSwapped ? 'left-0' : 'right-0'} label-caps text-orange dark:text-orange-light font-bold transition-all duration-500 ease-out whitespace-nowrap {activeIndex === idx
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'}"
                >
                  {item.tagline}
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
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1)
  }
  .card-slot {
    will-change: transform
  }
  @media (min-width: 768px) {
    .swap-img {
      transform: translateX(calc(100% + var(--card-gap, 0.5rem)))
    }
    .swap-text {
      transform: translateX(calc(-100% - var(--card-gap, 0.5rem)))
    }
  }
  @media (max-width: 767px) {
    .swap-img {
      transform: translateY(calc(100% + var(--card-gap, 0.5rem)))
    }
    .swap-text {
      transform: translateY(calc(-100% - var(--card-gap, 0.5rem)))
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card-slot {
      transition: none
    }
  }
</style>
