<script lang="ts">
  import { onMount } from 'svelte'
  import { COLLABORATION_CAPTION } from './HeroCaptions'

  const VIDEO_URL = '/assets/landing/collaboration.mp4'

  let video: HTMLVideoElement
  let showingVideo = false

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const controller = new AbortController()
    let inView = false
    let objectUrl: string | undefined
    let requestedVideo = false

    const shouldPlay = () => inView && !reducedMotion.matches && !document.hidden

    function syncPlayback() {
      if (!shouldPlay()) {
        video.pause()
        return
      }

      if (objectUrl && !video.ended) {
        void video.play().catch(() => {
          if (shouldPlay()) showingVideo = false
        })
      } else if (!requestedVideo) {
        requestedVideo = true
        void loadVideo()
      }
    }

    async function loadVideo() {
      try {
        // Fetch once so inline playback doesn't depend on HTTP range support.
        const response = await fetch(VIDEO_URL, { signal: controller.signal })
        if (!response.ok) return
        const blob = await response.blob()
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        video.src = objectUrl
        syncPlayback()
      } catch {
        showingVideo = false
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.35
      syncPlayback()
    }, { threshold: 0.35 })

    observer.observe(video)
    reducedMotion.addEventListener('change', syncPlayback)
    document.addEventListener('visibilitychange', syncPlayback)

    return () => {
      controller.abort()
      observer.disconnect()
      reducedMotion.removeEventListener('change', syncPlayback)
      document.removeEventListener('visibilitychange', syncPlayback)
      video.pause()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  })
</script>

<section
  id="collaboration"
  aria-labelledby="collaboration-heading"
  class="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 py-14 sm:px-8 sm:py-20 md:px-12 lg:grid-cols-[1fr_2fr]"
>
  <div>
    <h2 id="collaboration-heading" class="heading-section text-main">
      {@html COLLABORATION_CAPTION.headline}
    </h2>
    <p class="desc-section text-main mt-3 max-w-sm">
      {COLLABORATION_CAPTION.subtext}
    </p>
  </div>

  <div class="relative aspect-video overflow-hidden rounded-2xl bg-canvas">
    <img
      src="/frames/frame_0125.webp"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      width="1280"
      height="720"
    />
    <video
      bind:this={video}
      class="absolute inset-0 h-full w-full object-cover motion-reduce:invisible"
      class:invisible={!showingVideo}
      muted
      playsinline
      preload="none"
      aria-hidden="true"
      on:playing={() => { showingVideo = true }}
      on:error={() => { showingVideo = false }}
    ></video>
  </div>
</section>
