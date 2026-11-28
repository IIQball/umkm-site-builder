<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import HeroCaptions from './HeroCaptions.svelte'

  const TOTAL_FRAMES = 839
  const BUFFER_AHEAD = 3
  const KEEP_BEHIND = 3
  const MAX_PENDING = 3
  const SOURCE_WIDTH = 1280
  const SOURCE_HEIGHT = 720

  let heroContainerEl: HTMLElement
  let canvasEl: HTMLCanvasElement
  let ctx2d: CanvasRenderingContext2D | null = null
  let ctx: any = null
  let ScrollTriggerInstance: any = null

  const images = new Map<number, HTMLImageElement>()
  const failedFrames = new Set<number>()
  const pendingFrames = new Set<number>()
  const playhead = { frame: 1 }

  let currentFrameIndex = 1
  let lastRenderedImage: HTMLImageElement | null = null
  let hasDrawnFrame = false
  let progress = 0
  let mistOpacity = 1
  let isScrolling = false
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null
  let isDestroyed = false

  const getFrameUrl = (index: number) => {
    const padded = String(index).padStart(4, '0')
    return `/frames/frame_${padded}.webp`
  }

  const drawCover = (image: HTMLImageElement) => {
    if (!ctx2d || !canvasEl) return
    const w = window.innerWidth
    const h = window.innerHeight
    const imgW = image.naturalWidth || SOURCE_WIDTH
    const imgH = image.naturalHeight || SOURCE_HEIGHT
    const scale = Math.max(w / imgW, h / imgH)
    const renderW = imgW * scale
    const renderH = imgH * scale
    const offsetX = (w - renderW) / 2
    const offsetY = (h - renderH) / 2

    ctx2d.clearRect(0, 0, w, h)
    ctx2d.drawImage(image, offsetX, offsetY, renderW, renderH)
  }

  const isReady = (img: HTMLImageElement | undefined): img is HTMLImageElement =>
    !!img?.complete && img.naturalWidth > 0

  const bufferFrames = () => {
    const start = Math.max(2, currentFrameIndex - KEEP_BEHIND)
    const end = Math.min(TOTAL_FRAMES, currentFrameIndex + BUFFER_AHEAD)

    for (const index of images.keys()) {
      if ((index < start || index > end) && !pendingFrames.has(index)) images.delete(index)
    }
    if (currentFrameIndex === 1) return

    for (let index = currentFrameIndex; index <= end && pendingFrames.size < MAX_PENDING; index++) {
      if (images.has(index) || failedFrames.has(index)) continue

      const img = new Image()
      const finish = () => {
        if (isDestroyed) return
        pendingFrames.delete(index)
        renderCanvas(currentFrameIndex)
      }
      img.onload = finish
      img.onerror = () => {
        failedFrames.add(index)
        images.delete(index)
        finish()
      }
      pendingFrames.add(index)
      images.set(index, img)
      img.src = getFrameUrl(index)
    }
  }

  const renderCanvas = (target: number, forceDraw = false) => {
    const nextFrame = Math.min(TOTAL_FRAMES, Math.max(1, target))
    const frameChanged = nextFrame !== currentFrameIndex
    currentFrameIndex = nextFrame
    progress = (currentFrameIndex - 1) / (TOTAL_FRAMES - 1)
    mistOpacity = Math.max(0, 1 - progress / 0.04)

    if (frameChanged) {
      isScrolling = progress > 0
      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (isScrolling) scrollTimeout = setTimeout(() => { isScrolling = false }, 250)
    }

    bufferFrames()
    if (currentFrameIndex === 1) {
      hasDrawnFrame = false
      lastRenderedImage = null
      return
    }

    const exact = images.get(currentFrameIndex)
    const next = images.get(currentFrameIndex + 1)
    const prev = images.get(currentFrameIndex - 1)
    const image = isReady(exact) ? exact : lastRenderedImage ?? (isReady(prev) ? prev : isReady(next) ? next : null)
    if (image && (forceDraw || image !== lastRenderedImage)) {
      drawCover(image)
      lastRenderedImage = image
      hasDrawnFrame = true
    }
  }

  const updateCanvasDimensions = () => {
    if (!canvasEl || !ctx2d) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = window.innerWidth
    const h = window.innerHeight
    canvasEl.width = w * dpr
    canvasEl.height = h * dpr
    canvasEl.style.width = `${w}px`
    canvasEl.style.height = `${h}px`
    ctx2d.setTransform(1, 0, 0, 1, 0, 0)
    ctx2d.scale(dpr, dpr)
    ctx2d.imageSmoothingEnabled = true
    ctx2d.imageSmoothingQuality = 'high'
  }

  const handleResize = () => {
    updateCanvasDimensions()
    renderCanvas(currentFrameIndex, true)
    ScrollTriggerInstance?.refresh()
  }

  const handleTopScroll = () => {
    if (window.scrollY <= 10 && currentFrameIndex !== 1) {
      playhead.frame = 1
      renderCanvas(1)
    }
  }

  onMount(async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ctx2d = canvasEl.getContext('2d', { alpha: false })
    if (!ctx2d) return
    updateCanvasDimensions()

    const [gsapMod, stMod] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ])
    if (isDestroyed) return
    const gsap = gsapMod.gsap || gsapMod.default || gsapMod
    ScrollTriggerInstance = stMod.ScrollTrigger || stMod.default || stMod
    gsap.registerPlugin(ScrollTriggerInstance)

    ctx = gsap.context(() => {
      gsap.to(playhead, {
        frame: TOTAL_FRAMES,
        ease: 'none',
        scrollTrigger: {
          trigger: heroContainerEl,
          start: 'top top',
          end: '+=5000',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self: { progress: number }) => {
            if (self.progress >= 1) {
              renderCanvas(TOTAL_FRAMES)
            } else if (self.progress <= 0) {
              renderCanvas(1)
            } else {
              renderCanvas(Math.round(playhead.frame))
            }
          }
        }
      })
    }, heroContainerEl)

    ScrollTriggerInstance.sort()
    ScrollTriggerInstance.refresh()

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleTopScroll, { passive: true })
  })

  onDestroy(() => {
    isDestroyed = true
    ctx?.revert()
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleTopScroll)
    }
    if (scrollTimeout) clearTimeout(scrollTimeout)
    for (const img of images.values()) {
      img.onload = null
      img.onerror = null
    }
    images.clear()
    pendingFrames.clear()
  })

  $: heroOpacity = currentFrameIndex <= 80 ? 1 : currentFrameIndex >= 120 ? 0 : (120 - currentFrameIndex) / 40
  $: isNavbarVisible = progress === 0 || !isScrolling
</script>

<div
  bind:this={heroContainerEl}
  id="hero-scroll-track"
  class="relative overflow-hidden w-full h-[100dvh] min-h-[100dvh] z-10 flex flex-col justify-between"
>
  <picture class="absolute inset-0 w-full h-full -z-30 pointer-events-none block">
    <source media="(max-width: 768px)" srcset="/frames/frame_0001_sm.webp" type="image/webp" />
    <img
      src="/frames/frame_0001.webp"
      alt="Pinoka Visual Hero"
      class="w-full h-full object-cover pointer-events-none block"
      fetchpriority="high"
      loading="eager"
      width="1280"
      height="720"
    />
  </picture>

  <canvas
    bind:this={canvasEl}
    class="absolute inset-0 w-full h-full -z-20 pointer-events-none block"
    class:invisible={!hasDrawnFrame}
  ></canvas>

  <div class="absolute inset-0 -z-15 pointer-events-none bg-black/5 dark:bg-black/40 transition-colors duration-300"></div>

  <div
    class="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-white/30 via-white/10 to-transparent dark:from-black/40 dark:via-black/15 dark:to-transparent transition-opacity duration-150"
    style="opacity: {mistOpacity}"
  ></div>

  {#if $$slots.navbar}
    <div
      class="fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out {isNavbarVisible
        ? 'translate-y-0 opacity-100 pointer-events-auto'
        : '-translate-y-full opacity-0 pointer-events-none'}"
    >
      <slot name="navbar" />
    </div>
  {/if}

  <div
    class="relative z-20 flex-1 flex flex-col justify-between w-full transition-opacity duration-300 ease-out"
    style:opacity="{heroOpacity.toFixed(3)}"
    style:pointer-events="{heroOpacity > 0.1 ? 'auto' : 'none'}"
  >
    <slot name="hero">
      <slot />
    </slot>
  </div>

  <HeroCaptions currentFrame={currentFrameIndex} />
</div>
