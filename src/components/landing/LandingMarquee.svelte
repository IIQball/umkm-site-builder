<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getNavModeState } from '@/components/common/navbar.helpers'

  let isVisible = true
  let ticking = false

  const updateVisibility = () => {
    isVisible = getNavModeState() !== 'hidden'
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateVisibility()
        ticking = false
      })
      ticking = true
    }
  }

  onMount(() => {
    updateVisibility()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  })
</script>

<aside
  class="relative w-full h-8 sm:h-8.5 overflow-hidden select-none border-b border-border/70 dark:border-white/10 bg-canvas/80 dark:bg-canvas/90 backdrop-blur-md transition-all duration-300 ease-out z-50 pointer-events-auto group {isVisible
    ? 'translate-y-0 opacity-100'
    : '-translate-y-full opacity-0 pointer-events-none'}"
  aria-label="Pengumuman Status Pengembangan Sistem"
  role="region"
>
  <!-- Edge Gradient Mask: Memudarkan tepi kiri & kanan agar teks tidak menabrak batas layar secara kasar -->
  <div class="marquee-mask w-full h-full flex items-center">
    <div
      class="marquee-slider flex items-center whitespace-nowrap group-hover:[animation-play-state:paused]"
    >
      <!-- Track Item 1 -->
      <div class="inline-flex items-center gap-4 sm:gap-6 px-4 shrink-0">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-warning/30 text-warning font-mono text-xs uppercase"
        >
          <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-1.5 w-1.5 bg-warning"
            ></span>
          </span>
          Uji Coba Publik
        </span>

        <span class="text-xs text-main/90 dark:text-main font-normal tracking-wide">
          Sistem Pinoka dalam tahap pengembangan aktif.
        </span>

        <span class="text-secondary/40 dark:text-white/20 select-none text-xs" aria-hidden="true">✦</span>

        <span class="text-xs text-main/90 dark:text-main font-normal tracking-wide">
          Seluruh fitur katalog dapat dicoba secara bebas.
        </span>

        <span class="text-secondary/40 dark:text-white/20 select-none text-xs" aria-hidden="true">✦</span>

        <span class="text-xs text-secondary dark:text-muted font-normal tracking-wide">
          Mohon hindari memasukkan informasi penting atau data sensitif.
        </span>

        <span class="text-secondary/40 dark:text-white/20 select-none text-xs" aria-hidden="true">✦</span>
      </div>

      <!-- Track Item 2 (Seamless Infinite Symmetrical Clone) -->
      <div class="inline-flex items-center gap-4 sm:gap-6 px-4 shrink-0" aria-hidden="true">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-warning/30 text-warning font-mono text-xs uppercase"
        >
          <span class="relative flex h-1.5 w-1.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-1.5 w-1.5 bg-warning"
            ></span>
          </span>
          Uji Coba Publik
        </span>

        <span class="text-xs text-main/90 dark:text-main font-normal tracking-wide">
          Sistem Pinoka dalam tahap pengembangan aktif.
        </span>

        <span class="text-secondary/40 dark:text-white/20 select-none text-xs">✦</span>

        <span class="text-xs text-main/90 dark:text-main font-normal tracking-wide">
          Seluruh fitur katalog dapat dicoba secara bebas.
        </span>

        <span class="text-secondary/40 dark:text-white/20 select-none text-xs">✦</span>

        <span class="text-xs text-secondary dark:text-muted font-normal tracking-wide">
          Mohon hindari memasukkan informasi penting atau data sensitif.
        </span>

        <span class="text-secondary/40 dark:text-white/20 select-none text-xs">✦</span>
      </div>
    </div>
  </div>
</aside>

<style>
  /* Linear gradient mask creates a luxurious vignette fade on both horizontal edges */
  .marquee-mask {
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 28px,
      black calc(100% - 28px),
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 28px,
      black calc(100% - 28px),
      transparent 100%
    );
  }

  @keyframes marquee-glide {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }

  .marquee-slider {
    width: max-content;
    animation: marquee-glide 36s linear infinite;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-mask {
      -webkit-mask-image: none;
      mask-image: none;
    }
    .marquee-slider {
      animation: none;
      transform: none;
      width: 100%;
      overflow-x: auto;
      justify-content: center;
    }
  }
</style>
