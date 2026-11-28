<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import HeroCaptions from './HeroCaptions.svelte'
  import { HERO_SCENES } from './HeroCaptions'

  const FIRST_FRAME = 216
  const LAST_FRAME = 839
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
  const playhead = { frame: FIRST_FRAME }

  let currentFrameIndex = FIRST_FRAME
  let lastRenderedImage: HTMLImageElement | null = null
  let hasDrawnFrame = false
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
    const start = Math.max(FIRST_FRAME + 1, currentFrameIndex - KEEP_BEHIND)
    const end = Math.min(LAST_FRAME, currentFrameIndex + BUFFER_AHEAD)

    for (const index of images.keys()) {
      if ((index < start || index > end) && !pendingFrames.has(index)) images.delete(index)
    }
    if (currentFrameIndex === FIRST_FRAME) return

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
    currentFrameIndex = Math.min(LAST_FRAME, Math.max(FIRST_FRAME, target))

    bufferFrames()
    if (currentFrameIndex === FIRST_FRAME) {
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
        frame: LAST_FRAME,
        ease: 'none',
        onUpdate: () => {
          const frame = Math.round(playhead.frame)
          if (frame !== currentFrameIndex) renderCanvas(frame)
        },
        scrollTrigger: {
          trigger: heroContainerEl,
          start: 'top top',
          end: '+=3700',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1
        }
      })
    }, heroContainerEl)

    ScrollTriggerInstance.sort()
    ScrollTriggerInstance.refresh()

    window.addEventListener('resize', handleResize, { passive: true })
  })

  onDestroy(() => {
    isDestroyed = true
    ctx?.revert()
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
    for (const img of images.values()) {
      img.onload = null
      img.onerror = null
    }
    images.clear()
    pendingFrames.clear()
  })
</script>

<div
  bind:this={heroContainerEl}
  id="hero-comic-sequence"
  class="relative isolate overflow-hidden w-full h-[100dvh] bg-canvas motion-reduce:hidden"
>
  <img
    src="/frames/frame_0216.webp"
    alt=""
    class="absolute inset-0 w-full h-full -z-30 object-cover pointer-events-none"
    loading="lazy"
    width="1280"
    height="720"
  />

  <canvas
    bind:this={canvasEl}
    aria-hidden="true"
    class="absolute inset-0 w-full h-full -z-20 pointer-events-none block"
    class:invisible={!hasDrawnFrame}
  ></canvas>

  <div class="absolute inset-0 -z-15 pointer-events-none bg-black/5 dark:bg-black/40 transition-colors duration-300"></div>
  <HeroCaptions currentFrame={currentFrameIndex} />
</div>

<div class="hidden max-w-7xl mx-auto px-6 py-12 gap-8 sm:grid-cols-2 sm:px-12 motion-reduce:grid">
  {#each HERO_SCENES as scene (scene.id)}
    <article>
      <h2 class="heading-section text-main">{@html scene.headline}</h2>
      <p class="desc-section text-main mt-3">{scene.subtext}</p>
    </article>
  {/each}
</div>
