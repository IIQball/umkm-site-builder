<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import HeroCaptions from './HeroCaptions.svelte'

  const TOTAL_FRAMES = 839
  const PRIORITY_FRAMES = 30
  const CHUNK_SIZE = 25
  const SOURCE_WIDTH = 1280
  const SOURCE_HEIGHT = 720

  let heroContainerEl: HTMLElement
  let canvasEl: HTMLCanvasElement
  let ctx2d: CanvasRenderingContext2D | null = null
  let ctx: gsap.Context | null = null

  const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
  const playhead = { frame: 1 }

  let currentFrameIndex = 1
  let lastRenderedIndex = 1
  let progress = 0
  let mistOpacity = 1
  let isScrolling = false
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null
  let refreshTimeout: ReturnType<typeof setTimeout> | null = null
  let isDestroyed = false
  let progressiveIndex = PRIORITY_FRAMES + 1

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

  const getAvailableFrame = (index: number): HTMLImageElement | null => {
    const exact = images[index - 1]
    if (exact && exact.complete && exact.naturalWidth > 0) return exact
    if (lastRenderedIndex >= 1 && images[lastRenderedIndex - 1]?.complete) {
      return images[lastRenderedIndex - 1]
    }
    for (let delta = 1; delta <= 50; delta++) {
      const prev = index - 1 - delta
      if (prev >= 0 && images[prev]?.complete && images[prev].naturalWidth > 0) {
        return images[prev]
      }
      const next = index - 1 + delta
      if (next < TOTAL_FRAMES && images[next]?.complete && images[next].naturalWidth > 0) {
        return images[next]
      }
    }
    return null
  }

  const loadImage = (index: number) => {
    if (index < 1 || index > TOTAL_FRAMES || images[index - 1]) return
    const img = new Image()
    img.src = getFrameUrl(index)
    img.onload = () => {
      images[index - 1] = img
      if (index === currentFrameIndex) {
        renderCanvas(currentFrameIndex)
      }
    }
  }

  const loadNextChunk = () => {
    if (isDestroyed || progressiveIndex > TOTAL_FRAMES) return
    const chunkEnd = Math.min(progressiveIndex + CHUNK_SIZE, TOTAL_FRAMES + 1)
    for (let i = progressiveIndex; i < chunkEnd; i++) {
      loadImage(i)
    }
    progressiveIndex = chunkEnd
    if (progressiveIndex <= TOTAL_FRAMES) {
      setTimeout(loadNextChunk, 50)
    }
  }

  const renderCanvas = (target: number) => {
    currentFrameIndex = Math.min(TOTAL_FRAMES, Math.max(1, target))
    progress = (currentFrameIndex - 1) / (TOTAL_FRAMES - 1)
    mistOpacity = Math.max(0, 1 - progress / 0.04)

    if (progress > 0) {
      isScrolling = true
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 250)
    } else {
      isScrolling = false
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }

    const img = getAvailableFrame(currentFrameIndex)
    if (img && img.complete && img.naturalWidth > 0) {
      drawCover(img)
      lastRenderedIndex = currentFrameIndex
    } else {
      loadImage(currentFrameIndex)
    }
  }

  const handleResize = () => {
    if (!canvasEl || !ctx2d) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
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
    renderCanvas(currentFrameIndex)
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  }

  const handleTopScroll = () => {
    if (window.scrollY <= 10 && currentFrameIndex !== 1) {
      playhead.frame = 1
      renderCanvas(1)
    }
  }

  onMount(() => {
    ctx2d = canvasEl.getContext('2d', { alpha: false })
    gsap.registerPlugin(ScrollTrigger)

    handleResize()

    for (let i = 1; i <= Math.min(PRIORITY_FRAMES, TOTAL_FRAMES); i++) {
      loadImage(i)
    }

    loadNextChunk()

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
          onUpdate: (self) => {
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

    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    refreshTimeout = setTimeout(() => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }, 200)

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
    if (refreshTimeout) clearTimeout(refreshTimeout)
  })

  $: heroOpacity = currentFrameIndex <= 80 ? 1 : currentFrameIndex >= 120 ? 0 : (120 - currentFrameIndex) / 40
  $: isNavbarVisible = progress === 0 || !isScrolling
</script>

<div
  bind:this={heroContainerEl}
  id="hero-scroll-track"
  class="relative overflow-hidden w-full h-screen z-10 flex flex-col justify-between"
>
  <canvas
    bind:this={canvasEl}
    class="absolute inset-0 w-full h-full -z-20 pointer-events-none block"
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
