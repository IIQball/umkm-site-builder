<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import SynergyOverlay from './SynergyOverlay.svelte'

  let activeStage = 0
  let mounted = false
  let Scene: typeof import('./Synergy3DScene.svelte').default | null = null
  let state: 'idle' | 'loading' | 'ready' | 'error' = 'idle'
  let attempt = 0
  let timeout: ReturnType<typeof setTimeout>

  onMount(() => { mounted = true })
  onDestroy(() => {
    attempt++
    clearTimeout(timeout)
  })

  function showPoster(nextState: 'idle' | 'error') {
    attempt++
    clearTimeout(timeout)
    Scene = null
    state = nextState
  }

  async function openModel() {
    if (state === 'loading') return
    if (state === 'ready') {
      showPoster('idle')
      return
    }

    state = 'loading'
    const currentAttempt = ++attempt
    timeout = setTimeout(() => showPoster('error'), 15_000)
    try {
      const module = await import('./Synergy3DScene.svelte')
      if (currentAttempt === attempt) Scene = module.default
    } catch {
      if (currentAttempt === attempt) showPoster('error')
    }
  }

  function handleReady() {
    if (state !== 'loading') return
    clearTimeout(timeout)
    state = 'ready'
  }
</script>

<section
  id="synergy"
  aria-labelledby="synergy-title"
  class="relative isolate overflow-hidden bg-canvas text-main py-20 sm:py-28"
>
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>
  <SynergyOverlay bind:activeStage>
    <div class="relative isolate grid aspect-square w-full place-items-center overflow-hidden">
      <img
        src="/assets/3d/banyuwangi_map.webp"
        width="760"
        height="811"
        loading="lazy"
        decoding="async"
        alt="Peta Banyuwangi dengan tiga titik usaha lokal"
        class="h-full w-full object-contain p-5 sm:p-8"
        class:invisible={state === 'ready'}
      />
      {#if Scene}
        <svelte:component this={Scene} {activeStage} onReady={handleReady} onFailure={() => showPoster('error')} />
      {/if}
    </div>

    <div class="mt-3 flex min-h-[3rem] flex-wrap items-center justify-center gap-x-3 gap-y-2">
      {#if mounted}
        <button
          type="button"
          class="inline-flex items-center rounded-full border border-border bg-canvas px-4 py-2 font-heading text-sm font-semibold text-main hover:bg-base-200 disabled:opacity-60"
          disabled={state === 'loading'}
          on:click={openModel}
        >
          {state === 'ready' ? 'Tampilkan Gambar Peta' : state === 'error' ? 'Coba Lagi' : 'Lihat Peta 3D'}
        </button>
        <div role="status" class="body-sm max-w-xs text-secondary">
          {#if state === 'loading'}
            Memuat peta 3D…
          {:else if state === 'error'}
            Peta 3D belum dapat ditampilkan.
          {/if}
        </div>
      {/if}
    </div>
  </SynergyOverlay>
</section>
